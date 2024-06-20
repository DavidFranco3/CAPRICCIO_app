import { useState, useEffect, Suspense } from 'react';
import { listarVentasMes } from "../../api/ventas";
import GraficaVentasMes from "../HistoricoVentasMes/components/GraficaVentasMes";
import GraficaProductosMes from '../HistoricoVentasMes/components/GraficaProductosMes';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../Logs/components/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import "../../scss/styles.scss";
import { Spinner, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function GraficaMensual(props) {
    const { mes, año, setRefreshCheckLogin, location } = props;

    const [tab, setTab] = useState('dinero');

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
    // Termina cerrado de sesión automatico

    // Para guardar el listado de detalles de las ventas del dia
    const [listDetallesMes, setListDetallesMes] = useState(null);

    const cargarDatos = () => {
        try {
            listarVentasMes(mes, año).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listDetallesMes && data) {
                    setListDetallesMes(formatModelVentas(data));
                } else {
                    const datosVentas = formatModelVentas(data);
                    setListDetallesMes(datosVentas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [location]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                        {dayjs(mes).format('MMMM')}
                        </h1>
                    </Col>
                </Row>
            </Alert>

            {
                listDetallesMes ?
                    (
                        <>
                            <Tabs
                                activeKey={tab}
                                onSelect={(k) => setTab(k)}
                                className="flex w-full"
                                id="uncontrolled-tab-estados"
                            >
                                <Tab
                                    key={0}
                                    tabClassName="font-semibold text-lg"
                                    eventKey="dinero"
                                    title="Dinero"
                                >
                                    <br />
                                    <Suspense fallback={< Spinner />}>
                                        <GraficaVentasMes
                                            listDetallesMes={listDetallesMes}
                                            mes={mes}
                                            location={location}
                                            setRefreshCheckLogin={setRefreshCheckLogin}
                                        />
                                    </Suspense>
                                </Tab>

                                <Tab
                                    key={1}
                                    tabClassName="font-semibold text-lg"
                                    eventKey="productos"
                                    title="Productos"
                                >
                                    <br />
                                    <Suspense fallback={< Spinner />}>
                                        <GraficaProductosMes
                                            listDetallesMes={listDetallesMes}
                                            mes={mes}
                                            location={location}
                                            setRefreshCheckLogin={setRefreshCheckLogin}
                                        />
                                    </Suspense>
                                </Tab>
                            </Tabs>
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
            tipoPago: venta.tipoPago,
            efectivo: venta.efectivo,
            cambio: venta.cambio,
            total: parseInt(venta.total),
            subtotal: parseInt(venta.subtotal),
            iva: parseFloat(venta.iva),
            comision: parseFloat(venta.comision),
            hacerPedido: venta.hacerPedido,
            tipoPedido: venta.tipoPedido,
            estado: venta.estado,
            fechaCreacion: venta.createdAt,
            fechaActualizacion: venta.updatedAt
        });
    });
    return tempVentas;
}

export default GraficaMensual;