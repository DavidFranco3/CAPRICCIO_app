import { useState } from 'react';
import "../../../../scss/styles.scss";
import Dropzone from "../../../../components/Dropzone";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from "../../../../api/cloudinary";
import Swal from 'sweetalert2';
import { actualizaCategoria } from "../../../../api/categorias";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function ModificaCategorias(props) {
    const { datosCategorias, navigate, setShowModal } = props;

    const { id, imagen } = datosCategorias;

    // Para almacenar la imagen
    const [imagenFile, setImagenFile] = useState(imagen);

    // Para almacenar el valor del formulario
    const [formData, setFormData] = useState(initialFormData(datosCategorias));

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        if (!imagenFile || !formData.nombre) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
        } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                subeArchivosCloudinary(imagenFile, "categoria").then(response => {
                    const { data } = response;
                    const dataTemp = {
                        nombre: formData.nombre,
                        imagen: data.secure_url,
                        negocio: "LA NENA"
                    }
                    actualizaCategoria(id, dataTemp).then(response => {
                        const { data } = response;
                        navigate({
                            search: queryString.stringify(""),
                        });
                        LogsInformativos("Se ha modificado la categoría " + datosCategorias.nombre, datosCategorias);
                        Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
                        cancelarRegistro();
                    })
                }).then(e => {
                    console.log(e)
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
                <div className="imagenPrincipal">
                    <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
                    <div title="Seleccionar imagen de la categoría" className="imagenProducto">
                        <Dropzone
                            setImagenFile={setImagenFile}
                            imagenProductoBD={imagen}
                        />
                    </div>
                </div>

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
        nombre: data.nombre
    }
}

export default ModificaCategorias;

