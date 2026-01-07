import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { editarMesa, obtenerMesa, registraMesas } from "../../../api/mesas";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const EditarMesa = (props) => {
  const { mesaId, setShow } = props;

  const [numeroMesa, setNumeroMesa] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const cargarDatosMesa = async (idMesa) => {
    const response = await obtenerMesa(idMesa);
    const { data } = response;
    setNumeroMesa(data.numeroMesa);
    setNumeroPersonas(data.numeroPersonas);
    setDescripcion(data.descripcion || "");
  };

  useEffect(() => {
    cargarDatosMesa(mesaId);
  }, [mesaId]);

  const cerrarModal = () => {
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!numeroMesa || !numeroPersonas || !descripcion) {
      Swal.fire({ icon: 'warning', title: "Todos los campos son obligatorios", timer: 1600, showConfirmButton: false });
      return;
    }
    try {
      const response = await editarMesa(mesaId, {
        numeroMesa,
        descripcion,
        numeroPersonas,
      });

      if (response.status === 200) {
        console.log("Actualización exitosa");
        Swal.fire({ icon: 'success', title: "Actualización exitosa", timer: 1600, showConfirmButton: false });
        setNumeroMesa("");
        setNumeroPersonas("");
        setDescripcion("");
        setShow(false);
      } else {
        console.error("Error al actualizar la mesa");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Numero de mesa:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              type="text"
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="sm"
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-around">
          <Button variant="success" type="submit">
            <i className="fas fa-pen" /> Editar
          </Button>
          <Button variant="danger" onClick={cerrarModal}>
            <FontAwesomeIcon icon={faX} /> Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditarMesa;

