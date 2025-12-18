import { useEffect, useState } from "react";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../../../components/Logo/Logo";
import printJS from "print-js";  // Importamos la librería
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/es';
import qz from "qz-tray";
import { Image, Modal, Button, Form } from "react-bootstrap";


function TicketFinal(params) {
  const { formData, setShowTicket, setShowTerminalPV, setShowMod } = params;

  dayjs.extend(utc); // Configura el idioma español
  dayjs.locale('es');
  dayjs.extend(localizedFormat);

  const [showModal, setShowModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const handlePrint = () => {
    if (formData.productos.length === 0) {
      console.log("Agregue productos");
    } else {
      // Crear el contenido del ticket para imprimir
      const ticketContent = `
        <div id="ticketCocina" class="container-sm">
        <div id="logo" className="logotipo">
                    <img src=${logo} alt="logo" />
                </div>
          <div class="d-flex justify-content-center align-items-center">
            <Logo />
          </div>
          <div>Nombre: ${formData.cliente}</div>
          <div class="row d-flex justify-content-center">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td>Ticket</td>
                  <td>Mesa</td>
                </tr>
                <tr>
                  <td>${formData.numeroTiquet}</td>
                  <td>${formData.mesa || "Sin mesa"}</td>
                </tr>
                <tr>
                  <td>Pedido:</td>
                  <td>Para:</td>
                </tr>
                <tr>
                  <td>${formData.hacerPedido}</td>
                  <td>${formData.tipoPedido}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">${dayjs.utc(formData.fecha).format("dddd, LL hh:mm A")}</div>
          <div class="ticket__table">
            <table class="table table-borderless">
              <thead>
                <tr>
                  <td class="items__numeracion">#</td>
                  <td class="items__description">Descripción</td>
                  <td class="items__qty">Cantidad</td>
                </tr>
              </thead>
              <tbody>
                ${formData.productos.map(
        (item, index) => ` 
                    <tr>
                      <td>${index + 1}.- </td>
                      <td class="items__description">${item.nombre}</td>
                      <td>1</td>
                    </tr>`
      ).join("")}
              </tbody>
            </table>
          </div>
          <div>Detalles: ${formData.detalles}</div>
          <div class="mt-2">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td>Subtotal:</td>
                  <td>${formData.subtotal}</td>
                </tr>
                <tr>
                  <td>Descuento:</td>
                  <td>${formData.descuento}</td>
                </tr>
                <tr>
                  <td>IVA:</td>
                  <td>${formData.iva}</td>
                </tr>
                <tr>
                  <td>Total:</td>
                  <td>${formData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-2">
            <p class="mb-0">Pagado en: ${formData.tipoPago}</p>
            ${formData.tipoPago === "Efectivo" ? `<p class="mb-0">Cambio: ${formData.cambio}</p>` : ""}
          </div>
        </div>
      `;

      // Usamos print-js para imprimir el contenido generado
      printJS({
        printable: ticketContent,
        type: 'raw-html',
        style: `
          @page {
            size: 58mm 100mm; /* Establecer el tamaño del ticket */
            margin: 0; /* Sin márgenes */
          }
          body {
            margin: 0; /* Sin márgenes */
            padding: 0;
            width: 58mm; /* Ajuste al tamaño del ticket */
            font-family: Arial, sans-serif;  /* Fuente más clara para tickets */
            font-size: 8px;  /* Tamaño de fuente reducido */
          }
          .ticket__table {
            width: 100%;
            font-size: 8px;
          }
          .ticket__table th, .ticket__table td {
            padding: 2px;
            font-size: 8px;
            text-align: left;
          }
          .items__numeracion, .items__description, .items__qty {
            font-size: 8px;
          }
          .ticket__actions, .remove-icon, .remove-icono {
            display: none !important;
          }
          .logotipo {
            width: 50px !important;
            margin: 0 auto;
            display: block;
          }
          img {
            width: 50px !important;
            margin: 0 auto;
          }
          .detallesTitulo {
            margin-top: 5px !important;
            font-size: 8px;
          }
          .items__description {
            font-size: 7px;  /* Ajuste de tamaño de descripción de productos */
          }
          .items__qty {
            font-size: 7px;  /* Ajuste de cantidad */
          }
          p {
            margin: 0;
            padding: 0;
            font-size: 8px;
            text-align: center;
          }
        `
      });
    }

    // Ocultamos el ticket y las pantallas correspondientes después de imprimir
    setShowMod(false);
    setShowTicket(false);
    setShowTerminalPV(false);
  };

  const cancelarImp = () => {
    setShowMod(false);
    setShowTicket(false);
    setShowTerminalPV(false);
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
      const ticketContent = generarTicket(formData);

      const contenido = [
        { type: "raw", format: "plain", data: ticketContent },
        { type: "raw", format: "plain", data: "\x1B\x69" }, // Corte
      ];

      await qz.print(printerConfig, contenido);
    } catch (error) {
      console.error("Error al imprimir el ticket:", error);
    } finally {
      if (qz.websocket.isActive()) {
        setShowMod(false);
        setShowTicket(false);
        setShowTerminalPV(false);
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
      ticket += centrarTexto("Pagado: " + "$" + Number((Number(formData.cambio || 0) + Number(formData.total || 0))).toFixed(2)) + "\n";
      ticket += centrarTexto("Cambio: " + "$" + (isNaN(Number(formData.cambio)) ? "0.00" : Number(formData.cambio).toFixed(2)) + "\n\n");
    }

    ticket += "\n";
    ticket += centrarTexto("¡Gracias por su compra!") + "\n";
    ticket += centrarTexto("Vuelva pronto") + "\n";
    ticket += "\n\n";
    ticket += "\n\n\n"; // Espacio extra para corte automático
    ticket += "\x1D\x56\x00"; // Código de corte de papel

    return ticket;
  };

  console.log(generarTicket(formData));

  return (
    <>
      <div className="d-flex justify-content-evenly">
        <button className="btn btn-primary" onClick={() => isMobile ? handlePrint() : imprimirTicket()}>
          <i className="fas fa-print"></i> Imp
        </button>
        <button className="btn btn-danger" onClick={cancelarImp}>
          <FontAwesomeIcon icon={faX} /> Cerrar
        </button>
      </div>
    </>
  );
}

export default TicketFinal;
