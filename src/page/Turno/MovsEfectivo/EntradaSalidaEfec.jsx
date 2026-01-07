import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import obtenerFechaHoraMexico from "../../../components/Fecha/FechaHoraMexico";
import { registrarMovimientoTurnoCaja } from "../../../api/movimientosTurnoCajas";
import Swal from 'sweetalert2';

function EntradaSalidaEfec(params) {
  const { entrada, caja, turno, añadirDineroACaja, listCajas } = params;
  console.log(params);

  const [cantidad, setCantidad] = useState(null);
  const [razon, setRazon] = useState("");

  const handleCantidadChange = (e) => {
    setCantidad(parseFloat(e.target.value) || null);
  };

  const handleRazonChange = (e) => {
    setRazon(e.target.value);
  };

  const registrarMovimiento = async () => {
    try {
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
    } catch (error) {}
  };

  const ingresarRetirar = () => {
    let saldo = caja.saldo;
    if (entrada) {
      saldo += cantidad;
    } else {
      saldo -= cantidad;
    }

    // Llamar a la función para añadir dinero a la caja con el nuevo saldo
    añadirDineroACaja(caja.nombreCaja, saldo, listCajas);
    registrarMovimiento();
  };

  return (
    <>
      <Container>
        <Form.Label>Cantidad a {entrada ? "ingresar" : "retirar"}</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese la cantidad"
          value={cantidad}
          onChange={handleCantidadChange}
        />
        <Form.Label>Razón:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Razón del movimiento"
          value={razon}
          onChange={handleRazonChange}
        />
        <div className="mt-2 d-flex justify-content-center">
          <button className="btn btn-success" onClick={ingresarRetirar}>
            Confirmar
          </button>
        </div>
      </Container>
    </>
  );
}

export default EntradaSalidaEfec;

