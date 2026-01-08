import { useState, useActionState } from 'react';
import { registraCategorias } from "../../../../api/categorias";
import Dropzone from "../../../../components/Dropzone";
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from "../../../../api/cloudinary";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function RegistroCategorias(props) {
    const { setShowModal, navigate } = props;

    //Para almacenar la imagen del producto que se guardara a la bd
    const [imagenProducto, setImagenProducto] = useState(null);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const nombre = fd.get("nombre");

        if (!imagenProducto || !nombre) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            // Sube a cloudinary la imagen principal del producto
            const responseCloudy = await subeArchivosCloudinary(imagenProducto, "categoria");
            const { data: dataCloudy } = responseCloudy;

            const dataTemp = {
                nombre: nombre,
                imagen: dataCloudy.secure_url,
                negocio: "LA NENA",
                estado: "true"
            }
            const responseReg = await registraCategorias(dataTemp);
            const { data: dataReg } = responseReg;

            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Se ha registrado la categoría " + nombre, dataReg.datos);
            Swal.fire({ icon: 'success', title: dataReg.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al registrar categoría", timer: 1600, showConfirmButton: false });
            return { error: e.message };
        }
    }, null);

    return (
        <>
            <Form action={action}>
                <div className="imagenPrincipal">
                    <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
                    <div title="Seleccionar imagen de la categoría" className="imagenProducto">
                        <Dropzone
                            setImagenFile={setImagenProducto}
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
                                required
                            />
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Registrar categoría"
                            type="submit"
                            variant="success"
                            className="registrar"
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Registrar" : <Spinner animation="border" />}
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

export default RegistroCategorias;

