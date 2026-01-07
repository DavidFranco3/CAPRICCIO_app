import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { actualizaCaja, listarCajas } from "../../api/cajas";
import {
  obtenerUltimoTurno,
  registrarTurno,
  cerrarTurno,
} from "../../api/turnos"; // Asegúrate de tener esta función en tu archivo de API
import Swal from 'sweetalert2';
import { toInteger } from "lodash";
import obtenerFechaHoraMexico from "../Fecha/FechaHoraMexico"; // Ajusta la ruta según tu estructura de carpetas

function Turno(params) {
  const { turno, setTurno, setShow } = params;
  console.log(params);

  const [formData, setFormData] = useState({});
  const [listCajas, setListCajas] = useState([]);

  useEffect(() => {
    if (turno) {
      setFormData(turno);
    } else {
      setFormData(initialFormData());
    }
  }, [turno]);

  const cargarCajas = async () => {
    const response = await listarCajas();
    const { data } = response;
    setListCajas(data);
  };

  const obtenerNumeroTurno = async () => {
    const response = await obtenerUltimoTurno();
    const { data } = response;

    let num = toInteger(data.idTurno);
    setFormData((prevFormData) => ({
      ...prevFormData,
      idTurno: num + 1,
    }));
  };

  useEffect(() => {
    cargarCajas();
    if (!turno) {
      obtenerNumeroTurno();
    }
  }, [turno]);

  const añadirDineroACaja = async (nombreCaja, saldo, listCajas) => {
    // Buscar la caja en listCajas por nombre
    let idCaja = "";
    const cajaEncontrada = listCajas.find(
      (caja) => caja.nombreCaja === nombreCaja
    );

    // Verificar si se encontró la caja
    if (cajaEncontrada) {
      idCaja = cajaEncontrada._id;

      // Actualizar el saldo de la caja
      try {
        const response = await actualizaCaja(idCaja, { saldo });
        const { data } = response;
        console.log(data);
        Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      } catch (error) {
        console.error("Error al actualizar la caja:", error);
        Swal.fire({ icon: 'error', title: "No se pudo actualizar la caja.", timer: 1600, showConfirmButton: false });
      }
    } else {
      console.error("Caja no encontrada");
      Swal.fire({ icon: 'error', title: "Caja no encontrada.", timer: 1600, showConfirmButton: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataTemp = {
      idTurno: formData.idTurno,
      empleado: formData.empleado,
      caja: formData.caja,
      fechaInicio: obtenerFechaHoraMexico(), // Usar la función para obtener la fecha y hora de México
      fechaFinal: null,
      observaciones: formData.observaciones,
      fondoCaja: formData.fondoCaja,
      totalEfectivo: formData.totalEfectivo,
      estado: "abierto",
    };

    try {
      const response = await registrarTurno(dataTemp);
      const { data } = response;
      setTurno(dataTemp);
      await añadirDineroACaja(dataTemp.caja, dataTemp.fondoCaja, listCajas);
      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      setShow(false);
    } catch (error) {
      console.error(error);
      // Manejar errores aquí, por ejemplo, mostrar una notificación de error.
    }
  };

  return (
    <>
      <Container>
        <Form>
          <Form.Group>
            <Form.Label>No. Turno: {formData.idTurno}</Form.Label>
          </Form.Group>
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Empleado:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del empleado"
              name="empleado"
              value={formData.empleado}
              onChange={handleChange}
              disabled={turno}
            />
          </Form.Group>
          <Form.Group className="mt-2 d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Caja:</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="caja"
              value={formData.caja}
              onChange={handleChange}
              disabled={turno}
            >
              <option value="">Seleccione una caja</option>
              {listCajas.map((caja) => (
                <option key={caja.id} value={caja.nombreCaja}>
                  {caja.nombreCaja}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2 d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Fondo de caja:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Inserte el fondo de caja"
              name="fondoCaja"
              value={formData.fondoCaja}
              onChange={handleChange}
              disabled={turno}
            />
          </Form.Group>
          <Form.Group className="mt-2 d-flex align-items-center">
            <Form.Label className="mb-0 me-2">Observaciones:</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Inserte observaciones del turno"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              disabled={turno}
            />
          </Form.Group>
          <Container className="mt-3 d-flex justify-content-center">
            {!turno && (
              <button
                className="btn btn-primary"
                onClick={handleSubmit} // Cambiado aquí
              >
                Añadir turno
              </button>
            )}
          </Container>
        </Form>
      </Container>
    </>
  );
}

export default Turno;

function initialFormData() {
  return {
    idTurno: 0,
    empleado: "",
    caja: "",
    fechaInicio: "",
    fechaFinal: "",
    observaciones: "",
    fondoCaja: 0,
    totalEfectivo: 0,
    estado: "abierto",
  };
}

