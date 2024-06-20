import { useState, useEffect } from 'react';
import { map } from "lodash";
import { Badge, Container } from "react-bootstrap";
import "../../../scss/styles.scss";
import BasicModal from "../../../components/Modal/BasicModal";
import ListProductoTiquet from "../../Ventas/components/DetallesVenta";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";

function ListHistorialVentasSemana(props) {
    const { listDetallesSemana, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas } = props;

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para ver los producto vendidos en el tiquet
    const detallesTiquet = (content) => {
        setTitulosModal("Detalles del tiquet");
        setContentModal(content);
        setShowModal(true);
    }

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const columns = [
        {
            name: "No. Ticket",
            selector: row => row.numeroTiquet,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Productos",
            selector: row => row.productosVendidos,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total",
            selector: row => (
                <>
                    <Badge
                        bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(row.total)} MXN
                    </Badge>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <>
                            <Badge
                                title="Ver productos vendidos"
                                bg="primary"
                                className="vistaDetalle"
                                onClick={() => {
                                    detallesTiquet(
                                        <ListProductoTiquet
                                            datos={row}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                        </>
                    </div>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarImagen = () => {
        const timeout = setTimeout(() => {
            setRows(listDetallesSemana);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarImagen();
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listDetallesSemana}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalVentas}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );

}

export default ListHistorialVentasSemana;
