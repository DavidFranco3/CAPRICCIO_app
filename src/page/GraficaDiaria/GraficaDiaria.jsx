import { useState, useEffect, Suspense } from 'react';
import { listarVentasDia } from "../../api/ventas";
import GraficaVentasDia from "../HistoricoVentasDia/components/GraficaVentasDia";
import GraficaProductosDia from '../HistoricoVentasDia/components/GraficaProductosDia';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../Logs/components/LogsSistema/LogsSistema';
import Swal from 'sweetalert2';
import "../../scss/styles.scss";
import { Spinner, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function GraficaDiaria(props) {
    const { dia, setRefreshCheckLogin, location } = props;

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
    // Termina cerrado de sesión automatico

    // Para guardar el listado de detalles de las ventas del dia
    const [listDetallesDia, setListDetallesDia] = useState(null);

    const cargarDatos = () => {
        try {
            listarVentasDia(dia).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listDetallesDia && data) {
                    setListDetallesDia(formatModelVentas(data));
                } else {
                    const datosVentas = formatModelVentas(data);
                    setListDetallesDia(datosVentas);
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
                            {dayjs(dia).format('dddd, LL')}
                        </h1>
                    </Col>
                </Row>
            </Alert>

            {
                listDetallesDia ?
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
                                        <GraficaVentasDia
                                            listDetallesDia={listDetallesDia}
                                            dia={dia}
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
                                        <GraficaProductosDia
                                            listDetallesDia={listDetallesDia}
                                            dia={dia}
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

export default GraficaDiaria;
