import { useEffect } from "react";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../../../components/Logo/Logo";
import printJS from "print-js";  // Importamos la librería

function TicketFinal(params) {
  const { formData, setShowTicket, setShowTerminalPV, setShowMod } = params;

  const handlePrint = () => {
    if (formData.productos.length === 0) {
      console.log("agregue productos");
    } else {
      // Crear el contenido del ticket para imprimir
      const ticketContent = `
        <div id="ticketCocina" class="container-sm">
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
          .tabla {width:100%;border-collapse:collapse;margin:16px 0 16px 0;}
          .tabla th {border:1px solid #ddd;padding:4px;background-color:#d4eefd;text-align:left;font-size:30px;}
          .tabla td {border:1px solid #ddd;text-align:left;padding:6px;}
          p {margin-top: -10px !important;}
          .cafe__number {margin-top: -10px !important;}
          .logotipo {width: 91px !important; margin: 0 auto;}
          img {width: 91px !important; margin: 0 auto;}
          .logotipoRappi {width: 91px !important; margin: 0 auto;}
          img {width: 91px !important; margin: 0 auto;}
          .detallesTitulo {margin-top: 10px !important;}
          .ticket__actions {display: none !important;}
          .remove-icon {display: none !important;}
          .remove-icono {display: none !important;}
          .items__price {color: #000000 !important;}
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
