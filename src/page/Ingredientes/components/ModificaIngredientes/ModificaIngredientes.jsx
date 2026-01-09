import { startTransition, useState, useActionState } from 'react';
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from '../../../../api/cloudinary';
import Swal from 'sweetalert2';
import { actualizaIngrediente } from '../../../../api/ingredientes';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';
import { useForm } from "react-hook-form";

function ModificaIngredientes(props) {
    const { datosIngredientes, navigate, setShowModal } = props;
    const { id, imagen } = datosIngredientes;

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            nombre: datosIngredientes.nombre,
            umPrimaria: datosIngredientes.umPrimaria,
            costoAdquisicion: datosIngredientes.costoAdquisicion,
            umAdquisicion: datosIngredientes.umAdquisicion,
            umProduccion: datosIngredientes.umProduccion,
            cantidadPiezas: datosIngredientes.cantidadPiezas
        }
    });

    const umPrimaria = watch("umPrimaria");

    // Para almacenar la imagen
    const [imagenFile, setImagenFile] = useState(imagen);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const nombre = fd.get("nombre");
        const umPrimaria = fd.get("umPrimaria");
        const costoAdquisicion = parseFloat(fd.get("costoAdquisicion"));
        const cantidadPiezas = parseFloat(fd.get("cantidadPiezas") || 0);
        const umAdquisicion = fd.get("umAdquisicion");
        const umProduccion = fd.get("umProduccion");

        if (!nombre || !umPrimaria || !costoAdquisicion) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            let imagenUrl = "";
            // Original logic checks if imagenFile exists
            if (imagenFile && typeof imagenFile !== 'string') {
                const response = await subeArchivosCloudinary(imagenFile, "ingrediente");
                imagenUrl = response.data.secure_url;
            } else if (typeof imagenFile === 'string') {
                imagenUrl = imagenFile;
            }

            const umAdqToUse = umPrimaria === "Paquete" ? "Paquete" : umAdquisicion;
            const umProdToUse = umPrimaria === "Paquete" ? "Piezas" : umProduccion;

            const precio = umPrimaria === "Paquete" ? costoAdquisicion / cantidadPiezas
                : umAdquisicion === "Decá" ? costoAdquisicion / 100
                    : umAdquisicion === "Hectó" ? costoAdquisicion / 10
                        : umAdquisicion === "Kiló" ? costoAdquisicion / 1000
                            : umAdquisicion === "Decí" ? costoAdquisicion * 10
                                : umAdquisicion === "Centí" ? costoAdquisicion * 100
                                    : umAdquisicion === "Milí" ? costoAdquisicion * 1000
                                        : umAdquisicion == umPrimaria ? costoAdquisicion : "";

            const costoProduccion = umPrimaria === "Paquete" ? costoAdquisicion / cantidadPiezas
                : umProduccion === "Decá" ? parseFloat(precio) * 100
                    : umProduccion === "Hectó" ? parseFloat(precio) / 10
                        : umProduccion === "Kiló" ? parseFloat(precio) * 1000
                            : umProduccion === "Decí" ? parseFloat(precio) / 10
                                : umProduccion === "Centí" ? parseFloat(precio) / 100
                                    : umProduccion === "Milí" ? parseFloat(precio) / 1000
                                        : umProduccion == umPrimaria ? precio : "";

            const dataTemp = {
                nombre: nombre,
                umPrimaria: umPrimaria,
                costoAdquisicion: costoAdquisicion,
                umAdquisicion: umAdqToUse,
                umProduccion: umProdToUse,
                cantidadPiezas: cantidadPiezas,
                costoProduccion: costoProduccion,
                imagen: imagenUrl,
            };

            const response = await actualizaIngrediente(id, dataTemp);
            const { data } = response;

            navigate({ search: queryString.stringify(""), });
            LogsInformativos("Se ha modificado el ingrediente " + datosIngredientes.nombre, datosIngredientes);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;

        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al modificar", showConfirmButton: false, timer: 1600 });
            return { error: "Error" };
        }
    }, null);

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        startTransition(() => {
            action(formData);
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
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

                        <Form.Group as={Col} controlId="formGridCosto">
                            <Form.Label>Precio de adquisición</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Escribe el costo de adquisición"
                                step="0.01"
                                {...register("costoAdquisicion", { required: "El costo es obligatorio", min: 0 })}
                                isInvalid={!!errors.costoAdquisicion}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.costoAdquisicion?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridUmPrimaria">
                            <Form.Label>Unidad de medida</Form.Label>
                            <Form.Control
                                as="select"
                                {...register("umPrimaria", { required: "Selecciona una opción" })}
                                isInvalid={!!errors.umPrimaria}
                            >
                                <option value="">Elige una opción</option>
                                <option value="Litros">Litros</option>
                                <option value="Gramos">Gramos</option>
                                <option value="Metros">Metros</option>
                                <option value="Paquete">Paquete</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.umPrimaria?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">

                        {
                            umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridUmAdqPaq">
                                        <Form.Label>Unidad de medida de adquisicón</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value="Paquete"
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridUmProdPaq">
                                        <Form.Label>Unidad de medida de producción</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value="Piezas"
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            umPrimaria && umPrimaria !== "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridUmAdq">
                                        <Form.Label>Unidad de medida de adquisición</Form.Label>
                                        <Form.Control
                                            as="select"
                                            {...register("umAdquisicion")}
                                        >
                                            <option value="">Elige una opción</option>
                                            <option value={umPrimaria}>{umPrimaria}</option>
                                            <option value="Decá">Decá{umPrimaria.toLowerCase()}</option>
                                            <option value="Hectó">Hectó{umPrimaria.toLowerCase()}</option>
                                            <option value="Kiló">Kiló{umPrimaria.toLowerCase()}</option>
                                            <option value="Decí">Decí{umPrimaria.toLowerCase()}</option>
                                            <option value="Centí">Centí{umPrimaria.toLowerCase()}</option>
                                            <option value="Milí">Milí{umPrimaria.toLowerCase()}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            umPrimaria && umPrimaria !== "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridUmProd">
                                        <Form.Label>Unidad de medida de producción</Form.Label>
                                        <Form.Control
                                            as="select"
                                            {...register("umProduccion")}
                                        >
                                            <option value="">Elige una opción</option>
                                            <option value={umPrimaria}>{umPrimaria}</option>
                                            <option value="Decá">Decá{umPrimaria.toLowerCase()}</option>
                                            <option value="Hectó">Hectó{umPrimaria.toLowerCase()}</option>
                                            <option value="Kiló">Kiló{umPrimaria.toLowerCase()}</option>
                                            <option value="Decí">Decí{umPrimaria.toLowerCase()}</option>
                                            <option value="Centí">Centí{umPrimaria.toLowerCase()}</option>
                                            <option value="Milí">Milí{umPrimaria.toLowerCase()}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridCantPiezas">
                                        <Form.Label>Cantidad de piezas del paquete</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad de piezas que contiene el paquete"
                                            {...register("cantidadPiezas")}
                                        />
                                    </Form.Group>
                                </>
                            )
                        }
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
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Registrar" : <Spinner animation="border" size="sm" />}
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

function initialFormData(data) {
    return {
        nombre: data.nombre,
        umPrimaria: data.umPrimaria,
        costoAdquisicion: data.costoAdquisicion,
        umAdquisicion: data.umAdquisicion,
        umProduccion: data.umProduccion,
        costoProduccion: data.costoProduccion,
        cantidadPiezas: data.cantidadPiezas,
    }
}

export default ModificaIngredientes;

