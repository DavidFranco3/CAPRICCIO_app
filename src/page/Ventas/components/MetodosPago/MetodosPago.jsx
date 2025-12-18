import { useState } from 'react';
import { Button, Col, Form, Row, Spinner, Badge } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave, faCirclePlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {map} from "lodash";

function MetodosPago(props) {
    const { setListMetodosPago2, setShowModal  } = props;

    const [listMetodosPago, setListMetodosPago] = useState([]);

    const [formData, setFormData] = useState(initialFormValue());

    const [loading, setLoading] = useState(false);


    const renglon = listMetodosPago.length + 1;
console.log(formData.tipoPago)
    const addItems = () => {

        if (!formData.tipoPago) {
            toast.warning("Completa la información del metodo de pago");
        } else {

            const dataTemp = {
                metodoPago: formData.tipoPago,
            }

            //LogRegistroProductosOV(folioActual, cargaProductos.ID, cargaProductos.item, cantidad, um, precioUnitario, total, setListProductosCargados);
            // console.log(dataTemp)

            setListMetodosPago(
                [...listMetodosPago, dataTemp]
            );

            setFormData(initialFormValue)
            document.getElementById("tipoPago").value = "Elige una opción"
            //setTotalUnitario(0)
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setFormData(initialFormValue)
        document.getElementById("tipoPago").value = "Elige una opción"
    }

    console.log(listMetodosPago)

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listMetodosPago;
        newArray.splice(newArray.findIndex(a => a.metodoPago === producto.metodoPago), 1);
        setListMetodosPago([...newArray]);
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        setListMetodosPago2(listMetodosPago)
        cancelarRegistro();
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false);
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="metodoDePago">
                    <hr />
                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>A continuación, especifica los detalles del ingrediente y agregalo</h4>
                    </Badge>
                    <br />
                    <hr />

                    <Row>
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                ITEM
                            </Form.Label>
                            <Form.Control type="number"
                                id="index"
                                value={renglon}
                                name="index"
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Método de pago
                            </Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={formData.tipoPago}
                                name="tipoPago"
                                id="tipoPago"
                            >
                                <option>Elige una opción</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </Form.Control>
                        </Form.Group>
                        <Col sm="1">
                            <Form.Group as={Row} className="formGridCliente">
                                <Form.Label>
                                    &nbsp;
                                </Form.Label>

                                <Col>
                                    <Button
                                        variant="success"
                                        title="Agregar el producto"
                                        className="editar"
                                        onClick={() => {
                                            addItems()
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        title="Cancelar el producto"
                                        className="editar"
                                        onClick={() => {
                                            cancelarCargaProducto()
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faX} className="text-lg" />
                                    </Button>
                                </Col>

                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                {/* Listado de productos  */}
                <div className="tablaProductos">

                    {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                    {/* Inicia tabla informativa  */}
                    <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                        <h4>Listado de ingredientes seleccionados</h4>
                    </Badge>
                    <br />
                    <hr />
                    <table className="responsive-tableRegistroVentas"
                    >
                        <thead>
                            <tr>
                                <th scope="col">ITEM</th>
                                <th scope="col">Metodo</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                        </thead>
                        <tfoot>
                        </tfoot>
                        <tbody>
                            {map(listMetodosPago, (producto, index) => (
                                <tr key={index}>
                                    <td scope="row">
                                        {index + 1}
                                    </td>
                                    <td data-title="Descripcion">
                                        {producto.metodoPago}
                                    </td>
                                    <td data-title="Eliminar">
                                        <Badge
                                            bg="danger"
                                            title="Eliminar"
                                            className="eliminar"
                                            onClick={() => {
                                                removeItem(producto)
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Termina tabla informativa */}
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button title="Agregar Observaciones" type="submit" variant="success" className="registrar">
                            <FontAwesomeIcon icon={faSave} /> {!loading ? "Aceptar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button title="Cerrar ventana" variant="danger" className="cancelar" disabled={loading} onClick={cancelarRegistro}>
                            <FontAwesomeIcon icon={faX} /> Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );

}

function initialFormValue(data) {
    return {
        tipoPedido: "",
    }
}

export default MetodosPago;
