import { useState, useEffect } from 'react';
import "../../../../scss/styles.scss";
import { Badge, Container, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faArrowDownLong, faEye, faBars } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import DataTablecustom from "../../../../components/Generales/DataTable";
import { formatMoneda } from "../../../../components/Generales/FormatMoneda";
import { formatFecha } from "../../../../components/Generales/FormatFecha";
import { estilos } from "../../../../utils/tableStyled";
import CancelarIngredientes from '../CancelarIngredientes';
import EliminaIngredientes from '../EliminaIngredientes';
import ModificaIngredientes from '../ModificaIngredientes';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useNavigate } from "react-router-dom"

function ListIngredientes(props) {
    const { listIngredientes, location, navigate, rowsPerPage, setRowsPerPage, page, setPage, noTotalIngredientes } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaMovimientos = (id) => {
        enrutamiento(`/MovimientosIngredientes/${id}`)
    }

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de categorias
    const eliminaIngredientes = (content) => {
        setTitulosModal("Eliminación ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de categorias
    const modificaIngredientes = (content) => {
        setTitulosModal("Modificación ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const cancelarIngrediente = (content) => {
        setTitulosModal("Cancelar ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const recuperarIngrediente = (content) => {
        setTitulosModal("Recuperar ingrediente");
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
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Precio de adquisición",
            selector: row => formatMoneda(row.costoAdquisicion),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM adquisición",
            selector: row => row.umAdquisicion === "Paquete" || row.umAdquisicion === "Gramos" || row.umAdquisicion === "Litros" || row.umAdquisicion === "Metros" ? row.umAdquisicion : row.umAdquisicion + row.umPrimaria.toLowerCase(),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM producción",
            selector: row => row.umProduccion === "Piezas" || row.umProduccion === "Gramos" || row.umProduccion === "Litros" || row.umProduccion === "Metros" ? row.umProduccion : row.umProduccion + row.umPrimaria.toLowerCase(),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad + " " + row.umProduccion,
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
                                        className="indicadorCancelarVenta cursor-pointer"
                                        title="Cancelar ingrediente"
                                        onClick={() => {
                                            cancelarIngrediente(
                                                <CancelarIngredientes
                                                    datosIngrediente={row}
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
                                        className="indicadorCancelarVenta cursor-pointer"
                                        title="Recuperar ingrediente"
                                        onClick={() => {
                                            recuperarIngrediente(
                                                <CancelarIngredientes
                                                    datosIngrediente={row}
                                                    location={location}
                                                    navigate={navigate}
                                                    setShowModal={setShowModal}
                                                />
                                            )
                                        }}
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
            name: "Modificación",
            selector: row => formatFecha(row.fechaActualizacion),
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
                        <Dropdown.Item onClick={() => rutaMovimientos(row.id)}>
                            <FontAwesomeIcon icon={faEye} style={{ color: "#17a2b8" }} />
                            &nbsp; Ver movimientos
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => {
                            modificaIngredientes(
                                <ModificaIngredientes
                                    datosIngredientes={row}
                                    location={location}
                                    navigate={navigate}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}>
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffc107" }} />
                            &nbsp; Editar
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => {
                            eliminaIngredientes(
                                <EliminaIngredientes
                                    datosIngrediente={row}
                                    location={location}
                                    navigate={navigate}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}>
                            <FontAwesomeIcon icon={faTrashCan} style={{ color: "#dc3545" }} />
                            &nbsp; Eliminar
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
            setRows(listIngredientes);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTablecustom
                    columnas={columns}
                    datos={listIngredientes}
                    title="Lista de Ingredientes"
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListIngredientes;
