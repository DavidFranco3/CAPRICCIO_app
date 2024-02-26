import { useState, useEffect } from "react";
import { withRouter } from "../../utils/withRouter";
import Menu from "../../components/TerminalPV/Menu";
import Tiquet from "../../components/TerminalPV/Tiquet";
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
import { obtenerVentas } from "../../api/ventas";


function TerminalPv(props) {
  const { setRefreshCheckLogin } = props;

  const estadoticket = props.estado;
  const mesaticket = props.mesaticket;
  const mesaid = props.idmesa;
  const idTicket = props.idTicket;
  console.log("id del ticket", idTicket);


/**obtener ticke por id*/
const [listMesas, setListMesas] = useState([]);

  const cargarMesas = (id) => {
    try {
      obtenerVentas(id)
        .then((response) => {
          const { data } = response;
          console.log("datos del ticket", data);
          if (!listMesas && data) {
            setListMesas(formatModelVentas(data));
          } else {
            const datosMesas = formatModelVentas(data);
            setListMesas(datosMesas);
            //console.log("mesas", datosMesas);
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
    cargarMesas(idTicket);
  }, [idTicket]);
/**
 * fin obtener ticket por id 
 */




  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
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
  const [listCategorias, setListCategorias] = useState(null);

  // obtener el listado de productos
  const cargarDatosProductos = () => {
    try {
      listarProductosCategoria(categoriaActual)
        .then((response) => {
          const { data } = response;
          if (!listProductos && data) {
            const sortedProductos = formatModelProductos(data).sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setListProductos(sortedProductos);
          } else {
            const datosProductos = formatModelProductos(data);
            const sortedProductos = datosProductos.sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setListProductos(sortedProductos);
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

  const cargarDatosCategorias = () => {
    try {
      listarCategorias()
        .then((response) => {
          const { data } = response;
          if (!listCategorias && data) {
            const sortedCategorias = formatModelCategorias(data).sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setListCategorias(sortedCategorias);
          } else {
            const datosCategorias = formatModelCategorias(data);
            const sortedCategorias = datosCategorias.sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setListCategorias(sortedCategorias);
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
            <h1 className="font-bold">Ventas</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: "right" }}>
              <Button
                title="Regresar a la pagina anterior"
                className="btnRegistro"
                style={{ marginRight: "10px" }}
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
 */}
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
                      estadoticket = {estadoticket}
                      mesaticket = {mesaticket}
                      mesaid = {mesaid}
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
      id: producto._id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      negocio: producto.negocio,
      costoProduccion: parseFloat(producto.costoProduccion)
        ? parseFloat(producto.costoProduccion)
        : 0,
      ingredientes: producto.ingredientes,
      precio: parseFloat(producto.precio),
      imagen: producto.imagen,
      estado: producto.estado,
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


function formatModelVentas(ventas) {
  const tempVentas = [];
  ventas.forEach((venta) => {
      tempVentas.push({
          id: venta._id,
          numeroTiquet: venta.numeroTiquet,
          cliente: venta.cliente,
          mesa: venta.mesa,
          tipo: venta.tipo ? venta.tipo : "No disponible",
          usuario: venta.usuario,
          productosVendidos: venta.productos.length,
          articulosVendidos: venta.productos,
          detalles: venta.detalles,
          tipoPago: venta.tipoPago,
          efectivo: venta.efectivo,
          cambio: venta.cambio,
          total: parseFloat(venta.total),
          subtotal: parseFloat(venta.subtotal),
          iva: parseFloat(venta.iva),
          comision: parseFloat(venta.comision),
          pagado: venta.pagado,
          hacerPedido: venta.hacerPedido,
          tipoPedido: venta.tipoPedido,
          estado: venta.estado,
          atendido: !venta.atendido ? "false" : venta.atendido,
          semana: !venta.semana ? "0" : venta.semana, // Corregido
          año: !venta.año ? "2023" : venta.año, // Simplificado
          fechaCreacion: venta.createdAt,
          fechaActualizacion: venta.updatedAt
      });
  });
  return tempVentas;
}

export default withRouter(TerminalPv);
