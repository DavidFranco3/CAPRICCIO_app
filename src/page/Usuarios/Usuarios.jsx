import { useState, useEffect, Suspense } from "react";
import {
  listarPaginacionUsuariosActivos,
  totalUsuariosActivos,
  listarPaginacionUsuariosCancelados,
  totalUsuariosCancelados,
} from "../../api/usuarios";
import { withRouter } from "../../utils/withRouter";
import "../../scss/styles.scss";
import { Alert, Col, Row, Button, Spinner } from "react-bootstrap";
import RegistrarUsuario from "./components/RegistroUsuarios";
import ListUsuarios from "./components/ListUsuarios";
import BasicModal from "../../components/Modal/BasicModal";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Usuarios(props) {
  const { setRefreshCheckLogin, location, navigate } = props;

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
  };

  // Para definir el estado del switch
  const [estadoSwitch, setEstadoSwitch] = useState(true);

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Para la lista de abonos
  const registroUsuarios = (content) => {
    setTitulosModal("Registrar un usuario");
    setContentModal(content);
    setShowModal(true);
  };

  const [datosUsuario, setDatosUsuario] = useState("");

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log(data)
          setDatosUsuario(data);
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

  // Para almacenar los usuarios
  const [listUsuarios, setListUsuarios] = useState(null);

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [noTotalUsuarios, setNoTotalUsuarios] = useState(1);

  // Para listar los usuarios
  useEffect(() => {
    //console.log("Estado del switch ", estadoSwitch)
    try {
      if (estadoSwitch) {
        // Lista los productos activos
        totalUsuariosActivos()
          .then((response) => {
            const { data } = response;
            setNoTotalUsuarios(data);
          })
          .catch((e) => {
            console.log(e);
          });

        if (page === 0) {
          setPage(1);

          listarPaginacionUsuariosActivos(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              if (!listUsuarios && data) {
                setListUsuarios(formatModelUsuarios(data));
              } else {
                const datosUsuarios = formatModelUsuarios(data);
                setListUsuarios(datosUsuarios);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          listarPaginacionUsuariosActivos(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              //console.log(data)

              if (!listUsuarios && data) {
                setListUsuarios(formatModelUsuarios(data));
              } else {
                const datosUsuarios = formatModelUsuarios(data);
                setListUsuarios(datosUsuarios);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      } else {
        // Lista los productos obsoletos
        totalUsuariosCancelados()
          .then((response) => {
            const { data } = response;
            setNoTotalUsuarios(data);
          })
          .catch((e) => {
            console.log(e);
          });

        if (page === 0) {
          setPage(1);

          listarPaginacionUsuariosCancelados(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              if (!listUsuarios && data) {
                setListUsuarios(formatModelUsuarios(data));
              } else {
                const datosUsuarios = formatModelUsuarios(data);
                setListUsuarios(datosUsuarios);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          listarPaginacionUsuariosCancelados(page, rowsPerPage)
            .then((response) => {
              const { data } = response;
              //console.log(data)
              if (!listUsuarios && data) {
                setListUsuarios(formatModelUsuarios(data));
              } else {
                const datosUsuarios = formatModelUsuarios(data);
                setListUsuarios(datosUsuarios);
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
  }, [location, estadoSwitch, page, rowsPerPage]);

  return (
    <>
      <div className="card card-outline m-3">
        <div className="card-header bg-gray">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 font-bold">Usuarios</h4>
            <div className="d-flex align-items-center">
              <button
                title="Registrar un nuevo usuario"
                className="btn btn-outline-light"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  registroUsuarios(
                    <RegistrarUsuario
                      setShowModal={setShowModal}
                      location={location}
                      navigate={navigate}
                    />
                  );
                }}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Registrar
              </button>
              <Switch
                title={
                  estadoSwitch === true
                    ? "Ver usuarios cancelados"
                    : "Ver usuarios activos"
                }
                checked={estadoSwitch}
                onChange={setEstadoSwitch}
                className={`${estadoSwitch ? "bg-teal-900" : "bg-red-600"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 float-end`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    estadoSwitch ? "translate-x-9" : "translate-x-0"
                  }
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </div>
        </div>
        <div className="card-body">
          {listUsuarios ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListUsuarios
                  listUsuarios={listUsuarios}
                  location={location}
                  navigate={navigate}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  noTotalUsuarios={noTotalUsuarios}
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

function formatModelUsuarios(usuarios) {
  const tempUsuarios = [];
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
      fechaActualizacion: usuario.updatedAt,
    });
  });
  return tempUsuarios;
}

export default withRouter(Usuarios);
