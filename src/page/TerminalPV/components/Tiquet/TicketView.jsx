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
    const anchoTicket = 32; // Ancho de 54mm (~32 caracteres)
    const anchoProducto = 16; // Ajustado para mejor alineación
    const anchoCantidad = 5;
    const anchoPrecio = 9;

    // Función para centrar texto
    const centrarTexto = (texto, ancho = anchoTicket) => {
      const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
      return ' '.repeat(espacios) + texto;
    };

    let ticket = "";

    // Encabezado de la empresa
    ticket += centrarTexto("CAPRICCIO") + "\n\n";

    // Detalles de la venta
    ticket += centrarTexto("Cliente: " + formData.cliente) + "\n";
    ticket += centrarTexto("Ticket: " + formData.numeroTiquet) + "\n";
    ticket += centrarTexto("Mesa: " + formData.mesa) + "\n";
    ticket += centrarTexto("Pedido: " + formData.hacerPedido) + "\n";
    ticket += centrarTexto("Para: " + formData.tipoPedido) + "\n";
    ticket += centrarTexto("Fecha: " + dayjs.utc(formData.fecha).format("DD/MM/YYYY hh:mm A")) + "\n\n";

    // Encabezado de productos con alineación exacta
    ticket += centrarTexto("Producto        Cant  Precio") + "\n";
    ticket += centrarTexto("------------------------------") + "\n";

    // Imprimir productos con mejor alineación
    formData.productos.forEach((producto) => {
      let nombre = producto?.nombre || "";
      let cantidad = String(producto.cantidad || 1).padStart(anchoCantidad);
      let precio = ('$' + producto.precio.toFixed(2)).padStart(anchoPrecio);

      // Si el nombre es muy largo, dividirlo en varias líneas
      while (nombre.length > anchoProducto) {
        ticket += centrarTexto(nombre.slice(0, anchoProducto)) + "\n";
        nombre = nombre.slice(anchoProducto);
      }

      // Agregar el producto alineado
      let lineaProducto = `${nombre.padEnd(anchoProducto)}${cantidad}${precio}`;
      ticket += centrarTexto(lineaProducto) + "\n";
    });

    // Línea de separación
    ticket += centrarTexto("------------------------------") + "\n";

    // Totales alineados y centrados
    ticket += centrarTexto(`Subtotal: $${Number(formData.subtotal || 0).toFixed(2)}`) + "\n";
    ticket += centrarTexto(`Descuento: $${Number(formData.descuento || 0).toFixed(2)}`) + "\n";
    ticket += centrarTexto(`IVA: $${Number(formData.iva || 0).toFixed(2)}`) + "\n";
    ticket += centrarTexto(`Total: $${Number(formData.total || 0).toFixed(2)}`) + "\n";

    // Tipo de pago
    ticket += centrarTexto("Pago: " + formData.tipoPago) + "\n";
    if (formData.tipoPago === "Efectivo") {
      ticket += centrarTexto("Pagado: $" + Number((Number(formData.cambio || 0) + Number(formData.total || 0))).toFixed(2)) + "\n";
      ticket += centrarTexto("Cambio: $" + Number(formData.cambio || 0).toFixed(2)) + "\n";
    }

    ticket += "\n";
    ticket += centrarTexto("¡Gracias por su compra!") + "\n";
    ticket += centrarTexto("Vuelva pronto") + "\n";
    ticket += "\n\n";
    ticket += "\n\n\n"; // Espacio extra para corte automático
    ticket += "\x1D\x56\x00"; // Código de corte de papel

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
        <button className="btn btn-primary" onClick={() => isMobile ? handlePrint() : imprimirTicket()}>
          <i className="fas fa-print"></i> Imprimir
        </button>
      </div>
    </>
  );
};

export default TicketView;
