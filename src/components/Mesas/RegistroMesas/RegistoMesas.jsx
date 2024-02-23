import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const RegistoMesas = () => {
  return (
    <div>
      <Form>
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
            <Form.Control type="text" />
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
            <Form.Control type="text" />
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
            <Form.Control as="textarea" />
          </Col>
        </Row>
      </Form>
      <div style={{textAlign:"center"}}>
        <Button variant="success">
          <i class="fa fa-solid fa-check" /> Agregar
        </Button>
      </div>
    </div>
  );
};

export default RegistoMesas;
