import React from 'react';

const TicketView = ({ ticket }) => {
  if (!ticket) {
    return <div>No hay datos del ticket disponibles.</div>;
  }

  return (
    <div className="ticket-view">
      <h2>Ticket {ticket.numeroTiquet}</h2>
      <p><strong>Cliente:</strong> {ticket.cliente}</p>
      <p><strong>Fecha:</strong> {ticket.fecha ? new Date(ticket.fecha).toLocaleString() : 'Fecha no disponible'}</p>
      <p><strong>Forma de Pago:</strong> {ticket.tipoPago}</p>
      <p><strong>Total:</strong> {ticket.total}</p>
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
      <p><strong>Observaciones:</strong> {ticket.observaciones}</p>
    </div>
  );
};

export default TicketView;
