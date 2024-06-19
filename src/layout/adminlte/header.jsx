import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import BasicModal from "../../components/Modal/BasicModal";
import Comision from "../../page/Comision/RegistroComision";

const Header = ({ datosUsuario }) => {

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const editarComision = (content) => {
    setTitulosModal("Comisión bancaria");
    setContentModal(content);
    setShowModal(true);
  };

  const { setRefreshCheckLogin } = datosUsuario;
  const redirecciona = useNavigate();
  const cierreAutomatico = () => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        /*LogsInformativosLogout(
          "Sesión finalizada",
          datosUsuario,
          setRefreshCheckLogin
        );*/
        logoutApi();
        //setRefreshCheckLogin(true);
        toast.warning("Sesión expirada");
        toast.success("Sesión cerrada por seguridad");
      }
    }
  };

  //Para cerrar la sesion
  const cerrarSesion = () => {
    /*LogsInformativosLogout(
      "Sesión finalizada",
      datosUsuario,
      setRefreshCheckLogin
    );*/
    logoutApi();
    //setRefreshCheckLogin(true);
    toast.success("Sesión cerrada");
    window.location.reload();

  };

  // Cerrado de sesión automatico
  useEffect(() => {
    cierreAutomatico();
  }, []);
  // Termina cerrado de sesión automatico

  // Para ir hacia el inicio
  const enrutaInicio = () => {
    redirecciona("/");
  };



  return (
    <div className="bg-secondary">
      <nav className="main-header navbar navbar-expand navbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              className="nav-link"
              data-widget="pushmenu"
              role="button"
            >
              <i className="fas fa-bars" />
            </span>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="index3.html" className="nav-link">
              Home
            </a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Navbar Search */}
          <li className="nav-item">
            <span
              className="nav-link"
              data-widget="navbar-search"
              role="button"
            >
              <i className="fas fa-search" />
            </span>
            <div className="navbar-search-block">
              <form className="form-inline">
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>

          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <span className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell" />
              <span className="badge badge-warning navbar-badge cursor-pointer">
                <i className="fa fa-user"></i>
              </span>
            </span>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                Usuario: {datosUsuario.nombre}
              </span>
              <div className="dropdown-divider" />
                <span className="dropdown-item">
                  <button
                    className="btn btn-block text-left"
                    onClick={() => {
                      cerrarSesion();
                    }}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Cerrar sesión
                  </button>
                </span>
                {datosUsuario.rol === "administrador" && (
                  <span className="dropdown-item">
                    <button 
                      onClick={() => {
                        editarComision(
                          <Comision
                            setShowModal={setShowModal}
                          />
                        )
                      }}
                    >
                      <i className="fas fa-landmark mr-2"></i>
                      Comision bancaria
                    </button>
                  </span>
                )}
              <div className="dropdown-divider" />
            </div>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              data-widget="fullscreen"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt" />
            </span>
          </li>
        </ul>
      </nav>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal} size={"md"}>
        {contentModal}
      </BasicModal>

    </div>
  );
};

export default Header;
