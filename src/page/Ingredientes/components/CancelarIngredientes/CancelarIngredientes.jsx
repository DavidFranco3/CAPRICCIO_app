import { useState, useActionState } from 'react';
import "../../../../scss/styles.scss";
import { cancelarIngrediente } from "../../../../api/ingredientes";
import Swal from 'sweetalert2';
import { Button, Col, Row, Form, Spinner, Image, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function CancelarIngredientes(props) {
    const { datosIngrediente, navigate, setShowModal } = props;

    const { id, nombre, umPrimaria, umAdquisicion, umProduccion, costoAdquisicion, imagen, estado } = datosIngrediente;

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
            const response = await cancelarIngrediente(id, dataTemp);
            const { data } = response;

            navigate({
                search: queryString.stringify(""), // Forces refresh/navigation update
            });
            LogsInformativos("Estado del ingrediente " + nombre + " actualizado", datosIngrediente);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false })
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
                <Form action={action}>
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

export default CancelarIngredientes;

