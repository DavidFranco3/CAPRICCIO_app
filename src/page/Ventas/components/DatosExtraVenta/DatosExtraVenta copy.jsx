import { useState, useEffect } from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import Descuento from "../Descuento";

function DatosExtraVenta(props) {
  const {
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

  // MANEJAR EL DESCUENTO DE MANERA ADECUADA
  const [tipoDescuento, setTipoDescuento] = useState("porcentaje");
  const [descuento, setDescuento] = useState(0);
  const [descuentoCalculado, setDescuentoCalculado] = useState(0);
  const [subtotal, setSubtotal] = useState(props.total);
  const [total, setTotal] = useState(subtotal);

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
  };

  const handleDescuentoChange = (e) => {
    const newDescuento = parseFloat(e.target.value) || 0;
    setDescuento(newDescuento);
    calcularTotal(tipoDescuento, newDescuento, subtotal);
  };

  const handleTipoDescuentoChange = (e) => {
    const newTipoDescuento = e.target.value;
    setTipoDescuento(newTipoDescuento);
    calcularTotal(newTipoDescuento, descuento, subtotal);
  };


  // Para cancelar el registro
  const cancelarRegistro = () => {
    setShowModal(false);
  };

  if (tipoPedido === "Para comer aquí") {
    
    console.log(hacerPedido, tipoPedido);

    return (
      <>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <div className="metodoDePago">
          <Row className="mb-3 me-3">
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
            <Col >
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
            </Col>
          </Row>
          <Row className="mb-3 me-3">
            <Col>
              <h2>Subtotal: ${""}
                {new Intl.NumberFormat("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  subtotal
                )}{" "} MXN
              </h2>
              <h2>Descuento: ${""}
                {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    descuentoCalculado
                  )}{" "} MXN 
                </h2> 
              <h1>Total: ${""}
                {new Intl.NumberFormat("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  total
                )}{" "} MXN 
              </h1>
            </Col>
            
          </Row>
        </div>
      </Form>
    </>
    );
    
  } else {
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
                    <option value="por Didi">Didi</option>
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
              // disabled={!totalPagoValido}
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
}

function initialFormValue(data) {
  return {
    tipoDescuento: "",
    dineroDescontado: "",
    porcentajeDescontado: ""
  };
}

export default DatosExtraVenta;

