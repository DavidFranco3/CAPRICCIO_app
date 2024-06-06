import { useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "../../../scss/styles.scss";

function DatosExtraVenta(props) {

  console.log(props);

  const {
    setShowModal,
  } = props;

  // MANEJAR EL DESCUENTO DE MANERA ADECUADA
  const [tipoDescuento, setTipoDescuento] = useState("porcentaje");
  const [descuento, setDescuento] = useState(0);
  const [descuentoCalculado, setDescuentoCalculado] = useState(0);
  const [subtotal, setSubtotal] = useState(props.total);
  const [total, setTotal] = useState(subtotal);
  const [cambio, setCambio] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);

  // FORM DATA
  const [formData, setFormData] = useState(
    {
      infoVenta: {
        numeroTiquet: props.numTicket,
        cliente: "",
        mesa: props.numMesa,
        usuario: props.usuario,
        productos: props.products,
        estado: props.estado,
        detalles: props.detalles,
        observaciones: "",
        tipoPago: "",
        efectivo: "",
        cambio: "",
        subtotal: props.total,
        tipoPedido: props.tipoPedido,
        hacerPedido: props.hacerPedido,
        tipoDescuento: "",
        descuento: "",
        pagado: "",
        total: "",
        iva: "",
        atendido: "",
        comision: "",
        agrupar: "",
        año: "",
        semana: "",
        fecha: "",
        metodosPago: [],
      },
      infoMetodosPago: {
        estadoPagoEfectivo: false,
        estadoPagoTarjeta: false,
        estadoPagoTransfer: false,
        cantidadPagoEfectivo: '',
        cantidadPagoTarjeta: '',
        cantidadPagoTransfer: '',
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

  const calcularTotal = (tipoDescuento, descuento, subtotal) => {
    let descuentoAplicado = 0;
    if (tipoDescuento === "porcentaje") {
      descuentoAplicado = subtotal * (descuento / 100);
    } else {
      descuentoAplicado = parseFloat(descuento);
    }
    setDescuentoCalculado(descuentoAplicado);
    const totalCalculado = subtotal - descuentoAplicado;
    setTotal(totalCalculado);
    setFormData({
      ...formData,
      infoVenta: {
        ...formData.infoVenta,
        total: totalCalculado,
      },
    });
  };

  const handleDescuentoChange = useCallback((e) => {
    const newDescuento = parseFloat(e.target.value) || 0;
    setDescuento(newDescuento);
    calcularTotal(tipoDescuento, newDescuento, subtotal);
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        descuento: newDescuento,
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

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleInfoVentaChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        [name]: value,
      },
    }));
  }, []);

  const handleIvaChange = useCallback((e) => {
    const { value } = e.target;
    const ivaValue = parseFloat(value);
    const ivaAmount = ivaValue * subtotal;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        iva: ivaAmount,
      },
    }));
  }, [subtotal, setFormData]);

  useEffect(() => {
    const totalWithIva = subtotal + formData.infoVenta.iva;
    setTotal(totalWithIva);
  }, [subtotal, formData.infoVenta.iva]);

  const handleInfoMetodosPagoChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoMetodosPago: {
        ...prevFormData.infoMetodosPago,
        [name]: value ? parseFloat(value) : '',
      },
    }));
  }, []);
  

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoMetodosPago: {
        ...prevFormData.infoMetodosPago,
        [name]: checked,
        [name.replace('estadoPago', 'cantidadPago')]: checked ? prevFormData.infoMetodosPago[name.replace('estadoPago', 'cantidadPago')] : 0,
      },
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
    }));
  }, [inputValues]);

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

  const onSubmit = (e) => {
    e.preventDefault();

    const dataTemp = formData.infoVenta;

    // if (dataTemp) {
      
    // }

    console.log(dataTemp);
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
                    />
                    <Form.Check
                      type="radio"
                      label="%"
                      name="tipoDescuento"
                      value="porcentaje"
                      checked={tipoDescuento === 'porcentaje'}
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
                        value={0.16}
                        checked={formData.infoVenta.iva === (0.16 * subtotal)}
                        onChange={handleIvaChange}
                      />
                      <Form.Check
                        type="radio"
                        label="No"
                        name="iva"
                        value={0}
                        checked={formData.infoVenta.iva === 0}
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        label= "Efectivo"
                        name="estadoPagoEfectivo"
                        value="true"
                        checked = {formData.infoMetodosPago.estadoPagoEfectivo}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="cantidadPagoEfectivo"
                        value={formData.infoMetodosPago.cantidadPagoEfectivo}
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
                        label= "Tarjeta"
                        name="estadoPagoTarjeta"
                        value="true"
                        checked = {formData.infoMetodosPago.estadoPagoTarjeta}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="cantidadPagoTarjeta"
                        defaultValue={formData.infoMetodosPago.cantidadPagoTarjeta}
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
                        label= "Transferencia"
                        name="estadoPagoTransfer"
                        value="true"
                        checked = {formData.infoMetodosPago.estadoPagoTransfer}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="cantidadPagoTransfer"
                        defaultValue={formData.infoMetodosPago.cantidadPagoTransfer}
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
                      }).format(formData.infoVenta.cambio)}{" "}MXN
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
          
          {formData.infoVenta.hacerPedido === 'Presencial' && (
            <Row className="mt-2 mx-1 p-1 border rounded">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as='textarea'
                name="observaciones"
                placeholder="Ingresa datos relevantes para la compra como domicilio o extras de algún aderezo"
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
        <button className="btn btn-danger" onClick={cancelarRegistro}>
          <i className="fa fa-ban me-2"></i>
          Cancelar
        </button>
      </div>
    </>
  );
}

export default DatosExtraVenta;
