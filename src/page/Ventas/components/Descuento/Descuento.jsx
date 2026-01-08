import { useState, useActionState } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';

function Descuento(props) {
    const { setShowModal, tipoDescuento, setTipoDescuento, dineroDescontado, setDineroDescontado, porcentajeDescontado, setPorcentajeDescontado } = props;

    // We keep local state FOR THE UI LOGIC (showing/hiding fields)
    const [localTipoDescuento, setLocalTipoDescuento] = useState(tipoDescuento);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const type = fd.get("tipoDescuento");
        const dinero = fd.get("dineroDescontado");
        const porcentaje = fd.get("porcentajeDescontado");

        if (!type || type === "Elige una opción") {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        // Logic here
        setTipoDescuento(type);
        if (type === "Moneda") {
            setDineroDescontado(dinero);
        } else if (type === "Porcentaje") {
            setPorcentajeDescontado(parseFloat(porcentaje) / 100);
        }

        cancelarRegistro();
        return null;
    }, null);

    return (
        <>
            <Form action={action}>
                <div className="metodoDePago">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Tipo de descuento
                            </Form.Label>

                            <Form.Control as="select"
                                defaultValue={localTipoDescuento}
                                name="tipoDescuento"
                                onChange={(e) => setLocalTipoDescuento(e.target.value)}
                                required
                            >
                                <option>Elige una opción</option>
                                <option value="Porcentaje">Porcentaje</option>
                                <option value="Moneda">Moneda</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    {
                        (localTipoDescuento == "Porcentaje") &&
                        (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridPorcentaje">
                                        <Form.Label>
                                            Porcentaje
                                        </Form.Label>

                                        <Form.Control
                                            placeholder='Porcentaje Descontado'
                                            defaultValue={porcentajeDescontado * 100}
                                            name="porcentajeDescontado"
                                            required
                                        />
                                    </Form.Group>
                                </Row>
                            </>
                        )
                    }

                    {
                        (localTipoDescuento == "Moneda") &&
                        (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridDinero">
                                        <Form.Label>
                                            Dinero
                                        </Form.Label>

                                        <Form.Control
                                            placeholder='Dinero Descontado'
                                            defaultValue={dineroDescontado}
                                            name="dineroDescontado"
                                            required
                                        />
                                    </Form.Group>
                                </Row>
                            </>
                        )
                    }

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button title="Aceptar" type="submit" variant="success" className="registrar" disabled={isPending}>
                                <FontAwesomeIcon icon={faSave} /> {!isPending ? "Aceptar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button title="Cerrar ventana" variant="danger" className="cancelar" disabled={isPending} onClick={cancelarRegistro}>
                                <FontAwesomeIcon icon={faX} /> Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </div>
            </Form>
        </>
    );
}

export default Descuento;

