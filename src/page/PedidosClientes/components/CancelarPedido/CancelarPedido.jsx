import { useState } from 'react';
import "../../../../scss/styles.scss";
import { cancelarPedidos } from "../../../../api/pedidosClientes";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Spinner, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function CancelarPedido(props) {
    const { datosPedidos, navigate, setShowModal } = props;

    const { id, numeroTiquet, productosVendidos, total, estado, fechaCreacion } = datosPedidos

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
                estado: estado === "Pendiente" ? "Confirmado" : "Cancelado"
            }
            cancelarPedidos(id, dataTemp).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("Estado del pedido " + numeroTiquet + " actualizado", datosPedidos);
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
                                    Esta acción cancelara el pedido.
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
                                    Esta acción recuperara el pedido.
                                </p>
                            </Alert>
                        </>
                    )
                }
                <Form onSubmit={onSubmit}>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNoTiquet">
                            Número del ticket
                            <Form.Control
                                type="text"
                                value={numeroTiquet}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNoProductos">
                            Productos vendidos
                            <Form.Control
                                type="text"
                                value={productosVendidos}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNoTiquet">
                            Total
                            <Form.Control
                                type="text"
                                value={total}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNoProductos">
                            Día de la venta
                            <Form.Control
                                type="text"
                                value={dayjs(fechaCreacion).format('L hh:mm A')}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estado === "true" ? "cancelar venta" : "recuperar venta"}
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                <FontAwesomeIcon icon={faSave} /> {!loading ? (estado === "Pendiente" ? "Confirmar" : "Cancelar") : <Spinner animation="border" />}
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

export default CancelarPedido;
