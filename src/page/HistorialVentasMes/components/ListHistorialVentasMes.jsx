import { useState, useEffect } from 'react';
import { Badge, Dropdown } from "react-bootstrap";
import "../../../scss/styles.scss";
import BasicModal from "../../../components/Modal/BasicModal";
import ListProductoTiquet from "../../Ventas/components/DetallesVenta";
import DataTablecustom from '../../../components/Generales/DataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faBars } from "@fortawesome/free-solid-svg-icons";
import { formatMoneda } from '../../../components/Generales/FormatMoneda';

function ListHistorialVentasMes(props) {
    const { listDetallesMes } = props;

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
            selector: row => formatMoneda(row.total),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            cell: (row) => (
                <Dropdown className="dropdown-js">
                    <Dropdown.Toggle className="botonDropdown" id={`dropdown-basic-${row.id}`} variant="link">
                        <FontAwesomeIcon icon={faBars} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            detallesTiquet(
                                <ListProductoTiquet
                                    datos={row}
                                />
                            )
                        }}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ color: "#17a2b8" }} />
                            &nbsp; Detalles
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ),
            sortable: false,
            center: true,
            reorder: false,
            ignoreRowClick: true,
            width: "120px",
        },
    ];

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarImagen = () => {
        const timeout = setTimeout(() => {
            setRows(listDetallesMes);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarImagen();
    }, []);

    return (
        <>
            <DataTablecustom datos={listDetallesMes} columnas={columns} title={"Ventas del mes"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );

}

export default ListHistorialVentasMes;
