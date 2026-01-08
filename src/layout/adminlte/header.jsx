import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
//import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import BasicModal from "../../components/Modal/BasicModal";
import Comision from "../../page/Comision/RegistroComision";
import Turno from "../../components/Turno/Turno";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversalAccess } from "@fortawesome/free-solid-svg-icons";
import ActionsLogo from "../../components/Logo/ActionsLogo";

const Header = (props) => {
  const { datosUsuario, turno, setTurno } = props;

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Estados para búsqueda y dropdown
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const editarComision = (content) => {
    setTitulosModal("Comisión bancaria");
    setContentModal(content);
    setShowModal(true);
  };

  const verTurno = (content) => {
    let titulo = "Registro turno";
    if (turno) titulo = "Ver turno";
    setTitulosModal(titulo);
    setContentModal(content);
    setShowModal(true);
  };

  const { setRefreshCheckLogin } = datosUsuario;
  const redirecciona = useNavigate();
  const cierreAutomatico = () => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        logoutApi();
        Swal.fire({ icon: 'warning', title: "Sesión expirada", timer: 1600, showConfirmButton: false });
        Swal.fire({ icon: 'success', title: "Sesión cerrada por seguridad", timer: 1600, showConfirmButton: false });
      }
    }
  };

  const cerrarSesion = () => {
    logoutApi();
    Swal.fire({ icon: 'success', title: "Sesión cerrada", timer: 1600, showConfirmButton: false });
    window.location.reload();
  };

  useEffect(() => {
    cierreAutomatico();
  }, []);

  const enrutaInicio = () => {
    redirecciona("/");
  };

  const editarLogo = (content) => {
    setTitulosModal("Logo");
    setContentModal(content);
    setShowModal(true);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="bg-secondary">
      <nav className="main-header navbar navbar-expand navbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <span
              className="nav-link"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const body = document.querySelector('body');
                if (window.innerWidth <= 991) {
                  if (body.classList.contains('sidebar-open')) {
                    body.classList.remove('sidebar-open');
                    body.classList.add('sidebar-collapse');
                    body.classList.add('sidebar-closed');
                  } else {
                    body.classList.add('sidebar-open');
                    body.classList.remove('sidebar-collapse');
                    body.classList.remove('sidebar-closed');
                  }
                } else {
                  if (body.classList.contains('sidebar-collapse')) {
                    body.classList.remove('sidebar-collapse');
                  } else {
                    body.classList.add('sidebar-collapse');
                  }
                }
              }}
            >
              <i className="fas fa-bars" />
            </span>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item d-flex align-items-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                verTurno(
                  <Turno
                    turno={turno}
                    setTurno={setTurno}
                    setShow={setShowModal}
                  />
                )
              }
            >
              Turno
            </button>
          </li>
          {/* Navbar Search */}
          <li className="nav-item">
            <span
              className="nav-link"
              role="button"
              onClick={toggleSearch}
            >
              <i className="fas fa-search" />
            </span>
            <div className={`navbar-search-block ${showSearch ? 'navbar-search-open' : ''}`} style={{ display: showSearch ? 'flex' : 'none' }}>
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
                      onClick={toggleSearch}
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>

          {/* Notifications Dropdown Menu */}
          <li className={`nav-item dropdown ${showDropdown ? 'show' : ''}`}>
            <span
              className="nav-link"
              role="button"
              onClick={toggleDropdown}
            >
              <i className="far fa-bell" />
              <span className="badge badge-warning navbar-badge cursor-pointer">
                <i className="fa fa-user"></i>
              </span>
            </span>
            <div className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${showDropdown ? 'show' : ''}`}>
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
              <div className="m-0 dropdown-divider" />
              {datosUsuario.rol === "administrador" && (
                <>
                  <span
                    onClick={() =>
                      editarLogo(<ActionsLogo setShow={setShowModal} />)
                    }
                    className="dropdown-item cursor-pointer d-flex justify-content-center align-items-center "
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faUniversalAccess}
                    />
                    Logo
                  </span>
                  <div className="m-0 dropdown-divider" />
                  <span className="dropdown-item">
                    <button
                      className="btn btn-block text-left"
                      onClick={() => {
                        editarComision(
                          <Comision setShowModal={setShowModal} />
                        );
                      }}
                    >
                      <i className="fas fa-landmark mr-2"></i>
                      Comision bancaria
                    </button>
                  </span>
                </>
              )}
            </div>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              role="button"
              onClick={toggleFullscreen}
            >
              <i className="fas fa-expand-arrows-alt" />
            </span>
          </li>
        </ul>
      </nav>

      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"md"}
      >
        {contentModal}
      </BasicModal>
    </div>
  );
};

export default Header;

