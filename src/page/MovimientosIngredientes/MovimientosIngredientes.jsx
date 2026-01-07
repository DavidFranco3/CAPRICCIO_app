import { useState, useEffect, Suspense } from 'react';
import { listarMovimientosIngredientesPaginacion, totalMovimientosIngredientes } from "../../api/ingredientes";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import BasicModal from "../../components/Modal/BasicModal";
import ListMovimientosIngredientes from "../Ingredientes/components/MovimientosIngredientes/ListMovimientosIngredientes";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../Logs/components/LogsSistema/LogsSistema';
import Swal from 'sweetalert2';
import { Spinner, Button, Col, Row, Alert } from "react-bootstrap";
import RegistroMovimientiosIngredientes from "../Ingredientes/components/MovimientosIngredientes/RegistroMovimientosIngredientes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate, useParams } from "react-router-dom";

function MovimientosIngredientes(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    const parametros = useParams();
    const { id } = parametros;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/Ingredientes")
    }

    // Para definir el estado del switch
    const [estadoSwitch, setEstadoSwitch] = useState(true);

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

    // Para la lista de abonos
    const registroIngredientes = (content) => {
        setTitulosModal("Registrar un movimiento");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar el listado de categorias
    const [listIngredientes, setListIngredientes] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalIngredientes, setNoTotalIngredientes] = useState(1);

    const cargarDatos = () => {
        //console.log("Estado del switch ", estadoSwitch)
        try {
            // Lista los productos activos
            totalMovimientosIngredientes(id).then(response => {
                const { data } = response;
                setNoTotalIngredientes(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarMovimientosIngredientesPaginacion(page, rowsPerPage, id).then(response => {
                    const { data } = response;
                    if (!listIngredientes && data) {
                        setListIngredientes(formatModelMovimientosIngredientes(data));
                    } else {
                        const datosIngredientes = formatModelMovimientosIngredientes(data);
                        setListIngredientes(datosIngredientes)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarMovimientosIngredientesPaginacion(page, rowsPerPage, id).then(response => {
                    const { data } = response;
                    if (!listIngredientes && data) {
                        setListIngredientes(formatModelMovimientosIngredientes(data));
                    } else {
                        const datosIngredientes = formatModelMovimientosIngredientes(data);
                        setListIngredientes(datosIngredientes)
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
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Movimientos de ingredientes</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                title="Registrar un nuevo ingrediente"
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    registroIngredientes(
                                        <RegistroMovimientiosIngredientes
                                            setShowModal={setShowModal}
                                            location={location}
                                            navigate={navigate}
                                            id={id}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                            </Button>
                            <Button
                                title="Regresar a la pagina anterior"
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    rutaRegreso();
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            {
                listIngredientes ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <ListMovimientosIngredientes
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listIngredientes={listIngredientes}
                                    location={location}
                                    navigate={navigate}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalIngredientes={noTotalIngredientes}
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function formatModelMovimientosIngredientes(ingredientes) {
    const tempIngredientes = []
    ingredientes.forEach((ingrediente) => {
        tempIngredientes.push({
            nombre: ingrediente.nombre,
            tipo: ingrediente.tipo,
            cantidad: ingrediente.cantidad,
            um: ingrediente.um,
            fecha: ingrediente.fecha,
        });
    });
    return tempIngredientes;
}

export default withRouter(MovimientosIngredientes);

