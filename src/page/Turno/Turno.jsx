import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { actualizaCaja, listarCajas } from "../../api/cajas";
import ListTurnos from "../../components/Turno/ListTurnos";
import obtenerFechaHoraMexico from "../../components/Fecha/FechaHoraMexico";
import { cerrarTurno } from "../../api/turnos";
import { toast } from "react-toastify";
import BasicModal from "../../components/Modal/BasicModal";
import EntradaSalidaEfec from "./MovsEfectivo/EntradaSalidaEfec";
import MovimientosTurnos from "../../components/Turno/MovimientosTurno/MovimientosTurnos";

dayjs.extend(utc);
dayjs.extend(timezone);

function VistaTurnos(props) {
  console.log(props);
  const { turno, setTurno } = props;
  const [listCajas, setListCajas] = useState([]);
  const [caja, setCaja] = useState(null);
  console.log(turno);

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState("");

  const cargarCajas = async () => {
    const response = await listarCajas();
    const { data } = response;
    setListCajas(data);
  };

  console.log(listCajas);

  useEffect(() => {
    cargarCajas();
  }, []);

  useEffect(() => {
    if (turno && listCajas.length > 0) {
      obtenerCaja(turno.caja);
    }
  }, [turno, listCajas]);

  const obtenerCaja = (nombreCaja) => {
    const cajaEncontrada = listCajas.find(
      (caja) => caja.nombreCaja === nombreCaja
    );

    console.log(cajaEncontrada);
    // Verificar si se encontró la caja
    if (cajaEncontrada) {
      setCaja(cajaEncontrada);
    }
  };

  // Variables para las fechas formateadas
  let formattedFechaInicio = "";
  let formattedFechaFinal = "";

  // Convertir y formatear las fechas
  if (turno) {
    formattedFechaInicio = dayjs(turno.fechaInicio)
      .add(6, "hour")
      .tz("America/Mexico_City")
      .format("DD/MM/YYYY h:mm A");
    formattedFechaFinal = turno.fechaFinal
      ? dayjs(turno.fechaFinal)
          .tz("America/Mexico_City")
          .format("DD/MM/YYYY h:mm A")
      : "Turno activo";
  }

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
        toast.success(data.mensaje);
      } catch (error) {
        console.error("Error al actualizar la caja:", error);
        toast.error("No se pudo actualizar la caja.");
      }
    } else {
      console.error("Caja no encontrada");
      toast.error("Caja no encontrada.");
    }
  };

  const terminarTurno = async () => {
    const dataTemp = {
      idTurno: turno.idTurno,
      empleado: turno.empleado,
      caja: turno.caja,
      fechaInicio: turno.fechaInicio, // Usar la función para obtener la fecha y hora de México
      fechaFinal: obtenerFechaHoraMexico(),
      observaciones: turno.observaciones,
      fondoCaja: turno.fondoCaja,
      totalEfectivo: caja.saldo,
      estado: "cerrado",
    };

    try {
      const response = await cerrarTurno(turno._id, dataTemp);
      const { data } = response;
      await añadirDineroACaja(dataTemp.caja, 0, listCajas);
      toast.success(data.mensaje);
      setTurno(null);
    } catch (error) {
      console.error(error);
      // Manejar errores aquí, por ejemplo, mostrar una notificación de error.
    }
  };

  const entradaSalidaEfectivo = async (entrada, content) => {
    let titulo = entrada ? "Ingresar efectivo" : "Retirar efectivo";
    setShowModal(true);
    setContentModal(content);
    setTitulosModal(titulo);
  };

  const movimientosTurnoActual = (content) => {
    setShowModal(true);
    setContentModal(content);
    setTitulosModal("Movimientos turno actual");
  };

  return (
    <>
      <div className="card card-outline m-3">
        <div className="card-header bg-gray">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 d-flex align-items-center">Turnos</h4>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <h5>Turno Activo</h5>
            {turno ? (
              <table className="table table-striped-columns">
                <thead>
                  <tr>
                    <th>Id Turno</th>
                    <th>Empleado</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Corte</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{turno.idTurno}</td>
                    <td>{turno.empleado}</td>
                    <td>{formattedFechaInicio}</td>
                    <td>{formattedFechaFinal}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>No hay turno activo</div>
            )}
          </li>
          {caja && (
            <li className="list-group-item">
              <h5>Caja del turno</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Caja</th>
                    <th>Saldo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{caja.nombreCaja}</td>
                    <td>{caja.saldo}</td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            movimientosTurnoActual(
                              <MovimientosTurnos caja={caja} turno={turno} />
                            );
                          }}
                        >
                          Corte caja
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            entradaSalidaEfectivo(
                              false,
                              <EntradaSalidaEfec
                                entrada={false}
                                caja={caja}
                                turno={turno}
                                listCajas={listCajas}
                                añadirDineroACaja={añadirDineroACaja}
                              />
                            )
                          }
                        >
                          Salida Efectivo
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            entradaSalidaEfectivo(
                              true,
                              <EntradaSalidaEfec
                                entrada={true}
                                caja={caja}
                                turno={turno}
                                listCajas={listCajas}
                                añadirDineroACaja={añadirDineroACaja}
                              />
                            )
                          }
                        >
                          Entrada Efectivo
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={terminarTurno}
                        >
                          Corte final
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          )}
          <li className="list-group-item">
            <h5>Listado de turnos anteriores</h5>
            <ListTurnos turno={turno} />
          </li>
        </ul>
      </div>
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"md"}
      >
        {contentModal}
      </BasicModal>
    </>
  );
}

export default VistaTurnos;
