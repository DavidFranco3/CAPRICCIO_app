import { Container, Form, Spinner, Row, Col, Button } from "react-bootstrap";
import { eliminarMesa, obtenerMesa } from "../../../api/mesas";
import { useEffect, useState, useActionState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faX } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

function EliminarMesa(props) {
  const { mesaId, setShow } = props;

  const [numeroMesa, setNumeroMesa] = useState("");

  const cargarDatosMesa = async (idMesa) => {
    try {
      const response = await obtenerMesa(idMesa);
      const { data } = response;
      setNumeroMesa(data.numeroMesa);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargarDatosMesa(mesaId);
  }, [mesaId]);

  const [errorState, action, isPending] = useActionState(async () => {
    try {
      const response = await eliminarMesa(mesaId);
      const { data } = response;
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      setShow(false);
      return null;
    } catch (e) {
      console.log(e);
      Swal.fire({ icon: 'error', title: "Error al eliminar", timer: 1600, showConfirmButton: false });
      return { error: "Error" };
    }
  }, null);

  return (
    <>
      <Container>
        <Form action={action}>
          <Form.Group>
            <Form.Label>Num. mesa</Form.Label>
            <Form.Control type="input" value={numeroMesa} disabled />
          </Form.Group>
          <Form.Group as={Row} className="botonSubirProducto mt-3">
            <Col>
              <Button
                variant="success"
                type="submit"
                className="w-100"
                disabled={isPending}
              >
                {isPending ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faDeleteLeft} /> Eliminar</>}
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                className="w-100"
                onClick={() => props.setShow(false)}
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faX} /> Cancelar
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}

export default EliminarMesa;

