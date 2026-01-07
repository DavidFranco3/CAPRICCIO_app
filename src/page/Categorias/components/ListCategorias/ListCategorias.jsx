import { useState, useEffect } from 'react';
import "../../../../scss/styles.scss";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import EliminaCategorias from "../EliminaCategorias";
import ModificaCategorias from "../ModificaCategorias";
import CancelarCategorias from "../CancelarCategorias";
import DataTablecustom from '../../../../components/Generales/DataTable';
import { formatFecha } from '../../../../components/Generales/FormatFecha';

function ListCategorias(props) {
    const { listCategorias, location, navigate } = props;

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de categorias
    const eliminaCategorias = (content) => {
        setTitulosModal("Eliminación categoría");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de categorias
    const modificaCategorias = (content) => {
        setTitulosModal("Modificación categoría");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const cancelarCategoria = (content) => {
        setTitulosModal("Cancelar categoría");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const recuperarCategoria = (content) => {
        setTitulosModal("Recuperar categoría");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: "Nombre",
            selector: row => row.nombre,
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
                                            cancelarCategoria(
                                                <CancelarCategorias
                                                    datosCategoria={row}
                                                    location={location}
                                                    navigate={navigate}
                                                    setShowModal={setShowModal}
                                                />
                                            )
                                        }}
                                    >
                                        Habilitada
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
                                        title="Recuperar categoria"
                                        onClick={() => {
                                            recuperarCategoria(
                                                <CancelarCategorias
                                                    datosCategoria={row}
                                                    location={location}
                                                    navigate={navigate}
                                                    setShowModal={setShowModal}
                                                />
                                            )
                                        }}
                                    >
                                        Deshabilitada
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
                            title="Modificar Categoría"
                            bg="success"
                            className="editar"
                            onClick={() => {
                                modificaCategorias(
                                    <ModificaCategorias
                                        datosCategorias={row}
                                        location={location}
                                        navigate={navigate}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}>
                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </Badge>

                        <Badge
                            title="Eliminar categoría"
                            bg="danger"
                            className="eliminar"
                            onClick={() => {
                                eliminaCategorias(
                                    <EliminaCategorias
                                        datosCategoria={row}
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
            setRows(listCategorias);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <>
            <DataTablecustom datos={listCategorias} columnas={columns} title={"Categorias"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListCategorias;
