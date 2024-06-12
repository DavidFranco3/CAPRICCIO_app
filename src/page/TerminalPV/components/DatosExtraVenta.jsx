import { useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "../../../scss/styles.scss";
import { toast } from "react-toastify";
import { ocuparDesocuparMesas } from "../../../api/mesas";

function DatosExtraVenta(props) {

  console.log(props);

  const {
    setShowModal,
  } = props;

  // MANEJAR EL DESCUENTO DE MANERA ADECUADA
  const [tipoDescuento, setTipoDescuento] = useState("Porcentaje");
  const [descuento, setDescuento] = useState(0);
  const [descuentoCalculado, setDescuentoCalculado] = useState(0);
  const [subtotal, setSubtotal] = useState(props.formData.subtotal);
  const [total, setTotal] = useState(subtotal);
  const [cambio, setCambio] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);

  const [iva, setIva] = useState(false);

  const [fechayHora, setFechayHora] = useState("");
  const [fechayHoraSinFormato, setFechayHoraSinFormato] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const adjustedDate = dayjs(hoy).utc().utcOffset(-360).format(); // Ajusta la hora a CST (UTC -6)

    setFechayHora(dayjs(adjustedDate).locale("es").format("dddd, LL hh:mm A"));
    setFechayHoraSinFormato(adjustedDate);
  }, []);

  // FORM DATA
  const [formData, setFormData] = useState(
    {
      infoVenta: props.formData,
      infoMetodosPago: {
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
      }
  }
  );

  console.log(formData);

  // const cargarInfoPedido = (newHacerPedido, newTipoPedido) => {
  //   setFormData({
  //     ...formData,
  //     infoVenta: {
  //       ...formData.infoVenta,
  //       tipoPedido:  newTipoPedido,
  //       hacerPedido: newHacerPedido,
  //     }
  //   })
  // }

  const calcularTotal = (tipoDescuento, descuento, subtotal, ivaValue) => {
    let descuentoAplicado = 0;
    if (tipoDescuento === "Porcentaje") {
      descuentoAplicado = subtotal * (descuento / 100);
    } else {
      descuentoAplicado = parseFloat(descuento);
    }
    setDescuentoCalculado(descuentoAplicado);
    formData.infoVenta.iva = (subtotal + descuentoAplicado) * ivaValue;
    const totalCalculado = subtotal - descuentoAplicado + formData.infoVenta.iva;
    setTotal(totalCalculado);
    setFormData({
      ...formData,
      infoVenta: {
        ...formData.infoVenta,
        total: totalCalculado,
      },
    });
  };

  useEffect(() => {
    calcularTotal(tipoDescuento, descuento, subtotal, iva ? 0.16 : 0);
  }, [subtotal, descuento, tipoDescuento, iva]);

  const handleDescuentoChange = useCallback((e) => {
    const newDescuento = parseFloat(e.target.value) || 0;
    setDescuento(newDescuento);
    calcularTotal(tipoDescuento, newDescuento, subtotal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        descuento: tipoDescuento === "Porcentaje" ? (newDescuento / 100) * subtotal : newDescuento,
      },
    }));
  }, [tipoDescuento, subtotal]);

  const handleTipoDescuentoChange = useCallback((e) => {
    const newTipoDescuento = e.target.value;
    setTipoDescuento(newTipoDescuento);
    calcularTotal(newTipoDescuento, descuento, subtotal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        tipoDescuento: newTipoDescuento,
      },
    }));
  }, [descuento, subtotal]);

  const handleIvaChange = useCallback((e) => {
    const isIvaEnabled = e.target.value === "true";
    const ivaValue = isIvaEnabled ? 0.16 : 0;
  
    calcularTotal(tipoDescuento, descuento, subtotal, ivaValue);
  
    setIva(isIvaEnabled);
  }, [subtotal, descuentoCalculado, tipoDescuento, descuento]);

  const handleInfoMetodosPagoChange = useCallback((e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;
  
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: parsedValue,
    }));
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoMetodosPago: {
        ...prevFormData.infoMetodosPago,
        [name]: parsedValue,
      },
    }));
  }, []);
  
  // Estado local para manejar el valor de los campos de entrada
  const [inputValues, setInputValues] = useState({
    cantidadPagoEfectivo: formData.infoMetodosPago.cantidadPagoEfectivo,
    cantidadPagoTarjeta: formData.infoMetodosPago.cantidadPagoTarjeta,
    cantidadPagoTransfer: formData.infoMetodosPago.cantidadPagoTransfer,
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoMetodosPago: {
        ...prevFormData.infoMetodosPago,
        cantidadPagoEfectivo: inputValues.cantidadPagoEfectivo,
        cantidadPagoTarjeta: inputValues.cantidadPagoTarjeta,
        cantidadPagoTransfer: inputValues.cantidadPagoTransfer,
      },
      infoVenta: {
        ...prevFormData.infoVenta,

      }
    }));
  }, [inputValues]);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => {
      const updatedMetodosPago = {
        ...prevFormData.infoMetodosPago,
        [name]: checked,
        [name.replace('estadoPago', 'cantidadPago')]: checked ? prevFormData.infoMetodosPago[name.replace('estadoPago', 'cantidadPago')] : 0,
      };
  
      return {
        ...prevFormData,
        infoMetodosPago: updatedMetodosPago,
      };
    });
  
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name.replace('estadoPago', 'cantidadPago')]: checked ? prevInputValues[name.replace('estadoPago', 'cantidadPago')] : 0,
    }));
  }, []);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    const efectivoPagado = parseFloat(formData.infoMetodosPago.cantidadPagoEfectivo) || 0;
    if (efectivoPagado > total) {
      const nuevoCambio = efectivoPagado - total;
      setCambio(nuevoCambio);
      setFormData((prevFormData) => ({
        ...prevFormData,
        infoVenta: {
          ...prevFormData.infoVenta,
          cambio: nuevoCambio,
        },
      }));
    } else {
      setCambio(0);
      setFormData((prevFormData) => ({
        ...prevFormData,
        infoVenta: {
          ...prevFormData.infoVenta,
          cambio: 0,
        },
      }));
    }

    const totalPagado = 
      (parseFloat(formData.infoMetodosPago.cantidadPagoEfectivo) || 0) +
      (parseFloat(formData.infoMetodosPago.cantidadPagoTarjeta) || 0) +
      (parseFloat(formData.infoMetodosPago.cantidadPagoTransfer) || 0);
    
    setTotalPagado(totalPagado);

  }, [formData.infoMetodosPago, total]);



  // Para cancelar el registro
  const cancelarRegistro = () => {
    setShowModal(false);
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
      formattedDate
    }
  }

  const desocuparMesa = async () => {
    try {
      const dataTemp = {
        estado: "libre",
        idTicket: "",
      };
      ocuparDesocuparMesas(props.mesaId, dataTemp).then((response) => {
        const { data } = response;
        toast.success(data.mensaje);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cambiarOrdenAVenta = () => {
    
  }

  const onSubmit = (e) => {

    const fechas = calcularFecha();
    formData.infoVenta.total = total;
    
    if ((formData.infoMetodosPago.estadoPagoEfectivo && formData.infoMetodosPago.estadoPagoTarjeta) ||
    (formData.infoMetodosPago.estadoPagoEfectivo && formData.infoMetodosPago.estadoPagoTransfer) || 
    (formData.infoMetodosPago.estadoPagoTransfer && formData.infoMetodosPago.estadoPagoTarjeta)) {
      formData.infoVenta.tipoPago = "Combinado";
    } else if (formData.infoMetodosPago.estadoPagoEfectivo) {
      formData.infoVenta.tipoPago = "Efectivo";
    } else if (formData.infoMetodosPago.estadoPagoTarjeta) {
      formData.infoVenta.tipoPago = "TDC";
    } else if (formData.infoMetodosPago.estadoPagoTransfer) {
      formData.infoVenta.tipoPago = "Transferencia";
    }

    console.log(formData.infoVenta);

    try {
      const dataTemp = {
        numeroTiquet: formData.infoVenta.numeroTiquet,
        cliente: formData.infoVenta.cliente,
        tipo: props.mesaClick ? "Orden de mesa" : "Pedido de mostrador",
        mesa: formData.infoVenta.mesa,
        usuario: formData.infoVenta.usuario,
        estado: props.hacerPedido === "Rappi" && props.hacerPedido === "Uber" ? "PREP" : "COBR",
        detalles: formData.infoVenta.detalles,
        observaciones: formData.infoVenta.observaciones,
        tipoPago: formData.infoVenta.tipoPago,
        efectivo: formData.infoMetodosPago.cantidadPagoEfectivo,
        cambio: formData.infoVenta.cambio,
        subtotal: formData.infoVenta.subtotal,
        tipoPedido: formData.infoVenta.tipoPedido,
        hacerPedido: formData.infoVenta.hacerPedido,
        tipoDescuento: formData.infoVenta.tipoDescuento,
        descuento: formData.infoVenta.descuento,
        pagado: props.hacerPedido === "Rappi" && props.hacerPedido === "Uber" ? false : true,
        total: formData.infoVenta.total,
        iva: formData.infoVenta.iva,
        atendido: formData.infoVenta.atendido,
        comision: formData.infoVenta.comision,
        año: formData.infoVenta.año,
        mes: formData.infoVenta.mes,
        semana: formData.infoVenta.semana,
        fecha: formData.infoVenta.fecha,
        metodosPago: formData.infoVenta.metodosPago,
      }
      console.log(dataTemp);
    } catch (error) {
      
    }

  }

  // RETORNO DE INFO
  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className="metodoDePago">
          <Row className="mx-1 mb-2 ">
            <Col className=" border rounded mx-1">
              <Row>
                <Form.Group controlId="formGridNombre">
                  <Form.Label>Nombre del cliente</Form.Label>
                  <Form.Control
                    type="text"
                    name="cliente"
                    placeholder="Escribe el nombre del cliente"
                    value={formData.infoVenta.cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        infoVenta: {
                          ...formData.infoVenta,
                          cliente: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-around">
                <Form.Label>Descuento</Form.Label>
                <Row>
                  <Col className="d-flex align-items-center justify-content-around">
                    <Form.Check
                      type="radio"
                      label="00"
                      name="tipoDescuento"
                      value="cantidad"
                      checked={tipoDescuento === 'cantidad'}
                      onChange={handleTipoDescuentoChange}
                      disabled={formData.infoVenta.hacerPedido === 'Uber' && formData.infoVenta.hacerPedido === 'Rappi'}
                    />
                    <Form.Check
                      type="radio"
                      label="%"
                      name="tipoDescuento"
                      value="Porcentaje"
                      checked={tipoDescuento === 'Porcentaje'}
                      onChange={handleTipoDescuentoChange}
                    />  
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="descuento"
                      value={descuento}
                      onChange={handleDescuentoChange}
                      placeholder="00 || %"
                    />
                  </Col>
                </Row>
              </Row>
              <Row>
                <Col>
                  <Form.Label>IVA</Form.Label>
                  <Row>
                    <Col className="d-flex align-items-center justify-content-evenly">
                      <Form.Check
                        type="radio"
                        label="Si"
                        name="iva"
                        value={true}
                        checked={iva === true}
                        onChange={handleIvaChange}
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        name="iva"
                        value={false}
                        checked={iva === false}
                        onChange={handleIvaChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col className="border rounded">
              <Row>
                <Col>
                  <Form.Group controlId="formGridPedido">
                    <Form.Label>Pedido</Form.Label>
                    <Form.Control
                      as="select"
                      name="hacerPedido"
                      value={formData.infoVenta.hacerPedido}
                      onChange={handleSelectChange}
                      disabled={props.mesaClick}
                    >
                      <option>Elige una opción</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Llamada">Llamada</option>
                      {props.mesaClick && <option value="Presencial">Presencial</option>}
                      <option value="Rappi">Rappi</option>
                      <option value="Uber">Uber</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formGridTipoPedido">
                    <Form.Label>Tipo de Pedido</Form.Label>
                    <Form.Control
                      as="select"
                      name="tipoPedido"
                      value={formData.infoVenta.tipoPedido}
                      onChange={handleSelectChange}
                      disabled={props.mesaClick}
                    >
                      <option>Elige una opción</option>
                      {props.mesaClick && (<option value="Para comer aquí">Para comer aquí</option>)}
                      <option value="Para llevar">Para llevar</option>
                      <option value="A domicilio">A domicilio</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <label className="form-label">
                Desglose
              </label>
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th className="table-active">Subtotal</th>
                    <td>
                      ${""}{new Intl.NumberFormat("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        subtotal
                      )}{" "} MXN
                    </td>
                  </tr>
                  <tr>
                    <th className="table-active">Descuento</th>
                    <td>
                      ${new Intl.NumberFormat("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        descuentoCalculado
                      )}{" "} MXN 
                    </td>
                  </tr>
                  <tr>
                    <th className="table-active">IVA</th>
                    <td>
                      ${new Intl.NumberFormat("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        formData.infoVenta.iva
                      )}{" "} MXN 
                    </td>
                  </tr>
                  <tr>
                    <th className="table-active">Total</th>
                    <td>
                      ${new Intl.NumberFormat("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        total
                      )}{" "} MXN 
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          
          {formData.infoVenta.hacerPedido !== 'Rappi' && formData.infoVenta.hacerPedido !== 'Uber' && (
            <Row className="mx-1 p-1 border rounded">
              <Col className="">
                <h3>
                  Métodos de pago y pago
                </h3>
                <table className="table table-stripped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Método de pago</th>
                      <th>Cantidad pagada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Efectivo"
                          name="estadoPagoEfectivo"
                          checked={formData.infoMetodosPago.estadoPagoEfectivo}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="cantidadPagoEfectivo"
                          value={inputValues.cantidadPagoEfectivo}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.estadoPagoEfectivo}
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Tarjeta"
                          name="estadoPagoTarjeta"
                          checked={formData.infoMetodosPago.estadoPagoTarjeta}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="cantidadPagoTarjeta"
                          value={inputValues.cantidadPagoTarjeta}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.estadoPagoTarjeta}
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Transferencia"
                          name="estadoPagoTransfer"
                          checked={formData.infoMetodosPago.estadoPagoTransfer}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="cantidadPagoTransfer"
                          value={inputValues.cantidadPagoTransfer}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.estadoPagoTransfer}
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Total pagado:</td>
                      <td>
                        {new Intl.NumberFormat("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalPagado)}{" "}MXN
                      </td>
                    </tr>
                    <tr>
                      <td>Cambio:</td>
                      <td>
                        {new Intl.NumberFormat("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(cambio)}{" "}MXN
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          )}


          {formData.infoVenta.hacerPedido !== 'Presencial' && (
            <Row className="mt-2 mx-1 p-1 border rounded">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as='textarea'
                name="observaciones"
                defaultValue={formData.infoVenta.observaciones}
                placeholder={"Ingresa datos relevantes para la compra como domicilio o extras de algún aderezo"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    infoVenta: {
                      ...formData.infoVenta,
                      observaciones: e.target.value,
                    },
                  })
                }
              />
            </Row>
          )}
          

        </div>
        

      </Form>
      
      <div className="mt-3 d-flex justify-content-evenly">
        <button className="btn btn-success" onClick={onSubmit}>
          <i className="fa fa-coins me-2"></i>
          Cobrar
        </button>
        <button className="btn btn-warning" onClick={onSubmit}>
          <i className="fa fa-hourglass-half me-2"></i>
          Cobrar después
        </button>
        <button className="btn btn-danger" onClick={cancelarRegistro}>
          <i className="fa fa-ban me-2"></i>
          Cancelar
        </button>
      </div>
    </>
  );
}

export default DatosExtraVenta;
