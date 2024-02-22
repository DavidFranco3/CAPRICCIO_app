import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import { listarPaginacionProductosActivos, totalProductosActivos, listarPaginacionProductosCancelados, totalProductosCancelados } from "../../api/productos";
import ListProductos from "../../components/Productos/ListProductos";
import { listarCategorias } from "../../api/categorias";
import { Spinner, Button, Col, Row, Alert } from "react-bootstrap";
import BasicModal from "../../components/Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import "../../scss/styles.scss";
import { Switch } from '@headlessui/react';
import { useNavigate } from "react-router-dom";

function Productos(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/")
    }

    // Para definir el estado del switch
    const [estadoSwitch, setEstadoSwitch] = useState(true);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la lista de abonos
    const registroProductos = () => {
        enrutamiento("/RegistraProductos")
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

    // Guarda el listado de productos
    const [listProductos, setListProductos] = useState(null);

    // Para guardar el listado de categorias
    const [listCategorias, setListCategorias] = useState(null);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalProductos, setNoTotalProductos] = useState(1);

    const cargarDatos = () => {
        //console.log("Estado del switch ", estadoSwitch)
        try {
            if (estadoSwitch) {
                // Lista los productos activos
                totalProductosActivos().then(response => {
                    const { data } = response;
                    setNoTotalProductos(data)
                }).catch(e => {
                    console.log(e)
                })

                if (page === 0) {
                    setPage(1)

                    listarPaginacionProductosActivos(page, rowsPerPage).then(response => {
                        const { data } = response;
                        if (!listarPaginacionProductosActivos && data) {
                            setListProductos(formatModelProductos(data));
                        } else {
                            const datosProductos = formatModelProductos(data);
                            setListProductos(datosProductos)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                } else {
                    listarPaginacionProductosActivos(page, rowsPerPage).then(response => {
                        const { data } = response;
                        //console.log(data)

                        if (!listProductos && data) {
                            setListProductos(formatModelProductos(data));
                        } else {
                            const datosProductos = formatModelProductos(data);
                            setListProductos(datosProductos)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            } else {
                // Lista los productos obsoletos
                totalProductosCancelados().then(response => {
                    const { data } = response;
                    setNoTotalProductos(data)
                }).catch(e => {
                    console.log(e)
                })

                if (page === 0) {
                    setPage(1)

                    listarPaginacionProductosCancelados(page, rowsPerPage).then(response => {
                        const { data } = response;
                        if (!listProductos && data) {
                            setListProductos(formatModelProductos(data));
                        } else {
                            const datosProductos = formatModelProductos(data);
                            setListProductos(datosProductos)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                } else {
                    listarPaginacionProductosCancelados(page, rowsPerPage).then(response => {
                        const { data } = response;
                        //console.log(data)

                        if (!listProductos && data) {
                            setListProductos(formatModelProductos(data));
                        } else {
                            const datosProductos = formatModelProductos(data);
                            setListProductos(datosProductos)
                        }
                    }).catch(e => {
                        console.log(e)
                    })
                }
            }

        } catch (e) {
            console.log(e)
        }
    }

    // obtener el listado de productos
    useEffect(() => {
        cargarDatos();
    }, [location, estadoSwitch, page, rowsPerPage]);

    const cargarDatosCategorias = () => {
        try {
            listarCategorias().then(response => {
                const { data } = response;
                if (!listCategorias && data) {
                    setListCategorias(formatModelCategorias(data));
                } else {
                    const datosCategorias = formatModelCategorias(data);
                    setListCategorias(datosCategorias);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCategorias();
    }, [location]);


    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={8} className="titulo">
                        <h1 className="font-bold">Productos</h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <div style={{ float: 'right' }}>

                            <Button
                                title="Registrar un nuevo producto"
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    registroProductos();
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

            <Row>
                <Col xs={12} md={8}>
                    <h3 className="tituloSwitch">Estado de los productos</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Switch
                        title={estadoSwitch === true ? "Ver productos cancelados" : "Ver productos activos"}
                        checked={estadoSwitch}
                        onChange={setEstadoSwitch}
                        className={`${estadoSwitch ? 'bg-teal-900' : 'bg-red-600'}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={`${estadoSwitch ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                        />
                    </Switch>
                </Col>
            </Row>

            {
                listProductos ?
                    (
                        <>
                            <Suspense fallback={< Spinner />}>
                                <ListProductos
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    listProductos={listProductos}
                                    listCategorias={listCategorias}
                                    location={location}
                                    navigate={navigate}
                                    setRowsPerPage={setRowsPerPage}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalProductos={noTotalProductos}
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

function formatModelProductos(productos) {
    const tempProductos = []
    productos.forEach((producto) => {
        tempProductos.push({
            id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            negocio: producto.negocio,
            costoProduccion: parseFloat(producto.costoProduccion) ? parseFloat(producto.costoProduccion) : 0,
            ingredientes: producto.ingredientes,
            precio: parseFloat(producto.precio),
            imagen: producto.imagen,
            estado: producto.estado,
            fechaCreacion: producto.createdAt,
            fechaActualizacion: producto.updatedAt
        });
    });
    return tempProductos;
}

function formatModelCategorias(categorias) {
    const tempCategorias = []
    categorias.forEach((categoria) => {
        tempCategorias.push({
            id: categoria._id,
            nombre: categoria.nombre,
            negocio: categoria.negocio,
            imagen: categoria.imagen,
            estado: categoria.estado,
            fechaCreacion: categoria.createdAt,
            fechaActualizacion: categoria.updatedAt
        });
    });
    return tempCategorias;
}

export default withRouter(Productos);
