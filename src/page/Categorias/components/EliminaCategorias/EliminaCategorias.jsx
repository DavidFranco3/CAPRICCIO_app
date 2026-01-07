import { useState } from 'react';
import { Button, Col, Form, Row, Spinner, Image, Alert } from "react-bootstrap";
import { eliminaCategoria } from "../../../../api/categorias";
import Swal from 'sweetalert2';
import queryString from "query-string";
import "../../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function EliminaCategorias(props) {
    const { datosCategoria, navigate, setShowModal } = props;

    const { id, nombre, imagen, fechaActualizacion } = datosCategoria;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }


    const [loading, setLoading] = useState(null);

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        try {
            eliminaCategoria(id).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("La categoría " + nombre  + " fue eliminada", datosCategoria);
                Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false })
                cancelarRegistro();
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <div className="datosDelProducto">
                    <Alert variant="danger">
                        <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                        <p className="mensaje">
                            Esta acción eliminará del sistema la categoría.
                        </p>
                    </Alert>

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

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Modificación</Form.Label>
                            <Form.Control
                                align="center"
                                type="text"
                                name="nombre"
                                placeholder="Escribe el nombre"
                                value={dayjs(fechaActualizacion).format('L hh:mm A')}
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
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!loading ? "Eliminar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            title="Cerrar ventana"
                            variant="danger"
                            className="cancelar"
                            disabled={loading}
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

export default EliminaCategorias;

