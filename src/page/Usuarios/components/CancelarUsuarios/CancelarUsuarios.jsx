import { useState, useActionState } from 'react';
import "../../../../scss/styles.scss";
import { deshabilitaUsuario } from '../../../../api/usuarios';
import Swal from 'sweetalert2';
import { Button, Col, Row, Form, Spinner, Image, Alert } from "react-bootstrap";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function CancelarUsuarios(props) {
    const { datosUsuario, navigate, setShowModal } = props;
    const { id, nombre, usuario, password, admin, estadoUsuario } = datosUsuario;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        try {
            const dataTemp = {
                estadoUsuario: estadoUsuario === "true" ? "false" : "true"
            }
            const response = await deshabilitaUsuario(id, dataTemp);
            const { data } = response;
            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Estado del usuario " + usuario + " actualizado", datosUsuario);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al actualizar estado del usuario", timer: 1600, showConfirmButton: false });
            return { error: e.message };
        }
    }, null);

    return (
        <>
            <div className="datosDelProducto">
                {estadoUsuario === "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara el usuario.
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
                                    Esta acción habilitara el usuario.
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
                        <Form.Group as={Col} controlId="formGridUsuario">
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
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="text"
                                name="password"
                                placeholder="Escribe el password"
                                value={password}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridAdmin">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="admin"
                                placeholder="Escribe el tipo de usuario"
                                value={admin}
                                disabled
                            >
                                <option>Elige una opción</option>
                                <option value="administrador">Administrador</option>
                                <option value="vendedor">Cajero</option>
                                <option value="mesero">Mesero</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title={estadoUsuario === "true" ? "cancelar usuario" : "recuperar usuario"}
                                type="submit"
                                variant="success"
                                className="registrar w-100"
                                disabled={isPending}
                            >
                                <FontAwesomeIcon icon={faSave} /> {!isPending ? (estadoUsuario === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana"
                                variant="danger"
                                className="cancelar w-100"
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

export default CancelarUsuarios;

