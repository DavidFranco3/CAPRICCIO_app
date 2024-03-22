import { useState, useEffect } from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Descuento from "../Descuento";

function DatosExtraVenta(props) {
  const {
    tipoDescuento,
    setTipoDescuento,
    dineroDescontado,
    setDineroDescontado,
    porcentajeDescontado,
    setPorcentajeDescontado,
    observaciones,
    mesa,
    dineroIngresado,
    tipoPago,
    tipoPedido,
    hacerPedido,
    nombreCliente,
    setMesa,
    setObservaciones,
    setDineroIngresado,
    setFormDatacantidadPagadaEfectivo,
    setFormDatacantidadPagadaTarjeta,
    setFormDatacantidadPagadaTransferencia,
    setTipoPago,
    setTipoPedido,
    setHacerPedido,
    setNombreCliente,

    setShowModal,
  } = props;

  const [total, setTotal] = useState(props.total);

  console.log(total)

  const initialState = {
    tipoPagoEfectivo: false,
    cantidadPagadaEfectivo: "",
    tipoPagoTarjeta: false,
    cantidadPagadaTarjeta: "",
    tipoPagoTransferencia: false,
    cantidadPagadaTransferencia: "",
    dinero: "",
  };

  const [formDatapagos, setFormDatapagos] = useState(initialState);
  //console.log('formas',formDatapagos);
  const [totalPagoValido, setTotalPagoValido] = useState(true);
  const [formData2, setFormData2] = useState(initialFormValue);

  const [formData, setFormData] = useState({
    nombre: nombreCliente,
    hacerPedido: hacerPedido,
    tipoPedido: tipoPedido,
    tipoPago: tipoPago,
    dinero: dineroIngresado,
    mesa: mesa === "no aplica" ? "" : mesa,
    observaciones: observaciones,
    ...formDatapagos, // Agregamos los datos de pagos
    descuento: false,
  });

  useEffect(() => {
    const sum =
      (parseFloat(formData.cantidadPagadaEfectivo) || 0) +
      (parseFloat(formData.cantidadPagadaTarjeta) || 0) +
      (parseFloat(formData.cantidadPagadaTransferencia) || 0);
    setTotalPagoValido(sum === parseFloat(total));
  }, [formData, total]);

  useEffect(() => {
    setTotal(formData2.tipoDescuento == "Moneda" ? props.total - formData2.dineroDescontado : formData2.tipoDescuento == "Porcentaje" ? props.total - (props.total * (formData2.porcentajeDescontado / 100)) : props.total )
  }, [formData2]);

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormDatapagos({
      ...formDatapagos,
      [name]: checked,
      [name.startsWith("tipoPago")
        ? name.replace("tipoPago", "cantidadPagada")
        : ""]: checked
          ? formData[name.replace("tipoPago", "cantidadPagada")]
          : "",
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormDatapagos({
      ...formDatapagos,
      [name]: value,
    });
  };

  const handleClearRow = (fieldName, checkboxName) => {
    setFormData({
      ...formData,
      [fieldName]: "",
      [checkboxName]: false,
    });
  };
  const handleClearDiscount = () => {
    setFormData({
      ...formData,
      descuento: false, // Establece el estado de descuento como false para desmarcar el checkbox
    });
  };

  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    const selectedPayments = [
      formData.tipoPagoEfectivo,
      formData.tipoPagoTarjeta,
      formData.tipoPagoTransferencia,
    ].filter((payment) => payment);

    const isParaLlevar =
      formData.tipoPedido === "para llevar" ||
      formData.tipoPedido === "recoger en tienda";
    const isParaComerAqui = formData.tipoPedido === "para comer aquí";
    const isTipoPagoEmpty =
      (isParaLlevar ||
        formData.hacerPedido === "por Rappi" ||
        formData.hacerPedido === "por Uber") &&
      !formData.tipoPago;
    const isDineroEmpty = formData.tipoPago === "Efectivo" && !formData.dinero;
    const isMesaEmpty =
      isParaComerAqui &&
      formData.hacerPedido !== "por WhatsApp" &&
      formData.hacerPedido !== "por llamada" &&
      !formData.mesa;

    if (!formData.hacerPedido || !formData.nombre || !formData.observaciones) {
      toast.warning("Completa el formulario");
    } else if (isTipoPagoEmpty || isDineroEmpty || isMesaEmpty) {
      toast.warning("Completa todos los campos obligatorios");
    } else {
      setLoading(true);

      // Llamar a la función de envío del formulario y pasar los métodos de pago
      setShowModal(true);
      setFormDatapagos({
        tipoPagoEfectivo: formData.tipoPagoEfectivo,
        cantidadPagadaEfectivo: formData.cantidadPagadaEfectivo,
        tipoPagoTarjeta: formData.tipoPagoTarjeta,
        cantidadPagadaTarjeta: formData.cantidadPagadaTarjeta,
        tipoPagoTransferencia: formData.tipoPagoTransferencia,
        cantidadPagadaTransferencia: formData.cantidadPagadaTransferencia,
        dinero: formData.dinero,
      });
      setFormDatacantidadPagadaEfectivo(formData.cantidadPagadaEfectivo);
      setFormDatacantidadPagadaTarjeta(formData.cantidadPagadaTarjeta);
      setFormDatacantidadPagadaTransferencia(formData.cantidadPagadaTransferencia);
      setDineroIngresado(formData.dinero);
      setTipoPedido(
        formData.hacerPedido === "por WhatsApp" ||
          formData.hacerPedido === "por llamada"
          ? "para llevar"
          : formData.tipoPedido
      );
      setHacerPedido(formData.hacerPedido);
      setNombreCliente(formData.nombre);
      setMesa(
        formData.hacerPedido === "por WhatsApp" ||
          formData.hacerPedido === "por llamada" ||
          formData.hacerPedido === "por Rappi" ||
          formData.hacerPedido === "por Uber"
          ? "no aplica"
          : formData.mesa
      );
      setObservaciones(formData.observaciones);
      setTipoDescuento(formData2.tipoDescuento);
      setDineroDescontado(formData2.dineroDescontado);
      setPorcentajeDescontado(parseFloat(formData2.porcentajeDescontado) / 100);
      cancelarRegistro();
    }
    console.log(formData);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData2({ ...formData2, [e.target.name]: e.target.value });
  };

  // Para cancelar el registro
  const cancelarRegistro = () => {
    setShowModal(false);
  };

  return (
    <>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <div className="metodoDePago">
          <Row className="mb-3">
            <Col>
              <Form.Group as={Col} controlId="formGridNombre">
                <Form.Label>Nombre del cliente</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Escribe el nombre del cliente"
                  defaultValue={formData.nombre}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group as={Col} controlId="formGridEstado">
                <Form.Label>Hacer Pedido</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={formData.hacerPedido}
                  name="hacerPedido"
                >
                  <option>Elige una opción</option>
                  <option value="por WhatsApp">WhatsApp</option>
                  <option value="por llamada">Llamada</option>
                  <option value="de forma presencial">Presencial</option>
                  <option value="por Rappi">Rappi</option>
                  <option value="por Uber">Uber</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3"></Row>

          {formData.hacerPedido === "de forma presencial" ? (
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEstado">
                <Form.Label>Tipo Pedido</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={formData.tipoPedido}
                  name="tipoPedido"
                >
                  <option>Elige una opción</option>
                  <option value="para llevar">Para llevar</option>
                  <option value="para comer aquí">Para comer aquí</option>
                  {formData.hacerPedido !== "de forma presencial" &&
                    formData.hacerPedido !== "" && (
                      <>
                        <option value="recoger en tienda">
                          Recoger en tienda
                        </option>
                      </>
                    )}
                </Form.Control>
              </Form.Group>
            </Row>
          ) : null}
          {formData.tipoPedido === "para llevar" ||
            formData.tipoPedido === "recoger en tienda" ||
            formData.hacerPedido === "por Rappi" ||
            formData.hacerPedido === "por Uber" ? (
            <Row className="mb-3">
              <Form.Check
                type="checkbox"
                label="Descuento"
                name="descuento"
                checked={formData.descuento}
              />
              {formData.descuento && (
                <Button
                  variant="secondary"
                  onClick={() => handleClearDiscount()}
                >
                  Limpiar Descuento
                </Button>
              )}
              {formData.descuento &&
                <>
                  <div className="metodoDePago">
                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="formGridEstado">
                        <Form.Label>
                          Tipo de descuento
                        </Form.Label>

                        <Form.Control as="select"
                          defaultValue={formData2.tipoDescuento}
                          name="tipoDescuento"
                        >
                          <option>Elige una opción</option>
                          <option value="Porcentaje">Porcentaje</option>
                          <option value="Moneda">Moneda</option>
                        </Form.Control>
                      </Form.Group>
                    </Row>

                    {
                      (formData2.tipoDescuento == "Porcentaje") &&
                      (
                        <>
                          <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEstado">
                              <Form.Label>
                                Porcentaje
                              </Form.Label>

                              <Form.Control
                                placeholder='Porcentaje Descontado'
                                defaultValue={formData2.porcentajeDescontado}
                                name="porcentajeDescontado"
                              />
                            </Form.Group>
                          </Row>
                        </>
                      )
                    }

                    {
                      (formData2.tipoDescuento == "Moneda") &&
                      (
                        <>
                          <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEstado">
                              <Form.Label>
                                Dinero
                              </Form.Label>

                              <Form.Control
                                placeholder='Dinero Descontado'
                                defaultValue={formData2.dineroDescontado}
                                name="dineroDescontado"
                              />
                            </Form.Group>
                          </Row>
                        </>
                      )
                    }

                  </div>
                </>
              }
              <h1>Total pagar: ${""}
                {new Intl.NumberFormat("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  total
                  )}{" "}
                MXN</h1>
              <Form.Group as={Col} controlId="formGridEstado">
                <Form.Label>Métodos de pago y cantidad pagada</Form.Label>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Método de pago</th>
                      <th>Cantidad pagada</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Form.Check
                          type="checkbox"
                          label="Efectivo"
                          name="tipoPagoEfectivo"
                          checked={formData.tipoPagoEfectivo}
                          onChange={(e) => handleChangeCheckbox(e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={formData.cantidadPagadaEfectivo}
                          name="cantidadPagadaEfectivo"
                          disabled={!formData.tipoPagoEfectivo}
                          onChange={(e) => handleChangeInput(e)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleClearRow(
                              "cantidadPagadaEfectivo",
                              "tipoPagoEfectivo"
                            )
                          }
                        >
                          Limpiar
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="checkbox"
                          label="Tarjeta"
                          name="tipoPagoTarjeta"
                          checked={formData.tipoPagoTarjeta}
                          onChange={(e) => handleChangeCheckbox(e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={formData.cantidadPagadaTarjeta}
                          name="cantidadPagadaTarjeta"
                          disabled={!formData.tipoPagoTarjeta}
                          onChange={(e) => handleChangeInput(e)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleClearRow(
                              "cantidadPagadaTarjeta",
                              "tipoPagoTarjeta"
                            )
                          }
                        >
                          Limpiar
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Check
                          type="checkbox"
                          label="Transferencia"
                          name="tipoPagoTransferencia"
                          checked={formData.tipoPagoTransferencia}
                          onChange={(e) => handleChangeCheckbox(e)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={formData.cantidadPagadaTransferencia}
                          name="cantidadPagadaTransferencia"
                          disabled={!formData.tipoPagoTransferencia}
                          onChange={(e) => handleChangeInput(e)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleClearRow(
                              "cantidadPagadaTransferencia",
                              "tipoPagoTransferencia"
                            )
                          }
                        >
                          Limpiar
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total:</td>
                      <td colSpan="2">{total}</td>
                    </tr>
                    {!totalPagoValido && (
                      <tr>
                        <td colSpan="3" style={{ color: "red" }}>
                          La suma de los pagos excede el total
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </Table>

              </Form.Group>
            </Row>
          ) : null}

          {/**
                {formData.tipoPedido === "para llevar" || formData.tipoPedido === "recoger en tienda" || formData.hacerPedido === "por Rappi" || formData.hacerPedido === "por Uber" ? (
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Método de pago
                            </Form.Label>
                            <Form.Control as="select" defaultValue={formData.tipoPago} name="tipoPago">
                                <option>Elige una opción</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                ) : null}
                
                 */}
          {formData.tipoPago === "Efectivo" ? (
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridNombre">
                <Form.Label>¿Con cuánto dinero paga?</Form.Label>
                <Form.Control
                  type="number"
                  name="dinero"
                  placeholder="Escribe la cantidad recibida"
                  step="0.1"
                  min="0"
                  defaultValue={formData.dinero}
                />
              </Form.Group>
            </Row>
          ) : null}

          {formData.tipoPedido === "para comer aquí" &&
            formData.hacerPedido !== "por WhatsApp" &&
            formData.hacerPedido !== "por llamada" ? (
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridNombre">
                <Form.Label>Número de mesa</Form.Label>
                <Form.Control
                  type="number"
                  name="mesa"
                  placeholder="Escribe el número de la mesa"
                  defaultValue={formData.mesa}
                />
              </Form.Group>
            </Row>
          ) : null}

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridObsrevaciones">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observaciones"
                placeholder="Escribe los detalles ...."
                style={{ height: "100px" }}
                defaultValue={formData.observaciones}
              />
            </Form.Group>
          </Row>
        </div>

        <Form.Group as={Row} className="botonSubirProducto">
          <Col>
            <Button
              title="Agregar Observaciones"
              type="submit"
              variant="success"
              className="registrar"
              disabled={!totalPagoValido}
            >
              <FontAwesomeIcon icon={faSave} />{" "}
              {!loading ? "Aceptar" : <Spinner animation="border" />}
            </Button>
          </Col>
          <Col>
            <Button
              title="Cerrar ventana"
              variant="danger"
              className="cancelar"
              disabled={loading}
              onClick={cancelarRegistro}
            >
              <FontAwesomeIcon icon={faX} /> Cancelar
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
}

function initialFormValue(data) {
  return {
    tipoDescuento: "",
    dineroDescontado: "",
    porcentajeDescontado: ""
  };
}

export default DatosExtraVenta;
