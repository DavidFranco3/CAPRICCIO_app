import { useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "../../../scss/styles.scss";
import { toast } from "react-toastify";
import { ocuparDesocuparMesas } from "../../../api/mesas";
import { cobrarTicket, listarVentas, obtenerVentas, registraVentas } from "../../../api/ventas";
import { LogsInformativos } from "../../../components/Logs/LogsSistema/LogsSistema";

function DatosExtraVenta(props) {
  const { setShowModal, isVenta, comision } = props;

  console.log(isVenta);

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

  const verificarNumeroTiquetUnico = (data, numeroTiquet) => {
    return data.some((venta) => venta.numeroTiquet === numeroTiquet);
  };

  useEffect(() => {
    const hoy = new Date();
    const adjustedDate = dayjs(hoy).utc().utcOffset(-360).format(); // Ajusta la hora a CST (UTC -6)

    setFechayHora(dayjs(adjustedDate).locale("es").format("dddd, LL hh:mm A"));
    setFechayHoraSinFormato(adjustedDate);
  }, []);

  // FORM DATA
  const [formData, setFormData] = useState({
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
    },
  });

  // Estado local para manejar el valor de los campos de entrada
  const [inputValues, setInputValues] = useState({
    cantidadPagoEfectivo: formData.infoMetodosPago.efectivo.cantidad,
    cantidadPagoTdc: formData.infoMetodosPago.tdc.cantidad,
    cantidadPagoTransfer: formData.infoMetodosPago.transfer.cantidad,
  });

  const calcularTotal = (tipoDescuento, descuento, subtotal, ivaValue,) => {
    let descuentoAplicado = 0;
    if (tipoDescuento === "Porcentaje") {
      descuentoAplicado = subtotal * (descuento / 100);
    } else {
      descuentoAplicado = parseFloat(descuento);
    }
    setDescuentoCalculado(descuentoAplicado);
    formData.infoVenta.iva = (subtotal - descuentoAplicado) * ivaValue;
    let totalCalculado = subtotal - descuentoAplicado + formData.infoVenta.iva;
  
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
    calcularTotal(tipoDescuento, newDescuento, subtotal, iva, formData.infoMetodosPago.tdc.estado);
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoVenta: {
        ...prevFormData.infoVenta,
        descuento: tipoDescuento === "Porcentaje" ? (newDescuento / 100) * subtotal : newDescuento,
      },
    }));
  }, [tipoDescuento, subtotal, iva]);

  const handleTipoDescuentoChange = useCallback((e) => {
    const newTipoDescuento = e.target.value;
    setTipoDescuento(newTipoDescuento);
    calcularTotal(newTipoDescuento, descuento, subtotal, iva);
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
  
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        infoMetodosPago: {
          ...prevFormData.infoMetodosPago,
          [name.split('cantidadPago')[1].toLowerCase()]: {
            ...prevFormData.infoMetodosPago[name.split('cantidadPago')[1].toLowerCase()],
            cantidad: parsedValue,
          },
        },
      };
      return updatedFormData;
    });
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      infoMetodosPago: {
        ...prevFormData.infoMetodosPago,
        efectivo: {
          ...prevFormData.infoMetodosPago.efectivo,
          cantidad: inputValues.cantidadPagoEfectivo,
        },
        tdc: {
          ...prevFormData.infoMetodosPago.tdc,
          cantidad: inputValues.cantidadPagoTdc,
        },
        transfer: {
          ...prevFormData.infoMetodosPago.transfer,
          cantidad: inputValues.cantidadPagoTransfer,
        },
      },
    }));
  }, [inputValues]);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    const metodoPagoKey = name.split('estadoPago')[1].toLowerCase();
  
    setFormData((prevFormData) => {
      const updatedMetodosPago = {
        ...prevFormData.infoMetodosPago,
        [metodoPagoKey]: {
          ...prevFormData.infoMetodosPago[metodoPagoKey],
          estado: checked,
          cantidad: checked ? prevFormData.infoMetodosPago[metodoPagoKey].cantidad : 0,
        },
      };
  
      return {
        ...prevFormData,
        infoMetodosPago: updatedMetodosPago,
      };
    });
  
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`cantidadPago${metodoPagoKey.charAt(0).toUpperCase() + metodoPagoKey.slice(1)}`]: checked ? prevInputValues[`cantidadPago${metodoPagoKey.charAt(0).toUpperCase() + metodoPagoKey.slice(1)}`] : 0,
    }));
  
  }, []);
  
  useEffect(() => {
    const efectivoPagado = parseFloat(formData.infoMetodosPago.efectivo.cantidad) || 0;
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
      (parseFloat(formData.infoMetodosPago.efectivo.cantidad) || 0) +
      (parseFloat(formData.infoMetodosPago.tdc.cantidad) || 0) +
      (parseFloat(formData.infoMetodosPago.transfer.cantidad) || 0);
  
    setTotalPagado(totalPagado);
  
  }, [formData.infoMetodosPago, total]);

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

  // Para cancelar el registro
  const cancelarRegistro = () => {
    try {
      setShowModal(false);
    } catch (error) {
      console.error("Error al cerrar el modal principal:", error);
      try {
        props.setShow(false);
      } catch (error) {
        console.error("Error al cerrar el modal secundario:", error);
        // Mostrar un mensaje de error general aquí
        alert("Error al cerrar los modales");
      }
    }
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

  const desocuparMesa = async () => {
    try {
      const dataTemp = {
        estado: "libre",
        idTicket: "",
      };
      await ocuparDesocuparMesas(props.mesaId, dataTemp).then((response) => {
        const { data } = response;
        toast.success(data.mensaje);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const cambiarOrdenAVenta = async () => {
    // Implementa la lógica para cambiar la orden a orden cobrada
    const fecha = calcularFecha();
    formData.infoVenta.total = total;

    if ((formData.infoMetodosPago.efectivo.estado && formData.infoMetodosPago.tdc.estado) ||
      (formData.infoMetodosPago.efectivo.estado && formData.infoMetodosPago.transfer.estado) ||
      (formData.infoMetodosPago.transfer.estado && formData.infoMetodosPago.tdc.estado)) {
      formData.infoVenta.tipoPago = "Combinado";
    } else if (formData.infoMetodosPago.efectivo.estado) {
      formData.infoVenta.tipoPago = "Efectivo";
    } else if (formData.infoMetodosPago.tdc.estado) {
      formData.infoVenta.tipoPago = "TDC";
    } else if (formData.infoMetodosPago.transfer.estado) {
      formData.infoVenta.tipoPago = "Transferencia";
    }

    console.log(formData.infoVenta);

    if (totalPagado - cambio < total) {
      toast.warning("Por favor ingresa la cantidad mínima del total");
    } else {
      try {
        const dataTemp = {
          numeroTiquet: formData.infoVenta.numeroTiquet,
          cliente: formData.infoVenta.cliente,
          tipo: props.mesaClick ? "Orden de mesa" : "Pedido de mostrador",
          mesa: formData.infoVenta.mesa,
          usuario: formData.infoVenta.usuario,
          estado: "COBR",
          detalles: formData.infoVenta.detalles,
          observaciones: formData.infoVenta.observaciones,
          tipoPago: formData.infoVenta.tipoPago,
          efectivo: formData.infoMetodosPago.efectivo.cantidad,
          cambio: formData.infoVenta.cambio,
          productos: formData.infoVenta.productos,
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
          año: formData.infoVenta.año || fecha.añoVenta,
          mes: formData.infoVenta.mes || fecha.mes,
          semana: formData.infoVenta.semana || fecha.weekNumber,
          fecha: formData.infoVenta.fecha || fecha.formattedDate,
          metodosPago: formData.infoMetodosPago,
        };
        console.log(dataTemp);

        if (!isVenta) {
          await registraVentas(dataTemp).then( async (response) => {
            const { data } = response;
            LogsInformativos(
              "Orden creada y cobrada " + dataTemp.numeroTiquet + " en la  mesa " + props.numMesa,
              data.datos
            );
            await desocuparMesa();
            try {
              setShowModal(false);
            } catch (error) {
              console.error("Error al cerrar el modal principal:", error);
              try {
                props.setShow(false);
              } catch (error) {
                console.error("Error al cerrar el modal secundario:", error);
                // Mostrar un mensaje de error general aquí
                alert("Error al cerrar los modales");
              }
            }
            toast.success("Se ha creado y cobrado la orden en mesa con éxito");
          });
        } else {
          await cobrarTicket(formData.infoVenta.numeroTiquet, dataTemp).then( async (response) => {
            const { data } = response;
            LogsInformativos(
              "Se ha cobrado la orden " + formData.infoVenta.numeroTiquet + " de la  mesa " + formData.infoVenta.mesa,
              data.datos
            );
            await desocuparMesa();
            try {
              setShowModal(false);
            } catch (error) {
              console.error("Error al cerrar el modal principal:", error);
              try {
                props.setShow(false);
              } catch (error) {
                console.error("Error al cerrar el modal secundario:", error);
                // Mostrar un mensaje de error general aquí
                alert("Error al cerrar los modales");
              }
            }
            toast.success(`Se ha cobrado la orden de la mesa ${dataTemp.mesa} con éxito`);
          });
        }
      } catch (error) {
        console.error("Error al enviar los datos:", error);
      }
    }
  };

  const cobrarDespues = async () => {
    const fecha = calcularFecha();
    formData.infoVenta.total = total;

    if ((formData.infoMetodosPago.efectivo.estado && formData.infoMetodosPago.tdc.estado) ||
      (formData.infoMetodosPago.efectivo.estado && formData.infoMetodosPago.transfer.estado) ||
      (formData.infoMetodosPago.transfer.estado && formData.infoMetodosPago.tdc.estado)) {
      formData.infoVenta.tipoPago = "Combinado";
    } else if (formData.infoMetodosPago.efectivo.estado) {
      formData.infoVenta.tipoPago = "Efectivo";
    } else if (formData.infoMetodosPago.tdc.estado) {
      formData.infoVenta.tipoPago = "TDC";
    } else if (formData.infoMetodosPago.transfer.estado) {
      formData.infoVenta.tipoPago = "Transferencia";
    } else {
      formData.infoVenta.tipoPago = "";
    }

    console.log(formData.infoVenta);

    try {
      const dataTemp = {
        numeroTiquet: formData.infoVenta.numeroTiquet,
        cliente: formData.infoVenta.cliente,
        tipo: props.mesaClick ? "Orden de mesa" : "Pedido de mostrador",
        mesa: formData.infoVenta.mesa,
        usuario: formData.infoVenta.usuario,
        estado: "PP",
        detalles: formData.infoVenta.detalles,
        observaciones: formData.infoVenta.observaciones,
        tipoPago: formData.infoVenta.tipoPago,
        efectivo: formData.infoMetodosPago.efectivo.cantidad,
        cambio: formData.infoVenta.cambio,
        subtotal: formData.infoVenta.subtotal,
        productos: formData.infoVenta.productos,
        tipoPedido: formData.infoVenta.tipoPedido,
        hacerPedido: formData.infoVenta.hacerPedido,
        tipoDescuento: formData.infoVenta.tipoDescuento,
        descuento: formData.infoVenta.descuento,
        pagado: props.hacerPedido === false,
        total: formData.infoVenta.total,
        iva: formData.infoVenta.iva,
        atendido: formData.infoVenta.atendido,
        comision: formData.infoVenta.comision,
        año: formData.infoVenta.año || fecha.añoVenta,
        mes: formData.infoVenta.mes || fecha.mes,
        semana: formData.infoVenta.semana || fecha.weekNumber,
        fecha: formData.infoVenta.fecha || fecha.formattedDate,
        metodosPago: formData.infoMetodosPago,
      };
      console.log(dataTemp);

      if (!isVenta) {
        await registraVentas(dataTemp).then( async (response) => {
          const { data } = response;
          LogsInformativos(
            "Orden creada y puesta para cobrar después " + dataTemp.numeroTiquet,
            data.datos
          );
          try {
            setShowModal(false);
          } catch (error) {
            console.error("Error al cerrar el modal principal:", error);
            try {
              props.setShow(false);
            } catch (error) {
              console.error("Error al cerrar el modal secundario:", error);
              // Mostrar un mensaje de error general aquí
              alert("Error al cerrar los modales");
            }
          }
          toast.success("orden creada para pagar después");
        });
        
      } else {
        await cobrarTicket(formData.infoVenta.numeroTiquet, dataTemp).then( (response) => {
          const { data } = response;
          LogsInformativos(
            "Orden cambiada para cobrar después " + dataTemp.numeroTiquet + " en la  mesa " + props.numMesa,
            data.datos
          );
          try {
            setShowModal(false);
          } catch (error) {
            console.error("Error al cerrar el modal principal:", error);
            try {
              props.setShow(false);
            } catch (error) {
              console.error("Error al cerrar el modal secundario:", error);
              // Mostrar un mensaje de error general aquí
              alert("Error al cerrar los modales");
            }
          }
          toast.success("Lista la orden para pagar después");
        });
        
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <>
      <Form onSubmit={cobrarDespues}>
        <div className="metodoDePago">
          <Row className="mx-1 mb-2 ">
            <Col className="border rounded mx-1">
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
                      checked={tipoDescuento === "cantidad"}
                      onChange={handleTipoDescuentoChange}
                      disabled={formData.infoVenta.hacerPedido === "Uber" && formData.infoVenta.hacerPedido === "Rappi"}
                    />
                    <Form.Check
                      type="radio"
                      label="%"
                      name="tipoDescuento"
                      value="Porcentaje"
                      checked={tipoDescuento === "Porcentaje"}
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
                      <th colSpan={3}>Cantidad pagada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Efectivo"
                          name="estadoPagoEfectivo"
                          checked={formData.infoMetodosPago.efectivo.estado}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td colSpan={3}>
                        <Form.Control
                          type="text"
                          name="cantidadPagoEfectivo"
                          value={inputValues.cantidadPagoEfectivo}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.efectivo.estado}
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          label="Tarjeta"
                          name="estadoPagoTdc"
                          checked={formData.infoMetodosPago.tdc.estado}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          name="cantidadPagoTdc"
                          value={inputValues.cantidadPagoTdc}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.tdc.estado}
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
                          checked={formData.infoMetodosPago.transfer.estado}
                          onChange={handleCheckboxChange}
                        />
                      </td>
                      <td colSpan={3}>
                        <Form.Control
                          type="text"
                          name="cantidadPagoTransfer"
                          value={inputValues.cantidadPagoTransfer}
                          onChange={handleInfoMetodosPagoChange}
                          disabled={!formData.infoMetodosPago.transfer.estado}
                          min="0"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Total pagado:</td>
                      <td colSpan={3}>
                        {new Intl.NumberFormat("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totalPagado)}{" "}MXN
                      </td>
                    </tr>
                    <tr>
                      <td>Cambio:</td>
                      <td colSpan={3}>
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
        <button className="btn btn-success" onClick={cambiarOrdenAVenta}>
          <i className="fa fa-coins me-2"></i>
          Cobrar
        </button>
        <button className="btn btn-warning" onClick={cobrarDespues}>
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
