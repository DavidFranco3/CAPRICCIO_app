import { useState, useActionState } from "react";
import { Container, Form, Spinner, Row, Col, Button } from "react-bootstrap";
import obtenerFechaHoraMexico from "../../../components/Fecha/FechaHoraMexico";
import { registrarMovimientoTurnoCaja } from "../../../api/movimientosTurnoCajas";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faX } from "@fortawesome/free-solid-svg-icons";

function EntradaSalidaEfec(params) {
  const { entrada, caja, turno, añadirDineroACaja, listCajas } = params;

  const [errorState, action, isPending] = useActionState(async (previousState, formData) => {
    const cantidad = parseFloat(formData.get("cantidad"));
    const razon = formData.get("razon");

    if (!cantidad) return { error: "Cantidad requerida" };

    try {
      // Logica de saldo
      let saldo = caja.saldo;
      if (entrada) {
        saldo += cantidad;
      } else {
        saldo -= cantidad;
      }

      // Actualizar caja (Funcion prop)
      await añadirDineroACaja(caja.nombreCaja, saldo, listCajas);

      // Registrar movimiento
      const dataTemp = {
        idTurno: turno.idTurno,
        nombreCaja: caja.nombreCaja,
        movimiento: entrada ? "Ingreso efectivo" : "Retiro efectivo",
        cantidad: cantidad,
        fecha: obtenerFechaHoraMexico(),
        razon: razon,
      };

      const response = await registrarMovimientoTurnoCaja(dataTemp);
      const { data } = response;
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      return null;
    } catch (error) {
      console.error(error);
      return { error: "Error" };
    }
  }, null);

  return (
    <>
      <Container>
        <Form action={action}>
          <Form.Label>Cantidad a {entrada ? "ingresar" : "retirar"}</Form.Label>
          <Form.Control
            type="number"
            name="cantidad"
            placeholder="Ingrese la cantidad"
            step="0.01"
          />
          <Form.Label>Razón:</Form.Label>
          <Form.Control
            type="text"
            name="razon"
            placeholder="Razón del movimiento"
          />
          <Form.Group as={Row} className="botonSubirProducto mt-3">
            <Col>
              <Button
                title={entrada ? "Ingresar efectivo" : "Retirar efectivo"}
                type="submit"
                variant="success"
                className="registrar w-100"
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faSave} /> {isPending ? <Spinner animation="border" size="sm" /> : "Confirmar"}
              </Button>
            </Col>
            <Col>
              <Button
                title="Cerrar ventana"
                variant="danger"
                className="cancelar w-100"
                disabled={isPending}
                onClick={() => {
                  if (params.setShowModal) params.setShowModal(false);
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

export default EntradaSalidaEfec;

