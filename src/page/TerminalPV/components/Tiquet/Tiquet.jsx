import { useState, useEffect, useActionState } from "react";
import "./ticket.css";
import Swal from 'sweetalert2';
import { faCircleInfo, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import {
  obtenUltimoNoTiquet,
  registraVentas,
  actualizaTicket,
  listarVentas,
  obtenerVentas,
  actualizarProdsTicket,
} from "../../../../api/ventas";
import { Col, Row, Image, Table, Form } from "react-bootstrap";
import DatosExtraVenta from "../DatosExtraVenta";
import { logoTiquetGris } from "../../../../assets/base64/logo-tiquet";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LogsInformativos } from "../../../Logs/components/LogsSistema/LogsSistema";
import { ocuparDesocuparMesas } from "../../../../api/mesas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { obtenerComisiones } from "../../../../api/comision";
import TicketCocina from "./Imprimir/TicketCocina";
import Logo from "../../../../components/Logo/Logo";

function Tiquet(props) {
  console.log(props);

  // Importa el complemento de zona horaria
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);



  const {
    setShow,
    setShowTerminalPV,
    idUsuario,
    products,
    empty,
    remove,
    turno,
  } = props;

  const estadoticket = props.estadoticket;
  const mesaticket = props.mesaticket;
  const idTicketMesa = props.idTicket;
  const numMesa = props.numMesa;
  const mesaId = props.mesaId;
  const add = props.agregar;
  const mesaClick = props.mesaClick;

  const [numeroTiquet, setNumeroTiquet] = useState("");
  const [cliente, setCliente] = useState("");
  const [formData, setFormData] = useState(initialFormData());
  const [comision, setComision] = useState(0);
  const [agregado, setAgregado] = useState(false);
  const MAX_INTENTOS_GENERACION = 100;

  const verificarNumeroTiquetUnico = (data, numeroTiquet) => {
    return data.some((venta) => venta.numeroTiquet === numeroTiquet);
  };

  const cargarTicket = async () => {
    try {
      const response = await obtenerVentas(idTicketMesa);
      const { data } = response;
      if (data && data.length > 0) {
        const ticketData = data[0];
        setFormData(ticketData);
      }
    } catch (error) {
      console.error("Error al cargar los datos del ticket:", error);
    }
  };

  useEffect(() => {
    if (idTicketMesa) {
      cargarTicket();
    } else {
      setFormData(initialFormData());
    }
  }, [idTicketMesa]);

  const obtenerNumeroTiquet = async () => {
    try {
      const response = await listarVentas();
      const { data } = response;

      let baseNumero = 1;
      let nuevoNumeroTiquet;
      let existe;
      let intentos = 0;

      do {
        nuevoNumeroTiquet = baseNumero + "-" + generarLetrasAleatorias();
        existe = verificarNumeroTiquetUnico(data, nuevoNumeroTiquet);
        intentos++;

        if (intentos >= MAX_INTENTOS_GENERACION) {
          baseNumero++;
          intentos = 0;
        }
      } while (existe && baseNumero < 100);

      setNumeroTiquet(nuevoNumeroTiquet);
      setFormData((prevFormData) => ({
        ...prevFormData,
        numeroTiquet: nuevoNumeroTiquet,
      }));
    } catch (error) {
      console.error("Error al obtener el último número de ticket:", error);
      const nuevoNumero = "1-" + generarLetrasAleatorias();
      setNumeroTiquet(nuevoNumero);
      setFormData((prevFormData) => ({
        ...prevFormData,
        numeroTiquet: nuevoNumero,
      }));
    }
  };

  useEffect(() => {
    if (!idTicketMesa) {
      obtenerNumeroTiquet();
    }
  }, [idTicketMesa]);

  // CODIGO PARA CARGAR COMISIÓN
  const cargarComision = async () => {
    try {
      const response = await obtenerComisiones();
      const { data } = response;
      setComision(data[0].valor / 100);
    } catch (e) {
      console.error("Error al obtener la comisión:", e);
    }
  };

  const handleCliente = (e) => {
    setCliente(e.target.value);
  };

  useEffect(() => {
    cargarComision();
  }, []);

  const total = products.reduce(
    (amount, item) => amount + parseFloat(item.precio),
    0
  );

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      productos: products,
      subtotal: total,
    }));
  }, [products, total]);

  const handleDeleteProduct = (item) => {
    remove(item);
  };

  //Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  // Para el modal de las observaciones
  const datosExtraVenta = (content) => {
    setTitulosModal("Cobro");
    setContentModal(content);
    setShowModal(true);
  };

  const [fechayHoraSinFormato, setFechayHoraSinFormato] = useState("");
  const [fechayHora, setFechayHora] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const adjustedDate = dayjs(hoy).utc().utcOffset(-360).format(); // Ajusta la hora a CST (UTC -6)

    setFechayHora(dayjs(adjustedDate).locale('es').format('dddd, LL hh:mm A'));
    setFechayHoraSinFormato(adjustedDate);
  }, []);

  // FUNCIÓN PARA OCUPAR MESA
  const ocuparMesa = async () => {
    try {
      const dataTemp = {
        estado: "ocupado",
        idTicket: numeroTiquet,
      };
      ocuparDesocuparMesas(props.mesaId, dataTemp).then((response) => {
        const { data } = response;
        Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Importa el complemento de zona horaria
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);

  // Para el modal de las observaciones
  const ticketCocina = (content) => {
    setTitulosModal("Cobro");
    setContentModal(content);
    setShowModal(true);
  };

  const calcularFecha = () => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const añoVenta = hoy.getFullYear();

    // Configurar el objeto Date para que tome en cuenta el inicio de semana según tu localidad
    hoy.setHours(0, 0, 0);
    hoy.setDate(hoy.getDate() + 4 - (hoy.getDay() || 7));

    // Calcular el número de la semana
    const yearStart = new Date(hoy.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((hoy - yearStart) / 86400000 + 1) / 7);
    const formattedDate = dayjs(fechayHoraSinFormato)
      .tz("America/Mexico_City")
      .format("YYYY-MM-DDTHH:mm:ss.SSS");

    return {
      mes,
      añoVenta,
      weekNumber,
      formattedDate,
    };
  };

  // ACTION FOR PONER/ACTUALIZAR ORDEN 
  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const actionType = fd.get("actionType"); // "SAVE"

    if (actionType === "SAVE") {
      if (products.length === 0) {
        Swal.fire({ icon: 'warning', title: "Debe cargar productos al ticket", timer: 1600, showConfirmButton: false });
        return null;
      }

      const fecha = calcularFecha();
      const formattedDate = dayjs(fechayHoraSinFormato).tz('America/Mexico_City').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

      try {
        if (idTicketMesa) {
          // UPDATE
          const dataTemp = {
            productos: products,
            detalles: formData.detalles,
            subtotal: total,
          };
          await actualizarProdsTicket(formData.numeroTiquet, dataTemp);
          LogsInformativos(`Se ha actualizado la orden ${formData.numeroTiquet} en la mesa ${numMesa}`, dataTemp);
          Swal.fire({ icon: 'success', title: "Orden actualizada con éxito", timer: 1600, showConfirmButton: false });
        } else {
          // CREATE
          const dataTemp = {
            ...formData,
            turno: turno.idTurno,
            mesa: numMesa,
            usuario: idUsuario,
            estado: mesaClick ? "OEM" : "PP",
            subtotal: total,
            tipoPedido: tipoPedido,
            hacerPedido: hacerPedido,
            atendido: usuario,
            mes: fecha.mes,
            año: fecha.añoVenta,
            semana: fecha.weekNumber,
            fecha: fecha.formattedDate,
            createdAt: formattedDate
          };
          await registraVentas(dataTemp);
          LogsInformativos(`Se ha puesto la orden ${formData.numeroTiquet} en la mesa ${numMesa}`, dataTemp);

          // Ocupar mesa
          await ocuparDesocuparMesas(mesaId, { estado: "ocupado", idTicket: formData.numeroTiquet });
          setAgregado(true);
          Swal.fire({ icon: 'success', title: "Orden puesta en mesa con éxito", timer: 1600, showConfirmButton: false });
        }
      } catch (e) {
        console.log(e);
        Swal.fire({ icon: 'error', title: "Error al procesar la orden", text: e.message });
      }
    }
    return null;
  }, null);

  const Encabezado = ({ Logo, tipoPedido, fechayHora }) => {
    return (
      <div className="cafe">
        {/**/}
        <div id="logoFinal" className="logotipo">
          <Logo />
        </div>

        <div className="card card-widget widget-user">
          <div className="card-body">
            <div className="row">
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h5 className="description-header">Tel</h5>
                  <span className="description-text">442-714-09-79</span>
                </div>
              </div>
              <div className="col-sm-4 border-right">
                <div className="description-block">
                  <h5 className="description-header">Ticket</h5>
                  <span className="description-text">
                    #{formData.numeroTiquet}
                  </span>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="description-block">
                  <h5 className="description-header">Mesa</h5>
                  <span className="description-text">
                    {tipoPedido !== "para llevar" && (
                      <>
                        <p className="invoice__cliente">{numMesa}</p>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/**/}
        <div className="detallesTitulo">
          <p className="cafe__number">{fechayHora}</p>
        </div>
      </div>
    );
  };

  const Cuerpo = ({ products, onClick }) => {
    return (
      <div className="ticket__table">
        <Table>
          <thead>
            <tr>
              <th className="items__numeracion">#</th>
              <th className="items__description">Descripción</th>
              <th className="items__qty">Cantidad</th>
              <th className="items__price">Precio</th>
              <th className="remove-icono">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}.- </td>
                <td className="items__description">{item.nombre}</td>
                <td>1</td>
                <td>
                  ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(item.precio)}{" "}
                  MXN
                </td>
                <td
                  title="Quitar producto"
                  onClick={() => onClick(item)}
                  className="remove-icon"
                >
                  ❌
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const Pie = ({ total }) => {
    return (
      <div className="subtotal">
        <hr />
        <Row>
          <Col>
            <div className="subtotal__price">
              Subtotal ${""}
              {new Intl.NumberFormat("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(total)}{" "}
              MXN
            </div>
          </Col>
        </Row>
        <hr />
      </div>
    );
  };

  const Opciones = ({ icon }) => {
    return (
      <div className="ticket__actions">
        <button
          title="Cobrar"
          onClick={() => {
            if (products.length >= 1) {
              if (mesaClick) {
                datosExtraVenta(
                  <DatosExtraVenta
                    formData={formData}
                    setShowModal={setShowModal}
                    setShow={setShow}
                    mesaId={mesaId}
                    mesaClick={mesaClick}
                    isVenta={agregado}
                    comision={comision}
                    turno={turno}
                  />
                );
              } else {
                datosExtraVenta(
                  <DatosExtraVenta
                    formData={formData}
                    mesaId={mesaId}
                    setShowTerminalPV={setShowTerminalPV}
                    setShow={setShow}
                    setShowTicket={setShowModal}
                    mesaClick={mesaClick}
                    isVenta={agregado}
                    comision={comision}
                    turno={turno}
                  />
                );
              }
            } else {
              Swal.fire({ icon: 'error', title: "Debes agregar productos al ticket", timer: 1600, showConfirmButton: false });
            }
          }}
        >
          <i className="fas fa-duotone fa-money-bill"></i>
        </button>

        <button title="Añadir" onClick={() => ponerOrdenActualizarOrden()}>
          <i className="fas fa-plus"></i>
        </button>

        <button
          title="Imprimir"
          onClick={() =>
            ticketCocina(
              <TicketCocina formData={formData} fecha={fechayHora} />
            )
          }
        >
          <i className="fas fa-receipt"></i>
        </button>

        <button title="Limpiar el ticket" /*PENDIENTE*/>
          <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
        </button>
      </div>
    );
  };

  return (
    <>
      <Form action={action}>
        <div id="ticketGenerado" className="ticket">
          <div className="ticket__information">
            {/**/}

            <Encabezado
              Logo={Logo}
              numeroTiquet={numeroTiquet}
              mesa={numMesa}
              fechayHora={fechayHora}
            />
            <div className="d-flex align-items-center mb-2">
              <Form.Label className="mb-0 mr-2">Cliente:</Form.Label>
              <Form.Control
                type="text"
                value={formData.cliente}
                placeholder="Ingrese el nombre del cliente"
                onChange={(e) => {
                  setFormData({ ...formData, cliente: e.target.value });
                }}
                className="ml-2"
              />
            </div>
            {/**/}
            <Cuerpo products={products} onClick={handleDeleteProduct} />
            <Row>
              <Col>
                <Form.Group controlId="detallesTextarea">
                  <Form.Label>Detalles</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Ingrese los detalles de la orden"
                    value={formData.detalles}
                    rows={3}
                    style={{ overflow: "hidden", resize: "none" }}
                    onChange={(e) => {
                      setFormData({ ...formData, detalles: e.target.value });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/**/}
            <Pie total={formData.subtotal} />
          </div>

          <div className="ticket__actions">
            <Button
              title="Cobrar"
              variant="link"
              className="p-0 border-0"
              disabled={isPending}
              onClick={() => {
                if (products.length >= 1) {
                  datosExtraVenta(
                    <DatosExtraVenta
                      formData={formData}
                      setShowModal={setShowModal}
                      setShow={setShow}
                      setShowTicket={setShowModal}
                      setShowTerminalPV={setShowTerminalPV}
                      mesaId={mesaId}
                      mesaClick={mesaClick}
                      isVenta={idTicketMesa || agregado}
                      comision={comision}
                      turno={turno}
                      numMesa={numMesa}
                    />
                  );
                } else {
                  Swal.fire({ icon: 'error', title: "Debes agregar productos al ticket", timer: 1600, showConfirmButton: false });
                }
              }}
            >
              <i className="fas fa-duotone fa-money-bill"></i>
            </Button>

            <Button
              title="Añadir/Guardar"
              type="submit"
              name="actionType"
              value="SAVE"
              variant="link"
              className="p-0 border-0"
              disabled={isPending}
            >
              {isPending ? <Spinner size="sm" /> : <i className="fas fa-plus"></i>}
            </Button>

            <Button
              title="Imprimir"
              variant="link"
              className="p-0 border-0"
              disabled={isPending}
              onClick={() =>
                ticketCocina(
                  <TicketCocina formData={formData} fecha={fechayHora} />
                )
              }
            >
              <i className="fas fa-receipt"></i>
            </Button>

            <Button title="Limpiar el ticket" variant="link" className="p-0 border-0" onClick={() => empty()} disabled={isPending}>
              <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
            </Button>
          </div>
        </div>
      </Form>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default Tiquet;

function initialFormData() {
  return {
    numeroTiquet: "",
    cliente: "",
    mesa: "",
    usuario: "",
    productos: "",
    estado: "",
    detalles: "",
    observaciones: "",
    tipoPago: "",
    efectivo: "",
    cambio: 0,
    subtotal: 0,
    tipoPedido: "",
    hacerPedido: "",
    tipoDescuento: "",
    descuento: 0,
    pagado: "",
    total: "",
    iva: 0,
    atendido: "",
    comision: "",
    agrupar: "",
    año: "",
    semana: "",
    fecha: "",
    metodosPago: {
      efectivo: {
        estado: false,
        cantidad: 0,
      },
      tdc: {
        estado: false,
        cantidad: 0,
      },
      transfer: {
        estado: false,
        cantidad: 0,
      },
    },
  };
}

// Función para generar letras aleatorias
const generarLetrasAleatorias = () => {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let letrasAleatorias = "";
  for (let i = 0; i < 4; i++) {
    const indice = Math.floor(Math.random() * letras.length);
    letrasAleatorias += letras.charAt(indice);
  }
  return letrasAleatorias;
};

