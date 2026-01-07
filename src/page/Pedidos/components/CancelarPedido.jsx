import { useState } from 'react';
import "../../../scss/styles.scss";
import { cancelarVenta } from "../../../api/ventas";
import Swal from 'sweetalert2';
import { Button, Col, Row, Form, Spinner, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../Logs/components/LogsSistema/LogsSistema';

function CancelarVenta(props) {
    const { datosVentas, navigate, location, setShow } = props;
console.log(datosVentas)
    console.log(location);

    const { _id, numeroTiquet, productos, total, estado, fechaCreacion } = datosVentas

    console.log(navigate)

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShow(false)
    }

    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true);
        try {
            const dataTemp = {
                estado: estado !== "false" ? "false" : "pp"
            }
            cancelarVenta(_id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Estado de la venta " + numeroTiquet + " actualizado", datosVentas);
                Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
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

                {estado === "PP" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción cancelara la venta.
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
                                    Esta acción recuperara la venta.
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
                                value={productos.length}
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
                                <FontAwesomeIcon icon={faSave} /> {!loading ? (estado === "PP" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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

export default CancelarVenta;
