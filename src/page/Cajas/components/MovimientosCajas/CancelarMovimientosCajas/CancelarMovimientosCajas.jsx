import { useState, useActionState } from 'react';
import "../../../../../scss/styles.scss";
import { cancelarMovimientos } from "../../../../../api/movimientosCajas";
import Swal from 'sweetalert2';
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

    const [errorState, action, isPending] = useActionState(async () => {
        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }
            const response = await cancelarMovimientos(id, dataTemp);
            const { data } = response;

            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Estado del movimiento actualizado", datosMovimiento);

            // Logic from original code:
            // movimiento == "Fondo de caja" ? parseFloat(monto) * -1 : 
            // movimiento == "Venta" && pago == "Transferencia" ? 0 : 
            // movimiento == "Venta" && pago == "Tarjeta" ? 0 : 
            // movimiento == "Venta" && pago == "Efectivo" ? parseFloat(monto) * -1 : 
            // movimiento == "Retiro" ? monto : 
            // movimiento == "Aumento" ? monto : 0

            const total = movimiento === "Fondo de caja" ? parseFloat(monto) * -1
                : movimiento === "Venta" && pago === "Transferencia" ? 0
                    : movimiento === "Venta" && pago === "Tarjeta" ? 0
                        : movimiento === "Venta" && pago === "Efectivo" ? parseFloat(monto) * -1
                            : movimiento === "Retiro" ? monto
                                : movimiento === "Aumento" ? monto : 0;

            LogCajaActualizacion(idCaja, total);

            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al cambiar estado", timer: 1600, showConfirmButton: false });
            return { error: "Error" };
        }
    }, null);

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
                <Form action={action}>
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
                                disabled={isPending}
                            >
                                <FontAwesomeIcon icon={faSave} /> {!isPending ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" size="sm" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana"
                                variant="danger"
                                className="cancelar"
                                disabled={isPending}
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
