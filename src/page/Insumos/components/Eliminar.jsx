import { useState, useActionState } from "react";
import { Button, Col, Form, Row, Spinner, Image, Alert } from "react-bootstrap";
import Swal from 'sweetalert2';
import queryString from "query-string";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "dayjs/locale/es";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { LogsInformativos } from "../../Logs/components/LogsSistema/LogsSistema";
import { eliminaInsumo } from "../../../api/insumos";

function EliminarInsumos(props) {
  const { datosInsumo, setShow } = props;
  console.log(datosInsumo);

  dayjs.locale("es");
  dayjs.extend(localizedFormat);

  const [errorState, action, isPending] = useActionState(async () => {
    try {
      const response = await eliminaInsumo(datosInsumo._id);
      const { data } = response;
      LogsInformativos(
        "El insumo " + datosInsumo.nombre + " fue eliminado",
        datosInsumo
      );
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      setShow(false);
      return null; // Return null on success
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: "Error al eliminar el insumo", timer: 1600, showConfirmButton: false });
      return { error: "Error de eliminación" };
    }
  }, null);

  return (
    <>
      <Form action={action}>
        <div className="datosDelProducto">
          <Alert variant="danger">
            <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
            <p className="mensaje">
              Esta acción eliminará del sistema el ingrediente.
            </p>
          </Alert>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Escribe el nombre"
                value={datosInsumo.nombre}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Precio de adquisición</Form.Label>
              <Form.Control
                type="text"
                name="costo"
                placeholder="Escribe el nombre"
                value={datosInsumo.precioCompra}
                disabled
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Unidad de medida de adquisición</Form.Label>
              <Form.Control
                type="text"
                name="tipoUM"
                placeholder="Escribe el nombre"
                value={datosInsumo.umCompra}
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridNombre">
              <Form.Label>Unidad de medida de producción</Form.Label>
              <Form.Control
                type="text"
                name="um"
                placeholder="Escribe el nombre"
                value={datosInsumo.umTrabajo}
                disabled
              />
            </Form.Group>
          </Row>
        </div>

        <Form.Group as={Row} className="botonSubirProducto">
          <Col>
            <Button
              title="Eliminar categoría"
              type="submit"
              variant="success"
              className="registrar"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faSave} />{" "}
              {!isPending ? "Eliminar" : <Spinner animation="border" size="sm" />}
            </Button>
          </Col>
          <Col>
            <Button
              title="Cerrar ventana"
              variant="danger"
              className="cancelar"
              disabled={isPending}
              onClick={() => {
                setShow(false);
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

export default EliminarInsumos;

