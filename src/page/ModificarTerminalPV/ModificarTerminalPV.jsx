import React, { useState, useEffect } from 'react';
import { withRouter } from "../../utils/withRouter";
import Menu from "../../components/ModificarTerminalPV/Menu";
import Tiquet from "../../components/ModificarTerminalPV/Tiquet";
import "../../scss/styles.scss";
import { listarProductosCategoria } from "../../api/productos";
import { Alert, Col, Row, Button } from "react-bootstrap";
import { listarCategorias } from "../../api/categorias";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ModificarTerminalPv({ setRefreshCheckLogin }) {
    const enrutamiento = useNavigate();
    const [datosUsuario, setDatosUsuario] = useState("");
    const [idUsuario, setIdUsuario] = useState("");
    const [ticketItems, setTicketItems] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState("");
    const [listProductos, setListProductos] = useState(null);
    const [listCategorias, setListCategorias] = useState(null);

    useEffect(() => {
        obtenerDatosUsuario();
        cargarDatosCategorias();
    }, []);

    useEffect(() => {
        cargarDatosProductos();
    }, [categoriaActual]);

    useEffect(() => {
        cierreSesion();
    }, []);

    const obtenerDatosUsuario = async () => {
        try {
            const response = await obtenerUsuario(obtenidusuarioLogueado(getTokenApi()));
            const { data } = response;
            setDatosUsuario(data);
            setIdUsuario(data._id);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            if (error.message === 'Network Error') {
                toast.error("Conexión al servidor no disponible");
            }
        }
    };

    const cierreSesion = () => {
        if (getTokenApi() && isExpiredToken(getTokenApi())) {
            LogsInformativosLogout("Sesión finalizada", datosUsuario, setRefreshCheckLogin);
            logoutApi();
            setRefreshCheckLogin(true);
            toast.warning('Sesión expirada');
            toast.success('Sesión cerrada por seguridad');
        }
    };

    const emptyTicket = () => {
        setTicketItems([]);
    };

    const addItems = (product) => {
        setTicketItems(prevItems => [...prevItems, product]);
    };

    const removeProduct = (item) => {
        setTicketItems(prevItems => prevItems.filter(a => a.nombre !== item.nombre));
    };

    const cargarDatosProductos = async () => {
        try {
            const response = await listarProductosCategoria(categoriaActual);
            const { data } = response;
            const datosProductos = formatModelProductos(data);
            setListProductos(datosProductos);
        } catch (error) {
            console.error("Error al cargar datos de productos:", error);
        }
    };

    const cargarDatosCategorias = async () => {
        try {
            const response = await listarCategorias();
            const { data } = response;
            const datosCategorias = formatModelCategorias(data);
            setListCategorias(datosCategorias);
        } catch (error) {
            console.error("Error al cargar datos de categorías:", error);
        }
    };

    const rutaRegreso = () => {
        enrutamiento("/");
    };

    return (
        <>
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Ventas</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                title="Regresar a la pagina anterior"
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={rutaRegreso}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            {listProductos && listCategorias ? (
                <div className="app">
                    <div className="pos">
                        <Tiquet
                            products={ticketItems}
                            empty={emptyTicket}
                            remove={removeProduct}
                            idUsuario={idUsuario}
                        />
                        <Menu
                            addItems={addItems}
                            listProductos={listProductos}
                            listCategorias={listCategorias}
                            setCategoriaActual={setCategoriaActual}
                            categoriaActual={categoriaActual}
                        />
                    </div>
                </div>
            ) : (
                <Lottie loop={true} play={true} animationData={AnimacionLoading} />
            )}
        </>
    );
}

function formatModelProductos(productos) {
    return productos.map((producto) => ({
        id: producto._id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        negocio: producto.negocio,
        costoProduccion: parseFloat(producto.costoProduccion) || 0,
        ingredientes: producto.ingredientes,
        precio: parseFloat(producto.precio),
        imagen: producto.imagen,
        estado: producto.estado,
        fechaCreacion: producto.createdAt,
        fechaActualizacion: producto.updatedAt
    }));
}

function formatModelCategorias(categorias) {
    return categorias.map((categoria) => ({
        id: categoria._id,
        nombre: categoria.nombre,
        negocio: categoria.negocio,
        imagen: categoria.imagen,
        fechaCreacion: categoria.createdAt,
        fechaActualizacion: categoria.updatedAt
    }));
}

export default withRouter(ModificarTerminalPv);
