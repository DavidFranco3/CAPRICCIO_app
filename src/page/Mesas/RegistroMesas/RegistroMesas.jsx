import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { registraMesas } from "../../../api/mesas";
import Swal from 'sweetalert2';

const RegistroMesas = () => {
  const [numeroMesa, setNumeroMesa] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!numeroMesa || !numeroPersonas || !descripcion) {
      Swal.fire({ icon: 'warning', title: "Todos los campos son obligatorios", timer: 1600, showConfirmButton: false });
      return;
    }
    try {
      const response = await registraMesas({
        numeroMesa,
        descripcion,
        numeroPersonas,
        estado: "libre",
      });

      if (response.status === 200) {
        console.log("Registro exitoso");
        Swal.fire({ icon: 'success', title: "Registro exitoso", timer: 1600, showConfirmButton: false });
        setNumeroMesa("");
        setNumeroPersonas("");
        setDescripcion("");
      } else {
        console.error("Error al registrar la mesa");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-2 mb-md-4 mb-lg-7">
          <Col
            sm={12}
            md={4}
            lg={4}
            className="d-flex align-items-end justify-content-start justify-content-md-end justify-content-lg-end"
          >
            <Form.Label>Numero de mesa:</Form.Label>
          </Col>
          <Col sm={12} md={8} lg={8}>
            <Form.Control
              type="text"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-7">
          <Col
            sm={12}
            md={4}
            lg={4}
            className="d-flex align-items-end justify-content-start justify-content-md-end justify-content-lg-end"
          >
            <Form.Label>Numero de personas:</Form.Label>
          </Col>
          <Col sm={12} md={8} lg={8}>
            <Form.Control
              type="text"
              value={numeroPersonas}
              onChange={(e) => setNumeroPersonas(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-7">
          <Col
            sm={12}
            md={4}
            lg={4}
            className="d-flex align-items-end justify-content-start justify-content-md-end justify-content-lg-end"
          >
            <Form.Label>Descripción:</Form.Label>
          </Col>
          <Col sm={12} md={8} lg={8}>
            <Form.Control
              as="textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Button variant="success" type="submit">
            <i className="fa fa-solid fa-check" /> Agregar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegistroMesas;

