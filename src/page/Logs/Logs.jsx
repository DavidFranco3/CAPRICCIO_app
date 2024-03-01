import { useState, useEffect, Suspense } from "react";
import { Alert, Col, Row, Button, Spinner } from "react-bootstrap";
import { withRouter } from "../../utils/withRouter";
import { listarLogsPaginacion, totalLogs } from "../../api/logsGenerales";
import ListLogs from "../../components/Logs/ListLogs";
import "../../scss/styles.scss";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Logs(props) {
  const { setRefreshCheckLogin, location, navigate } = props;

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
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

  // Para almacenar todos los log del sistema
  const [listLog, setListLog] = useState(null);

  // Para controlar la paginación
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [noTotalLogs, setNoTotalLogs] = useState(1);

  const cargarDatos = () => {
    //console.log("Estado del switch ", estadoSwitch)
    try {
      // Lista los productos activos
      totalLogs()
        .then((response) => {
          const { data } = response;
          setNoTotalLogs(data);
        })
        .catch((e) => {
          console.log(e);
        });

      if (page === 0) {
        setPage(1);

        listarLogsPaginacion(page, rowsPerPage)
          .then((response) => {
            const { data } = response;
            if (!listLog && data) {
              setListLog(formatModelLogs(data));
            } else {
              const datosLogs = formatModelLogs(data);
              setListLog(datosLogs);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        listarLogsPaginacion(page, rowsPerPage)
          .then((response) => {
            const { data } = response;
            if (!listLog && data) {
              setListLog(formatModelLogs(data));
            } else {
              const datosLogs = formatModelLogs(data);
              setListLog(datosLogs);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Para listar las ventas
  useEffect(() => {
    cargarDatos();
  }, [location, page, rowsPerPage]);

  return (
    <>
      
      <div className="card card-outline card-danger m-3">
        <div className="card-header">
          <h3 className="font-bold">Logs del sistema</h3>
        </div>
        <div className="card-body">
          {listLog ? (
            <>
              <Suspense fallback={<Spinner />}>
                <ListLogs
                  listLogs={listLog}
                  location={location}
                  navigate={navigate}
                  setRefreshCheckLogin={setRefreshCheckLogin}
                  setRowsPerPage={setRowsPerPage}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  setPage={setPage}
                  noTotalLogs={noTotalLogs}
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
    </>
  );
}

function formatModelLogs(data) {
  //console.log(data)
  const dataTemp = [];
  data.forEach((data) => {
    dataTemp.push({
      id: data._id,
      folio: data.folio,
      usuario: data.usuario,
      sucursal: data.sucursal,
      correo: data.correo,
      ip: data.ip,
      dispositivo: data.dispositivo,
      descripcion: data.descripcion,
      detalles: data.detalles,
      mensaje: data.detalles.mensaje,
      fechaCreacion: data.createdAt,
      fechaActualizacion: data.updatedAt,
    });
  });
  return dataTemp;
}

export default withRouter(Logs);
