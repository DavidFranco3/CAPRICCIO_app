import { startTransition, useActionState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { registraMesas } from "../../../api/mesas";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

const RegistroMesas = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [errorState, action, isPending] = useActionState(async (previousState, formData) => {
    const numeroMesa = formData.get("numeroMesa");
    const numeroPersonas = formData.get("numeroPersonas");
    const descripcion = formData.get("descripcion");

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
        if (props.setShow) props.setShow(false);
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

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Ej. 1"
              {...register("numeroMesa", { required: "El número de mesa es obligatorio" })}
              isInvalid={!!errors.numeroMesa}
            />
            <Form.Control.Feedback type="invalid">
              {errors.numeroMesa?.message}
            </Form.Control.Feedback>
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
              placeholder="Ej. 4"
              {...register("numeroPersonas", { required: "El número de personas es obligatorio" })}
              isInvalid={!!errors.numeroPersonas}
            />
            <Form.Control.Feedback type="invalid">
              {errors.numeroPersonas?.message}
            </Form.Control.Feedback>
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
              placeholder="Descripción de la mesa"
              {...register("descripcion", { required: "La descripción es obligatoria" })}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Form.Group as={Row} className="botonSubirProducto mt-3">
          <Col>
            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={isPending}
            >
              {isPending ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faCheck} /> Agregar</>}
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              className="w-100"
              type="button"
              onClick={() => {
                if (props.setShow) props.setShow(false);
              }}
              disabled={isPending}
            >
              <FontAwesomeIcon icon={faX} /> Cancelar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default RegistroMesas;

