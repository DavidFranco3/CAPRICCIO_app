import { useState, useEffect, Suspense } from 'react';
import { listarDetallesVentasPorDia, listarPaginacionVentasDia, listarConsumoIngredientesDiario } from "../../api/ventas";
import ListHistorialVentasDia from "../../components/HistorialVentasDia/ListHistorialVentasDia";
import ListIngredientesConsumidosDia from '../../components/Ingredientes/ListIngredientesConsumidosDia';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import "../../scss/styles.scss";
import { Spinner, Tabs, Tab, } from "react-bootstrap";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";

function HistorialVentasDia(props) {
    const { dia, location } = props;
    
    const [tab, setTab] = useState('general');

    dayjs.locale('es');
    dayjs.extend(localizedFormat);
    /*
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
*/
    //console.log(dia)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalVentas, setNoTotalVentas] = useState(1);

    // Para guardar el listado de detalles de las ventas del dia
    const [listDetallesDia, setListDetallesDia] = useState(null);

    const cargarDatos = () => {
        try {
            listarDetallesVentasPorDia(dia).then(response => {
                const { data } = response;
                setNoTotalVentas(data);
            }).catch(e => {
                console.log(e);
            });
    
            listarPaginacionVentasDia(page, rowsPerPage, dia).then(response => {
                const { data } = response;
                if (!listDetallesDia && data) {
                    setListDetallesDia(formatModelVentas(data));
                } else {
                    const datosVentas = formatModelVentas(data);
                    setListDetallesDia(datosVentas);
                }
                setPage(1); // Mover la actualización de la página aquí
            }).catch(e => {
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }
    

    useEffect(() => {
        cargarDatos();
    }, [dia, location, page, rowsPerPage]);

    // Para guardar el listado de detalles de las ventas del dia
    const [listIngredientesConsumidos, setListIngredientesConsumidos] = useState([]);

    const cargarDatosIngredientes = () => {
        try {
            listarConsumoIngredientesDiario(dia).then(response => {
                const { data } = response;
                if (!listIngredientesConsumidos && data) {
                    setListIngredientesConsumidos(formatModelIngredientesConsumidos(data));
                } else {
                    const datosIngredientes = formatModelIngredientesConsumidos(data);
                    setListIngredientesConsumidos(datosIngredientes);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosIngredientes();
    }, [location]);

    return (
        <>
            {
                listDetallesDia ?
                    (
                        <>
                            <div className="diaHistorial">
                                {dayjs(dia).format('dddd, LL')}
                            </div>
                            <Tabs
                                activeKey={tab}
                                onSelect={(k) => setTab(k)}
                                className="flex w-full"
                                id="uncontrolled-tab-estados"
                            >
                                <Tab
                                    key={0}
                                    tabClassName="font-semibold text-lg"
                                    eventKey="general"
                                    title="Ventas"
                                >
                                    <Suspense fallback={< Spinner />}>
                                        <ListHistorialVentasDia
                                            listDetallesDia={listDetallesDia}
                                            dia={dia}
                                            location={location}
                                            //setRefreshCheckLogin={setRefreshCheckLogin}
                                            setRowsPerPage={setRowsPerPage}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            setPage={setPage}
                                            noTotalVentas={noTotalVentas}
                                        />
                                    </Suspense>
                                </Tab>

                                <Tab
                                    key={1}
                                    tabClassName="font-semibold text-lg"
                                    eventKey="ingredientes"
                                    title="Ingredientes"
                                >
                                    <Suspense fallback={< Spinner />}>
                                        <ListIngredientesConsumidosDia
                                            listIngredientesConsumidos={listIngredientesConsumidos}
                                            location={location}
                                            //setRefreshCheckLogin={setRefreshCheckLogin}
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
    // Verificar si ventas es un array
    if (!Array.isArray(ventas)) {
        console.error("El argumento 'ventas' no es un array válido.");
        return [];
    }

    const tempVentas = [];
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


function formatModelIngredientesConsumidos(ingredientes) {
    const tempIngredientes = []
    ingredientes.forEach((ingrediente) => {
        tempIngredientes.push({
            id: ingrediente.id,
            nombre: ingrediente.nombre,
            cantidad: ingrediente.cantidad,
            um: ingrediente.um
        });
    });
    return tempIngredientes;
}

export default HistorialVentasDia;