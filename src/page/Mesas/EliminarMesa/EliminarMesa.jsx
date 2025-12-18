import { Container, Form } from "react-bootstrap";
import { eliminarMesa, obtenerMesa } from "../../../api/mesas";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function EliminarMesa(props) {
  const { mesaId, setShow } = props;

  const [numeroMesa, setNumeroMesa] = useState("");

  const cargarDatosMesa = async (idMesa) => {
    const response = await obtenerMesa(idMesa);
    const { data } = response;
    setNumeroMesa(data.numeroMesa);
  };

  useEffect(() => {
    cargarDatosMesa(mesaId);
  }, [mesaId]);

  const deleteMesa = async () => {
    try {
      const response = await eliminarMesa(mesaId);
      const { data } = response;
      toast.success(data.mensaje);
      setShow(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Container>
        <Form.Group>
          <Form.Label>Num. mesa</Form.Label>
          <Form.Control type="input" value={numeroMesa} disabled />
        </Form.Group>
        <div className="mt-2 d-flex justify-content-center">
          <button className="btn btn-danger" onClick={deleteMesa}>
            <FontAwesomeIcon icon={faDeleteLeft} /> Eliminar
          </button>
        </div>
      </Container>
    </>
  );
}

export default EliminarMesa;
