import { useEffect } from "react";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function TicketFinal(params) {
  const { formData, setShowTicket, setShowTerminalPV, setShowMod } = params;

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

    // setShow(false);
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
      <div id="ticketCocina" className="container-sm">
        <div className="d-flex justify-content-center align-items-center">
          <img src={logoTiquetGris} alt="Logo" />
        </div>
        <div>Nombre: {formData.cliente}</div>
        <div className="row d-flex justify-content-center">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Ticket</td>
                <td>Mesa</td>
              </tr>
              <tr>
                <td>{formData.numeroTiquet}</td>
                <td>{formData.mesa || "Sin mesa"}</td>
              </tr>
              <tr>
                <td>Pedido:</td>
                <td>Para:</td>
              </tr>
              <tr>
                <td>{formData.hacerPedido}</td>
                <td>{formData.tipoPedido}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">{formData.fecha}</div>
        <div className="ticket__table">
          <table className="table table-borderless">
            <thead>
              <tr>
                <td className="items__numeracion">#</td>
                <td className="items__description">Descripción</td>
                <td className="items__qty">Cantidad</td>
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
        <div className="mt-2">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td>{formData.subtotal}</td>
              </tr>
              <tr>
                <td>Descuento:</td>
                <td>{formData.descuento}</td>
              </tr>
              <tr>
                <td>IVA:</td>
                <td>{formData.iva}</td>
              </tr>
              <tr>
                <td>Total:</td>
                <td>{formData.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2">
          <p className="mb-0">Pagado en: {formData.tipoPago}</p>
          {formData.tipoPago === "Efectivo" && (
            <p className="mb-0">Cambio: {formData.cambio}</p>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-evenly">
        <button className="btn btn-primary" onClick={() => handlePrint()}>
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
