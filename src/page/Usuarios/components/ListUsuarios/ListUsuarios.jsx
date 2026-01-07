import { useState, useEffect } from 'react';
import "../../../../scss/styles.scss";
import { Badge, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import CancelarUsuarios from '../CancelarUsuarios';
import EliminaUsuarios from '../EliminaUsuarios';
import ModificaUsuarios from '../ModificaUsuarios';
import DataTablecustom from "../../../../components/Generales/DataTable";
import { formatFecha } from "../../../../components/Generales/FormatFecha";
import { estilos } from "../../../../utils/tableStyled";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListUsuarios(props) {
    const { listUsuarios, location, navigate, rowsPerPage, setRowsPerPage, page, setPage, noTotalUsuarios } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de categorias
    const eliminaUsuario = (content) => {
        setTitulosModal("Eliminación usuario");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de categorias
    const modificaUsuarios = (content) => {
        setTitulosModal("Modificación usuario");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const cancelarUsuario = (content) => {
        setTitulosModal("Cancelar usuario");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const recuperarUsuario = (content) => {
        setTitulosModal("Recuperar usuario");
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
            name: "Usuario",
            selector: row => row.usuario,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Password",
            selector: row => row.password,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo",
            selector: row => row.admin == "true" ? "Administrador" : "Cajero",
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => (
                <>
                    {
                        row.estadoUsuario === "true" ?
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        //className="estado"
                                        className="indicadorCancelarVenta cursor-pointer"
                                        title="Cancelar usuario"
                                        onClick={() => {
                                            cancelarUsuario(
                                                <CancelarUsuarios
                                                    datosUsuario={row}
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
                                        title="Recuperar usuario"
                                        onClick={() => {
                                            recuperarUsuario(
                                                <CancelarUsuarios
                                                    datosUsuario={row}
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
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <Badge
                            title="Modificar usuario"
                            bg="success"
                            className="editar cursor-pointer"
                            onClick={() => {
                                modificaUsuarios(
                                    <ModificaUsuarios
                                        datosUsuario={row}
                                        location={location}
                                        navigate={navigate}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}>
                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </Badge>
                        <Badge
                            title="Eliminar usuario"
                            bg="danger"
                            className="eliminar cursor-pointer"
                            onClick={() => {
                                eliminaUsuario(
                                    <EliminaUsuarios
                                        datosUsuario={row}
                                        location={location}
                                        navigate={navigate}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}>
                            <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                        </Badge>

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

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listUsuarios);
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
                    datos={listUsuarios}
                    title="Lista de Usuarios"
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListUsuarios;
