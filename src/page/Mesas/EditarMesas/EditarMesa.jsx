import { useEffect, useState, useActionState, startTransition } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { editarMesa, obtenerMesa } from "../../../api/mesas";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

const EditarMesa = (props) => {
  const { mesaId, setShow } = props;
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const cargarDatosMesa = async (idMesa) => {
    try {
      const response = await obtenerMesa(idMesa);
      const { data } = response;
      setValue("numeroMesa", data.numeroMesa);
      setValue("numeroPersonas", data.numeroPersonas);
      setValue("descripcion", data.descripcion || "");
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

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Numero de mesa:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              type="text"
              {...register("numeroMesa", { required: "El número de mesa es obligatorio" })}
              isInvalid={!!errors.numeroMesa}
            />
            <Form.Control.Feedback type="invalid">
              {errors.numeroMesa?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Numero de personas:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              type="text"
              {...register("numeroPersonas", { required: "El número de personas es obligatorio" })}
              isInvalid={!!errors.numeroPersonas}
            />
            <Form.Control.Feedback type="invalid">
              {errors.numeroPersonas?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="mb-2 mb-md-4 mb-lg-3">
          <Col sm={4} className="d-flex align-items-center">
            <Form.Label>Descripción:</Form.Label>
          </Col>
          <Col sm={8}>
            <Form.Control
              as="textarea"
              className="sm"
              {...register("descripcion", { required: "La descripción es obligatoria" })}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="botonSubirProducto mt-3">
          <Col>
            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={isPending}
            >
              {isPending ? <Spinner animation="border" size="sm" /> : <><i className="fas fa-pen" /> Editar</>}
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={cerrarModal}
              className="w-100"
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faX} /> Cancelar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default EditarMesa;

