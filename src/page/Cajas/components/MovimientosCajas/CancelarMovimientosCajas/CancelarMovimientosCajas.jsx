import { useState } from 'react';
import "../../../../../scss/styles.scss";
import { cancelarMovimientos } from "../../../../../api/movimientosCajas";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Spinner, Image, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../../Logs/components/LogsSistema/LogsSistema';
import { LogCajaActualizacion } from '../../Gestion/GestionCajas';

function CancelarMovimientosCajas(props) {
    const { datosMovimiento, navigate, setShowModal } = props;

    const { id, idCaja, cajero, movimiento, monto, pago, estado } = datosMovimiento;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true);
        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }
            cancelarMovimientos(id, dataTemp).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("Estado del movimiento actualizado", datosMovimiento);
                LogCajaActualizacion(idCaja, movimiento == "Fondo de caja" ? parseFloat(monto) * -1 : movimiento == "Venta" && pago == "Transferencia" ? 0 : movimiento == "Venta" && pago == "Tarjeta" ? 0 : movimiento == "Venta" && pago == "Efectivo" ? parseFloat(monto) * -1 : movimiento == "Retiro" ? monto : movimiento == "Aumento" ? monto : 0);
                toast.success(data.mensaje);
                cancelarRegistro();
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div className="datosDelProducto">
                {estado === "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción cancelara el movimiento.
                                </p>
                            </Alert>
                        </>
                    )
                    :
                    (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción recuperara el producto.
                                </p>
                            </Alert>
                        </>
                    )
                }
                <Form onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Cajero</Form.Label>
                            <Form.Control
                                type="text"
                                name="cajero"
                                placeholder="Escribe el nombre del cajero"
                                value={cajero}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Movimiento</Form.Label>
                            <Form.Control
                                type="text"
                                name="movimiento"
                                placeholder="Escribe el nombre del cajero"
                                value={movimiento}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        {
                            movimiento === "Fondo de caja" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Monto del movimiento
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="monto"
                                            placeholder="Escribe la cantidad"
                                            step="0.1"
                                            min="0"
                                            value={monto}
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            movimiento === "Retiro" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Monto del movimiento
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="monto"
                                            placeholder="Escribe la cantidad"
                                            step="0.1"
                                            min="0"
                                            value={monto}
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            movimiento === "Aumento" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Monto del movimiento
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="monto"
                                            placeholder="Escribe la cantidad"
                                            step="0.1"
                                            min="0"
                                            value={monto}
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            movimiento === "Venta" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Monto del movimiento
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="monto"
                                            placeholder="Escribe la cantidad"
                                            step="0.1"
                                            min="0"
                                            value={monto}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridEstado">
                                        <Form.Label>
                                            Método de pago
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={pago}
                                            name="pago"
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }
                    </Row>

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estado === "true" ? "cancelar producto" : "recuperar producto"}
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                <FontAwesomeIcon icon={faSave} /> {!loading ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana"
                                variant="danger"
                                className="cancelar"
                                onClick={() => {
                                    cancelarRegistro()
                                }}
                            >
                                <FontAwesomeIcon icon={faX} /> Cancelar
                            </Button>
                        </Col>
                    </Form.Group>

                </Form>
            </div>
        </>
    );
}

export default CancelarMovimientosCajas;
