import { useState, useEffect, useActionState } from 'react';
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

    // Data for display
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

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const tipo = fd.get("tipo");
        const cantidadStr = fd.get("cantidad");
        const cantidad = parseFloat(cantidadStr);

        if (!tipo || !cantidadStr || tipo === "Elige una opción") {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            // Fetch fresh data for integrity
            const [ingredienteRes, movimientosRes] = await Promise.all([
                obtenerIngredientes(id),
                listarMovimientosIngredientes(id)
            ]);

            const currentData = ingredienteRes.data;
            const history = movimientosRes.data;

            const currentStock = parseFloat(currentData.cantidad);
            const currentName = currentData.nombre;
            const currentUm = currentData.umProduccion;

            let nuevaCantidad = currentStock;

            if (tipo === "Entrada") {
                nuevaCantidad = currentStock + cantidad;
            } else if (tipo === "Salida") {
                if (currentStock === 0 || cantidad > currentStock) {
                    Swal.fire({ icon: 'error', title: "Las existencias no pueden satisfacer la solicitud", timer: 1600, showConfirmButton: false });
                    return { error: "Stock insuficiente" };
                }
                nuevaCantidad = currentStock - cantidad;
            }

            const dataMovimiento = {
                nombre: currentName,
                tipo: tipo,
                cantidad: cantidadStr,
                um: currentUm,
                fecha: new Date(),
            }

            // Combine history
            const finalEntrada = history.concat(dataMovimiento);

            const dataTempFinal = {
                movimientos: finalEntrada,
                cantidad: nuevaCantidad.toString()
            }

            const response = await registraMovimientosIngrediente(id, dataTempFinal);
            const { data } = response;
            const { mensaje, datos } = data;

            Swal.fire({ icon: 'success', title: mensaje, timer: 1600, showConfirmButton: false });
            LogsInformativos(`Se han actualizado las existencias del ingrediente ${currentName}`, datos);

            navigate({
                search: queryString.stringify(""),
            });
            cancelarRegistro();
            return null;

        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al registrar movimiento", showConfirmButton: false, timer: 1600 });
            return { error: "Error" };
        }
    }, null);

    return (
        <>
            <Form action={action}>
                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue=""
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
                                step="any"
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
                            <FontAwesomeIcon icon={faSave} /> {!isPending ? "Registrar" : <Spinner animation="border" size="sm" />}
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

export default RegistroMovimientosIngredientes;

