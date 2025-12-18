import { useState, useEffect } from 'react';
import "../../../../../scss/styles.scss";
import { Badge, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../../components/Modal/BasicModal";
import DataTable from "react-data-table-component";
import { estilos } from "../../../../../utils/tableStyled";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import CancelarMovimientosCajas from '../CancelarMovimientosCajas';
import GeneraPDF from '../GeneraPDF';

function ListMovimientosCajas(props) {
    const { listMovimientos, location, navigate, setRowsPerPage, setPage, noTotalMovimientos } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

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

    // Para cancelar la venta
    const recuperarCategoria = (content) => {
        setTitulosModal("Recuperar categoría");
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
            selector: row => (
                <>
                    <Badge
                        bg="success" className="estado">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(row.monto)} MXN
                    </Badge>
                </>
            ),
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
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <Badge
                            title="Movimientos"
                            bg="primary"
                            className="editar"
                            onClick={() => {
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
                            <FontAwesomeIcon icon={faEye} className="text-lg" />
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
            setRows(listMovimientos);
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
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listMovimientos}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalMovimientos}
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

export default ListMovimientosCajas;
