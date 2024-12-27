import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { listarMovimientoTurno } from "../../../api/movimientosTurnoCajas";
import { listarVentasTurno } from "../../../api/ventas";
import { toast } from "react-toastify";
import printJS from 'print-js';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

function MovimientosTurnos(params) {
  const { caja, turno } = params;
  const [listMovs, setListMovs] = useState([]);
  const [listVentas, setListVentas] = useState([]);
  const [totalVentasEfectivo, setTotalVentasEfectivo] = useState(0);
  const [saldoCaja, setSaldoCaja] = useState(0);

  const cargarListMovs = async () => {
    const response = await listarMovimientoTurno(turno.idTurno);
    const { data } = response;
    setListMovs(data);
  };

  const cargarListVentas = async () => {
    const response = await listarVentasTurno(turno.idTurno);
    const { data } = response;
    setListVentas(data);
    calcularTotalVentasEfectivo(data);
  };

  const calcularTotalVentasEfectivo = (ventas) => {
    if (!Array.isArray(ventas)) {
      setTotalVentasEfectivo(0);
      return;
    }
    const total = ventas
      .filter((venta) => venta.tipoPago === "Efectivo")
      .reduce((acc, venta) => acc + (venta.total || 0), 0);
    setTotalVentasEfectivo(total);
  };

  const cargarSaldoCaja = () => {
    if (turno.totalEfectivo === 0) setSaldoCaja(caja?.saldo);
    else setSaldoCaja(turno.totalEfectivo);
  };

  useEffect(() => {
    cargarListMovs();
    cargarListVentas();
    cargarSaldoCaja();
  }, []);

  // Para el modal
  const [showMod, setShowMod] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const handlePrint = () => {
    if (listMovs.length === 0 && listVentas.length === 0) {
      toast.warning("No hay información para imprimir");
    } else {
      printJS({
        printable: "ticketCorteCaja", // Usamos el ID del contenedor de la tabla
        type: "html",
        style: `
          @page {
            size: 58mm 100mm; /* Dimensiones del ticket */
            margin: 0; /* Eliminar márgenes */
          }
          body {
            margin: 0; /* Eliminar márgenes del cuerpo */
            padding: 0;
            width: 58mm;
          }
          .tabla { width: 100%; border-collapse: collapse; margin: 0; }
          .tabla th { border: 1px solid #ddd; padding: 4px; background-color: #d4eefd; text-align: left; font-size: 12px; }
          .tabla td { border: 1px solid #ddd; text-align: left; padding: 6px; font-size: 10px; }
          p { margin-top: -10px !important; font-size: 10px; }
          .cafe__number { margin-top: -10px !important; font-size: 10px; }
          .logotipo { width: 50px !important; margin: 0 auto; }
          img { width: 50px !important; margin: 0 auto; }
          .logotipoRappi { width: 50px !important; margin: 0 auto; }
          .detallesTitulo { margin-top: 10px !important; font-size: 12px; }
          .ticket__actions { display: none !important; }
          .remove-icon { display: none !important; }
          .items__price { color: #000000 !important; font-size: 10px; }
        `,
        showModal: true
      });
    }
  };
  

  return (
    <>
      <Container id="ticketCorteCaja">
        <h4>Movimientos del Turno No. {turno.idTurno}</h4>
        {listMovs.length > 0 || listVentas.length > 0 ? (
          <>
            {listMovs.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tipo Movimiento</th>
                    <th>Cantidad</th>
                    <th>Razón</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {listMovs.map((mov, index) => (
                    <tr key={index}>
                      <td>{mov.movimiento}</td>
                      <td>{mov.cantidad}</td>
                      <td>{mov.razon}</td>
                      <td>{new Date(mov.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="mt-2 mb-2">No hay movimientos en las cajas</div>
            )}
            <div>
              Total de ventas en efectivo: ${totalVentasEfectivo.toFixed(2)}{" "}
              <br />
              {turno.estado === "abierto" ? (
                <>Saldo de la caja hasta el momento: ${saldoCaja}</>
              ) : (
                <>Saldo de la caja al corte: ${saldoCaja}</>
              )}
            </div>
          </>
        ) : (
          <span>No hay movimientos</span>
        )}
      </Container>
      <div className=" mt-2 d-flex justify-content-center">
        <button className="btn btn-secondary" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Imp
        </button>
      </div>

      <BasicModal
        show={showMod}
        setShow={setShowMod}
        title={titulosModal}
        size={"sm"}
      >
        {modalContent}
      </BasicModal>
    </>
  );
}

export default MovimientosTurnos;
