import { useState, useActionState } from 'react';
import { Button, Col, Form, Spinner, Row, Image, Alert } from "react-bootstrap";
import { map } from "lodash";
import { eliminaProductos } from "../../../../api/productos";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../../scss/styles.scss";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function EliminaProductos(props) {
    const { datosProducto, navigate, listCategorias, setShowModal } = props;
    const { id, nombre, categoria, precio, imagen, fechaActualizacion } = datosProducto;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        try {
            const response = await eliminaProductos(id);
            const { data } = response;
            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("El producto " + nombre + " fue eliminado", datosProducto);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al eliminar producto", timer: 1600, showConfirmButton: false });
            return { error: e.message };
        }
    }, null);

    return (
        <>
            <div className="datosDelProducto">
                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminará del sistema el producto.
                    </p>
                </Alert>

                <Form action={action}>
                    <div className="imagenPrincipal">
                        <h4 className="textoImagenPrincipal">Imagen del producto</h4>
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
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                placeholder="Escribe el nombre"
                                value={nombre}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCategoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                as="select"
                                value={categoria}
                                name="categoria"
                                disabled>
                                <option>Elige una opción</option>
                                {map(listCategorias, (cat, index) => (
                                    <option key={index} value={cat?.id}>{cat?.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPrecio">
                            <Form.Label>
                                Precio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="precio"
                                placeholder="Escribe el precio"
                                value={precio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFecha">
                            <Form.Label>
                                Modificación
                            </Form.Label>
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
                                title="Eliminar producto"
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={isPending}
                            >
                                <FontAwesomeIcon icon={faSave} /> {!isPending ? "Eliminar" : <Spinner animation="border" />}
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

export default EliminaProductos;

