import { useActionState } from "react";
import { registraUsuarios } from "../../../../api/usuarios";
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from "../../../Logs/components/LogsSistema/LogsSistema";

function RegistroUsuarios(props) {
  const { setShowModal, navigate } = props;

  // Para cancelar el registro
  const cancelarRegistro = () => {
    setShowModal(false);
  };

  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombre = fd.get("nombre");
    const usuario = fd.get("usuario");
    const password = fd.get("password");
    const admin = fd.get("admin");

    if (!nombre || !usuario || !password || !admin || admin === "Elige una opción") {
      Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
      return { error: "Incompleto" };
    }

    try {
      const dataTemp = {
        nombre,
        usuario,
        admin: admin === "administrador" ? "true" : "false",
        password,
        tipo: "interno",
        rol: admin,
        estadoUsuario: "true",
      };

      const response = await registraUsuarios(dataTemp);
      const { data } = response;

      navigate({
        search: queryString.stringify(""),
      });
      LogsInformativos(
        "Se ha registrado el usuario " + usuario,
        data.datos
      );
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      cancelarRegistro();
      return null;
    } catch (e) {
      console.log(e);
      if (e.message === "Network Error") {
        Swal.fire({ icon: 'error', title: "Conexión al servidor no disponible", timer: 1600, showConfirmButton: false });
      } else if (e.response && e.response.status === 401) {
        const { mensaje } = e.response.data;
        Swal.fire({ icon: 'error', title: mensaje, timer: 1600, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: "Error al registrar usuario", timer: 1600, showConfirmButton: false });
      }
      return { error: e.message };
    }
  }, null);

  return (
    <>
      <Form action={action}>
        <div className="datosDelProducto">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Escribe el nombre"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                placeholder="Escribe el usuario"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                placeholder="Escribe el password"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridAdmin">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="admin"
              >
                <option>Elige una opción</option>
                <option value="administrador">Administrador</option>
                <option value="vendedor">Cajero</option>
              </Form.Control>
            </Form.Group>
          </Row>
        </div>

        <Form.Group as={Row} className="botonSubirProducto">
          <Col>
            <Button
              title="Registrar categoría"
              type="submit"
              variant="success"
              className="registrar"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faSave} />{" "}
              {!isPending ? "Registrar" : <Spinner animation="border" />}
            </Button>
          </Col>
          <Col>
            <Button
              title="Cerrar ventana"
              variant="danger"
              className="cancelar"
              disabled={isPending}
              onClick={() => {
                cancelarRegistro();
              }}
            >
              <FontAwesomeIcon icon={faX} /> Cancelar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
}

export default RegistroUsuarios;

