import { useState } from 'react';
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2';
import { actualizaUsuario } from '../../../../api/usuarios';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function ModificaUsuarios(props) {
    const { datosUsuario, navigate, setShowModal } = props;

    const { id } = datosUsuario;

    // Para almacenar el valor del formulario
    const [formData, setFormData] = useState(initialFormData(datosUsuario));

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.nombre || !formData.usuario || !formData.password || !formData.admin) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
        } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                const dataTemp = {
                    nombre: formData.nombre,
                    usuario: formData.usuario,
                    admin: formData.admin == "administrador" ? "true" : "false",
                    password: formData.password,
                    rol: formData.admin,
                }
                actualizaUsuario(id, dataTemp).then(response => {
                    const { data } = response;
                    navigate({
                        search: queryString.stringify(""),
                    });
                    LogsInformativos("Se ha modificado el usuario " + datosUsuario.usuario, datosUsuario);
                    Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
                    cancelarRegistro();
                }).catch(e => {
                    console.log(e)
                    if (e.message === 'Network Error') {
                        //console.log("No hay internet")
                        Swal.fire({ icon: 'error', title: "Conexión al servidor no disponible", timer: 1600, showConfirmButton: false });
                        setLoading(false);
                    } else {
                        if (e.response && e.response.status === 401) {
                            const { mensaje } = e.response.data;
                            Swal.fire({ icon: 'error', title: mensaje, timer: 1600, showConfirmButton: false });
                            setLoading(false);
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="datosDelProducto">
                <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                placeholder="Escribe el nombre"
                                defaultValue={formData.nombre}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario"
                                placeholder="Escribe el usuario"
                                defaultValue={formData.usuario}
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
                                defaultValue={formData.password}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="admin"
                                placeholder="Escribe el tipo de usuario"
                                defaultValue={formData.admin}
                            >
                                <option>Elige una opción</option>
                                <option value="administrador" selected={formData.admin=="administrador"}>Administrador</option>
                                <option value="vendedor" selected={formData.admin=="vendedor"}>Cajero</option>
                                <option value="mesero" selected={formData.admin=="mesero"}>Mesero</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Modificar categoría"
                            type="submit"
                            variant="success"
                            className="registrar"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!loading ? "Modificar" : <Spinner animation="border" />}
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

function initialFormData(data) {
    return {
        nombre: data.nombre,
        usuario: data.usuario,
        password: data.password,
        admin: data.admin,
    }
}

export default ModificaUsuarios;

