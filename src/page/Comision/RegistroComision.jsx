import { Col, Form, Button } from "react-bootstrap";
import { actualizarComision, obtenerComisiones, registrarComision } from "../../api/comision"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Comision() {
    const [comision, setComision] = useState([]);

    const cargarComision = () => {
        try {
            obtenerComisiones()
                .then((response) => {
                    const { data } = response;
                    console.log(data);
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

    const [formData, setFormData] = useState({
        nombreComision: "comisionTDC",
        estado: true,
        valor: comision[0]?.valor,
    });

    const actualizar = async (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
        console.log(comision[0]);
        console.log(formData);

        try {
            const response = await actualizarComision(comision[0]._id, formData.valor);
            console.log(response);
        } catch (e) {
            console.log(e);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // VOLVER A MOSTRAR SOLO EN CASO DE REQUIRIR OTRO REGISTRO
    // const onSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(formData);

    //     const dataTemp = formData;

    //     try {
    //         const response = registrarComision(dataTemp);
    //         console.log(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <div className="row g-3">
            <Col xs="auto">
                <Form className="justify-content-center" >
                    <div className="d-flex align-items-center justify-content-center">
                        <Form.Control
                            type="number"
                            name="valor"
                            placeholder="Ingresa el valor"
                            className="w-auto me-2"
                            value={formData.valor}
                            onChange={handleInputChange}
                        />
                        <span>%</span>
                        <Button onClick={actualizar} className="ms-2 btn btn-info">
                            Actualizar
                        </Button>
                    </div>
                </Form>
            </Col>
        </div>
    );
}

export default Comision;
