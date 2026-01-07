import { useState, useEffect } from 'react';
import {
    listarMovimientosIngredientes,
    obtenerIngredientes, registraMovimientosIngrediente
} from "../../../../../api/ingredientes";
import "../../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../../Logs/components/LogsSistema/LogsSistema';

function RegistroMovimientosIngredientes(props) {
    const { setShowModal, navigate, id } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    const [cantidadAcumulada, setCantidadAcumulada] = useState(0);
    const [nombreIngrediente, setNombreIngrediente] = useState("");
    const [umIngrediente, setUmIngrediente] = useState("");

    const obtenerCantidad = () => {
        try {
            obtenerIngredientes(id).then(response => {
                const { data } = response;
                setCantidadAcumulada(data.cantidad);
                setNombreIngrediente(data.nombre);
                setUmIngrediente(data.umProduccion);
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerCantidad();
    }, []);


    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.tipo || !formData.cantidad) {
            // console.log("Valores "+ validCount + " del form " + size(formData))
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false })
        } else {
            setLoading(true)

            try {
                // Obtener los datos de la materia prima, para recuperar todos los movimientos y almacenar uno nuevo
                listarMovimientosIngredientes(id).then(response => {
                    const { data } = response;

                    // Validar tipo y determinar nuevas existencias
                    if (formData.tipo === "Entrada") {
                        const nuevaCantidad = parseFloat(cantidadAcumulada) + parseFloat(formData.cantidad);

                        const dataMovimiento = {
                            nombre: nombreIngrediente,
                            tipo: formData.tipo,
                            cantidad: formData.cantidad,
                            um: umIngrediente,
                            fecha: new Date(),
                        }

                        const finalEntrada = data.concat(dataMovimiento)

                        const dataTempFinal = {
                            movimientos: finalEntrada,
                            cantidad: nuevaCantidad.toString()
                        }

                        //console.log("datos finales ", movimientosFinal)


                        registraMovimientosIngrediente(id, dataTempFinal).then(response => {
                            const { data } = response;
                            //console.log(response)
                            const { mensaje, datos } = data;
                            Swal.fire({ icon: 'success', title: mensaje, timer: 1600, showConfirmButton: false })
                            setLoading(false);
                            LogsInformativos(`Se han actualizado las existencias del ingrediente ${nombreIngrediente}`, datos)
                            navigate({
                                search: queryString.stringify(""),
                            });
                            cancelarRegistro();
                        });
                    }
                    if (formData.tipo === "Salida") {
                        // console.log("Afecta existencias stock")
                        if (parseFloat(cantidadAcumulada) === 0 || parseFloat(formData.cantidad) > parseFloat(cantidadAcumulada)) {
                            Swal.fire({ icon: 'error', title: "Las existencias no pueden satisfacer la solicitud", timer: 1600, showConfirmButton: false })
                            setLoading(false)
                        } else {
                            const nuevaCantidad = parseFloat(cantidadAcumulada) - parseFloat(formData.cantidad);

                            const dataMovimiento = {
                                nombre: nombreIngrediente,
                                tipo: formData.tipo,
                                cantidad: formData.cantidad,
                                um: umIngrediente,
                                fecha: new Date(),
                            }

                            const finalEntrada = data.concat(dataMovimiento)

                            const dataTempFinal = {
                                movimientos: finalEntrada,
                                cantidad: nuevaCantidad.toString()
                            }
                            registraMovimientosIngrediente(id, dataTempFinal).then(response => {
                                const { data } = response;
                                const { mensaje, datos } = data;
                                Swal.fire({ icon: 'success', title: mensaje, timer: 1600, showConfirmButton: false })
                                setLoading(false);
                                LogsInformativos(`Se han actualizado las existencias del ingrediente ${nombreIngrediente}`, datos)
                                navigate({
                                    search: queryString.stringify(""),
                                });
                                cancelarRegistro();
                            })
                        }
                    }

                })
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
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option>Elige una opción</option>
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>UM</Form.Label>
                            <Form.Control
                                type="text"
                                name="umIngrediente"
                                placeholder="Escribe la cantidad"
                                value={umIngrediente}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                name="cantidad"
                                placeholder="Escribe la cantidad"
                                defaultValue={formData.cantidad}
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
        tipo: "",
        cantidad: "",
    }
}

export default RegistroMovimientosIngredientes;

