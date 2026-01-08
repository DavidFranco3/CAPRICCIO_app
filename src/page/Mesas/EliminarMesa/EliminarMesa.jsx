import { Container, Form, Spinner } from "react-bootstrap";
import { eliminarMesa, obtenerMesa } from "../../../api/mesas";
import { useEffect, useState, useActionState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
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
          <div className="mt-2 d-flex justify-content-center">
            <button className="btn btn-danger" type="submit" disabled={isPending}>
              {isPending ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faDeleteLeft} /> Eliminar</>}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default EliminarMesa;

