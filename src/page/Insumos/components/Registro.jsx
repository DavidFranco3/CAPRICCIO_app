import React, { useState, useActionState } from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { registraInsumo } from "../../../api/insumos";
import Swal from 'sweetalert2';
import { data } from "autoprefixer";

function RegistroInsumo(props) {
  const { setShow } = props;

  const [formData, setFormData] = useState({
    nombre: "",
    precioCompra: "",
    precioUnitario: 0,
    categoria: "",
    umCompra: "",
    umTrabajo: "",
    stock: "",
    estado: "true",
  });

  const calcularPrecioUnitario = (precioCompra, umCompra, umTrabajo) => {
    if (umCompra === umTrabajo) return precioCompra;
    if (umCompra === "Kilogramos" && umTrabajo === "Gramos")
      return precioCompra / 1000;
    if (umCompra === "Litros" && umTrabajo === "Mililitros")
      return precioCompra / 1000;
    if (umCompra === "Gramos" && umTrabajo === "Kilogramos")
      return precioCompra * 1000;
    if (umCompra === "Mililitros" && umTrabajo === "Litros")
      return precioCompra * 1000;
    return precioCompra; // Default case
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombre = fd.get("nombre");
    const precioCompra = parseFloat(fd.get("precioCompra"));
    const categoria = fd.get("categoria");
    const umCompra = fd.get("umCompra");
    const umTrabajo = fd.get("umTrabajo");
    const stock = parseFloat(fd.get("stock"));

    if (!nombre || !precioCompra || !categoria || !umCompra || !stock) {
      Swal.fire({ icon: 'warning', title: "Formulario incompleto", timer: 1600, showConfirmButton: false });
      return { error: "Incompleto" };
    }

    const precioUnitario = calcularPrecioUnitario(precioCompra, umCompra, umTrabajo);

    try {
      const dataTemp = {
        nombre,
        precioCompra,
        precioUnitario,
        categoria,
        umCompra,
        umTrabajo: umTrabajo || (umCompra === "Pieza" ? "Pieza" : ""), // Fallback if simple select
        stock,
        estado: "true",
      };
      const response = await registraInsumo(dataTemp);
      const { data } = response;
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      setShow(false);
      return null;
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: 'error', title: "Error al registrar el insumo", timer: 1600, showConfirmButton: false });
      return { error: "Error de registro" };
    }
  }, null);

  return (
    <>
      <Container>
        <Form action={action}>
          <Row>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre"
                name="nombre"
                defaultValue={formData.nombre}
                required
              />
            </Col>
            <Col>
              <Form.Label>Precio de compra (Unitario)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio de compra"
                name="precioCompra"
                defaultValue={formData.precioCompra}
                required
                step="0.01"
              />
            </Col>
            <Col>
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria"
                defaultValue={formData.categoria}
                required
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
                required
              >
                <option value="">Elige una opción</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
                <option value="Litros">Litros</option>
                <option value="Mililitros">Mililitros</option>
                <option value={"Pieza"}>Pieza</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Unidad de medida de trabajo</Form.Label>
              <Form.Select
                name="umTrabajo"
                defaultValue={formData.umTrabajo}
                required
              >
                {formData.umCompra === "Pieza" ? (
                  <>
                    <option value="Mililitros">Pieza</option>
                  </>
                ) : (
                  <>
                    <option value="">Elige una opción</option>
                    <option value="Gramos">Gramos</option>
                    <option value="Kilogramos">Kilogramos</option>
                    <option value="Litros">Litros</option>
                    <option value="Mililitros">Mililitros</option>
                  </>
                )}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cantidad"
                name="stock"
                defaultValue={formData.stock}
                required
              />
            </Col>
          </Row>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn btn-success"
              type="submit"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faUpload} /> {!isPending ? "Registrar" : <Spinner animation="border" size="sm" />}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default RegistroInsumo;

