import { useState, useEffect } from "react";
import "../../../scss/styles.scss";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import {
  obtenUltimoNoTiquet,
  registraPedidos,
} from "../../../api/pedidosClientes";
import { obtenerProductos } from "../../../api/productos";
import { Col, Button, Row, Image, Table } from "react-bootstrap";
import DatosExtraVenta from "../../PedidosClientes/DatosExtraPedido";
import { logoTiquetGris } from "../../../assets/base64/logo-tiquet";
import "dayjs/locale/es";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { useNavigate } from "react-router-dom";

function Tiquet(props) {
  const { products, empty, remove, idUsuario } = props;

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/PedidosClientes");
  };

  dayjs.locale("es");
  dayjs.extend(localizedFormat);

  const [costoEnvio, setCostoEnvio] = useState("0.16");

  const obtenerCostoEnvio = () => {
    try {
      obtenerProductos("6387b912fa40f22f916a56f4")
        .then((response) => {
          const { data } = response;
          // console.log(data)
          setCostoEnvio(parseFloat(data.precio));
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    obtenerCostoEnvio();
  }, []);

  const total =
    products.reduce((amount, item) => amount + parseFloat(item.precio), 0) +
    parseFloat(costoEnvio);

  const [determinaBusquedaTiquet, setDeterminaBusquedaTiquet] = useState(false);
  const [numeroTiquet, setNumeroTiquet] = useState("");

  //Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const handleEmptyTicket = () => {
    empty();
    setTipoPago("");
    setIVA("0");
    setTipoPedido("");
    setHacerPedido("");
    setNombreCliente("");
    setDineroIngresado("");
    setObservaciones("");
  };

  const [IVA, setIVA] = useState("0.16");

  const obtenerNumeroTiquet = () => {
    try {
      obtenUltimoNoTiquet()
        .then((response) => {
          const { data } = response;
          // console.log(data)
          setNumeroTiquet(data.noTiquet);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    obtenerNumeroTiquet();
  }, []);

  const handleRegistraVenta = () => {
    let iva = "0";
    let comision = "0";

    if (IVA === "0.16") {
      iva = "0.16";
    }

    if (products.length === 0) {
      toast.warning("Debe cargar articulos al pedido");
    } else {
      const hoy = new Date();
      const grupo = hoy.getMonth() + 1;
      try {
        const dataTemp = {
          numeroTiquet: numeroTiquet,
          usuario: idUsuario,
          cliente: nombreCliente,
          estado: "Pendiente",
          detalles: observaciones,
          tipoPago: tipoPago,
          tipoPedido: tipoPedido,
          hacerPedido: hacerPedido,
          efectivo: dineroIngresado,
          cambio:
            parseFloat(dineroIngresado) -
            (parseFloat(total) +
              parseFloat(total) * parseFloat(iva) +
              parseFloat(total) * parseFloat(comision))
              ? parseFloat(dineroIngresado) -
                (parseFloat(total) +
                  parseFloat(total) * parseFloat(iva) +
                  parseFloat(total) * parseFloat(comision))
              : "0",
          productos: products,
          iva: parseFloat(total) * parseFloat(iva),
          comision: parseFloat(total) * parseFloat(comision),
          subtotal: total,
          direccion: domicilio,
          total:
            parseFloat(total) +
            parseFloat(total) * parseFloat(iva) +
            parseFloat(total) * parseFloat(comision),
          agrupar: grupo,
        };

        registraPedidos(dataTemp).then((response) => {
          const { data } = response;
          setDeterminaBusquedaTiquet(true);
          LogsInformativos(
            "Se ha registrado tu pedido, para confirmarlo debes enviar un mensaje de whatsapp al local usando el boton que aparece en la tabla",
            data.datos
          );
          toast.success(data.mensaje);
          handleEmptyTicket();
          rutaRegreso();
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleDeleteProduct = (item) => {
    remove(item);
  };

  // Para almacenar el nombre del cliente
  const [nombreCliente, setNombreCliente] = useState("");

  // Para alamcenar el dinero ingresado
  const [dineroIngresado, setDineroIngresado] = useState("");

  // Para almacenar el tipo de pago
  const [tipoPago, setTipoPago] = useState("");

  // Para almacenar el tipo de pedido
  const [tipoPedido, setTipoPedido] = useState("");

  // Para almacenar la forma en la que se hizo el pedido
  const [hacerPedido, setHacerPedido] = useState("");

  // Para almacenar las observaciones
  const [observaciones, setObservaciones] = useState("");

  // Para almacenar la direccion de entrega
  const [domicilio, setDomicilio] = useState("");

  // Para el modal de las observaciones
  const datosExtraVenta = (content) => {
    setTitulosModal("Datos extra del pedido");
    setContentModal(content);
    setShowModal(true);
  };

  const [fechayHora, setFechayHora] = useState("");

  const cargarFecha = () => {
    const hoy = new Date();
    const hora =
      hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha =
      hoy.getFullYear() +
      "-" +
      (hoy.getMonth() + 1) +
      "-" +
      hoy.getDate() +
      " " +
      hora;
    // console.log(fecha)
    // console.log("Fecha actual ", hoy)
    setFechayHora(dayjs(fecha).format("dddd, LL hh:mm A"));
  };

  useEffect(() => {
    cargarFecha();
  }, []);

  const Encabezado = ({
    logo,
    numeroTiquet,
    nombreCliente,
    tipoPedido,
    hacerPedido,
    fechayHora,
  }) => {
    return (
      <>
        <div className="cafe">
          {/**/}
          <div id="logoFinal" className="logotipo">
            <Image src={logo} alt="logo" />
          </div>
          <div className="card card-widget widget-user">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 border-right">
                  <div className="description-block">
                    <h5 className="description-header">Tel</h5>
                    <span className="description-text">442-714-09-79</span>
                  </div>
                </div>
                <div className="col-sm-6 border-right">
                  <div className="description-block">
                    <h5 className="description-header">Ticket</h5>
                    <span className="description-text">#{numeroTiquet}</span>
                  </div>
                </div>
               
              </div>
            </div>
          </div>
          {/**/}
          <div className="detallesTitulo">
            {/**
          <p className="cafe__number">Teléfono para pedidos</p>
          <p className="cafe__number">442-714-09-79</p>
         
          <p className="cafe__number">Ticket #{numeroTiquet}</p>
          <p className="cafe__number">Cliente {nombreCliente}</p>
          {tipoPedido !== "para llevar" && (
            <>
              <p className="invoice__cliente">Mesa {mesa}</p>
            </>
          )}
           */}
            <p className="invoice__cliente">Pedido {tipoPedido}</p>
            <p className="invoice__cliente">Hecho {hacerPedido}</p>
            <p className="cafe__number">{fechayHora}</p>
          </div>
        </div>
        {/** 
            <div className="cafe">
                
                <div id="logoFinal" className="logotipo">
                    <Image src={logo} alt="logo" />
                </div>
                
                <div className="detallesTitulo">
                    <p className="cafe__number">Teléfono para pedidos</p>
                    <p className="cafe__number">442-714-09-79</p>
                    <p className="cafe__number">Pedido {numeroTiquet}</p>
                    <p className="invoice__cliente">Cliente {nombreCliente}</p>
                    <p className="invoice__cliente">Pedido {tipoPedido}</p>
                    <p className="invoice__cliente">Hecho {hacerPedido}</p>
                    <p className="cafe__number">
                        {fechayHora}
                    </p>
                </div>
            </div>*/}
      </>
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

  const Pie = ({
    observaciones,
    tipoPago,
    total,
    IVA,
    dineroIngresado,
    domicilio,
    costoEnvio,
  }) => {
    return (
      <div className="subtotal">
        <hr />
        <Row>
          <Col>
            <p className="observaciones__tiquet">
              Observaciones: {observaciones}
            </p>
            <p className="observaciones__tiquet">
              Dirección de entrega: {domicilio}
            </p>
          </Col>
          <Col>
            <div className="subtotal__cambio">
              Pago realizado con {tipoPago}
            </div>

            <div className="subtotal__IVA"></div>

            <div className="subtotal__price">
              Subtotal ${""}
              {new Intl.NumberFormat("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(total)}{" "}
              MXN
            </div>

            {tipoPago === "Efectivo" && IVA === "0.16" && (
              <>
                <div className="subtotal__IVA">
                  IVA ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>

                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Efectivo" && IVA === "0" && (
              <>
                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(total) ? parseFloat(total) : "0")}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Tarjeta" && IVA === "0.16" && (
              <>
                <div className="subtotal__IVA">
                  IVA ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>

                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Tarjeta" && IVA === "0" && (
              <>
                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(total) ? parseFloat(total) : "0")}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Transferencia" && IVA === "0.16" && (
              <>
                <div className="subtotal__total">
                  IVA ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>
                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      ? parseFloat(total) + parseFloat(total) * parseFloat(IVA)
                      : "0"
                  )}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Transferencia" && IVA === "0" && (
              <>
                <div className="subtotal__total">
                  Total ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(total) ? parseFloat(total) : "0")}{" "}
                  MXN
                </div>
              </>
            )}

            {tipoPago === "Efectivo" && (
              <>
                <div className="subtotal__cambio">
                  Efectivo ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(dineroIngresado)
                      ? parseFloat(dineroIngresado)
                      : "0"
                  )}{" "}
                  MXN
                </div>
                <div className="subtotal__cambio">
                  Cambio ${""}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    parseFloat(dineroIngresado) -
                      (parseFloat(total) + parseFloat(total) * parseFloat(IVA))
                      ? parseFloat(dineroIngresado) -
                          (parseFloat(total) +
                            parseFloat(total) * parseFloat(IVA))
                      : "0"
                  )}{" "}
                  MXN
                </div>
              </>
            )}
          </Col>
        </Row>
        <hr />
      </div>
    );
  };

  const Opciones = ({ icon }) => {
    return (
      <div className="ticket__actions">
        <Button title="Registrar venta" onClick={() => handleRegistraVenta()}>
          ✅
        </Button>

        {/*<Button title="Imprimir ticket único" onClick={() => handlePrint()}>📄</Button>*/}

        {/*<Button title="Imprimir doble ticket" onClick={() => handlePrintDouble()}>2️⃣</Button>*/}

        <Button title="Limpiar el ticket" onClick={() => handleEmptyTicket()}>
          🗑️
        </Button>

        {/*<Button title="Aplicar IVA" onClick={() => handleIVAApply()}>🧾</Button>*/}

        {/*<Button title="Cancelar IVA" onClick={() => handleIVACancel()}>🚫️</Button>*/}

        <Button
          title="Añadir detalles del pedido"
          onClick={() =>
            datosExtraVenta(
              <DatosExtraVenta
                setTipoPago={setTipoPago}
                setDineroIngresado={setDineroIngresado}
                setTipoPedido={setTipoPedido}
                setHacerPedido={setHacerPedido}
                setNombreCliente={setNombreCliente}
                setObservaciones={setObservaciones}
                setDomicilio={setDomicilio}
                setShowModal={setShowModal}
              />
            )
          }
        >
          <FontAwesomeIcon icon={icon} />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div id="ticketGenerado" className="ticket">
        <div className="ticket__information">
          {/**/}
          <Encabezado
            logo={logoTiquetGris}
            numeroTiquet={numeroTiquet}
            nombreCliente={nombreCliente}
            tipoPedido={tipoPedido}
            hacerPedido={hacerPedido}
            fechayHora={fechayHora}
          />

          {/**/}
          <Cuerpo products={products} onClick={handleDeleteProduct} />

          {/**/}
          <Pie
            observaciones={observaciones}
            domicilio={domicilio}
            tipoPago={tipoPago}
            costoEnvio={costoEnvio}
            total={total}
            IVA={IVA}
            dineroIngresado={dineroIngresado}
          />
        </div>
        <Opciones icon={faCircleInfo} />
      </div>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default Tiquet;
