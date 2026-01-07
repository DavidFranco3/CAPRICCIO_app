import { useEffect, useState } from "react";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../api/auth";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { Card, Image, Row, Col, Container } from "react-bootstrap"; // Added Row, Col, Container
import { obtenerUsuario } from "../../api/usuarios";
import "../../scss/styles.scss";
import { LogsInformativosLogout } from "../Logs/components/LogsSistema/LogsSistema";
// Importaciones de imagenes del dashboard
import LogoVentas from "../../assets/png/ventas.png";
import LogoHistorial from "../../assets/png/facturas.png";
import LogoCajas from "../../assets/png/cajas.png";
import LogoIngredientes from "../../assets/png/ingredientes.png";
import LogoPedidos from "../../assets/png/pedidos.png";
import Turno from "../../components/Turno/Turno";
import BasicModal from "../../components/Modal/BasicModal";

// Nuevos Imports para Widgets
import dayjs from "dayjs";
import { listarVentasDia } from "../../api/ventas";
import KPICards from "./components/KPICards";
import TopProducts from "./components/TopProducts";
import SalesChartWidget from "./components/SalesChartWidget";

function Dashboard(props) {
  const { setRefreshCheckLogin, turno, setTurno } = props;
  console.log(props);

  const enrutamiento = useNavigate();

  const [estadoUsuario, setEstadoUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState(null);

  // State for Dashboard Data
  const [ventasDia, setVentasDia] = useState([]);

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          const { admin, tipo, rol } = data;
          //console.log(data)
          setTipoUsuario(tipo);
          setEstadoUsuario(admin);
          setRolUsuario(rol);
          setDatosUsuario(data);

          // Trigger data fetch if admin
          if (admin === "true") {
            fetchDashboardData();
          }
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

  const fetchDashboardData = async () => {
    try {
      const hoy = dayjs().format('YYYY-MM-DD');
      const response = await listarVentasDia(hoy);
      if (response && response.data) {
        setVentasDia(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
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

  // Termina cerrado de sesión automatico

  // Para modal
  const [showModal, setShowModal] = useState(false);
  const [contentMod, setContentMod] = useState(null);
  const [titulo, setTitulo] = useState(null);

  // Para registrar turno
  const registroTurno = (content) => {
    setShowModal(true);
    setContentMod(content);
    setTitulo("Registro turno");
  };

  const goTo = (ruta) => enrutamiento(ruta);

  const ItemCard = ({ path, logo, title }) => {
    const isTurnoActivo = turno && turno.estado && turno.estado !== "cerrado";

    if (!isTurnoActivo && path === "/TerminalPV") {
      return (
        <Card className="glass-card contenidoCentrado h-100 shadow-sm border-0 hover-lift cursor-pointer">
          <Card.Body>
            <div className="flex flex-col items-center justify-center">
              <div className="d-flex flex-col items-center justify-center">
                <p>Agregar turno</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    registroTurno(
                      <Turno
                        setShow={setShowModal}
                        turno={turno}
                        setTurno={setTurno}
                      />
                    )
                  }
                >
                  Agregar Turno
                </button>
              </div>
            </div>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card className="glass-card contenidoCentrado h-100 shadow-sm border-0 hover-lift cursor-pointer" onClick={() => goTo(path)} style={{ cursor: 'pointer' }}>
          <Card.Body className="p-3">
            <div className="flex flex-col items-center justify-center">
              <Image
                title={title}
                alt={title}
                src={logo}
                style={{ width: "64px", marginBottom: '10px' }} // Reduced size slightly for cleaner look
              />
              <span className="inline-block text-md font-semibold text-center text-white">{title}</span>
            </div>
          </Card.Body>
        </Card>
      );
    }
  };

  return (
    <>
      {/*Vista del Dashboard para un usuario administrador*/}
      {estadoUsuario === "true" && (
        <Container fluid className="p-4">

          <div className="mb-4">
            <h2 className="fw-bold text-white">Panel de Control</h2>
            <p className="text-white-50">Resumen de actividad del día {dayjs().format('DD/MM/YYYY')}</p>
          </div>

          <KPICards ventas={ventasDia} />

          <Row className="mb-4">
            <Col lg={8} md={12}>
              <SalesChartWidget ventas={ventasDia} />
            </Col>
            <Col lg={4} md={12} className="mt-4 mt-lg-0">
              <TopProducts ventas={ventasDia} />
            </Col>
          </Row>

          <BasicModal
            size={"md"}
            show={showModal}
            setShow={setShowModal}
            title={titulo}
          >
            {contentMod}
          </BasicModal>
        </Container>
      )}

      {/*Vista del Dashboard para un usuario cajero*/}
      {estadoUsuario === "false" &&
        rolUsuario === "cajero" &&
        tipoUsuario === "interno" && (
          <>
            <div className="m-3 grid grid-cols-5 gap-5">
              <ItemCard
                path={"/TerminalPV"}
                logo={LogoVentas}
                title={"Ventas"}
              />
              <ItemCard
                path={"/Insumos"}
                logo={LogoIngredientes}
                title={"Insumos"}
              />
              <ItemCard
                path={"/Turnos"}
                logo={LogoCajas}
                title={"Turnos y Cajas"}
              />
            </div>
            <BasicModal
              size={"md"}
              show={showModal}
              setShow={setShowModal}
              title={titulo}
            >
              {contentMod}
            </BasicModal>
          </>
        )}
      {/*Vista del Dashboard para un usuario mesero*/}
      {estadoUsuario === "false" &&
        rolUsuario === "mesero" &&
        tipoUsuario === "interno" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ItemCard
                path={"/TerminalPV"}
                logo={LogoVentas}
                title={"Ventas"}
              />
              <ItemCard
                path={"/HistorialesNoAdmin"}
                logo={LogoHistorial}
                title={"Historiales"}
              />
            </div>
            <BasicModal
              size={"md"}
              show={showModal}
              setShow={setShowModal}
              title={titulo}
            >
              {contentMod}
            </BasicModal>
          </>
        )}
      {/*Vista del Dashboard para un usuario cliente*/}
      {estadoUsuario === "false" && tipoUsuario === "externo" && (
        <>
          <div className="grid grid-cols-1 gap-1">
            <ItemCard
              path={"/PedidosClientes"}
              logo={LogoPedidos}
              title={"Pedidos en línea"}
            />
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;

