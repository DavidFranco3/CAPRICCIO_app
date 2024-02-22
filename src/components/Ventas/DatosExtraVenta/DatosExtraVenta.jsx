import { useState } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

function DatosExtraVenta(props) {
    const { observaciones, mesa, dineroIngresado, tipoPago, tipoPedido, hacerPedido, nombreCliente, setMesa, setObservaciones, setDineroIngresado, setTipoPago, setTipoPedido, setHacerPedido, setNombreCliente, setShowModal } = props;

    const [formData, setFormData] = useState({
        nombre: nombreCliente,
        hacerPedido: hacerPedido,
        tipoPedido: tipoPedido,
        tipoPago: tipoPago,
        dinero: dineroIngresado,
        mesa: mesa === "no aplica" ? "" : mesa,
        observaciones: observaciones
    });
    
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        const isParaLlevar = formData.tipoPedido === "para llevar" || formData.tipoPedido === "recoger en tienda";
        const isParaComerAqui = formData.tipoPedido === "para comer aquí";
        const isTipoPagoEmpty = (isParaLlevar || formData.hacerPedido === "por Rappi" || formData.hacerPedido === "por Uber") && !formData.tipoPago;
        const isDineroEmpty = formData.tipoPago === "Efectivo" && !formData.dinero;
        const isMesaEmpty = isParaComerAqui && (formData.hacerPedido !== "por WhatsApp" && formData.hacerPedido !== "por llamada") && !formData.mesa;

        if (!formData.hacerPedido || !formData.nombre || !formData.observaciones) {
            toast.warning("Completa el formulario");
        } else if (isTipoPagoEmpty || isDineroEmpty || isMesaEmpty) {
            toast.warning("Completa todos los campos obligatorios");
        } else {
            setLoading(true);
            setTipoPago(formData.tipoPago);
            setDineroIngresado(formData.dinero);
            setTipoPedido(formData.hacerPedido === "por WhatsApp" || formData.hacerPedido === "por llamada" ? "para llevar" : formData.tipoPedido);
            setHacerPedido(formData.hacerPedido);
            setNombreCliente(formData.nombre);
            setMesa((formData.hacerPedido === "por WhatsApp" || formData.hacerPedido === "por llamada" || formData.hacerPedido === "por Rappi" || formData.hacerPedido === "por Uber") ? "no aplica" : formData.mesa);
            setObservaciones(formData.observaciones);
            cancelarRegistro();
        }
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>
                            Nombre del cliente
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Escribe el nombre del cliente"
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEstado">
                        <Form.Label>
                            Hacer Pedido
                        </Form.Label>
                        <Form.Control as="select" defaultValue={formData.hacerPedido} name="hacerPedido">
                            <option>Elige una opción</option>
                            <option value="por WhatsApp">WhatsApp</option>
                            <option value="por llamada">Llamada</option>
                            <option value="de forma presencial">Presencial</option>
                            <option value="por Rappi">Rappi</option>
                            <option value="por Uber">Uber</option>
                        </Form.Control>
                    </Form.Group>
                </Row>

                {formData.hacerPedido === "de forma presencial" ? (
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Tipo Pedido
                            </Form.Label>
                            <Form.Control as="select" defaultValue={formData.tipoPedido} name="tipoPedido">
                                <option>Elige una opción</option>
                                <option value="para llevar">Para llevar</option>
                                <option value="para comer aquí">Para comer aquí</option>
                                {formData.hacerPedido !== "de forma presencial" && formData.hacerPedido !== "" && (
                                    <>
                                        <option value="recoger en tienda">Recoger en tienda</option>
                                    </>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Row>
                ) : null}

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


                {formData.tipoPago === "Efectivo" ? (
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                ¿Con cuánto dinero paga?
                            </Form.Label>
                            <Form.Control type="number" name="dinero" placeholder="Escribe la cantidad recibida" step="0.1" min="0" defaultValue={formData.dinero} />
                        </Form.Group>
                    </Row>
                ) : null}

                {formData.tipoPedido === "para comer aquí" && (formData.hacerPedido !== "por WhatsApp" && formData.hacerPedido !== "por llamada") ? (
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Número de mesa
                            </Form.Label>
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
                        <Form.Label>
                            Observaciones
                        </Form.Label>
                        <Form.Control as="textarea" name="observaciones" placeholder="Escribe los detalles ...." style={{ height: '100px' }} defaultValue={formData.observaciones} />
                    </Form.Group>
                </Row>
            </div>

            <Form.Group as={Row} className="botonSubirProducto">
                <Col>
                    <Button title="Agregar Observaciones" type="submit" variant="success" className="registrar">
                        <FontAwesomeIcon icon={faSave} /> {!loading ? "Aceptar" : <Spinner animation="border" />}
                    </Button>
                </Col>
                <Col>
                    <Button title="Cerrar ventana" variant="danger" className="cancelar" disabled={loading} onClick={cancelarRegistro}>
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
        mesa: data.mesa,
        tipoPago: data.tipoPago,
        dinero: data.dinero,
        tipoPedido: data.tipoPedido,
        hacerPedido: data.hacerPedido,
        nombre: data.nombre,
        observaciones: data.observaciones
    }
}

export default DatosExtraVenta;
