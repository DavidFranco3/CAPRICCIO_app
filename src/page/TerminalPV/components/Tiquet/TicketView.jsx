import { useEffect, useState } from "react";
import printJS from "print-js";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/es';
import qz from "qz-tray";
import { Image, Modal, Button, Form } from "react-bootstrap";

const TicketView = ({ ticket }) => {
  console.log(ticket)

  dayjs.extend(utc); // Configura el idioma español
  dayjs.locale('es');
  dayjs.extend(localizedFormat);


  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const handlePrint = () => {
    if (ticket.productos.length === 0) {
      console.log("Agregue productos");
    } else {
      // Configuración para `print-js` con tamaño de ticket 58mm x 100mm
      printJS({
        printable: "ticket-view",
        type: "html",
        targetStyles: ["*"], // Incluye todos los estilos
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
          .ticket-view {
            font-size: 10px;
            font-family: Arial, sans-serif;
            width: 58mm; /* Ancho fijo para ticket */
            margin: 0 auto; /* Centrado */
          }
          .ticket-view h2 {
            font-size: 12px;
            text-align: center;
            margin-bottom: 2px;
          }
          .ticket-view p {
            margin: 0;
            font-size: 10px;
            line-height: 1.2;
          }
          .ticket-view ul {
            padding: 0;
            margin: 0;
            list-style: none;
          }
          .ticket-view li {
            font-size: 10px;
            margin-bottom: 2px;
          }
          .logotipo {
            width: 50px !important;
            margin: 0 auto;
          }
          .btn {
            display: none; /* Oculta el botón al imprimir */
          }
        `,
      });
    }
  };

  const [showModal, setShowModal] = useState();
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

  const obtenerImpresoras = async () => {
    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      const impresoras = await qz.printers.find();
      console.log("Lista de impresoras:", impresoras);
      setPrinters(impresoras);
    } catch (error) {
      console.error("Error al obtener impresoras:", error);
    }
  };

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
      const ticketContent = generarTicket(ticket);

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

  const generarTicket = (formData) => {
    const anchoTicket = 40; // Ancho fijo del ticket
    const anchoProducto = 12; // Ancho máximo del nombre del producto
    const anchoCantidad = 8;
    const anchoPrecio = 16;

    // Función para centrar texto
    const centrarTexto = (texto, ancho = anchoTicket) => {
      const espaciosIzquierda = Math.max(0, Math.floor((ancho - texto.length) / 2));
      return ' '.repeat(espaciosIzquierda) + texto;
    };

    // Crear la cadena de texto para el ticket
    let ticket = '';

    // Encabezado de la empresa
    ticket += centrarTexto("CAPRICCIO") + "\n\n";

    // Detalles de la venta
    ticket += centrarTexto("Cliente: " + formData.cliente) + "\n";
    ticket += centrarTexto("Ticket: " + formData.numeroTiquet) + "\n";
    ticket += centrarTexto("Mesa: " + formData.mesa) + "\n";
    ticket += centrarTexto("Pedido: " + formData.hacerPedido) + "\n";
    ticket += centrarTexto("Para: " + formData.tipoPedido) + "\n";
    ticket += centrarTexto("Fecha: " + dayjs.utc(formData.fecha).format("dddd, LL hh:mm A")) + "\n\n";

    // Encabezado de productos
    ticket += "#  Producto        Cantidad     Precio\n";
    ticket += "----------------------------------------\n";

    // Imprimir productos con control de ancho
    formData.productos.forEach((producto, index) => {
      const numero = (index + 1).toString().padEnd(3);

      // Si el nombre es muy largo, dividirlo en varias líneas
      let nombre = producto?.nombre;
      let nombreCorto = nombre.length > anchoProducto ? nombre.slice(0, anchoProducto - 1) + "." : nombre.padEnd(anchoProducto);

      const cantidad = String(producto.cantidad || 1).padStart(anchoCantidad);
      const precio = ('$' + producto.precio.toFixed(2)).padStart(anchoPrecio);

      ticket += `${numero}${nombreCorto}${cantidad}${precio}\n`;

      // Si el nombre es largo, imprimir las siguientes líneas
      if (nombre.length > anchoProducto) {
        let restoNombre = nombre.slice(anchoProducto - 1);
        while (restoNombre.length > 0) {
          let parte = restoNombre.slice(0, anchoProducto);
          restoNombre = restoNombre.slice(anchoProducto);
          ticket += `   ${parte}\n`; // Indentar para alinear con productos
        }
      }
    });

    // Línea de separación
    ticket += "----------------------------------------\n";

    // Detalles adicionales
    ticket += centrarTexto("Detalles: " + formData.detalles) + "\n\n";

    // Total centrado
    const subtotalTexto = `Subtotal: $${(isNaN(Number(formData.subtotal)) ? "0.00" : Number(formData.subtotal).toFixed(2))}`;
    const descuentoTexto = `Descuento: $${(isNaN(Number(formData.descuento)) ? "0.00" : Number(formData.descuento).toFixed(2))}`;
    const ivaTexto = `IVA: $${(isNaN(Number(formData.iva)) ? "0.00" : Number(formData.iva).toFixed(2))}`;
    const totalTexto = `Total: $${(isNaN(Number(formData.total)) ? "0.00" : Number(formData.total).toFixed(2))}`;
    ticket += centrarTexto(subtotalTexto) + "\n";
    ticket += centrarTexto(descuentoTexto) + "\n";
    ticket += centrarTexto(ivaTexto) + "\n";
    ticket += centrarTexto(totalTexto) + "\n";

    ticket += centrarTexto("Pagado: " + formData.tipoPago) + "\n";
    if (formData.tipoPago == "Efectivo") {
      ticket += centrarTexto("Cambio: " + "$" + (isNaN(Number(formData.cambio)) ? "0.00" : Number(formData.cambio).toFixed(2)) + "\n\n");
    }
    // ticket += "\n\n";
    // ticket += "\n\n";
    // Pie de página
    ticket += centrarTexto("Gracias por su compra") + "\n";
    ticket += centrarTexto("¡Vuelva pronto!") + "\n";
    ticket += "\n\n";
    ticket += "\n\n";
    ticket += "\n\n";
    ticket += "\x1D\x56\x00";
    return ticket;
  };

  console.log(generarTicket(ticket));

  return (
    <>
      <div className="ticket-view" id="ticket-view">
        <div id="logo" className="logotipo">
          <img src={logo} alt="logo" />
        </div>
        <h2>Ticket {ticket.numeroTiquet}</h2>
        <p>
          <strong>Cliente:</strong> {ticket.cliente}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {ticket.fecha
            ? new Date(ticket.fecha).toLocaleString()
            : "Fecha no disponible"}
        </p>
        <p>
          <strong>Forma de Pago:</strong> {ticket.tipoPago}
        </p>
        <p>
          <strong>Subtotal:</strong> ${ticket.subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Descuento:</strong> ${ticket.descuento.toFixed(2)}
        </p>
        <p>
          <strong>IVA:</strong> ${ticket.iva.toFixed(2)}
        </p>
        <p>
          <strong>Total:</strong> ${ticket.total.toFixed(2)}
        </p>
        <p>
          <strong>Pago:</strong> ${(ticket.cambio + ticket.total).toFixed(2)}
        </p>
        <p>
          <strong>Cambio:</strong> ${ticket.cambio.toFixed(2)}
        </p>
        <h3>Productos:</h3>
        <ul>
          {ticket.productos && Array.isArray(ticket.productos) ? (
            ticket.productos.map((producto, index) => (
              <li key={index}>
                {producto.nombre} - {producto.cantidad} x ${producto.precio}
              </li>
            ))
          ) : (
            <li>No hay productos disponibles</li>
          )}
        </ul>
        <p>
          <strong>Observaciones:</strong> {ticket.detalles}
        </p>
      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-primary" onClick={() => isMobile ? handlePrint() : setShowModal(true)}>
          <i className="fas fa-print"></i> Imprimir
        </button>
      </div>

      {/* Modal para seleccionar impresora en PC */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona una impresora</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="selectPrinter">
            <Form.Label>Elige una impresora</Form.Label>
            <Form.Control
              as="select"
              value={selectedPrinter || ""}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option value="">Seleccione una impresora</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer}>
                  {printer}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={imprimirTicket}>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TicketView;
