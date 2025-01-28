import React from "react";
import printJS from "print-js";

const TicketView = ({ ticket }) => {
  console.log(ticket)
  if (!ticket) {
    return <div>No hay datos del ticket disponibles.</div>;
  }

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
          <strong>Observaciones:</strong> {ticket.observaciones}
        </p>
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={handlePrint}>
          <i className="fas fa-print"></i> Imprimir
        </button>
      </div>
    </>
  );
};

export default TicketView;
