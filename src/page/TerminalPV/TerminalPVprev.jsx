import { useState, useEffect } from "react";
import { withRouter } from "../../utils/withRouter";
import Menu from "./components/Menu";
import Tiquet from "./components/Tiquet/Tiquet";
import "../../scss/styles.scss";
import { listarProductos, listarProductosCategoria } from "../../api/productos";
import { listarCategorias } from "../../api/categorias";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from "../Logs/components/LogsSistema/LogsSistema";
import Swal from 'sweetalert2';
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { useNavigate } from "react-router-dom";
import { obtenerVentas } from "../../api/ventas";

function TerminalPv(props) {
  console.log(props);

  const { setRefreshCheckLogin, turno, setShowTerminalPV } = props;

  const estadoticket = props.estado;
  const mesaticket = props.mesaticket;
  const numMesa = props.numMesa;
  const estadov = props.agregar;
  const tipoPedido = props.tipoPedido;
  const hacerPedido = props.hacerPedido;
  const mesaClick = props.mesaClick;
  const tpv = props.tpv;

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
            Swal.fire({ icon: 'error', title: "Conexión al servidor no disponible", timer: 1600, showConfirmButton: false });
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
        Swal.fire({ icon: 'warning', title: "Sesión expirada", timer: 1600, showConfirmButton: false });
        Swal.fire({ icon: 'success', title: "Sesión cerrada por seguridad", timer: 1600, showConfirmButton: false });
      }
    }
  };

  // Cerrado de sesión automatico
  useEffect(() => {
    cierreSesion();
  }, []);

  // MANEJO DE TICKET
  const [ticketItems, setTicketItems] = useState([]);

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

  // Definir la función cargarMesas fuera del condicional
  const cargarVentaPorTicket = (idTicket) => {
    try {
      obtenerVentas(idTicket)
        .then((response) => {
          const { data } = response;
          console.log(response);
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
      cargarVentaPorTicket(idTicket);
    }
  }, []);

  /**
   * fin obtener ticket por id
   */

  // Para almacenar la lista de productos
  const [listProductos, setListProductos] = useState(null);
  const [listCategorias, setListCategorias] = useState(null);
  const [categoriaActual, setCategoriaActual] = useState("");

  // obtener el listado de productos
  const cargarDatosProductos = () => {
    try {
      if (categoriaActual) {
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
      } else {
        listarProductos()
          .then((response) => {
            const { data } = response;
            const datosProductos = formatModelProductos(data);
            const sortedProductos = datosProductos.sort((a, b) =>
              a.nombre.localeCompare(b.nombre)
            );
            setListProductos(sortedProductos);
          })
          .catch((e) => {
            console.log(e);
          });
      }
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
              <div className="col-lg-7 col-md-12 col-sm-12">
                <div className="card card-outline card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Menu</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        class="btn btn-tool"
                        data-card-widget="collapse"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
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
              <div className="col-lg-5 col-md-12 col-sm-12">
                <div className="card card-outline card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Ticket</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        class="btn btn-tool"
                        data-card-widget="collapse"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
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
                      turno={turno}
                      agregar={estadov}
                      products={ticketItems}
                      empty={emptyTicket}
                      remove={removeProduct}
                      idUsuario={idUsuario}
                      usuario={datosUsuario.nombre}
                      estadoticket={estadoticket}
                      mesaticket={mesaticket}
                      numMesa={numMesa}
                      mesaId={props.mesaId}
                      idTicket={idTicket}
                      setShowTerminalPV={setShowTerminalPV}
                      tipoPedido={tipoPedido}
                      hacerPedido={hacerPedido}
                      mesaClick={mesaClick}
                      tpv={tpv}
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
      insumos: producto.insumos,
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
  } else if (typeof ventas === "object" && ventas !== null) {
    // Si es un objeto individual, formatearlo directamente
    return formatSingleVenta(ventas);
  } else {
    // Si no es ni un array ni un objeto individual, devuelve un valor predeterminado o maneja el caso según tus necesidades
    console.error(
      "El argumento 'ventas' no es ni un array ni un objeto individual válido."
    );
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
    fechaActualizacion: venta.updatedAt,
  };
}

export default withRouter(TerminalPv);

