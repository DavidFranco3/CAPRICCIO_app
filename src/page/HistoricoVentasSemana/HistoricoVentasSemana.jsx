import { useState, useEffect, Suspense } from 'react';
import { listarPaginacionVentas, totalVentas } from "../../api/ventas";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import ListHistoricoVentasSemana from './components/ListHistoricoVentasSemana';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../Logs/components/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import { Spinner, Col, Row, Button, Alert } from "react-bootstrap";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function HistoricoVentasSemana(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/")
    }

    const [datosUsuario, setDatosUsuario] = useState("");

    const obtenerDatosUsuario = () => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                //console.log(data)
                setDatosUsuario(data);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const cierreSesion = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", datosUsuario, setRefreshCheckLogin);
                logoutApi();
                setRefreshCheckLogin(true);
                toast.warning('Sesión expirada');
                toast.success('Sesión cerrada por seguridad');
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreSesion();
    }, []);

    const [rowsPerPage, setRowsPerPage] = useState(500);
    const [page, setPage] = useState(1);
    const [noTotalVentas, setNoTotalVentas] = useState(1);

    // Para almacenar las ventas realizadas
    const [listVentas, setListVentas] = useState(null);

    const cargarDatos = () => {
        try {
            totalVentas().then(response => {
                const { data } = response;
                setNoTotalVentas(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarPaginacionVentas(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listVentas && data) {
                        setListVentas(formatModelVentas(data));
                    } else {
                        const datosVentas = formatModelVentas(data);
                        setListVentas(datosVentas)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionVentas(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)

                    if (!listVentas && data) {
                        setListVentas(formatModelVentas(data));
                    } else {
                        const datosVentas = formatModelVentas(data);
                        setListVentas(datosVentas)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [location, page, rowsPerPage]);


    return (
        <>
            {
                listVentas ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <ListHistoricoVentasSemana
                                    listVentas={listVentas}
                                    location={location}
                                    navigate={navigate}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalVentas={noTotalVentas}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }
        </>
    );
}

function formatModelVentas(ventas) {
    const tempVentas = []
    ventas.forEach((venta) => {
        tempVentas.push({
            id: venta._id,
            numeroTiquet: venta.numeroTiquet,
            cliente: venta.cliente,
            productosVendidos: venta.productos.length,
            articulosVendidos: venta.productos,
            detalles: venta.detalles,
            tipoPago: !venta.tipoPago ? "Pendiente" : venta.tipoPago,
            total: parseFloat(venta.total),
            subtotal: parseFloat(venta.subtotal),
            iva: parseFloat(venta.iva),
            comision: parseFloat(venta.comision),
            hacerPedido: venta.hacerPedido,
            tipoPedido: venta.tipoPedido,
            estado: venta.estado,
            agrupar: venta.agrupar,
            año: !venta.año ? "2023" : venta.año,
            semana: !venta.semana ? "0" : venta.semana,
            fechaCreacion: venta.createdAt,
            fechaActualizacion: venta.updatedAt
        });
    });
    return tempVentas;
}

export default withRouter(HistoricoVentasSemana);
