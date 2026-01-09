import { useState, useEffect, useActionState } from 'react';
import { registraMovimientos } from "../../../../../api/movimientosCajas";
import { actualizaVenta, obtenerVentas } from "../../../../../api/ventas";
import { obtenerCaja } from "../../../../../api/cajas";
import "../../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../../Logs/components/LogsSistema/LogsSistema';
import { LogCajaActualizacion } from '../Gestion/GestionMovimientos';
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../../../api/auth";
import { obtenerUsuario } from "../../../../../api/usuarios";
import { obtenerUltimaCajaCajero } from '../../../../../api/cajas';

function RegistroMovimientosCajasVentas(props) {
    const { setShowModal, navigate, location, datosVentas } = props;

    const { id, numeroTiquet, usuario } = datosVentas

    // UI State for calculations
    const [formData, setFormData] = useState(initialFormValue(datosVentas));
    const [formDataMovimiento, setFormDataMovimiento] = useState(initialFormValueMovimiento());

    const [idCajero, setIdCajero] = useState("");
    const [cajero, setCajero] = useState("");

    const obtenerDatosUsuario = () => {
        try {
            obtenerUsuario(usuario).then(response => {
                const { data } = response;
                const { _id, nombre } = data;
                setIdCajero(_id);
                setCajero(nombre);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    console.log("No hay internet")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const [caja, setCaja] = useState("");

    const cargarDatosCajas = () => {
        try {
            obtenerUltimaCajaCajero(usuario).then(response => {
                const { data } = response;
                const { _id } = data[0];
                setCaja(_id);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    console.log("No hay internet")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCajas();
    }, [idCajero]);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataMovimiento({ ...formDataMovimiento, [e.target.name]: e.target.value });
    };

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const tipoPago = fd.get("tipoPago");
        const iva = fd.get("iva");
        const efectivoStr = fd.get("efectivo");

        const movimiento = "Venta";
        const montoBase = parseFloat(datosVentas.total);

        if (!movimiento || !tipoPago || tipoPago === "Elige una opción") {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            const cajaRes = await obtenerUltimaCajaCajero(usuario);
            const currentCajaId = cajaRes.data[0]._id;

            const efectivoVal = parseFloat(efectivoStr || 0);
            const monto = montoBase;

            let totalCalc = monto;
            if (iva === "si") {
                totalCalc = monto + (monto * 0.16);
            }

            let cambio = 0;
            if (tipoPago === "Efectivo") {
                cambio = efectivoVal - totalCalc;
            } else {
                cambio = efectivoVal - (iva === "si" ? totalCalc : monto);
            }

            const dataTemp = {
                idCaja: currentCajaId,
                idCajero: usuario,
                cajero: cajero,
                movimiento: movimiento,
                pago: tipoPago,
                monto: monto,
                estado: "true",
            }

            const response = await registraMovimientos(dataTemp);
            const { data } = response;

            let balanceChange = 0;
            if (movimiento === "Venta") {
                if (tipoPago === "Efectivo") balanceChange = monto;
            }

            LogCajaActualizacion(currentCajaId, balanceChange);
            LogsInformativos("Se ha registrado el movimiento del cajero " + cajero, data.datos);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });

            // Update Venta
            const dataTemp2 = {
                tipoPago: tipoPago,
                efectivo: efectivoStr,
                cambio: cambio.toFixed(2),
                total: totalCalc.toFixed(2),
                pagado: "true",
                iva: iva === "si" ? (monto * 0.16).toFixed(2) : "0",
                comision: tipoPago === "Tarjeta" ? monto : "0"
            }

            await actualizaVenta(id, dataTemp2);

            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Se actualizo la venta " + numeroTiquet, dataTemp2);
            cancelarRegistro();
            return null;

        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al registrar venta", timer: 1600, showConfirmButton: false });
            return { error: "Error" };
        }
    }, null);

    return (
        <>
            <Form action={action} onChange={onChange}>
                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Cajero</Form.Label>
                            <Form.Control
                                type="text"
                                name="cajero"
                                placeholder="Escribe el nombre del cajero"
                                value={cajero}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Movimiento</Form.Label>
                            <Form.Control
                                as="select"
                                name="movimiento"
                                placeholder="Escribe el nombre del cajero"
                                defaultValue={formData.movimiento}
                                disabled
                            >
                                <option>Elige una opción</option>
                                <option value="Fondo de caja">Fondo de caja</option>
                                <option value="Venta">Venta</option>
                                <option value="Retiro">Retiro</option>
                                <option value="Aumento">Aumento</option>
                                <option value="Corte de caja">Corte de caja</option>
                                <option value="Cierre">Cierre</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Método de pago
                            </Form.Label>

                            <Form.Control
                                as="select"
                                defaultValue=""
                                name="tipoPago"
                            >
                                <option>Elige una opción</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                IVA
                            </Form.Label>

                            <Form.Control
                                as="select"
                                defaultValue=""
                                name="iva"
                            >
                                <option>Elige una opción</option>
                                <option value="si">Si</option>
                                <option value="no">No</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        {
                            formDataMovimiento.tipoPago == "Efectivo" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Efectivo
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="efectivo"
                                            placeholder="Escribe la cantidad de dinero ingresado"
                                            step="0.1"
                                            min="0"
                                            defaultValue={formDataMovimiento.efectivo}
                                        />
                                    </Form.Group>
                                </>
                            )
                        }

                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>
                                Monto del movimiento
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="monto"
                                placeholder="Escribe la cantidad"
                                step="0.1"
                                min="0"
                                value={formDataMovimiento.tipoPago == "Efectivo" && formDataMovimiento.iva == "si" ? (formData.monto + formData.monto * parseFloat("0.16")).toFixed(2) : formDataMovimiento.tipoPago == "Tarjeta" && formDataMovimiento.iva == "si" ? (formData.monto + formData.monto * parseFloat("0.16")).toFixed(2) : formDataMovimiento.tipoPago == "Tarjeta" && formDataMovimiento.iva == "no" ? (formData.monto).toFixed(2) : formDataMovimiento.tipoPago == "Transferencia" && formDataMovimiento.iva == "si" ? (formData.monto + formData.monto * parseFloat("0.16")).toFixed(2) : formData.monto.toFixed(2)}
                                disabled
                            />
                        </Form.Group>

                        {
                            formDataMovimiento.tipoPago == "Efectivo" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridNombre">
                                        <Form.Label>
                                            Cambio
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cambio"
                                            placeholder="Escribe la cantidad de dinero ingresado"
                                            step="0.1"
                                            min="0"
                                            disabled
                                            value={formDataMovimiento.tipoPago == "Efectivo" && formDataMovimiento.iva == "si" ? (parseFloat(formDataMovimiento.efectivo) - (formData.monto + formData.monto * parseFloat("0.16"))).toFixed(2) : (formDataMovimiento.efectivo - formData.monto).toFixed(2)}
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
                            title="Registrar movimiento"
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

function initialFormValue(data) {
    return {
        movimiento: "Venta",
        monto: data.total,
        pago: data.tipoPago,
    }
}

function initialFormValueMovimiento() {
    return {
        tipoPago: "",
        efectivo: "",
        iva: "",
        comision: "",
    }
}

export default RegistroMovimientosCajasVentas;
