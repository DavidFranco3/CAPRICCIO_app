import { useState } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "../../../scss/styles.scss";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

function Descuento(props) {
    const { setShowModal, tipoDescuento, setTipoDescuento, dineroDescontado, setDineroDescontado, porcentajeDescontado, setPorcentajeDescontado } = props;

    const dataTemp = {
        tipoDescuento: tipoDescuento,
        dineroDescontado: dineroDescontado,
        porcentajeDescontado: porcentajeDescontado
    }

    const [formData, setFormData] = useState(initialFormValue(dataTemp));
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.tipoDescuento) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true);
            setTipoDescuento(formData.tipoDescuento);
            setDineroDescontado(formData.dineroDescontado);
            setPorcentajeDescontado(parseFloat(formData.porcentajeDescontado) / 100);
            cancelarRegistro();
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    console.log(formData.hacerPedido)

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>

                <div className="metodoDePago">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEstado">
                            <Form.Label>
                                Tipo de descuento
                            </Form.Label>

                            <Form.Control as="select"
                                defaultValue={formData.tipoDescuento}
                                name="tipoDescuento"
                            >
                                <option>Elige una opción</option>
                                <option value="Porcentaje">Porcentaje</option>
                                <option value="Moneda">Moneda</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    {
                        (formData.tipoDescuento == "Porcentaje") &&
                        (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEstado">
                                        <Form.Label>
                                            Porcentaje
                                        </Form.Label>

                                        <Form.Control
                                            placeholder='Porcentaje Descontado'
                                            defaultValue={formData.porcentajeDescontado}
                                            name="porcentajeDescontado"
                                        />
                                    </Form.Group>
                                </Row>
                            </>
                        )
                    }

                    {
                        (formData.tipoDescuento == "Moneda") &&
                        (
                            <>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEstado">
                                        <Form.Label>
                                            Dinero
                                        </Form.Label>

                                        <Form.Control
                                            placeholder='Dinero Descontado'
                                            defaultValue={formData.dineroDescontado}
                                            name="dineroDescontado"
                                        />
                                    </Form.Group>
                                </Row>
                            </>
                        )
                    }

                </div>
            </Form>
        </>
    );
}

function initialFormValue(data) {
    return {
        tipoDescuento: data.tipoDescuento,
        dineroDescontado: data.dineroDescontado,
        porcentajeDescontado: data.porcentajeDescontado
    }
}

export default Descuento;
