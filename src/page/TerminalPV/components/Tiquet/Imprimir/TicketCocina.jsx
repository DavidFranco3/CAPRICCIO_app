function TicketCocina(params) {
  const { formData } = params;

  const handlePrint = () => {
    if (formData.productos.length === 0) {
      console.log("agregue productos");
    } else {
      const tiquetGenerado = window.open(
        "Tiquet",
        "PRINT",
        "height=800,width=1200"
      );
      tiquetGenerado.document.write("<html><head>");
      tiquetGenerado.document.write(
        "<style>.tabla{width:100%;border-collapse:collapse;margin:16px 0 16px 0;}.tabla th{border:1px solid #ddd;padding:4px;background-color:#d4eefd;text-align:left;font-size:30px;}.tabla td{border:1px solid #ddd;text-align:left;padding:6px;} p {margin-top: -10px !important;} .cafe__number {margin-top: -10px !important;} .logotipo {width: 91px !important; margin: 0 auto;} img {width: 91px !important; margin: 0 auto;} .logotipoRappi {width: 91px !important; margin: 0 auto;} img {width: 91px !important; margin: 0 auto;}  .detallesTitulo {margin-top: 10px !important;} .ticket__actions {display: none !important;} .remove-icon {display: none !important;} .remove-icono {display: none !important;} .items__price {color: #000000 !important;} </style>"
      );
      tiquetGenerado.document.write("</head><body>");
      tiquetGenerado.document.write(
        document.getElementById("ticketCocina").innerHTML
      );
      tiquetGenerado.document.write("</body></html>");

      tiquetGenerado.document.close();
      tiquetGenerado.focus();
      tiquetGenerado.print();
      tiquetGenerado.close();
    }
  };

  return (
    <>
      <div id="ticketCocina" className="container-sm">
        <div>Nombre: {formData.cliente}</div>
        <div className="row d-flex justify-content-center">
          <table className="table table-borderless">
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
        <div className="row">{params.fecha}</div>
        <div className="ticket__table">
          <table className="table table-borderless">
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
        <div>Detalles: {formData.detalles}</div>
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
