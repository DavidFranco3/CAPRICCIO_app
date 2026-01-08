import { Col, Form, Button, Spinner } from "react-bootstrap";
import { actualizarComision, obtenerComisiones } from "../../api/comision"
import { useEffect, useState, useActionState } from "react";
import Swal from 'sweetalert2';

function Comision(props) {
    const [comision, setComision] = useState([]);

    const cargarComision = () => {
        try {
            obtenerComisiones()
                .then((response) => {
                    const { data } = response;
                    setComision(data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        cargarComision();
    }, []);

    const [errorState, action, isPending] = useActionState(async (previousState, formData) => {
        const valor = formData.get("valor");

        if (!valor) {
            return { error: "Valor requerido" };
        }

        const dataTemp = {
            valor: valor
        }

        try {
            // Assuming we update the first/only commission found
            if (!comision[0]?._id) return { error: "No comision ID" };

            const response = await actualizarComision(comision[0]._id, dataTemp);
            Swal.fire({ icon: 'success', title: "Comisión actualizada correctamente", timer: 1600, showConfirmButton: false });
            props.setShowModal(false);
            return null;
        } catch (e) {
            console.log(e);
            Swal.fire({ icon: 'error', title: "Error al actualizar", timer: 1600, showConfirmButton: false });
            return { error: "Error" };
        }
    }, null);

    return (
        <div className="row g-3">
            <Col xs="auto">
                <Form action={action} className="justify-content-center" >
                    <div className="d-flex align-items-center justify-content-center">
                        <Form.Control
                            type="number"
                            name="valor"
                            placeholder="Ingresa el valor"
                            className="w-auto me-2"
                            defaultValue={comision[0]?.valor}
                            key={comision[0]?.valor ? "loaded" : "loading"}
                        />
                        <span>%</span>
                        <Button type="submit" className="ms-2 btn btn-info" disabled={isPending}>
                            {isPending ? <Spinner animation="border" size="sm" /> : "Actualizar"}
                        </Button>
                    </div>
                </Form>
            </Col>
        </div>
    );
}

export default Comision;

