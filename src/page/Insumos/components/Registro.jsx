import React, { useState } from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Form, Row } from "react-bootstrap";
import { registraInsumo } from "../../../api/insumos";
import { toast } from "react-toastify";

function RegistroInsumo() {
  const [formData, setFormData] = useState({
    nombre: "",
    precioCompra: "",
    categoria: "",
    umCompra: "",
    umTrabajo: "",
    stock: "",
    estado: "true",
  });

  const [formValid, setFormValid] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (formValid) {
      try {
        const dataTemp = formData;
        const response = await registraInsumo(dataTemp);
        const { data } = response;
        toast.success(data.mensaje);
      } catch (error) {
        console.log(error);
      }

      // Aquí puedes manejar el envío del formulario
      console.log("Formulario enviado:", formData);
    } else {
      console.log("Formulario incompleto");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
    setFormValid(
      updatedFormData.nombre &&
        updatedFormData.precioCompra &&
        updatedFormData.categoria &&
        updatedFormData.umCompra &&
        updatedFormData.umTrabajo &&
        updatedFormData.stock
    );
  };

  return (
    <>
      <Container>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Col>
            <Col>
              <Form.Label>Precio de compra</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio de compra"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleInputChange}
              />
            </Col>
            <Col>
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                <option value="">Elige una opción</option>
                <option value="Materia prima">Materia prima</option>
                <option value="Insumo">Insumo</option>
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Unidad de medida de compra</Form.Label>
              <Form.Select
                name="umCompra"
                value={formData.umCompra}
                onChange={handleInputChange}
              >
                <option value="">Elige una opción</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
                <option value="Litros">Litros</option>
                <option value="Mililitros">Mililitros</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Unidad de medida de trabajo</Form.Label>
              <Form.Select
                name="umTrabajo"
                value={formData.umTrabajo}
                onChange={handleInputChange}
              >
                <option value="">Elige una opción</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
                <option value="Litros">Litros</option>
                <option value="Mililitros">Mililitros</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn btn-success"
              type="submit"
              disabled={!formValid}
            >
              <FontAwesomeIcon icon={faUpload} /> Registrar
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default RegistroInsumo;
