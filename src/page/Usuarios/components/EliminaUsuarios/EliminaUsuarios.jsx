import { useState } from 'react';
import { Button, Col, Form, Row, Spinner, Image, Alert } from "react-bootstrap";
import { eliminaUsuario } from "../../../../api/usuarios";
import Swal from 'sweetalert2';
import queryString from "query-string";
import "../../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function EliminaUsuarios(props) {
    const { datosUsuario, navigate, setShowModal } = props;

    const { id, nombre, usuario, password, admin } = datosUsuario;

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
            eliminaUsuario(id).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("El usuario " + usuario + " fue eliminado", datosUsuario);
                Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
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
                            Esta acción eliminará del sistema el usuario.
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
                            <Form.Label>Usario</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario"
                                placeholder="Escribe el usuario"
                                value={usuario}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                name="password"
                                placeholder="Escribe el password"
                                value={password}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="admin"
                                placeholder="Escribe el tipo de usuario"
                                value={admin}
                                disabled
                            >
                                <option>Elige una opción</option>
                                <option value="administrador" selected={admin === "administrador"}>Administrador</option>
                                <option value="vendedor" selected={admin === "vendedor"}>Cajero</option>
                                <option value="mesero" selected={admin === "mesero"}>Mesero</option>
                            </Form.Control>
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

export default EliminaUsuarios;

