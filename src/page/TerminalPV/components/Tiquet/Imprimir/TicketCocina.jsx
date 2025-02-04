import { useState, useEffect } from "react";
import PrintJS from "print-js";
import { Image, Modal, Button, Form } from "react-bootstrap";
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import 'dayjs/locale/es';
import qz from "qz-tray";

function TicketCocina(params) {
  const { formData } = params;
  console.log(formData);

  dayjs.extend(utc); // Configura el idioma español
  dayjs.locale('es');
  dayjs.extend(localizedFormat);


  const [showModal, setShowModal] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

  const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

  const handlePrint = () => {
    if (formData.productos.length === 0) {
      console.log("agregue productos");
    } else {
      PrintJS({
        printable: 'ticketCocina',
        type: 'html',
        style: `
          @page { size: 58mm 100mm; margin: 0; }
          body { margin: 0; padding: 0; width: 58mm; font-family: Arial, sans-serif; }
          .container-sm { width: 100%; padding: 0; margin: 0; font-size: 8px; }
          .tabla { width: 100%; border-collapse: collapse; margin: 0; }
          .tabla th, .tabla td { padding: 1px 3px; font-size: 8px; text-align: left; }
          .tabla th { background-color: #d4eefd; font-weight: bold; font-size: 8px; }
          .ticket__table { margin-top: 3px; }
          p, .cafe__number, .detallesTitulo { margin: 0 !important; padding: 0; font-size: 7px; }
        `,
      });
    }
  };

  const obtenerImpresoras = async () => {
    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      const impresoras = await qz.printers.find();
      console.log("Lista de impresoras:", impresoras);
      setPrinters(impresoras);
    } catch (error) {
      console.error("Error al obtener impresoras:", error);
    }
  };

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

    // Total centrado
    const totalTexto = `Total: $${(isNaN(Number(formData.subtotal)) ? "0.00" : Number(formData.subtotal).toFixed(2))}`;
    ticket += centrarTexto(totalTexto) + "\n";

    // Detalles adicionales
    ticket += centrarTexto("Detalles: " + formData.detalles) + "\n\n";

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
        <div className="row">{params.fecha}</div>
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
        <div>Total: ${isNaN(Number(formData.total)) ? "0.00" : Number(formData.subtotal).toFixed(2)}</div>
        <div>Detalless: {formData.detalles}</div>
      </div>

      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={() => isMobile ? handlePrint() : setShowModal(true)}>
          <i className="fas fa-print"></i> Imp
        </button>
      </div>

      {/* Modal para seleccionar impresora en PC */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Selecciona una impresora</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="selectPrinter">
            <Form.Label>Elige una impresora</Form.Label>
            <Form.Control
              as="select"
              value={selectedPrinter || ""}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option value="">Seleccione una impresora</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer}>
                  {printer}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={imprimirTicket}>
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TicketCocina;
