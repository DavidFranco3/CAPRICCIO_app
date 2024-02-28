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
  
  //console.log("id del ticket", idTicket);

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

/**obtener ticke por id*/
const idTicket = props.idTicket;
//console.log("folio del ticket",idTicket)
// Definir la función cargarMesas fuera del condicional
const cargarMesas = (idTicket) => {
  try {
    obtenerVentas(idTicket)
      .then((response) => {
        const { data } = response;
        //console.log("datos del ticket", data);
        //console.log("productos del ticket", data[0].productos);
        setTicketItems(data[0].productos);
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    console.log(e);
  }
};

// Llamar a useEffect siempre, pero dentro verificar si idTicket es válido
useEffect(() => {
  if (idTicket !== undefined && idTicket !== null) {
    cargarMesas(idTicket);
  }
}, []);


  /**
 * fin obtener ticket por id 
 */

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
                      idTicket = {idTicket}
                      
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
  if (Array.isArray(ventas)) {
    // Si es un array, iterar sobre cada elemento
    return ventas.map((venta) => formatSingleVenta(venta));
  } else if (typeof ventas === 'object' && ventas !== null) {
    // Si es un objeto individual, formatearlo directamente
    return formatSingleVenta(ventas);
  } else {
    // Si no es ni un array ni un objeto individual, devuelve un valor predeterminado o maneja el caso según tus necesidades
    console.error("El argumento 'ventas' no es ni un array ni un objeto individual válido.");
    return [];
  }
}

function formatSingleVenta(venta) {
  // Aquí colocas la lógica para formatear un objeto individual
  return {
    id: venta._id,
    numeroTiquet: venta.numeroTiquet,
    cliente: venta.cliente,
    mesa: venta.mesa,
    tipo: venta.tipo ? venta.tipo : "No disponible",
    // ... (resto de la lógica de transformación aquí)
    fechaCreacion: venta.createdAt,
    fechaActualizacion: venta.updatedAt
  };
}


export default withRouter(TerminalPv);
