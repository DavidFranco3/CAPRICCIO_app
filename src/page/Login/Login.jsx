import { useState, useActionState, startTransition } from "react";
import { login, setTokenApi } from "../../api/auth";
import Swal from 'sweetalert2';
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
import { useForm } from "react-hook-form";

function Login({ setRefreshCheckLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

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

  const [errorState, loginAction, isPending] = useActionState(async (prevState, fd) => {
    const usuario = fd.get("usuario");
    const password = fd.get("password");

    if (!usuario || !password) {
      Swal.fire({ icon: 'warning', title: "Completa todos los campos del formulario.", timer: 1600, showConfirmButton: false });
      return { error: "Incompleto" };
    }

    try {
      const response = await login({ usuario, password });
      const {
        data: { token },
      } = response;
      setTokenApi(token);
      const { _ } = jwtDecode(token);
      const idUdsuario = _;

      try {
        const userResponse = await obtenerUsuario(idUdsuario);
        const { data } = userResponse;
        LogsInformativos(
          "Inicio de sesión, para su seguridad la sesión finaliza automaticamente en 1 día",
          data
        );
        setRefreshCheckLogin(true);
        Swal.fire({ icon: 'success', title: "Bienvenido " + data.nombre, timer: 1600, showConfirmButton: false });
      } catch (ex) {
        Swal.fire({ icon: 'error', title: "Error al obtener el usuario", timer: 1600, showConfirmButton: false });
      }
      return null;
    } catch (ex) {
      if (ex.message === "Network Error") {
        Swal.fire({ icon: 'error', title: "Conexión al servidor no disponible", timer: 1600, showConfirmButton: false });
      } else if (ex.response && ex.response.status === 401) {
        const { mensaje } = ex.response.data;
        Swal.fire({ icon: 'error', title: mensaje, timer: 1600, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: "Error al iniciar sesión", timer: 1600, showConfirmButton: false });
      }
      return { error: ex.message };
    }
  }, null);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    startTransition(() => {
      loginAction(formData);
    });
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Logo La Nena" />
        </div>
        <h2>Bienvenido</h2>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-3">
            <Form.Control
              type="text"
              className="form-control"
              placeholder="Usuario"
              {...register("usuario", { required: "El usuario es obligatorio" })}
              isInvalid={!!errors.usuario}
            />
            <Form.Control.Feedback type="invalid">
              {errors.usuario?.message}
            </Form.Control.Feedback>
          </div>

          <div className="form-group mb-3 position-relative">
            <Form.Control
              type={mostrarPassword ? "text" : "password"}
              className="form-control"
              placeholder="Contraseña"
              {...register("password", { required: "La contraseña es obligatoria" })}
              isInvalid={!!errors.password}
            />
            <FontAwesomeIcon
              title="Mostrar contraseña"
              className="password-toggle"
              icon={!mostrarPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisiblity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </div>

          <Button
            title="Iniciar sesión"
            type="submit"
            className="btn-login"
            disabled={isPending}
          >
            {!isPending ? (
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

export default Login;

