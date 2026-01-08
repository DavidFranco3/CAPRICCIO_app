import { useState, useActionState } from 'react';
import "../../../../scss/styles.scss";
import { cancelarCategoria } from "../../../../api/categorias";
import Swal from 'sweetalert2';
import { Button, Col, Row, Form, Spinner, Image, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function CancelarCategorias(props) {
    const { datosCategoria, navigate, setShowModal } = props;
    const { id, nombre, imagen, estado, fechaActualizacion } = datosCategoria;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        try {
            const dataTemp = {
                estado: estado === "true" ? "false" : "true"
            }
            const response = await cancelarCategoria(id, dataTemp);
            const { data } = response;
            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Estado de la categoría " + nombre + " actualizado", datosCategoria);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al actualizar estado de la categoría", timer: 1600, showConfirmButton: false });
            return { error: e.message };
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
                                    Esta acción cancelara la categoría.
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
                                    Esta acción recuperara la categoría.
                                </p>
                            </Alert>
                        </>
                    )
                }
                <Form action={action}>
                    <div className="imagenPrincipal">
                        <h4 className="textoImagenPrincipal">Imagen de la categoría</h4>
                        <div className="imagenProducto">
                            <div className="vistaPreviaImagen">
                                <Image
                                    src={imagen}
                                />
                            </div>
                        </div>
                    </div>

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

                        <Form.Group as={Col} controlId="formGridFecha">
                            <Form.Label>Modificación</Form.Label>
                            <Form.Control
                                type="text"
                                name="fecha"
                                placeholder="Escribe la fecha"
                                value={dayjs(fechaActualizacion).format('L hh:mm A')}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estado === "true" ? "cancelar categoría" : "recuperar categoría"}
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={isPending}
                            >
                                <FontAwesomeIcon icon={faSave} /> {!isPending ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
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

export default CancelarCategorias;

