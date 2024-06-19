import { useState } from 'react';
import { registraIngredientes } from '../../../../api/ingredientes';
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { subeArchivosCloudinary } from '../../../../api/cloudinary';
import { toast } from "react-toastify";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../../components/Logs/LogsSistema/LogsSistema';

function RegistroIngredientes(props) {
    const { setShowModal, navigate } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    //Para almacenar la imagen del producto que se guardara a la bd
    const [imagenIngrediente, setImagenIngrediente] = useState(null);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.nombre || !formData.umPrimaria || !formData.costoAdquisicion) {
            toast.warning("Completa el formulario");
        } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                if(imagenIngrediente) {
                subeArchivosCloudinary(imagenIngrediente, "ingrediente").then(response => {
                    const { data } = response;

                    const precio = formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umAdquisicion === "Decá" ? parseFloat(formData.costoAdquisicion) / 100 : formData.umAdquisicion === "Hectó" ? parseFloat(formData.costoAdquisicion) / 10 : formData.umAdquisicion === "Kiló" ? parseFloat(formData.costoAdquisicion) / 1000 : formData.umAdquisicion === "Decí" ? parseFloat(formData.costoAdquisicion) * 10 : formData.umAdquisicion === "Centí" ? parseFloat(formData.costoAdquisicion) * 100 : formData.umAdquisicion === "Milí" ? parseFloat(formData.costoAdquisicion) * 1000 : formData.umAdquisicion == formData.umPrimaria ? formData.costoAdquisicion : "";

                    const dataTemp = {
                        nombre: formData.nombre,
                        umPrimaria: formData.umPrimaria,
                        costoAdquisicion: formData.costoAdquisicion,
                        umAdquisicion: formData.umPrimaria === "Paquete" ? "Paquete" : formData.umAdquisicion,
                        umProduccion: formData.umPrimaria === "Paquete" ? "Piezas" : formData.umProduccion,
                        cantidadPiezas: formData.cantidadPiezas,
                        cantidad: "0",
                        costoProduccion: formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umProduccion === "Decá" ? parseFloat(precio) * 100 : formData.umProduccion === "Hectó" ? parseFloat(formData.umAdquisicion) * 10 : formData.umProduccion === "Kiló" ? parseFloat(precio) * 1000 : formData.umProduccion === "Decí" ? parseFloat(precio) / 10 : formData.umProduccion === "Centí" ? parseFloat(precio) / 100 : formData.umProduccion === "Milí" ? parseFloat(precio) / 1000 : formData.umProduccion == formData.umPrimaria ? precio : "",
                        negocio: "LA NENA",
                        imagen: data.secure_url,
                        estado: "true"
                    }
                    registraIngredientes(dataTemp).then(response => {
                        const { data } = response;
                        navigate({
                            search: queryString.stringify(""),
                        });
                        LogsInformativos("Se ha registrado el ingrediente " + formData.nombre, data.datos);
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
                        cantidad: "0",
                        costoProduccion: formData.umPrimaria === "Paquete" ? parseFloat(formData.costoAdquisicion) / formData.cantidadPiezas : formData.umProduccion === "Decá" ? parseFloat(precio) * 100 : formData.umProduccion === "Hectó" ? parseFloat(formData.umAdquisicion) * 10 : formData.umProduccion === "Kiló" ? parseFloat(precio) * 1000 : formData.umProduccion === "Decí" ? parseFloat(precio) / 10 : formData.umProduccion === "Centí" ? parseFloat(precio) / 100 : formData.umProduccion === "Milí" ? parseFloat(precio) / 1000 : formData.umProduccion == formData.umPrimaria ? precio : "",
                        negocio: "LA NENA",
                        imagen: "",
                        estado: "true"
                    }
                    registraIngredientes(dataTemp).then(response => {
                        const { data } = response;
                        navigate({
                            search: queryString.stringify(""),
                        });
                        LogsInformativos("Se ha registrado el ingrediente " + formData.nombre, data.datos);
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

    console.log(formData);

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

function initialFormValue() {
    return {
        nombre: "",
        umPrimaria: "",
        costoAdquisicion: "",
        umAdquisicion: "",
        umProduccion: "",
        costoProduccion: "",
        cantidadPiezas: "",
    }
}

export default RegistroIngredientes;
