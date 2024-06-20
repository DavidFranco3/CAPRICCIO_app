import { useState, useEffect, Suspense } from "react";
import {
  listarPaginacionPedidosPorClientes,
  totalPedidosPorClientes,
  listarPaginacionPedidos,
  totalPedidos,
} from "../../api/pedidosClientes";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import { Alert, Col, Row, Button, Spinner } from "react-bootstrap";
import ListPedidos from "./components/ListPedidos";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from "../Logs/components/LogsSistema/LogsSistema";
import { toast } from "react-toastify";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faArrowCircleLeft,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "./components/Slider";
import BasicModal from "../../components/Modal/BasicModal";

function PedidosClientes(props) {
  const { setRefreshCheckLogin, location, navigate } = props;

  //Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const ayuda = (content) => {
    setTitulosModal("Ayuda");
    setContentModal(content);
    setShowModal(true);
  };

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
  };

  const rutaRegistroVenta = () => {
    enrutamiento("/TerminalPedidos");
  };

  // Para definir el estado del switch
  const [estadoSwitch, setEstadoSwitch] = useState(true);

  const [datosUsuario, setDatosUsuario] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("");

  const [estadoUsuario, setEstadoUsuario] = useState(null);

  const [idUsuario, setIdUsuario] = useState("");

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log(data)
          const { tipo, admin, _id } = data;
          setTipoUsuario(tipo);
          setEstadoUsuario(admin);
          setDatosUsuario(data);
          setIdUsuario(_id);
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

  // Para almacenar las ventas realizadas
  const [listPedidos, setListPedidos] = useState(null);

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [noTotalPedidos, setNoTotalPedidos] = useState(1);

  const cargarDatos = () => {
    //console.log("Estado del switch ", estadoSwitch)
    try {
      if (tipoUsuario === "externo") {
        // Lista los productos activos
        totalPedidosPorClientes(idUsuario)
          .then((response) => {
            const { data } = response;
            setNoTotalPedidos(data);
          })
          .catch((e) => {
            console.log(e);
          });

        if (page === 0) {
          setPage(1);

          listarPaginacionPedidosPorClientes(page, rowsPerPage, idUsuario)
            .then((response) => {
              const { data } = response;
              if (!listPedidos && data) {
                setListPedidos(formatModelPedidos(data));
              } else {
                const datosPedidos = formatModelPedidos(data);
                setListPedidos(datosPedidos);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          listarPaginacionPedidosPorClientes(page, rowsPerPage, idUsuario)
            .then((response) => {
              const { data } = response;
              if (!listPedidos && data) {
                setListPedidos(formatModelPedidos(data));
              } else {
                const datosPedidos = formatModelPedidos(data);
                setListPedidos(datosPedidos);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else {
        // Lista los productos obsoletos
        totalPedidos()
          .then((response) => {
            const { data } = response;
            setNoTotalPedidos(data);
          })
          .catch((e) => {
            console.log(e);
          });

        if (page === 0) {
          setPage(1);

          listarPaginacionPedidos(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              if (!listPedidos && data) {
                setListPedidos(formatModelPedidos(data));
              } else {
                const datosPedidos = formatModelPedidos(data);
                setListPedidos(datosPedidos);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          listarPaginacionPedidos(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              if (!listPedidos && data) {
                setListPedidos(formatModelPedidos(data));
              } else {
                const datosPedidos = formatModelPedidos(data);
                setListPedidos(datosPedidos);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Para listar las ventas
  useEffect(() => {
    cargarDatos();
  }, [location, tipoUsuario, page, rowsPerPage]);

  return (
    <>
      <div className="card card-outline m-3">
        <div className="card-header bg-gray">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="font-bold mb-0">Pedidos de clientes</h4>
            <div className="d-flex align-items-center">
              <div style={{ float: "right" }}>
                {estadoUsuario === "false" && tipoUsuario === "externo" && (
                  <>
                    <button
                      title="Ir a la terminal de pedidos"
                      className="btn btn-outline-light "
                      style={{ marginRight: "10px" }}
                      onClick={() => {
                        rutaRegistroVenta();
                      }}
                    >
                      <FontAwesomeIcon icon={faCirclePlus} /> Nuevo pedido
                    </button>
                    <button
                      title="Ver ayuda"
                      className="btn btn-outline-light"
                      style={{ marginRight: "10px" }}
                      onClick={() => ayuda(<Slider />)}
                    >
                      <FontAwesomeIcon icon={faQuestion} /> Ayuda
                    </button>
                  </>
                )}
                <button
                  title="Regresar a la pagina anterior"
                  className="btn btn-outline-light"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    rutaRegreso();
                  }}
                >
                  <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {listPedidos ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListPedidos
                  listPedidos={listPedidos}
                  tipoUsuario={tipoUsuario}
                  location={location}
                  navigate={navigate}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  noTotalPedidos={noTotalPedidos}
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

function formatModelPedidos(ventas) {
  const tempVentas = [];
  ventas.forEach((venta) => {
    tempVentas.push({
      id: venta._id,
      numeroTiquet: venta.numeroTiquet,
      cliente: venta.cliente,
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
      hacerPedido: venta.hacerPedido,
      tipoPedido: venta.tipoPedido,
      direccion: venta.direccion,
      estado: venta.estado,
      fechaCreacion: venta.createdAt,
      fechaActualizacion: venta.updatedAt,
    });
  });
  return tempVentas;
}

export default withRouter(PedidosClientes);
