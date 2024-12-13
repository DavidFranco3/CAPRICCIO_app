import React from "react";
import printJS from "print-js";

const TicketView = ({ ticket }) => {
  if (!ticket) {
    return <div>No hay datos del ticket disponibles.</div>;
  }

  const handlePrint = () => {
    if (ticket.productos.length === 0) {
      console.log("Agregue productos");
    } else {
      // Configuración para `print-js`
      printJS({
        printable: "ticket-view",
        type: "html",
        targetStyles: ["*"], // Incluye todos los estilos
      });
    }
  };

  return (
    <>
      <div className="ticket-view" id="ticket-view">
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
          <strong>Total:</strong> {ticket.total}
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
        <button className="btn btn-primary" onClick={() => handlePrint()}>
          <i className="fas fa-print"></i> Imp
        </button>
      </div>
    </>
  );
};

export default TicketView;
