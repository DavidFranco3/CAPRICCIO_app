import { useState, useEffect } from 'react';
import "../../../../../scss/styles.scss";
import { Badge, Container, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowDownLong, faBars } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../../components/Modal/BasicModal";
import DataTablecustom from '../../../../../components/Generales/DataTable';
import { estilos } from "../../../../../utils/tableStyled";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import CancelarMovimientosCajas from '../CancelarMovimientosCajas';
import GeneraPDF from '../GeneraPDF';
import { formatMoneda } from "../../../../../components/Generales/FormatMoneda";

function ListMovimientosCajas(props) {
    const { listMovimientos, location, navigate, setRowsPerPage, setPage, noTotalMovimientos } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para cancelar la venta
    const cancelarMovimiento = (content) => {
        setTitulosModal("Cancelar movimiento");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const movimientos = (content) => {
        setTitulosModal("Detalles");
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
            name: "Movimiento",
            selector: row => row.movimiento,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Monto",
            selector: row => formatMoneda(row.monto),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => (
                <>
                    {
                        row.estado === "true" ?
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        //className="estado"
                                        className="indicadorCancelarVenta"
                                        title="Cancelar categoria"
                                        onClick={() => {
                                            cancelarMovimiento(
                                                <CancelarMovimientosCajas
                                                    datosMovimiento={row}
                                                    location={location}
                                                    navigate={navigate}
                                                    setShowModal={setShowModal}
                                                />
                                            )
                                        }}
                                    >
                                        Habilitado
                                    </Badge>
                                </>
                            )
                            :
                            (
                                <>
                                    <Badge
                                        bg="danger"
                                        //className="estado"
                                        className="indicadorCancelarVenta"
                                    >
                                        Deshabilitado
                                    </Badge>
                                </>
                            )
                    }
                </>
            ),

            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Hora",
            selector: row => dayjs(row.fechaCreacion).format('hh:mm A'),
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
                            movimientos(
                                <GeneraPDF
                                    datos={row}
                                    location={location}
                                    navigate={navigate}
                                    setShowModal={setShowModal}
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

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listMovimientos);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <>
            <DataTablecustom datos={listMovimientos} columnas={columns} title={"Movimientos de cajas"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListMovimientosCajas;
