import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { editarMesa, obtenerMesa, registraMesas } from "../../../api/mesas";
import { toast } from "react-toastify";
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
  }

  useEffect(() => {
    cargarDatosMesa(mesaId);
  })

  const cerrarModal = () => {
    setShow(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!numeroMesa || !numeroPersonas || !descripcion) {
      toast.warning("Todos los campos son obligatorios");
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
        toast.success("Actualización exitosa");
        setNumeroMesa("");
        setNumeroPersonas("");
        setDescripcion("");
      } else {
        console.error("Error al actualizar la mesa");

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
              defaultValue={numeroMesa}
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
              defaultValue={numeroPersonas}
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
              defaultValue={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-around">
          <Button variant="success" type="submit">
            <i className="fas fa-pen" /> Editar
          </Button>
          <Button variant="danger" onClick={() => cerrarModal()}>
            <FontAwesomeIcon icon={faX} /> Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditarMesa;
