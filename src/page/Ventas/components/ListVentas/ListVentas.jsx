import { useState, useEffect } from 'react';
import { Badge, Container } from "react-bootstrap";
import "../../../../scss/styles.scss";
import BasicModal from "../../../../components/Modal/BasicModal";
import DetallesVenta from "../DetallesVenta";
import CancelarVenta from "../CancelarVenta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faX, faRotateLeft, faArrowDownLong, faPenToSquare, faCheck } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { estilos } from "../../../../utils/tableStyled";
import { atenderVenta } from "../../../../api/ventas"

import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import RegistroMovimientosCajasVentas from '../../../Cajas/components/MovimientosCajas/RegistroMovimientosCajasVentas';
import { useNavigate } from "react-router-dom";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import queryString from "query-string";

function ListVentas(props) {
    const { estadoUsuario, listVentas, location, setRefreshCheckLogin, navigate, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas } = props;

    const conditionalRowStyles = [
        {
            when: row => row.atendido == "false" && row.estado == "true",
            style: {
                backgroundColor: 'rgba(138,221, 45, 0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(138, 221, 45, 0.2)',
                },
            },
        },
        {
            when: row => row.estado == "false",
            style: {
                backgroundColor: 'rgba(255,0,0,0.2)',
                '&:hover': {
                    backgroundColor: 'rgba(255,0,0,0.2)',
                },
            },
        },
    ];

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    // Configura la zona horaria en UTC
    dayjs.extend(utc);
    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para ver detalles
    const detallesVenta = (content) => {
        setTitulosModal("Detalles de la venta");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const cancelarVenta = (content) => {
        setTitulosModal("Cancelar venta");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const recuperarVenta = (content) => {
        setTitulosModal("Recuperar venta");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const registrarMovimiento = (content) => {
        setTitulosModal("Registrar movimiento");
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

    //Para la modificacion de productos
    const modificaVenta = (id) => {
        enrutamiento(`/ModificarTerminalPV/${id}`);
    }

    const columns = [
        {
            name: "No. Ticket",
            selector: row => row.numeroTiquet,
            sortable: false,
            center: true,
            reorder: false,
        },
        {
            //CODIGO PARA FILTRAR VENTA EN VISTA CLIENTE. ANTES DEL 20 SE USA UTC+7, DESPUES UTC
            name: "Día de la venta",
            selector: row => {
                const fechaCreacion = dayjs(row.fechaCreacion);
                if (fechaCreacion.isBefore('2023-10-20')) {
                    return fechaCreacion.utcOffset('+07:00').format('dddd, LL hh:mm A');
                } else {
                    return fechaCreacion.utc().format('dddd, LL hh:mm A');
                }
            },
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => (
                <>
                    {
                        row.estado === "true" && row.pagado == "true" &&
                        (
                            <>
                                <Badge
                                    bg="success"
                                    className="estado"
                                >
                                    Venta completada
                                </Badge>
                            </>
                        )
                    }

                    {
                        row.estado === "true" && row.pagado == "false" &&
                        (
                            <>
                                <Badge
                                    bg="warning"
                                    className="estado"
                                >
                                    Pedido
                                </Badge>
                            </>
                        )
                    }

                    {
                        row.estado === "false" &&
                        (
                            <>
                                <Badge
                                    bg="danger"
                                    className="estado"
                                >
                                    Venta cancelada
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
            name: "Movimiento en caja",
            selector: row => (
                <>
                    {
                        row.estado === "true" && row.pagado == "false" &&
                        (
                            <>
                                <Badge
                                    bg="primary"
                                    title="Generar un movimiento en caja"
                                    className="indicadorDetallesVenta"
                                    onClick={() => {
                                        registrarMovimiento(
                                            <RegistroMovimientosCajasVentas
                                                datosVentas={row}
                                                location={location}
                                                navigate={navigate}
                                                setShowModal={setShowModal}
                                            />
                                        )
                                    }}
                                >
                                    Pagar
                                </Badge>
                            </>
                        )
                    }
                    {
                        row.estado === "true" && row.pagado == "true" &&
                        (
                            <>
                                <Badge
                                    bg="success"
                                    className="estado"
                                >
                                    Pagado
                                </Badge>
                            </>
                        )
                    }
                    {
                        row.estado === "false" &&
                        (
                            <>
                                <Badge
                                    bg="danger"
                                    className="estado"
                                >
                                    No disponible
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
            name: "Productos",
            sortable: false,
            center: true,
            reorder: false,
            selector: row => row.productosVendidos,
        },
        //CODIGO PARA MOSTRAR MESA O CLIENTE EN VISTA CLIENTE
        {
            name: "Mesa/Cliente",
            sortable: false,
            center: true,
            reorder: false,
            selector: row => {
                if (row.mesa === "no aplica") {
                    return row.cliente;
                } else if (row.mesa === "") {
                    return row.cliente;
                } else if (!row.cliente) {
                    return row.mesa;
                } else {
                    return "Mesa: " + row.mesa + " / Cliente: " + row.cliente;
                }
            },
        },

        {
            name: "Total",
            sortable: false,
            center: true,
            reorder: false,
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
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        {
                            row.atendido === "false" && row.estado === "true" &&
                            (
                                <>
                                    <Badge
                                        bg="warning"
                                        title="Cambiar status"
                                        className="editar"
                                        onClick={() => {
                                            const dataTemp = {
                                                atendido: row.atendido === "false" ? "true" : "false",
                                            }
                                            //console.log(dataTemp)

                                            try {
                                                atenderVenta(row.id, dataTemp).then(response => {
                                                    const { data } = response;
                                                    // console.log(data)
                                                    toast.success(data.mensaje);
                                                    LogsInformativos("La venta " + row.numeroTiquet + "fue atendida", dataTemp);
                                                    navigate({
                                                        search: queryString.stringify(""),
                                                    });
                                                })
                                            } catch (e) {
                                                console.log(e)
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCheck} className="text-lg" />
                                    </Badge>
                                </>
                            )
                        }

                        <Badge
                            title="Ver productos vendidos"
                            bg="primary"
                            className="indicadorDetallesVenta"
                            onClick={() => {
                                detallesVenta(
                                    <DetallesVenta
                                        datos={row}
                                        location={location}
                                        navigate={navigate}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faEye} className="text-lg" />
                        </Badge>

                        {
                            row.tipo === "Pedido inicial" &&
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        title="Modificar venta"
                                        className="editar"
                                        onClick={() => {
                                            modificaVenta(row.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                                    </Badge>
                                </>
                            )
                        }

                        {
                            estadoUsuario === "true" &&
                            (
                                <>
                                    {
                                        row.estado === "true" ?
                                            (
                                                <>
                                                    <Badge
                                                        bg="danger"
                                                        title="Cancelar venta"
                                                        className="indicadorCancelarVenta"
                                                        onClick={() => {
                                                            cancelarVenta(
                                                                <CancelarVenta
                                                                    datosVentas={row}
                                                                    location={location}
                                                                    navigate={navigate}
                                                                    setShowModal={setShowModal}
                                                                />
                                                            )
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faX} className="text-lg" />
                                                    </Badge>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <Badge
                                                        bg="success"
                                                        title="Recuperar venta"
                                                        className="indicadorCancelarVenta"
                                                        onClick={() => {
                                                            recuperarVenta(
                                                                <CancelarVenta
                                                                    datosVentas={row}
                                                                    location={location}
                                                                    navigate={navigate}
                                                                    setShowModal={setShowModal}
                                                                />
                                                            )
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faRotateLeft} className="text-lg" />
                                                    </Badge>
                                                </>
                                            )
                                    }
                                </>
                            )
                        }
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
            setRows(listVentas);
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
                    data={listVentas}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    conditionalRowStyles={conditionalRowStyles}
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

export default ListVentas;
