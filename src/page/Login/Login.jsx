import { useState } from "react";
import { login, setTokenApi } from "../../api/auth";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Spinner, Button, Form, Image, Row, Col } from "react-bootstrap";
import { obtenerUsuario } from "../../api/usuarios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LogoLANENA from "../../assets/png/nena1.png";
import "../../scss/styles.scss";
import RegistroClientes from "../Usuarios/components/RegistroClientes";
import BasicModal from "../../components/Modal/BasicModal";
import { LogsInformativos } from "../Logs/components/LogsSistema/LogsSistema";
import "./Login.scss";

function Login({ setRefreshCheckLogin }) {
  const [formData, setFormData] = useState(initialFormValue);
  const [signInLoading, setSignInLoading] = useState(false);

  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const togglePasswordVisiblity = () => {
    setMostrarPassword((val) => !val);
  };

  // Para hacer uso del modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Para la lista de abonos
  const registroUsuarios = (content) => {
    setTitulosModal("Crear usuario");
    setContentModal(content);
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usuario || !formData.password) {
      toast.warning("Completa todos los campos del formulario.");
    } else {
      setSignInLoading(true);
      try {
        login(formData)
          .then((response) => {
            const {
              data: { token },
            } = response;
            setTokenApi(token);
            const { _ } = jwtDecode(token);
            const idUdsuario = _;
            try {
              obtenerUsuario(idUdsuario).then((response) => {
                const { data } = response;
                LogsInformativos(
                  "Inicio de sesión, para su seguridad la sesión finaliza automaticamente en 1 día",
                  data
                );
                setRefreshCheckLogin(true);
                toast.success("Bienvenido " + data.nombre);
              });
            } catch (ex) {
              toast.error("Error al obtener el usuario");
            }
          })
          .catch((ex) => {
            if (ex.message === "Network Error") {
              toast.error("Conexión al servidor no disponible");
              setSignInLoading(false);
            } else {
              if (ex.response && ex.response.status === 401) {
                const { mensaje } = ex.response.data;
                toast.error(mensaje);
                setSignInLoading(false);
              }
            }
          });
      } catch (ex) {
        toast.error("Error al iniciar sesión");
        setSignInLoading(false);
      }
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Logo La Nena" />
        </div>
        <h2>Bienvenido</h2>

        <Form onSubmit={onSubmit} onChange={onChange}>
          <div className="form-group">
            <Form.Control
              type="text"
              name="usuario"
              defaultValue={formData.usuario}
              className="form-control"
              placeholder="Usuario"
            />
          </div>

          <div className="form-group">
            <Form.Control
              type={mostrarPassword ? "text" : "password"}
              name="password"
              defaultValue={formData.password}
              className="form-control"
              placeholder="Contraseña"
            />
            <FontAwesomeIcon
              title="Mostrar contraseña"
              className="password-toggle"
              icon={!mostrarPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisiblity}
            />
          </div>

          <Button
            title="Iniciar sesión"
            type="submit"
            className="btn-login"
            disabled={signInLoading}
          >
            {!signInLoading ? (
              "INICIAR SESIÓN"
            ) : (
              <Spinner animation="border" size="sm" />
            )}
          </Button>
        </Form>

        <div className="login-footer">
          <p>
            © {new Date().getFullYear()} Copyright:{" "}
            <a
              href="https://ideasysolucionestecnologicas.com"
              target="_blank"
              rel="noreferrer"
            >
              Ideas y Soluciones Tecnológicas
            </a>
          </p>
        </div>

        <BasicModal
          show={showModal}
          setShow={setShowModal}
          title={titulosModal}
        >
          {contentModal}
        </BasicModal>
      </div>
    </section>
  );
}

function initialFormValue() {
  return {
    usuario: "",
    password: "",
  };
}

export default Login;
