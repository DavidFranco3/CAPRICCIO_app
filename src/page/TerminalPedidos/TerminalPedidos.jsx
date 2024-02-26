import { useState, useEffect } from "react";
import { withRouter } from "../../utils/withRouter";
import Menu from "../../components/TerminalPedidos/Menu";
import Tiquet from "../../components/TerminalPedidos/Tiquet";
import "../../scss/styles.scss";
import { listarProductosCategoria } from "../../api/productos";
import { Alert, Col, Row, Button } from "react-bootstrap";
import { listarCategorias } from "../../api/categorias";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";
import { toast } from "react-toastify";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function TerminalPedidos(props) {
  const { setRefreshCheckLogin } = props;

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/PedidosClientes");
  };

  const [datosUsuario, setDatosUsuario] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log(data)
          setDatosUsuario(data);
          setIdUsuario(data._id);
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            //console.log("No hay internet")
            toast.error("Conexión al servidor no disponible");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const cierreSesion = () => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        LogsInformativosLogout(
          "Sesión finalizada",
          datosUsuario,
          setRefreshCheckLogin
        );
        logoutApi();
        setRefreshCheckLogin(true);
        toast.warning("Sesión expirada");
        toast.success("Sesión cerrada por seguridad");
      }
    }
  };

  // Cerrado de sesión automatico
  useEffect(() => {
    cierreSesion();
  }, []);

  const [ticketItems, setTicketItems] = useState([]);

  const [categoriaActual, setCategoriaActual] = useState("");

  const emptyTicket = () => {
    setTicketItems([]);
  };

  const addItems = (product) => {
    setTicketItems([...ticketItems, product]);
  };

  const removeProduct = (item) => {
    let newArray = ticketItems;
    newArray.splice(
      newArray.findIndex((a) => a.nombre === item.nombre),
      1
    );
    setTicketItems([...newArray]);
  };

  // Para almacenar la lista de productos
  const [listProductos, setListProductos] = useState(null);

  const cargarDatosProductos = () => {
    try {
      listarProductosCategoria(categoriaActual)
        .then((response) => {
          const { data } = response;
          if (!listProductos && data) {
            setListProductos(formatModelProductos(data));
          } else {
            const datosProductos = formatModelProductos(data);
            setListProductos(datosProductos);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  // obtener el listado de productos
  useEffect(() => {
    cargarDatosProductos();
  }, [categoriaActual]);

  // Para guardar el listado de categorias
  const [listCategorias, setListCategorias] = useState(null);

  const cargarDatosCategorias = () => {
    try {
      listarCategorias()
        .then((response) => {
          const { data } = response;
          //console.log(data)
          if (!listCategorias && data) {
            setListCategorias(formatModelCategorias(data));
          } else {
            const datosCategorias = formatModelCategorias(data);
            setListCategorias(datosCategorias);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarDatosCategorias();
  }, []);

  return (
    <>
      {/**
            <Alert className="fondoPrincipalAlert">
                <Row>
                    <Col xs={12} md={4} className="titulo">
                        <h1 className="font-bold">Pedidos</h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
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
            </Alert> */}

      {listProductos && listCategorias ? (
        <>
          <div className="containeripv">
            <div className="row">
              <div className="col-md-8">
                <div className="card card-outline card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Menu</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="maximize"
                      >
                        <i className="fas fa-expand" />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <Menu
                      addItems={addItems}
                      listProductos={listProductos}
                      listCategorias={listCategorias}
                      setCategoriaActual={setCategoriaActual}
                      categoriaActual={categoriaActual}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card card-outline card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Ticket</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="maximize"
                      >
                        <i className="fas fa-expand" />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <Tiquet
                      products={ticketItems}
                      empty={emptyTicket}
                      remove={removeProduct}
                      idUsuario={idUsuario}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Lottie loop={true} play={true} animationData={AnimacionLoading} />
        </>
      )}
    </>
  );
}

function formatModelProductos(productos) {
  const tempProductos = [];
  productos.forEach((producto) => {
    tempProductos.push({
      nombre: producto.nombre,
      categoria: producto.categoria,
      negocio: producto.negocio,
      precio: parseFloat(producto.precio),
      imagen: producto.imagen,
      fechaCreacion: producto.createdAt,
      fechaActualizacion: producto.updatedAt,
    });
  });
  return tempProductos;
}

function formatModelCategorias(categorias) {
  const tempCategorias = [];
  categorias.forEach((categoria) => {
    tempCategorias.push({
      id: categoria._id,
      nombre: categoria.nombre,
      negocio: categoria.negocio,
      imagen: categoria.imagen,
      fechaCreacion: categoria.createdAt,
      fechaActualizacion: categoria.updatedAt,
    });
  });
  return tempCategorias;
}

export default withRouter(TerminalPedidos);
