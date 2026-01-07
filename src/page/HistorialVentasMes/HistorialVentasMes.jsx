import { useState, useEffect, Suspense } from 'react';
import { listarDetallesVentasPorMes, listarPaginacionVentasMes } from "../../api/ventas";
import ListHistorialVentasMes from "./components";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../Logs/components/LogsSistema/LogsSistema';
import Swal from 'sweetalert2';
import "../../scss/styles.scss";
import { Spinner } from "react-bootstrap";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function HistorialVentasMes(props) {
    const { mes, año, setRefreshCheckLogin, location, history } = props;

    console.log(año)

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

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
                    Swal.fire({ icon: 'error', title: "Conexión al servidor no disponible", timer: 1600, showConfirmButton: false });
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
                Swal.fire({ icon: 'warning', title: 'Sesión expirada', timer: 1600, showConfirmButton: false });
                Swal.fire({ icon: 'success', title: 'Sesión cerrada por seguridad', timer: 1600, showConfirmButton: false });
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreSesion();
    }, []);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalVentas, setNoTotalVentas] = useState(1);

    // Para guardar el listado de detalles de las ventas del mes
    const [listDetallesMes, setListDetallesMes] = useState(null);

    const cargarDatos = () => {
        try {
            listarDetallesVentasPorMes(mes, año).then(response => {
                const { data } = response;
                setNoTotalVentas(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarPaginacionVentasMes(page, rowsPerPage, mes, año).then(response => {
                    const { data } = response;
                    if (!listDetallesMes && data) {
                        setListDetallesMes(formatModelVentas(data));
                    } else {
                        const datosVentas = formatModelVentas(data);
                        setListDetallesMes(datosVentas)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionVentasMes(page, rowsPerPage, mes, año).then(response => {
                    const { data } = response;
                    //console.log(data)

                    if (!listDetallesMes && data) {
                        setListDetallesMes(formatModelVentas(data));
                    } else {
                        const datosVentas = formatModelVentas(data);
                        setListDetallesMes(datosVentas)
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
    }, [mes, location, page, rowsPerPage]);


    return (
        <>
            {
                listDetallesMes ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <div className="diaHistorial">
                                    {dayjs(mes).format('MMMM')}
                                </div>
                                <ListHistorialVentasMes
                                    listDetallesMes={listDetallesMes}
                                    mes={mes}
                                    location={location}
                                    history={history}
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
            tipoPago: venta.tipoPago == "" ? "Pendiente" : venta.tipoPago,
            efectivo: venta.efectivo,
            cambio: venta.cambio,
            total: parseInt(venta.total),
            subtotal: parseInt(venta.subtotal),
            iva: parseFloat(venta.iva),
            comision: parseFloat(venta.comision),
            hacerPedido: venta.hacerPedido,
            tipoPedido: venta.tipoPedido,
            estado: venta.estado,
            año: !venta.año ? "2023" : venta.año,
            semana: !venta.semana ? "0" : venta.semana,
            fechaCreacion: venta.createdAt,
            fechaActualizacion: venta.updatedAt
        });
    });
    return tempVentas;
}


export default HistorialVentasMes;

