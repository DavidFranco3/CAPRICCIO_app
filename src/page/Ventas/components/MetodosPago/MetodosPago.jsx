import { useState, useActionState } from 'react';
import { Button, Col, Form, Row, Spinner, Badge } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave, faCirclePlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
import { map } from "lodash";

function MetodosPago(props) {
    const { setListMetodosPago2, setShowModal } = props;

    const [listMetodosPago, setListMetodosPago] = useState([]);
    const [tipoPago, setTipoPago] = useState("Elige una opción");

    const renglon = listMetodosPago.length + 1;

    const addItems = () => {
        if (!tipoPago || tipoPago === "Elige una opción") {
            Swal.fire({ icon: 'warning', title: "Completa la información del metodo de pago", timer: 1600, showConfirmButton: false });
        } else {
            const dataTemp = {
                metodoPago: tipoPago,
            }
            setListMetodosPago([...listMetodosPago, dataTemp]);
            setTipoPago("Elige una opción");
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        setTipoPago("Elige una opción");
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = [...listMetodosPago];
        newArray.splice(newArray.findIndex(a => a.metodoPago === producto.metodoPago), 1);
        setListMetodosPago(newArray);
    }

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false);
    };

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        setListMetodosPago2(listMetodosPago);
        cancelarRegistro();
        return null;
    }, null);

    return (
        <>
            <Form action={action}>
                <div className="metodoDePago">
                    <hr />
                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>A continuación, especifica los detalles del ingrediente y agregalo</h4>
                    </Badge>
                    <br />
                    <hr />

                    <Row>
                        <Form.Group as={Col} controlId="formGridIndex">
                            <Form.Label>
                                ITEM
                            </Form.Label>
                            <Form.Control type="number"
                                value={renglon}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Método de pago
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={tipoPago}
                                name="tipoPago"
                                onChange={(e) => setTipoPago(e.target.value)}
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

                                <Col className="d-flex">
                                    <Button
                                        variant="success"
                                        title="Agregar el producto"
                                        className="editar me-2"
                                        disabled={isPending}
                                        onClick={() => {
                                            addItems()
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        title="Cancelar el producto"
                                        className="editar"
                                        disabled={isPending}
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
                    <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                        <h4>Listado de ingredientes seleccionados</h4>
                    </Badge>
                    <br />
                    <hr />
                    <table className="responsive-tableRegistroVentas">
                        <thead>
                            <tr>
                                <th scope="col">ITEM</th>
                                <th scope="col">Metodo</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                        </thead>
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
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button title="Agregar Observaciones" type="submit" variant="success" className="registrar" disabled={isPending}>
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Aceptar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button title="Cerrar ventana" variant="danger" className="cancelar" disabled={isPending} onClick={cancelarRegistro}>
                            <FontAwesomeIcon icon={faX} /> Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default MetodosPago;

