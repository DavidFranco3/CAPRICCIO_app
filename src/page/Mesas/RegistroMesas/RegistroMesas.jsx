import React, { useState, useActionState, useRef } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { registraMesas } from "../../../api/mesas";
import Swal from 'sweetalert2';

const RegistroMesas = () => {
  const formRef = useRef(null);

  const [errorState, action, isPending] = useActionState(async (previousState, formData) => {
    const numeroMesa = formData.get("numeroMesa");
    const numeroPersonas = formData.get("numeroPersonas");
    const descripcion = formData.get("descripcion");

    if (!numeroMesa || !numeroPersonas || !descripcion) {
      Swal.fire({ icon: 'warning', title: "Todos los campos son obligatorios", timer: 1600, showConfirmButton: false });
      return { error: "Campos incompletos" };
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
        // Reset form
        if (formRef.current) formRef.current.reset();
        return null;
      } else {
        console.error("Error al registrar la mesa");
        Swal.fire({ icon: 'error', title: "Error al registrar", timer: 1600, showConfirmButton: false });
        return { error: "Error al registrar" };
      }
    } catch (error) {
      console.error("Error de red:", error);
      Swal.fire({ icon: 'error', title: "Error de red", timer: 1600, showConfirmButton: false });
      return { error: "Error de red" };
    }
  }, null);

  return (
    <div>
      <Form action={action} ref={formRef}>
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
              name="numeroMesa"
              placeholder="Ej. 1"
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
              name="numeroPersonas"
              placeholder="Ej. 4"
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
              name="descripcion"
              placeholder="Descripción de la mesa"
            />
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Button variant="success" type="submit" disabled={isPending}>
            {isPending ? <Spinner animation="border" size="sm" /> : <><i className="fa fa-solid fa-check" /> Agregar</>}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegistroMesas;

