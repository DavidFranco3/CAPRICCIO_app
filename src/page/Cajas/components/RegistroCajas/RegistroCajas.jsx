import { useState } from 'react';
import { registraCajas } from "../../../../api/cajas";
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map } from "lodash";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';

function RegistroCajas(props) {
    const { setShowModal, navigate, listUsuarios } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.cajero) {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
        } else {
            try {
                setLoading(true);

                const temp = formData.cajero.split("/");

                const dataTemp = {
                    idCajero: temp[0],
                    cajero: temp[1],
                    saldo: "0",
                    estado: "true"
                }
                registraCajas(dataTemp).then(response => {
                    const { data } = response;
                    navigate({
                        search: queryString.stringify(""),
                    });
                    LogsInformativos("Se ha registrado la caja para el cajero " + dataTemp.cajero, data.datos);
                    Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
                    cancelarRegistro();
                })
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
                            <Form.Label>Cajero</Form.Label>
                            <Form.Control
                                as="select"
                                name="cajero"
                                placeholder="Escribe el nombre del cajero"
                                defaultValue={formData.cajero}
                            >
                                <option>Elige una opción</option>
                                {map(listUsuarios, (usuario, index) => (
                                    <option key={index} value={usuario?.id + "/" + usuario?.nombre}>{usuario?.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Registrar caja"
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
        cajero: ""
    }
}

export default RegistroCajas;

