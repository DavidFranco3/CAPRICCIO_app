import { startTransition, useActionState } from 'react';
import { registraCajas } from "../../../../api/cajas";
import "../../../../scss/styles.scss";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map } from "lodash";
import Swal from 'sweetalert2';
import queryString from "query-string";
import { faX, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogsInformativos } from '../../../Logs/components/LogsSistema/LogsSistema';
import { useForm } from "react-hook-form";

function RegistroCajas(props) {
    const { setShowModal, navigate, listUsuarios } = props;
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
        const cajero = fd.get("cajero");

        if (!cajero || cajero === "Elige una opción") {
            Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
            return { error: "Incompleto" };
        }

        try {
            const temp = cajero.split("/");

            const dataTemp = {
                idCajero: temp[0],
                cajero: temp[1],
                saldo: "0",
                estado: "true"
            }

            const response = await registraCajas(dataTemp);
            const { data } = response;

            navigate({
                search: queryString.stringify(""),
            });
            LogsInformativos("Se ha registrado la caja para el cajero " + dataTemp.cajero, data.datos);
            Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
            cancelarRegistro();
            return null;

        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al registrar la caja", timer: 1600, showConfirmButton: false });
            return { error: "Error" };
        }
    }, null);

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        startTransition(() => {
            action(formData);
        });
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Cajero</Form.Label>
                            <Form.Select
                                defaultValue=""
                                {...register("cajero", {
                                    required: "Selecciona una opción",
                                    validate: value => value !== "Elige una opción" || "Selecciona una opción válida"
                                })}
                                isInvalid={!!errors.cajero}
                            >
                                <option>Elige una opción</option>
                                {map(listUsuarios, (usuario, index) => (
                                    <option key={index} value={usuario?.id + "/" + usuario?.nombre}>{usuario?.nombre}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.cajero?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                    <Col>
                        <Button
                            title="Registrar caja"
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
                            type="button"
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

export default RegistroCajas;

