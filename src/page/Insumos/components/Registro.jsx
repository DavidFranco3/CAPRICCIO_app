import { startTransition, useState, useActionState } from "react";
import { faUpload, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Container, Form, Row, Spinner, Button } from "react-bootstrap";
import { registraInsumo } from "../../../api/insumos";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";

function RegistroInsumo(props) {
  const { setShow } = props;
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  // Watch selected units for conditional logic
  const umCompra = watch("umCompra");

  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombre = fd.get("nombre");
    const precioCompra = parseFloat(fd.get("precioCompra"));
    const categoria = fd.get("categoria");
    const umCompraVal = fd.get("umCompra");
    const umTrabajoVal = fd.get("umTrabajo");
    const stock = parseFloat(fd.get("stock"));

    // Validation is now handled by react-hook-form on client side, 
    // but good to keep a check or rely on RHF preventing submit.

    const calcularPrecioUnitario = (precioC, umC, umT) => {
      if (umC === umT) return precioC;
      if (umC === "Kilogramos" && umT === "Gramos") return precioC / 1000;
      if (umC === "Litros" && umT === "Mililitros") return precioC / 1000;
      if (umC === "Gramos" && umT === "Kilogramos") return precioC * 1000;
      if (umC === "Mililitros" && umT === "Litros") return precioC * 1000;
      return precioC;
    };

    const precioUnitario = calcularPrecioUnitario(precioCompra, umCompraVal, umTrabajoVal);

    try {
      const dataTemp = {
        nombre,
        precioCompra,
        precioUnitario,
        categoria,
        umCompra: umCompraVal,
        umTrabajo: umTrabajoVal || (umCompraVal === "Pieza" ? "Pieza" : ""),
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

  const onSubmit = (data) => {
    // Create FormData to pass to the action
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    // Trigger the action manually wrapped in transition
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el nombre"
                {...register("nombre", { required: "El nombre es obligatorio" })}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Precio de compra (Unitario)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio de compra"
                step="0.01"
                {...register("precioCompra", { required: "El precio es obligatorio", min: 0 })}
                isInvalid={!!errors.precioCompra}
              />
              <Form.Control.Feedback type="invalid">
                {errors.precioCompra?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                {...register("categoria", { required: "Selecciona una categoría" })}
                isInvalid={!!errors.categoria}
              >
                <option value="">Elige una opción</option>
                <option value="Materia prima">Materia prima</option>
                <option value="Insumo">Insumo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.categoria?.message}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Unidad de medida de compra</Form.Label>
              <Form.Select
                {...register("umCompra", { required: "Selecciona una unidad de compra" })}
                isInvalid={!!errors.umCompra}
              >
                <option value="">Elige una opción</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
                <option value="Litros">Litros</option>
                <option value="Mililitros">Mililitros</option>
                <option value={"Pieza"}>Pieza</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.umCompra?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Unidad de medida de trabajo</Form.Label>
              <Form.Select
                {...register("umTrabajo", { required: "Selecciona una unidad de trabajo" })}
                isInvalid={!!errors.umTrabajo}
              >
                {umCompra === "Pieza" ? (
                  <>
                    <option value="Pieza">Pieza</option>
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
              <Form.Control.Feedback type="invalid">
                {errors.umTrabajo?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Stock inicial</Form.Label>
              <Form.Control
                type="number"
                placeholder="Stock inicial"
                step="0.001"
                {...register("stock", { required: "El stock es obligatorio", min: 0 })}
                isInvalid={!!errors.stock}
              />
              <Form.Control.Feedback type="invalid">
                {errors.stock?.message}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <br />
          <Form.Group as={Row} className="botonSubirProducto">
            <Col xs={6}>
              <Button
                title="Registrar insumo"
                type="submit"
                variant="success"
                className="registrar w-100"
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faUpload} /> {!isPending ? "Registrar" : <Spinner animation="border" size="sm" />}
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                title="Cerrar ventana"
                variant="danger"
                className="cancelar w-100"
                disabled={isPending}
                type="button"
                onClick={() => {
                  setShow(false)
                }}
              >
                <FontAwesomeIcon icon={faX} /> Cancelar
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}

export default RegistroInsumo;

