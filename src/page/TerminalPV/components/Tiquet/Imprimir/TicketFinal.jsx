import { useEffect } from "react";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../../../components/Logo/Logo";
import printJS from "print-js";  // Importamos la librería

function TicketFinal(params) {
  const { formData, setShowTicket, setShowTerminalPV, setShowMod } = params;

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
          <div class="row">${formData.fecha}</div>
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

  return (
    <>
      <div className="d-flex justify-content-evenly">
        <button className="btn btn-primary" onClick={handlePrint}>
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
