import React from 'react';

const TicketView = ({ ticket }) => {
  if (!ticket) {
    return <div>No hay datos del ticket disponibles.</div>;
  }

  const handlePrint = () => {
    if (ticket.productos.length === 0) {
      console.log("Agregue productos");
    } else {
      const tiquetGenerado = window.open("", "_blank", "height=800,width=1200");

      if (tiquetGenerado) {
        tiquetGenerado.document.head.innerHTML = `
          <title>Vista Previa del Ticket</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .tabla {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
            }
            .tabla th {
              border: 1px solid #ddd;
              padding: 4px;
              background-color: #d4eefd;
              text-align: left;
              font-size: 30px;
            }
            .tabla td {
              border: 1px solid #ddd;
              text-align: left;
              padding: 6px;
            }
            p {
              margin-top: -10px !important;
            }
            .logotipo, .logotipoRappi {
              width: 91px !important;
              margin: 0 auto;
            }
            img {
              width: 91px !important;
              margin: 0 auto;
            }
            .detallesTitulo {
              margin-top: 10px !important;
            }
            .ticket__actions, .remove-icon, .remove-icono {
              display: none !important;
            }
            .items__price {
              color: #000000 !important;
            }
          </style>
        `;

        const bodyContent = `
          <div>
            <h2>Ticket ${ticket.numeroTiquet}</h2>
            <p><strong>Cliente:</strong> ${ticket.cliente}</p>
            <p><strong>Fecha:</strong> ${ticket.fecha ? new Date(ticket.fecha).toLocaleString() : 'Fecha no disponible'}</p>
            <p><strong>Forma de Pago:</strong> ${ticket.tipoPago}</p>
            <p><strong>Total:</strong> ${ticket.total}</p>
            <h3>Productos:</h3>
            <ul>
              ${
                ticket.productos && Array.isArray(ticket.productos)
                  ? ticket.productos
                      .map(
                        (producto) =>
                          `<li>${producto.nombre} - ${producto.cantidad} x $${producto.precio}</li>`
                      )
                      .join("")
                  : "<li>No hay productos disponibles</li>"
              }
            </ul>
            <p><strong>Observaciones:</strong> ${ticket.observaciones}</p>
          </div>
        `;

        tiquetGenerado.document.body.innerHTML = bodyContent;

        // Hacer un pequeño delay antes de la impresión para garantizar el render
        setTimeout(() => {
          tiquetGenerado.print();
          tiquetGenerado.close();
        }, 500);
      } else {
        console.error("No se pudo abrir la ventana emergente.");
      }
    }
  };

  return (
    <>
      <div className="ticket-view" id="ticket-view">
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
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={handlePrint}>
          <i className="fas fa-print"></i> Imprimir
        </button>
      </div>
    </>
  );
};

export default TicketView;
