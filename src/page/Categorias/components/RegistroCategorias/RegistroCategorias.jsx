import { startTransition, useState, useActionState } from 'react';
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
import { useForm } from "react-hook-form";

function RegistroCategorias(props) {
    const { setShowModal, navigate } = props;
    const { register, handleSubmit, formState: { errors } } = useForm();

    //Para almacenar la imagen del producto que se guardara a la bd
    const [imagenProducto, setImagenProducto] = useState(null);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const nombre = fd.get("nombre");
        // Image is handled via closure variable (imagenProducto) or we could append it to FD before calling action

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

    const onSubmit = (data) => {
        if (!imagenProducto) {
            Swal.fire({ icon: 'warning', title: "Debes subir una imagen", timer: 1600, showConfirmButton: false });
            return;
        }

        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));

        startTransition(() => {
            action(formData);
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                                placeholder="Escribe el nombre"
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                                isInvalid={!!errors.nombre}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nombre?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Registrar categoría"
                            type="submit"
                            variant="success"
                            className="registrar w-100"
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Registrar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            title="Cerrar ventana"
                            variant="danger"
                            className="cancelar w-100"
                            disabled={isPending}
                            type="button"
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

