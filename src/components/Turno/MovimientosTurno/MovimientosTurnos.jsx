import { useEffect, useState } from "react";
import { Container, Table, Image, Modal, Button, Form } from "react-bootstrap";
import { listarMovimientoTurno } from "../../../api/movimientosTurnoCajas";
import { listarVentasTurno } from "../../../api/ventas";
import Swal from 'sweetalert2';
import printJS from 'print-js';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/es';
import qz from "qz-tray";

function MovimientosTurnos(params) {
  const { caja, turno } = params;
  const [listMovs, setListMovs] = useState([]);
  const [listVentas, setListVentas] = useState([]);
  const [totalVentasEfectivo, setTotalVentasEfectivo] = useState(0);
  const [saldoCaja, setSaldoCaja] = useState(0);

  dayjs.extend(utc); // Configura el idioma español
  dayjs.locale('es');
  dayjs.extend(localizedFormat);

  const [showModal, setShowModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

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

  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const handlePrint = () => {
    if (listMovs.length === 0 && listVentas.length === 0) {
      Swal.fire({ icon: 'warning', title: "No hay información para imprimir", timer: 1600, showConfirmButton: false });
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
          .logotipo img {
            width: 50px !important;
            display: block;
            margin: 0 auto;
          }
          .tabla { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 0;
          }
          .tabla th, .tabla td {
            border: 1px solid #ddd; 
            padding: 2px 5px; /* Reducir el espaciado para ajustarse mejor */
            text-align: left;
            font-size: 8px; /* Reducir el tamaño de fuente para caber mejor */
          }
          .tabla th {
            background-color: #d4eefd;
          }
          p, .cafe__number {
            margin-top: -5px !important;
            font-size: 8px; /* Ajustar el tamaño de fuente para que quepa mejor */
          }
          .ticket__actions, .remove-icon {
            display: none !important;
          }
          .items__price {
            color: #000000 !important;
            font-size: 8px; /* Reducir tamaño de texto para ajustarse mejor */
          }
          .detallesTitulo {
            margin-top: 5px !important;
            font-size: 10px;
          }
        `,
        showModal: true
      });
    }
  };

  async function obtenerImpresoras() {
    try {
      // Asegurar que QZ Tray está inicializado antes de usarlo
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      // Obtener la impresora predeterminada
      const impresora = await qz.printers.getDefault();
      setPrinters(impresora);
      setSelectedPrinter(impresora)
    } catch (error) {
      console.error("Error al obtener la impresora predeterminada:", error);
    }
  }

  useEffect(() => {
    obtenerImpresoras();
  }, []);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const imprimirTicket = async () => {
    if (!selectedPrinter) {
      console.log("Selecciona una impresora");
      return;
    }

    try {
      await qz.websocket.connect();
      const printerConfig = qz.configs.create(selectedPrinter);
      const ticketContent = generarTicket(turno, listMovs, listVentas, totalVentasEfectivo, saldoCaja);

      const contenido = [
        { type: "raw", format: "plain", data: ticketContent },
        { type: "raw", format: "plain", data: "\x1B\x69" }, // Corte
      ];

      await qz.print(printerConfig, contenido);
    } catch (error) {
      console.error("Error al imprimir el ticket:", error);
    } finally {
      if (qz.websocket.isActive()) {
        qz.websocket.disconnect();
      }
    }
  };

  const generarTicket = (turno, listMovs, listVentas, totalVentasEfectivo, saldoCaja) => {
    const anchoTicket = 32;
    const anchoTipo = 16;
    const anchoCantidad = 5;
    const anchoRazon = 9;
  
    const centrarTexto = (texto, ancho = anchoTicket) => {
      const espaciosIzquierda = Math.max(0, Math.floor((ancho - texto.length) / 2));
      return ' '.repeat(espaciosIzquierda) + texto;
    };
  
    let ticket = '';
  
    ticket += centrarTexto("CAPRICCIO") + "\n\n";
    ticket += centrarTexto("Movimientos del Turno No. " + turno.idTurno) + "\n";
    ticket += "#  Tipo Mov.      Cantidad     Razón\n";
    ticket += "----------------------------------------\n";
  
    listMovs.forEach((mov, index) => {
      const numero = (index + 1).toString().padEnd(3);
      let tipoMov = mov.movimiento.length > anchoTipo ? mov.movimiento.slice(0, anchoTipo - 1) + "." : mov.movimiento.padEnd(anchoTipo);
      const cantidad = String(mov.cantidad).padStart(anchoCantidad);
      let razon = mov.razon;
      let razonCorto = razon.length > anchoRazon ? razon.slice(0, anchoRazon - 1) + "." : razon.padEnd(anchoRazon);
  
      ticket += `${numero}${tipoMov}${cantidad}${razonCorto}\n`;
  
      if (razon.length > anchoRazon) {
        let restoRazon = razon.slice(anchoRazon - 1);
        while (restoRazon.length > 0) {
          let parte = restoRazon.slice(0, anchoRazon);
          restoRazon = restoRazon.slice(anchoRazon);
          ticket += `   ${parte}\n`;
        }
      }
    });
  
    ticket += "----------------------------------------\n";
  
    const subtotalTexto = `Total de ventas en efectivo: $${(isNaN(Number(totalVentasEfectivo)) ? "0.00" : Number(totalVentasEfectivo).toFixed(2))}`;
    if (turno.estado === "abierto") {
      ticket += centrarTexto("Saldo de la caja hasta el momento: " + "$" + (isNaN(Number(saldoCaja)) ? "0.00" : Number(saldoCaja).toFixed(2)) + "\n\n");
    } else {
      ticket += centrarTexto("Saldo de la caja al corte: " + "$" + (isNaN(Number(saldoCaja)) ? "0.00" : Number(saldoCaja).toFixed(2)) + "\n\n");
    }
    ticket += centrarTexto(subtotalTexto) + "\n";

    ticket += "\n";
    ticket += "\n\n";
    ticket += "\n\n\n"; // Espacio extra para corte automático
    ticket += "\x1D\x56\x00"; // Código de corte de papel
  
    return ticket;
  };
  
  console.log(generarTicket(turno, listMovs, listVentas, totalVentasEfectivo, saldoCaja));

  return (
    <>
      <Container id="ticketCorteCaja">
        <div class="logotipo">
          <img src={logo} alt="Logo" />
        </div>
        <h4>Movimientos del Turno No. {turno?.idTurno}</h4>
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
        <button className="btn btn-secondary" onClick={() => isMobile ? handlePrint() : imprimirTicket()}>
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

