import React, { useEffect, useState, useActionState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { editarMesa, obtenerMesa } from "../../../api/mesas";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const EditarMesa = (props) => {
  const { mesaId, setShow } = props;

  const [numeroMesa, setNumeroMesa] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarDatosMesa = async (idMesa) => {
    try {
      const response = await obtenerMesa(idMesa);
      const { data } = response;
      setNumeroMesa(data.numeroMesa);
      setNumeroPersonas(data.numeroPersonas);
      setDescripcion(data.descripcion || "");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargarDatosMesa(mesaId);
  }, [mesaId]);

  const cerrarModal = () => {
    setShow(false);
  };

  const [errorState, action, isPending] = useActionState(async (previousState, formData) => {
    const numMesa = formData.get("numeroMesa");
    const numPersonas = formData.get("numeroPersonas");
    const desc = formData.get("descripcion");

    if (!numMesa || !numPersonas || !desc) {
      Swal.fire({ icon: 'warning', title: "Todos los campos son obligatorios", timer: 1600, showConfirmButton: false });
      return { error: "Incompleto" };
    }

    try {
      const response = await editarMesa(mesaId, {
        numeroMesa: numMesa,
        descripcion: desc,
        numeroPersonas: numPersonas,
      });

      if (response.status === 200) {
        console.log("Actualización exitosa");
        Swal.fire({ icon: 'success', title: "Actualización exitosa", timer: 1600, showConfirmButton: false });
        setShow(false);
        return null;
      } else {
        console.error("Error al actualizar la mesa");
        Swal.fire({ icon: 'error', title: "Error al actualizar", timer: 1600, showConfirmButton: false });
        return { error: "Error" };
      }
    } catch (error) {
      console.error("Error de red:", error);
      Swal.fire({ icon: 'error', title: "Error de red", timer: 1600, showConfirmButton: false });
      return { error: "Error de red" };
    }
  }, null);

  return (
    <Container>
      <Form action={action}>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Numero de mesa:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="numeroMesa"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Numero de personas:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="numeroPersonas"
              value={numeroPersonas}
              onChange={(e) => setNumeroPersonas(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Descripción:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="sm"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-around">
          <Button variant="success" type="submit" disabled={isPending}>
            {isPending ? <Spinner animation="border" size="sm" /> : <><i className="fas fa-pen" /> Editar</>}
          </Button>
          <Button variant="danger" onClick={cerrarModal} disabled={isPending}>
            <FontAwesomeIcon icon={faX} /> Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditarMesa;

