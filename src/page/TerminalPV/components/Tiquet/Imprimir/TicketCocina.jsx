import React from "react";
import PrintJS from "print-js";
import { Image } from "react-bootstrap";

function TicketCocina(params) {
  const { formData } = params;

  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const handlePrint = () => {
    if (formData.productos.length === 0) {
      console.log("agregue productos");
    } else {
      // Usamos print-js para generar el ticket
      PrintJS({
        printable: 'ticketCocina', // El ID del contenedor que queremos imprimir
        type: 'html', // Tipo de contenido: HTML
        style: `
          @page {
            size: 58mm 100mm; /* Establecer el tamaño del ticket */
            margin: 0; /* Sin márgenes */
          }
          body {
            margin: 0; /* Sin márgenes */
            padding: 0;
            width: 58mm;
            font-family: Arial, sans-serif;
          }
          .container-sm {
            width: 100%;
            padding: 0;
            margin: 0;
            font-size: 8px; /* Ajustamos el tamaño de la fuente */
          }
          .tabla {
            width: 100%;
            border-collapse: collapse;
            margin: 0; /* Reducir márgenes */
          }
          .tabla th, .tabla td {
            padding: 1px 3px; /* Reducir el padding para ajustarse al espacio */
            font-size: 8px; /* Reducir tamaño de fuente */
            text-align: left;
          }
          .tabla th {
            background-color: #d4eefd;
            font-weight: bold;
            font-size: 8px; /* Ajuste tamaño de fuente */
          }
          .ticket__table {
            margin-top: 3px;
          }
          p, .cafe__number, .detallesTitulo {
            margin: 0 !important;
            padding: 0;
            font-size: 7px; /* Reducir aún más el tamaño de texto */
            line-height: 1.1;
          }
          .logotipo {
            text-align: center; /* Centrar el logo en la página */
            margin: 0 auto;
            padding: 0;
          }
          
          .ticket__actions, .remove-icon, .remove-icono {
            display: none !important;
          }
          .items__price {
            color: #000000 !important;
            font-size: 8px;
          }
          .items__numeracion, .items__description, .items__qty {
            font-size: 7px; /* Reducir aún más el tamaño de fuente en los ítems */
          }
          .ticket__table td, .ticket__table th {
            padding: 1px 3px; /* Reducir padding en la tabla de ítems */
          }
          .ticket__table tr td {
            padding: 2px 0;
            font-size: 7px; /* Ajustar texto en las filas */
          }
          /* Quitar bordes de la tabla */
          .tabla th, .tabla td {
            border: none !important;
          }
        `, // Estilos personalizados para la impresión
      });
    }
  };

  return (
    <>
      <div id="ticketCocina" className="container-sm">
        <div id="logo" className="logotipo">
          <Image src={logo} alt="logo" />
        </div>
        <div>Nombre: {formData.cliente}</div>
        <div className="row d-flex justify-content-center">
          <table className="table table-borderless tabla">
            <tbody>
              <tr>
                <th>Ticket</th>
                <th>Mesa</th>
              </tr>
              <tr>
                <td>{formData.numeroTiquet}</td>
                <td>{formData.mesa}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row" style={{ fontSize: '7px', marginTop: '3px' }}>{params.fecha}</div>
        <div className="ticket__table">
          <table className="table table-borderless tabla">
            <thead>
              <tr>
                <th className="items__numeracion">#</th>
                <th className="items__description">Descripción</th>
                <th className="items__qty">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {formData.productos?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}.- </td>
                  <td className="items__description">{item.nombre}</td>
                  <td>1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: '7px', marginTop: '3px' }}>Detalles: {formData.detalles}</div>
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={() => handlePrint()}>
          <i className="fas fa-print"></i> Imp
        </button>
      </div>
    </>
  );
}

export default TicketCocina;
