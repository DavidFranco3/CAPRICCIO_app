import { useState, useActionState } from 'react';
import { Button, Col, Form, Row, Spinner, Image, Alert } from "react-bootstrap";
import { eliminaIngrediente } from "../../../../api/ingredientes";
import Swal from 'sweetalert2';
import queryString from "query-string";
import "../../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function EliminaIngredientes(props) {
    const { datosIngrediente, navigate, setShowModal } = props;

    const { id, nombre, umPrimaria, umAdquisicion, umProduccion, costoAdquisicion, imagen } = datosIngrediente;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async () => {
        try {
            const response = await eliminaIngrediente(id);
            const { data } = response;
            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("El ingrediente " + nombre + " fue eliminado", datosIngrediente);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false })
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e)
            Swal.fire({ icon: 'error', title: "Error al eliminar", showConfirmButton: false, timer: 1600 })
            return { error: "Error" };
        }
    }, null);

    return (
        <>
            <Form action={action}>
                <div className="datosDelProducto">
                    <Alert variant="danger">
                        <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                        <p className="mensaje">
                            Esta acción eliminará del sistema el ingrediente.
                        </p>
                    </Alert>

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
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Eliminar categoría"
                            type="submit"
                            variant="success"
                            className="registrar"
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Eliminar" : <Spinner animation="border" size="sm" />}
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
        </>
    );
}

export default EliminaIngredientes;

