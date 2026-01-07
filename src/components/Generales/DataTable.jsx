import { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const DataTablecustom = ({
    datos = [],
    columnas = [],
    hiddenOptions = false,
    expandableRows = false,
    expandableRowsComponent = null,
    expandableRowExpanded = null,
    title,
    ...otherProps
}) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);
    const [visibleColumns, setVisibleColumns] = useState(columnas.map((col) => col.name));
    const [showModal, setShowModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [stickyColumns, setStickyColumns] = useState([]);
    const [columnWidths, setColumnWidths] = useState({});
    const tableRef = useRef(null);

    // 🔹 Detecta dinámicamente las claves, omitiendo "id" y "tipo"
    const keys = datos.length > 0
        ? Object.keys(datos[0]).filter(
            k => k !== "id" && k !== "tipo" && k !== "folio" && k !== "fechaActualizacion"
        )
        : [];

    // 🔹 Construye el CSV manualmente
    const csvContent = datos.map(item => {
        return keys
            .map(key => {
                const col = columnas.find(c => c.name === key) || {};
                let value;

                if (typeof col.exportSelector === "function") {
                    value = col.exportSelector(item);
                } else {
                    value = item[key];
                }
                // Formatea solo si es número
                if (typeof value === "number" || (!isNaN(value) && value !== "")) {
                    return Number(value).toFixed(2)
                }
                return value ?? "" // evita "undefined"
            })
            .join(",")
    }).join("\n")

    const handleFilterChange = (event) => {
        const searchValue = event.target.value.trim();
        setFilterValue(searchValue);

        if (searchValue.length === 0) {
            setFilteredData(datos);
            return;
        }

        const searchLower = searchValue.toLowerCase();

        const filtered = datos.filter((row) =>
            Object.values(row).some((value) => {
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchLower);
            })
        );

        setFilteredData(filtered);
    };

    const handleDoubleClick = (row) => {
        alert(JSON.stringify(row, null, 2));
    };

    useEffect(() => {
        setFilteredData(datos);
    }, [datos]);

    const downloadPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            const columnasFiltradas = columnas.filter(
                col => visibleColumns.includes(col.name) && col.name !== "Acciones"
            );

            const tableColumn = columnasFiltradas.map(col => col.name);

            const tableRows = datos.map(row => {
                const rowData = columnasFiltradas.map(col => {
                    let value;

                    if (typeof col.exportSelector === "function") {
                        value = col.exportSelector(row);
                    } else if (typeof col.selector === "function") {
                        try {
                            value = col.selector(row);

                            // 🔹 Si es JSX (React element), lo convertimos a texto
                            if (value && typeof value === "object") {
                                // Caso específico para la columna Estado
                                if (col.name === "Estado") {
                                    value = row.estado === "true"
                                        ? "Habilitada"
                                        : "Deshabilitada";
                                } else if (value.props?.children) {
                                    value = Array.isArray(value.props.children)
                                        ? value.props.children.join("")
                                        : value.props.children;
                                } else {
                                    value = "";
                                }
                            }
                        } catch {
                            value = "";
                        }
                    }

                    if (value && typeof value === "object") {
                        if (value.props && value.props.children) {
                            value = Array.isArray(value.props.children)
                                ? value.props.children.join("")
                                : value.props.children;
                        } else {
                            value = "";
                        }
                    }

                    return value || "";
                });
                return rowData;
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 30, // 👈 más margen superior para la primera página
                theme: "grid",
                styles: {
                    halign: "center",
                    valign: "middle",
                },
                headStyles: {
                    halign: "center",
                    valign: "middle",
                    fillColor: [240, 240, 240],
                    textColor: 20,
                    fontStyle: "bold",
                },
                didDrawPage: (data) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    const pageSize = doc.internal.pageSize;
                    const pageHeight = pageSize.height || pageSize.getHeight();

                    // 🏷️ Encabezado
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(16);
                    doc.text(title || "Reporte", pageWidth / 2, 15, { align: "center" });

                    // 📦 Ajustar margen superior para páginas siguientes
                    if (data.pageNumber > 1) {
                        data.settings.margin.top = 30; // asegura espacio entre encabezado y tabla
                    }

                    // 📄 Pie de página
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.text(
                        `Página ${data.pageNumber} de ${pageCount}`,
                        pageWidth / 2,
                        pageHeight - 10,
                        { align: "center" }
                    );
                },
                margin: { top: 30 }, // 👈 margen superior general
            });

            doc.save(`${title || "data"}.pdf`);
            setIsExporting(false);
        }, 100);
    };

    const handleColumnVisibilityChange = (columnName) => {
        setVisibleColumns((prevVisibleColumns) =>
            prevVisibleColumns.includes(columnName)
                ? prevVisibleColumns.filter((name) => name !== columnName)
                : [...prevVisibleColumns, columnName]
        );
    };

    const selectAllColumns = () => {
        setVisibleColumns(columnas.map((col) => col.name));
    };

    const deselectAllColumns = () => {
        setVisibleColumns([]);
    };

    // ✅ Columnas visibles memoizadas
    const filteredColumns = useMemo(
        () => columnas.filter((col) => visibleColumns.includes(col.name)),
        [columnas, visibleColumns]
    );

    // ✅ Columnas sticky en orden visual
    const orderedStickyColumns = useMemo(
        () => filteredColumns.filter((col) => stickyColumns.includes(col.name)),
        [filteredColumns, stickyColumns]
    );

    const toggleStickyColumn = (name) => {
        setStickyColumns((prev) => {
            const isSticky = prev.includes(name);
            if (isSticky) {
                return prev.filter((colName) => colName !== name);
            } else {
                if (prev.length < 3) {
                    return [...prev, name];
                }
                return prev; // límite de 3 columnas fijas
            }
        });
    };

    // ✅ Medir anchos usando la PRIMERA FILA de datos (más real que el header)
    useEffect(() => {
        if (!tableRef.current) return;

        const firstRow = tableRef.current.querySelector(".rdt_TableRow");
        if (!firstRow) return; // si no hay filas, no medimos

        const rowCells = firstRow.querySelectorAll(".rdt_TableCell");
        if (!rowCells.length) return;

        const newWidths = {};

        filteredColumns.forEach((col, index) => {
            if (rowCells[index]) {
                const width = rowCells[index].getBoundingClientRect().width;
                newWidths[col.name] = width;
            }
        });

        const oldKeys = Object.keys(columnWidths);
        const newKeys = Object.keys(newWidths);

        const sameLength = oldKeys.length === newKeys.length;
        const sameValues =
            sameLength &&
            newKeys.every((key) => columnWidths[key] === newWidths[key]);

        if (!sameValues) {
            setColumnWidths(newWidths);
        }
    }, [filteredColumns, columnWidths, filteredData.length]);

    // ✅ Calcular offsets en cadena según el orden visual de las columnas sticky
    const stickyOffsets = useMemo(() => {
        const offsets = {};
        let currentOffset = 0;

        orderedStickyColumns.forEach((col) => {
            offsets[col.name] = currentOffset;
            currentOffset += columnWidths[col.name] || 0;
        });

        return offsets;
    }, [orderedStickyColumns, columnWidths]);

    // ✅ Estilos dinámicos de columnas sticky (con z-index por orden)
    const dynamicStyles = useMemo(() => {
        return orderedStickyColumns
            .map((col, orderIndex) => {
                const index = filteredColumns.findIndex((c) => c.name === col.name);
                const offset = stickyOffsets[col.name];

                if (index === -1 || offset === undefined) return "";

                const zBase = 20 + orderIndex; // más grande para que no se pisen

                return `
                    .rdt_TableCol:nth-child(${index + 1}),
                    .rdt_TableCell:nth-child(${index + 1}) {
                        position: sticky !important;
                        left: ${offset}px;
                        z-index: ${zBase};
                        background-color: #f1f3f5;
                        background-clip: padding-box;
                    }
                    .rdt_TableCol:nth-child(${index + 1}) {
                        z-index: ${zBase + 1};
                    }
                `;
            })
            .join("");
    }, [orderedStickyColumns, stickyOffsets, filteredColumns]);

    const processedColumns = filteredColumns.map((col) => {
        // quitar props internas de react-data-table que NO deben ir al DOM
        const {
            right,
            center,
            compact,
            wrap,
            grow,
            maxWidth,
            minWidth,
            width,
            reorder,   // si existe
            ...safeProps
        } = col;

        const isSticky = stickyColumns.includes(col.name);
        const canBeMadeSticky = isSticky || stickyColumns.length < 3;

        return {
            ...safeProps,
            name: (
                <div className="custom-header-wrapper">
                    <label className="custom-checkbox-label">
                        <input
                            type="checkbox"
                            className="custom-checkbox-input"
                            checked={isSticky}
                            disabled={!canBeMadeSticky}
                            onChange={() => toggleStickyColumn(col.name)}
                        />
                        <span className="custom-checkbox-checkmark">
                            <i className="fas fa-thumbtack"></i>
                        </span>
                    </label>
                    <span className="custom-header-name">{col.name}</span>
                </div>
            ),
        };
    });


    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                fontWeight: "600",
                fontSize: "14px",
                color: "#ffffff",
                minHeight: "52px",
            },
        },
        headCells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
                whiteSpace: "nowrap",
                justifyContent: "center",
                textAlign: "center",
            },
        },
        rows: {
            style: {
                backgroundColor: "transparent",
                fontSize: "13px",
                color: "#ffffff",
                minHeight: "48px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05) !important",
                "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    color: "white !important",
                },
            },
            stripedStyle: {
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "#ffffff",
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
                justifyContent: "center",
                textAlign: "center",
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "13px",
                minHeight: "56px",
                backgroundColor: "transparent",
                color: "white",
            },
            pageButtonsStyle: {
                color: "white",
                fill: "white",
                "&:disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                    fill: "rgba(255, 255, 255, 0.3)",
                }
            }
        },
    };

    return (
        <section className="datatable-container" ref={tableRef}>
            <style>{`
                /* Glassmorphism DataTable Styles */
                .datatable-container {
                    position: relative;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    padding: 20px;
                    /* Removed overflow-x: auto to prevent clipping of fixed dropdowns */
                    color: white;
                }

                .datatable-container::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: 12px;
                    z-index: -1;
                    pointer-events: none;
                }

                /* Ensure react-data-table inner parts don't clip */
                .rdt_Table {
                    background: transparent !important;
                    overflow: visible !important;
                }

                .rdt_TableBody {
                    overflow: visible !important;
                }

                .rdt_TableRow {
                    overflow: visible !important;
                    background-color: transparent !important;
                }

                .rdt_TableCell {
                    overflow: visible !important;
                }

                /* This is critical: sometimes there is a wrapper div with overflow hidden */
                div[class*="TableWrapper"] {
                    overflow: visible !important;
                }

                div[class*="DataTable"] {
                    overflow: visible !important;
                }

                ${dynamicStyles}

                .sticky-info-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .custom-header-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                }

                .custom-header-name {
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .custom-checkbox-label {
                    position: relative;
                    cursor: pointer;
                    width: 18px;
                    height: 18px;
                }

                .custom-checkbox-input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .custom-checkbox-checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 18px;
                    width: 18px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.5);
                }

                .custom-checkbox-label:hover .custom-checkbox-checkmark {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .custom-checkbox-input:checked ~ .custom-checkbox-checkmark {
                    background-color: #00d2ff;
                    border-color: #00d2ff;
                    color: white;
                }

                .custom-checkbox-input:disabled ~ .custom-checkbox-checkmark {
                    background-color: rgba(255, 255, 255, 0.1);
                    cursor: not-allowed;
                    opacity: 0.5;
                }

                .custom-checkbox-checkmark .fa-thumbtack {
                    font-size: 10px;
                    transition: transform 0.2s ease;
                }

                .custom-checkbox-input:checked ~ .custom-checkbox-checkmark .fa-thumbtack {
                    transform: rotate(45deg);
                }

                .search-bar-container {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .search-input-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.6);
                    pointer-events: none;
                }

                .search-input {
                    padding-left: 40px !important;
                    background: rgba(255, 255, 255, 0.1) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    border-radius: 6px;
                    padding: 10px 12px;
                    font-size: 14px;
                    width: 100%;
                    transition: all 0.2s ease;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .search-input:focus {
                    outline: none;
                    border-color: #00d2ff !important;
                    background: rgba(255, 255, 255, 0.2) !important;
                    box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .btn-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 500;
                    border-radius: 50px;
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }

                .btn-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                }

                .btn-csv {
                    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
                    color: white;
                }

                .btn-pdf {
                    background: linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%);
                    color: white;
                }

                .btn-columns {
                    background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
                    color: white;
                }

                .btn-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    filter: grayscale(1);
                }

                /* Modal personalizado Glass */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-content-custom {
                    background: rgba(30, 30, 40, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease;
                    color: white;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-header-custom {
                    background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
                    color: white;
                    padding: 20px 24px;
                    border-radius: 16px 16px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title-custom {
                    font-weight: 600;
                    font-size: 18px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .modal-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                }

                .modal-close-btn:hover {
                    background: rgba(255, 255, 255, 0.4);
                }

                .modal-body-custom {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
                }

                .modal-footer-custom {
                    padding: 16px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .column-actions {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-column-action {
                    flex: 1;
                    padding: 8px 12px;
                    font-size: 13px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .btn-column-action:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .column-checkbox-wrapper {
                    padding: 10px;
                    border-radius: 6px;
                    transition: background-color 0.2s ease;
                    display: flex;
                    align-items: center;
                    color: white;
                }

                .column-checkbox-wrapper:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .column-checkbox {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    user-select: none;
                }

                .column-checkbox input {
                    margin-right: 8px;
                    cursor: pointer;
                }

                .btn-modal {
                    padding: 8px 16px;
                    font-size: 14px;
                    border-radius: 50px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                }

                .btn-modal-light {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .btn-modal-light:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .btn-modal-primary {
                    background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
                    color: white;
                }

                .btn-modal-primary:hover {
                    box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
                }

                @media (max-width: 768px) {
                    .search-bar-container {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .search-input-wrapper {
                        max-width: 100%;
                    }

                    .action-buttons {
                        justify-content: stretch;
                    }

                    .btn-action {
                        flex: 1;
                        justify-content: center;
                    }

                    .modal-content-custom {
                        width: 95%;
                        margin: 10px;
                    }
                }
            `}</style>

            <div className="search-bar-container" hidden={hiddenOptions}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <div className="search-input-wrapper">
                            <i className="fa fa-search search-icon" />
                            <input
                                type="search"
                                value={filterValue}
                                onChange={handleFilterChange}
                                className="search-input"
                                placeholder="Buscar en todos los campos..."
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div className="action-buttons">
                                <CSVLink
                                    data={csvContent}
                                    filename={`${title || "data"}.csv`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <button className="btn-action btn-csv">
                                        <i className="fas fa-file-csv" />
                                        <span>CSV</span>
                                    </button>
                                </CSVLink>

                                <button
                                    onClick={downloadPDF}
                                    className="btn-action btn-pdf"
                                    disabled={isExporting}
                                >
                                    <i className="fas fa-file-pdf" />
                                    <span>
                                        {isExporting ? "Exportando..." : "PDF"}
                                    </span>
                                </button>

                                <button
                                    className="btn-action btn-columns"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fas fa-columns" />
                                    <span>Columnas</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky-info-label">
                <i className="fas fa-info-circle"></i>
                <span>
                    Use la chincheta (<i className="fas fa-thumbtack"></i>) en el
                    encabezado de una columna para fijarla. Puede fijar hasta 3
                    columnas.
                </span>
            </div>

            <DataTable
                columns={processedColumns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                striped
                highlightOnHover
                pointerOnHover
                responsive
                onRowDoubleClicked={handleDoubleClick}
                customStyles={customStyles}
                expandableRows={expandableRows}
                expandableRowsComponent={expandableRowsComponent}
                expandableRowExpanded={expandableRowExpanded}
                {...otherProps}
                noDataComponent={
                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            color: "#6c757d",
                        }}
                    >
                        <i
                            className="fas fa-inbox"
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                opacity: 0.5,
                            }}
                        />
                        <p style={{ margin: 0, fontSize: "14px" }}>
                            No se encontraron registros
                        </p>
                    </div>
                }
            />

            {/* Modal personalizado */}
            {
                showModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="modal-content-custom"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header-custom">
                                <h5 className="modal-title-custom">
                                    <i className="fas fa-columns" />
                                    Gestionar Columnas
                                </h5>
                                <button
                                    className="modal-close-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    <i className="fas fa-times" />
                                </button>
                            </div>

                            <div className="modal-body-custom">
                                <div className="column-actions">
                                    <button
                                        className="btn-column-action"
                                        onClick={selectAllColumns}
                                    >
                                        <i className="fas fa-check-double" />
                                        Seleccionar Todo
                                    </button>
                                    <button
                                        className="btn-column-action"
                                        onClick={deselectAllColumns}
                                    >
                                        <i className="fas fa-times" />
                                        Deseleccionar Todo
                                    </button>
                                </div>

                                {columnas.map((col) => (
                                    <div
                                        key={col.name}
                                        className="column-checkbox-wrapper"
                                    >
                                        <label className="column-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.includes(
                                                    col.name
                                                )}
                                                onChange={() =>
                                                    handleColumnVisibilityChange(
                                                        col.name
                                                    )
                                                }
                                            />
                                            {col.name}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer-custom">
                                <button
                                    className="btn-modal btn-modal-light"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cerrar
                                </button>
                                <button
                                    className="btn-modal btn-modal-primary"
                                    onClick={() => setShowModal(false)}
                                >
                                    <i className="fas fa-check" />
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default DataTablecustom;
