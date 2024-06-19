import { useState } from 'react';
import "../../../../scss/styles.scss";
import { cancelarIngrediente } from "../../../../api/ingredientes";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Spinner, Image, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from "../../../../components/Logs/LogsSistema/LogsSistema";

function CancelarIngredientes(props) {
    const { datosIngrediente, navigate, setShowModal } = props;

    const { id, nombre, umPrimaria, umAdquisicion, umProduccion, costoAdquisicion, imagen, estado } = datosIngrediente;

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
            cancelarIngrediente(id, dataTemp).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("Estado del ingrediente " + nombre + " actualizado", datosIngrediente);
                toast.success(data.mensaje)
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
                                    Esta acción cancelara el ingrediente.
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
                                    Esta acción recuperara el ingrediente.
                                </p>
                            </Alert>
                        </>
                    )
                }
                <Form onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                placeholder="Escribe el nombre"
                                value={nombre}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Precio de adquisición</Form.Label>
                            <Form.Control
                                type="text"
                                name="costo"
                                placeholder="Escribe el nombre"
                                value={costoAdquisicion}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Unidad de medida de adquisición</Form.Label>
                            <Form.Control
                                type="text"
                                name="tipoUM"
                                placeholder="Escribe el nombre"
                                value={umAdquisicion === "Paquete" || umAdquisicion === "Gramos" || umAdquisicion === "Litros" || umAdquisicion === "Metros" ? umAdquisicion : umAdquisicion + umPrimaria.toLowerCase()}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Unidad de medida de producción</Form.Label>
                            <Form.Control
                                type="text"
                                name="um"
                                placeholder="Escribe el nombre"
                                value={umProduccion === "Piezas" || umProduccion === "Gramos" || umProduccion === "Litros" || umProduccion === "Metros" ? umProduccion : umProduccion + umPrimaria.toLowerCase()}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estado === "true" ? "cancelar ingrediente" : "recuperar ingrediente"}
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

export default CancelarIngredientes;
