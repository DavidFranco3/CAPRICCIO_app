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

function Login({ setRefreshCheckLogin }) {
  const [formData, setFormData] = useState(initialFormValue);
  const [signInLoading, setSignInLoading] = useState(false);

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
    <section className="h-screen">
      <div className="container px-6 py-12 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0 space-y-4">
            <div className="d-flex flex-column justify-content-center">
              <Row className="d-flex justify-content-center">
                <h4 className="d-flex justify-content-center">TPV</h4>
              </Row>
              <Row>
                <h4 className="d-flex justify-content-center">IsoTech</h4>
              </Row>
            </div>
            <Form onSubmit={onSubmit} onChange={onChange}>
              <div className="mb-6">
                <Form.Control
                  type="text"
                  name="usuario"
                  defaultValue={formData.usuario}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Usuario"
                />
              </div>

              <div className="flex items-center mb-6">
                <Form.Control
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  defaultValue={formData.password}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  placeholder="Contraseña"
                />
                <FontAwesomeIcon
                  title="Mostrar contraseña"
                  className="cursor-pointer py-2 -ml-6"
                  icon={!mostrarPassword ? faEyeSlash : faEye}
                  onClick={togglePasswordVisiblity}
                />
              </div>
              <div className="pt-6">
                <Button
                  title="Iniciar sesión"
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-bold text-lg leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  variant="primary"
                  disabled={signInLoading}
                >
                  {!signInLoading ? (
                    "Iniciar Sesión"
                  ) : (
                    <Spinner animation="border" />
                  )}
                </Button>
              </div>
              <br />
            </Form>
          </div>

          <BasicModal
            show={showModal}
            setShow={setShowModal}
            title={titulosModal}
          >
            {contentModal}
          </BasicModal>
        </div>
        <div className="w-full text-center lg:text-left">
          <div className="text-gray-700 text-center p-4">
            ©{" "}
            {
              // Get current year
              new Date().getFullYear()
            }{" "}
            Copyright:{" "}
            <a
              className="pie text-emerald-700 no-underline"
              href="https://ideasysolucionestecnologicas.com"
              target="_blank"
              rel="noreferrer"
              title="Ir al sitio web de la empresa"
            >
              Ideas y Soluciones Tecnológicas S.A de C.V
            </a>
          </div>
        </div>
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
