import { useState, useEffect, Suspense } from 'react';
import { listarPaginacionCajas, totalCajas } from "../../api/cajas";
import { obtenerUltimoMovimiento } from "../../api/movimientosCajas";
import { listarUsuariosCajeros } from "../../api/usuarios";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import BasicModal from "../../components/Modal/BasicModal";
import ListCajas from "../../components/Cajas/ListCajas";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import { Spinner, Button, Col, Row, Alert } from "react-bootstrap";
import RegistroCajas from "../../components/Cajas/RegistroCajas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate } from "react-router-dom";

function Cajas(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/")
    }

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const [datosUsuario, setDatosUsuario] = useState("");

    const [datosUltimoMovimiento, setDatosUltimoMovimiento] = useState("");

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

            obtenerUltimoMovimiento().then(response => {
                const { data } = response;
                //console.log(data)
                setDatosUltimoMovimiento(data);
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

    

    

    

    // Para la lista de abonos
    const registroCajas = (content) => {
        setTitulosModal("Registrar una caja");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar el listado de categorias
    const [listCajas, setListCajas] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalCajas, setNoTotalCajas] = useState(1);

    const cargarDatos = () => {
        try {
            totalCajas().then(response => {
                const { data } = response;
                setNoTotalCajas(data)
            }).catch(e => {
                console.log(e)
            })

            if (page === 0) {
                setPage(1)

                listarPaginacionCajas(page, rowsPerPage).then(response => {
                    const { data } = response;
                    if (!listCajas && data) {
                        setListCajas(formatModelCajas(data));
                    } else {
                        const datosCajas = formatModelCajas(data);
                        setListCajas(datosCajas)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarPaginacionCajas(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if (!listCajas && data) {
                        setListCajas(formatModelCajas(data));
                    } else {
                        const datosCajas = formatModelCajas(data);
                        setListCajas(datosCajas)
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

    // Para guardar el listado de categorias
    const [listUsuarios, setListUsuarios] = useState(null);

    const cargarDatosUsuarios = () => {
        try {
            listarUsuariosCajeros().then(response => {
                const { data } = response;
                if (!listUsuarios && data) {
                    setListUsuarios(formatModelUsuarios(data));
                } else {
                    const datosUsuarios = formatModelUsuarios(data);
                    setListUsuarios(datosUsuarios);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        cargarDatosUsuarios();
    }, [location]);

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Cajas</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            {
                                
                                    <>
                                        <Button
                                            title="Registrar una nueva cajaa"
                                            className="btnRegistro"
                                            style={{ marginRight: '10px' }}
                                            onClick={() => {
                                                registroCajas(
                                                    <RegistroCajas
                                                        setShowModal={setShowModal}
                                                        listUsuarios={listUsuarios}
                                                        location={location}
                                                        navigate={navigate}
                                                    />
                                                )
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                                        </Button>
                                    </>
                                
                            }
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
                listCajas ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <ListCajas
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listCajas={listCajas}
                                    location={location}
                                    navigate={navigate}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalCajas={noTotalCajas}
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

function formatModelCajas(cajas) {
    const tempCajas = []
    cajas.forEach((caja) => {
        tempCajas.push({
            id: caja._id,
            idCajero: caja.idCajero,
            cajero: caja.cajero,
            saldo: caja.saldo,
            fechaCreacion: caja.createdAt,
            fechaActualizacion: caja.updatedAt
        });
    });
    return tempCajas;
}

function formatModelUsuarios(usuarios) {
    const tempUsuarios = []
    usuarios.forEach((usuario) => {
        tempUsuarios.push({
            id: usuario._id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            usuario: usuario.usuario,
            admin: usuario.admin,
            correo: usuario.correo,
            password: usuario.password,
            foto: usuario.foto,
            estadoUsuario: usuario.estadoUsuario,
            fechaCreacion: usuario.createdAt,
            fechaActualizacion: usuario.updatedAt
        });
    });
    return tempUsuarios;
}

export default withRouter(Cajas);
