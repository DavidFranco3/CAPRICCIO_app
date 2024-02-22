import { useState, useEffect } from 'react';
import { registraMovimientos } from "../../../api/movimientosCajas";
import { actualizaVenta, obtenerVentas } from "../../../api/ventas";
import { obtenerCaja } from "../../../api/cajas";
import "../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogCajaActualizacion } from "../../Cajas/Gestion/GestionCajas";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { obtenerUsuario } from "../../../api/usuarios";
import { obtenerUltimaCajaCajero } from "../../../api/cajas";
import { LogVentaActualizacion } from "../../Ventas/Gestion/GestionVentas"

function RegistroMovimientosCajasVentas(props) {
    const { setShowModal, navigate, location, datosVentas } = props;

    const { id, numeroTiquet, usuario } = datosVentas

    const [formData, setFormData] = useState(initialFormValue(datosVentas));
    const [formDataMovimiento, setFormDataMovimiento] = useState(initialFormValueMovimiento());
    const [loading, setLoading] = useState(false);

    const [idCajero, setIdCajero] = useState("");
    const [cajero, setCajero] = useState("");

    const obtenerDatosUsuario = () => {
        try {
            obtenerUsuario(usuario).then(response => {
                const { data } = response;
                const { _id, nombre } = data;
                //console.log(data)
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
                console.log(_id)
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

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.movimiento || !formDataMovimiento.tipoPago) {
            toast.warning("Completa el formulario");
        } else {
            try {
                setLoading(true);

                const dataTemp = {
                    idCaja: caja,
                    idCajero: usuario,
                    cajero: cajero,
                    movimiento: formData.movimiento,
                    pago: formData.pago,
                    monto: formData.monto,
                    estado: "true",
                }
                registraMovimientos(dataTemp).then(response => {
                    const { data } = response;
                    //LogVentaActualizacion(id, numeroTiquet, formDataMovimiento.tipoPago, formDataMovimiento.efectivo, formDataMovimiento.iva, formData.monto, navigate)
                    LogCajaActualizacion(caja, formData.movimiento == "Fondo de caja" ? formData.monto : formData.movimiento == "Venta" && formData.pago == "Transferencia" ? 0 : formData.movimiento == "Venta" && formData.pago == "Tarjeta" ? 0 : formData.movimiento == "Venta" && formData.pago == "Efectivo" ? formData.monto : formData.movimiento == "Retiro" ? parseFloat(formData.monto) * -1 : formData.movimiento == "Aumento" ? formData.monto : 0);
                    LogsInformativos("Se ha registrado el movimiento del cajero " + dataTemp.cajero, data.datos);
                    toast.success(data.mensaje);
                }).catch(e => {
                    console.log(e)
                })

                const dataTemp2 = {

                    tipoPago: formDataMovimiento.tipoPago,
                    efectivo: formDataMovimiento.efectivo,
                    cambio:formDataMovimiento.tipoPago == "Efectivo" && formDataMovimiento.iva == "si" ? (parseFloat(formDataMovimiento.efectivo) - (formData.monto + formData.monto * parseFloat("0.16"))).toFixed(2) : (formDataMovimiento.efectivo - formData.monto).toFixed(2),
                    total: formDataMovimiento.tipoPago == "Efectivo" && formDataMovimiento.iva == "si" ? formData.monto + formData.monto * parseFloat("0.16") : formDataMovimiento.tipoPago == "Tarjeta" && formDataMovimiento.iva == "si" ? formData.monto + formData.monto * parseFloat("0.16") : formDataMovimiento.tipoPago == "Tarjeta" && formDataMovimiento.iva == "no" ? formData.monto : formDataMovimiento.tipoPago == "Transferencia" && formDataMovimiento.iva == "si" ? formData.monto + formData.monto * parseFloat("0.16") : formData.monto,
                    pagado: "true",
                    iva: formDataMovimiento.iva == "si" ? (formData.monto * parseFloat("0.16")).toFixed(2) : "0",
                    comision: formDataMovimiento.tipoPago == "Tarjeta"? formData.monto : "0"
                }
                actualizaVenta(id, dataTemp2).then(response => {
                    const { data } = response;
                    navigate({
                        search: queryString.stringify(""),
                    });
                    LogsInformativos("Se actualizo la venta " + numeroTiquet, dataTemp2);
                    cancelarRegistro();
                    // console.log("Actualización de saldo personal")
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataMovimiento({ ...formDataMovimiento, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
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
                                defaultValue={formDataMovimiento.tipoPago}
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
                                defaultValue={formDataMovimiento.iva}
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
                                            name="efectivo"
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

function initialFormDataCajaInitial() {
    return {
        idCajero: "",
        cajero: "",
    }
}

function initialFormDataCaja(data) {
    return {
        idCajero: data.idCajero,
        cajero: data.cajero,
    }
}

export default RegistroMovimientosCajasVentas;
