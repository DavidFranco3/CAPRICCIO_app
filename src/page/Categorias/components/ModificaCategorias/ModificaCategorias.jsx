import { useState, useActionState, startTransition } from 'react';
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
import { useForm } from "react-hook-form";

function ModificaCategorias(props) {
    const { datosCategorias, navigate, setShowModal } = props;
    const { id, imagen } = datosCategorias;

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            nombre: datosCategorias.nombre
        }
    });

    // Para almacenar la imagen
    const [imagenFile, setImagenFile] = useState(imagen);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const nombre = fd.get("nombre");
        // imagenFile is accessed from state

        try {
            let finalImageUrl = imagenFile;
            if (typeof imagenFile !== 'string') {
                // Sube a cloudinary la imagen si no es una URL string
                const responseCloudy = await subeArchivosCloudinary(imagenFile, "categoria");
                const { data: dataCloudy } = responseCloudy;
                finalImageUrl = dataCloudy.secure_url;
            }

            const dataTemp = {
                nombre: nombre,
                imagen: finalImageUrl,
                negocio: "LA NENA"
            }
            const responseAct = await actualizaCategoria(id, dataTemp);
            const { data: dataAct } = responseAct;

            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Se ha modificado la categoría " + datosCategorias.nombre, datosCategorias);
            Swal.fire({ icon: 'success', title: dataAct.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al modificar categoría", timer: 1600, showConfirmButton: false });
            return { error: e.message };
        }
    }, null);

    const onSubmit = (data) => {
        if (!imagenFile) {
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
                            title="Modificar categoría"
                            type="submit"
                            variant="success"
                            className="registrar w-100"
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Modificar" : <Spinner animation="border" />}
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

export default ModificaCategorias;

