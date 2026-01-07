import { useState, useEffect, Suspense } from 'react';
import { listarPaginacionMovimientos, totalMovimientos } from "../../../api/movimientosCajas";
import { withRouter } from "../../../utils/withRouter";
import "../../scss/styles.scss";
import BasicModal from "../../../components/Modal/BasicModal";
import ListMovimientosCajas from "../../../components/MovimientosCajas/ListMovimientosCajas";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { obtenerUsuario } from "../../../api/usuarios";
import { LogsInformativosLogout } from '../../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import { Spinner, Button, Col, Row, Alert } from "react-bootstrap";
import RegistroMovimientosCajas from "../components/MovimientosCajas/RegistroMovimientosCajas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../../assets/json/loading.json";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCaja } from "../../../api/cajas"

function MovimientosCajas(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    const params = useParams();
    const { caja } = params;

    const [estadoCaja, setEstadoCaja] = useState("");

    useEffect(() => {
        try {
            obtenerCaja(caja).then(response => {
                const { data } = response;
                const { estado } = data;
                setEstadoCaja(estado);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    console.log("No hay internet")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, [estadoCaja]);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/Cajas")
    }

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

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

    // Para la lista de abonos
    const registroMovimientos = (content) => {
        setTitulosModal("Registrar un movimiento");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar el listado de categorias
    const [listMovimientos, setListMovimientos] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalMovimientos, setNoTotalMovimientos] = useState(1);

    const cargarDatos = () => {
        try {
            totalMovimientos(caja).then(response => {
                const { data } = response;
                setNoTotalMovimientos(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)
                listarPaginacionMovimientos(page, rowsPerPage, caja).then(response => {
                    const { data } = response;
                    console.log(data);
                    if (!listMovimientos && data) {
                        setListMovimientos(formatModelMovimientosCajas(data));
                    } else {
                        const datosMovimientos = formatModelMovimientosCajas(data);
                        setListMovimientos(datosMovimientos)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionMovimientos(page, rowsPerPage, caja).then(response => {
                    const { data } = response;
                    console.log(data);
                    if (!listMovimientos && data) {
                        setListMovimientos(formatModelMovimientosCajas(data));
                    } else {
                        const datosMovimientos = formatModelMovimientosCajas(data);
                        setListMovimientos(datosMovimientos)
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

    rreturn(
        <>
            <div className="card card-outline m-3">
                <div className="card-header bg-gray">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 font-bold">Movimientos de cajas</h4>

                        <div className="d-flex align-items-center">
                            <button
                                title="Registrar un nuevo movimiento en la caja"
                                className="btn btn-outline-light"
                                style={{ marginRight: "10px" }}
                                onClick={() => {
                                    registroMovimientos(
                                        <RegistroMovimientosCajas
                                            caja={caja}
                                            setEstadoCaja={setEstadoCaja}
                                            setShowModal={setShowModal}
                                            location={location}
                                            navigate={navigate}
                                        />
                                    );
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                            </button>

                            <button
                                title="Regresar a la pagina anterior"
                                className="btn btn-outline-light"
                                onClick={() => {
                                    rutaRegreso();
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {listMovimientos ? (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListMovimientosCajas
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listMovimientos={listMovimientos}
                                    location={location}
                                    navigate={navigate}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalMovimientos={noTotalMovimientos}
                                />
                            </Suspense>
                        </>
                    ) : (
                        <>
                            <Lottie
                                loop={true}
                                play={true}
                                animationData={AnimacionLoading}
                            />
                        </>
                    )}
                </div>
            </div>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelMovimientosCajas(movimientos) {
    const tempMovimientos = []
    movimientos.forEach((movimiento) => {
        tempMovimientos.push({
            id: movimiento._id,
            idCaja: movimiento.idCaja,
            idCajero: movimiento.idCajero,
            cajero: movimiento.cajero,
            concepto: movimiento.concepto,
            movimiento: movimiento.movimiento,
            monto: movimiento.monto,
            pago: movimiento.pago,
            movimientosAcumulados: movimiento.movimientosAcumulados.reverse(),
            dineroAcumulado: movimiento.dineroAcumulado,
            observaciones: movimiento.observaciones,
            estado: movimiento.estado,
            fechaCreacion: movimiento.createdAt,
            fechaActualizacion: movimiento.updatedAt
        });
    });
    return tempMovimientos;
}

export default withRouter(MovimientosCajas);
