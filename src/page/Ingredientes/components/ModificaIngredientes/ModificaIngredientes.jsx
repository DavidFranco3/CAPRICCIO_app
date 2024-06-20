import { useState } from 'react';
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from '../../../../api/cloudinary';
import { toast } from "react-toastify";
import { actualizaIngrediente } from '../../../../api/ingredientes';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function ModificaIngredientes(props) {
    const { datosIngredientes, navigate, setShowModal } = props;

    const { id, imagen } = datosIngredientes;

    // Para almacenar el valor del formulario
    const [formData, setFormData] = useState(initialFormData(datosIngredientes));

    // Para almacenar la imagen
    const [imagenFile, setImagenFile] = useState(imagen);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.nombre || !formData.umPrimaria || !formData.costoAdquisicion) {
            toast.warning("Completa el formulario");
        } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                if (imagenFile) {
                    subeArchivosCloudinary(imagenFile, "ingrediente").then(response => {
                        const { data } = response;

                        const precio = formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umAdquisicion === "Decá" ? parseFloat(formData.costoAdquisicion) / 100 : formData.umAdquisicion === "Hectó" ? parseFloat(formData.costoAdquisicion) / 10 : formData.umAdquisicion === "Kiló" ? parseFloat(formData.costoAdquisicion) / 1000 : formData.umAdquisicion === "Decí" ? parseFloat(formData.costoAdquisicion) * 10 : formData.umAdquisicion === "Centí" ? parseFloat(formData.costoAdquisicion) * 100 : formData.umAdquisicion === "Milí" ? parseFloat(formData.costoAdquisicion) * 1000 : formData.umAdquisicion == formData.umPrimaria ? formData.costoAdquisicion : "";

                        const dataTemp = {
                            nombre: formData.nombre,
                            umPrimaria: formData.umPrimaria,
                            costoAdquisicion: formData.costoAdquisicion,
                            umAdquisicion: formData.umPrimaria === "Paquete" ? "Paquete" : formData.umAdquisicion,
                            umProduccion: formData.umPrimaria === "Paquete" ? "Piezas" : formData.umProduccion,
                            cantidadPiezas: formData.cantidadPiezas,
                            costoProduccion: formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umProduccion === "Decá" ? parseFloat(precio) * 100 : formData.umProduccion === "Hectó" ? parseFloat(formData.umAdquisicion) * 10 : formData.umProduccion === "Kiló" ? parseFloat(precio) * 1000 : formData.umProduccion === "Decí" ? parseFloat(precio) / 10 : formData.umProduccion === "Centí" ? parseFloat(precio) / 100 : formData.umProduccion === "Milí" ? parseFloat(precio) / 1000 : formData.umProduccion == formData.umPrimaria ? precio : "",
                            imagen: data.secure_url,
                        }
                        actualizaIngrediente(id, dataTemp).then(response => {
                            const { data } = response;
                            navigate({
                                search: queryString.stringify(""),
                            });
                            LogsInformativos("Se ha modificado el ingrediente " + datosIngredientes.nombre, datosIngredientes);
                            toast.success(data.mensaje);
                            cancelarRegistro();
                        })
                    }).then(e => {
                        console.log(e)
                    })
                } else {
                    const precio = formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umAdquisicion === "Decá" ? parseFloat(formData.costoAdquisicion) / 100 : formData.umAdquisicion === "Hectó" ? parseFloat(formData.costoAdquisicion) / 10 : formData.umAdquisicion === "Kiló" ? parseFloat(formData.costoAdquisicion) / 1000 : formData.umAdquisicion === "Decí" ? parseFloat(formData.costoAdquisicion) * 10 : formData.umAdquisicion === "Centí" ? parseFloat(formData.costoAdquisicion) * 100 : formData.umAdquisicion === "Milí" ? parseFloat(formData.costoAdquisicion) * 1000 : formData.umAdquisicion == formData.umPrimaria ? formData.costoAdquisicion : "";

                    const dataTemp = {
                        nombre: formData.nombre,
                        umPrimaria: formData.umPrimaria,
                        costoAdquisicion: formData.costoAdquisicion,
                        umAdquisicion: formData.umPrimaria === "Paquete" ? "Paquete" : formData.umAdquisicion,
                        umProduccion: formData.umPrimaria === "Paquete" ? "Piezas" : formData.umProduccion,
                        cantidadPiezas: formData.cantidadPiezas,
                        costoProduccion: formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umProduccion === "Decá" ? parseFloat(precio) * 100 : formData.umProduccion === "Hectó" ? parseFloat(formData.umAdquisicion) * 10 : formData.umProduccion === "Kiló" ? parseFloat(precio) * 1000 : formData.umProduccion === "Decí" ? parseFloat(precio) / 10 : formData.umProduccion === "Centí" ? parseFloat(precio) / 100 : formData.umProduccion === "Milí" ? parseFloat(precio) / 1000 : formData.umProduccion == formData.umPrimaria ? precio : "",
                        imagen: "",
                    }
                    actualizaIngrediente(id, dataTemp).then(response => {
                        const { data } = response;
                        navigate({
                            search: queryString.stringify(""),
                        });
                        LogsInformativos("Se ha modificado el ingrediente " + datosIngredientes.nombre, datosIngredientes);
                        toast.success(data.mensaje);
                        cancelarRegistro();
                    })
                }
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
                            <Form.Label>Precio de adquisición</Form.Label>
                            <Form.Control
                                type="text"
                                name="costoAdquisicion"
                                placeholder="Escribe el costo de adquisición"
                                defaultValue={formData.costoAdquisicion}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Unidad de medida</Form.Label>
                            <Form.Control
                                as="select"
                                name="umPrimaria"
                                defaultValue={formData.umPrimaria}
                            >
                                <option>Elige una opción</option>
                                <option value="Litros">Litros</option>
                                <option value="Gramos">Gramos</option>
                                <option value="Metros">Metros</option>
                                <option value="Paquete">Paquete</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">

                        {
                            formData.umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>Unidad de medida de adquisicón</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="tipo"
                                            value="Paquete"
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            formData.umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>Unidad de medida de producción</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="tipo"
                                            value="Piezas"
                                            disabled
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            formData.umPrimaria !== "" && formData.umPrimaria !== "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>Unidad de medida de adquisición</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="umAdquisicion"
                                            defaultValue={formData.umAdquisicion}
                                        >
                                            <option>Elige una opción</option>
                                            <option value={formData.umPrimaria}>{formData.umPrimaria}</option>
                                            <option value="Decá">Decá{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Hectó">Hectó{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Kiló">Kiló{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Decí">Decí{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Centí">Centí{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Milí">Milí{formData.umPrimaria.toLowerCase()}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            formData.umPrimaria !== "" && formData.umPrimaria !== "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>Unidad de medida de producción</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="umProduccion"
                                            defaultValue={formData.umProduccion}
                                        >
                                            <option>Elige una opción</option>
                                            <option value={formData.umPrimaria}>{formData.umPrimaria}</option>
                                            <option value="Decá">Decá{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Hectó">Hectó{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Kiló">Kiló{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Decí">Decí{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Centí">Centí{formData.umPrimaria.toLowerCase()}</option>
                                            <option value="Milí">Milí{formData.umPrimaria.toLowerCase()}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            formData.umPrimaria === "Paquete" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>Cantidad de piezas del paquete</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cantidadPiezas"
                                            defaultValue={formData.cantidadPiezas}
                                            placeholder="Cantidad de piezas que contiene el paquete"
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
                            className="registrar"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faSave} /> {!loading ? "Registrar" : <Spinner animation="border" />}
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
        umPrimaria: data.umPrimaria,
        costoAdquisicion: data.costoAdquisicion,
        umAdquisicion: data.umAdquisicion,
        umProduccion: data.umProduccion,
        costoProduccion: data.costoProduccion,
        cantidadPiezas: data.cantidadPiezas,
    }
}

export default ModificaIngredientes;
