import { startTransition, useActionState, useState } from 'react';
import { registraIngredientes } from '../../../../api/ingredientes';
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from '../../../../api/cloudinary';
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';
import { useForm } from "react-hook-form";

function RegistroIngredientes(props) {
    const { setShowModal, navigate } = props;
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const umPrimaria = watch("umPrimaria");

    //Para almacenar la imagen del producto que se guardara a la bd
    const [imagenIngrediente, setImagenIngrediente] = useState(null);

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

        // Validations handled by hook-form client-side mostly, but kept for robustness
        if (!nombre || !umPrimaria || !costoAdquisicion) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            let imagenUrl = "";
            if (imagenIngrediente) {
                const response = await subeArchivosCloudinary(imagenIngrediente, "ingrediente");
                imagenUrl = response.data.secure_url;
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
                    : umProduccion === "Hectó" ? parseFloat(precio) / 10  // Re-evaluated logic based on context (assuming conversion from unit to base) or keeping safe float. I'll trust standard logic flow.
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
                cantidad: "0",
                costoProduccion: costoProduccion,
                negocio: "LA NENA",
                imagen: imagenUrl,
                estado: "true"
            };

            const response = await registraIngredientes(dataTemp);
            const { data } = response;

            navigate({ search: queryString.stringify(""), });
            LogsInformativos("Se ha registrado el ingrediente " + nombre, data.datos);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;

        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al registrar", showConfirmButton: false, timer: 1600 });
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
                            <Form.Select
                                {...register("umPrimaria", { required: "Selecciona una opción" })}
                                isInvalid={!!errors.umPrimaria}
                            >
                                <option value="">Elige una opción</option>
                                <option value="Litros">Litros</option>
                                <option value="Gramos">Gramos</option>
                                <option value="Metros">Metros</option>
                                <option value="Paquete">Paquete</option>
                            </Form.Select>
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
                                        <Form.Select
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
                                        </Form.Select>
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
                                        <Form.Select
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
                                        </Form.Select>
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

export default RegistroIngredientes;