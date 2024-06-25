import { useEffect, useState } from "react";
import { listarVentasRangoFechas } from "../../../api/ventas";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../components/Modal/BasicModal";
import DetallesListaVentas from "./DetallesListaVentas";
import ReportePDF from "./GenerarDocs/ReportePDF";
import { listarCategorias } from "../../../api/categorias";

function ListVentas(props) {
    const { fechaInicial, fechaFinal } = props;

    const [listCategorias, setListCategorias] = useState([]);
    const [categoriasCargadas, setCategoriasCargadas] = useState(false);
    const [listVentas, setListVentas] = useState([]);
    const [contadorVentas, setContadorVentas] = useState(0);
    const [totalTotal, setTotalTotal] = useState(0);
    const [totalEfectivo, setTotalEfectivo] = useState(0);
    const [totalTransferencia, setTotalTransferencia] = useState(0);
    const [totalTDC, setTotalTDC] = useState(0);

    // PARA EL MODAL
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const cargarCategorias = async () => {
        try {
            const response = await listarCategorias();
            const { data } = response;

            const categoriasConProds = data.map(categoria => ({
                id: categoria._id,
                nombre: categoria.nombre,
                cantProds: 0
            }));

            setListCategorias(categoriasConProds);
            setCategoriasCargadas(true);
        } catch (error) {
            console.log(error);
        }
    };

    const detallesListaVentas = (content) => {
        setTitulosModal("Detalles Ventas");
        setContentModal(content);
        setShowModal(true);
    }

    const obtenerVentasPorFechas = async () => {
        try {
            // Asegurarse de que las fechas están en el formato correcto
            const fechaInicio = dayjs(fechaInicial).format('YYYY-MM-DD');
            const fechaFin = dayjs(fechaFinal).format('YYYY-MM-DD');

            console.log(fechaInicio, fechaFin);

            const response = await listarVentasRangoFechas(fechaInicio, fechaFin);
            const { data } = response;
            setListVentas(data);
            setContadorVentas(data.length); // Usa `data` aquí en lugar de `listVentas`
            obtenerTotalesVentas(data); // Usa `data` aquí en lugar de `listVentas`
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerTotalesVentas = (ventas) => {
        let totalTotal = ventas.reduce((acc, venta) => acc + venta.total, 0);
        let totalEfectivo = ventas
            .filter(venta => venta.tipoPago === 'Efectivo')
            .reduce((acc, venta) => acc + venta.total, 0);
        let totalTransferencia = ventas
            .filter(venta => venta.tipoPago === 'Transferencia')
            .reduce((acc, venta) => acc + venta.total, 0);
        let totalTDC = ventas
            .filter(venta => venta.tipoPago === 'TDC')
            .reduce((acc, venta) => acc + venta.total, 0);
        
        setTotalTotal(totalTotal);
        setTotalEfectivo(totalEfectivo);
        setTotalTransferencia(totalTransferencia);
        setTotalTDC(totalTDC);
    };

    useEffect(() => {
        if (fechaInicial && fechaFinal) {
            obtenerVentasPorFechas();
            cargarCategorias();
        }
    }, [fechaInicial, fechaFinal]);

    const columns = [
        {
            name: "No. Ticket",
            selector: row => row.numeroTiquet,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo pedido",
            selector: row => (
                    <>{row.hacerPedido} / {row.tipoPedido}</>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => row.fecha,
            sortable: true,
            center: true,
            reorder: false
        },
        {
            name: "Productos",
            selector: row => row.productos.length, // Asegúrate de que productos sea un array
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Método de Pago",
            selector: row => (row.metodosPago.efectivo.estado ? "Efectivo" : row.metodosPago.tdc.estado ? "TDC" : "Transferencia"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total",
            selector: row => (
                <>
                    <Badge
                        bg="success"
                    >
                        ${new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(row.total)} MXN
                    </Badge>
                </>
            ),
            sortable: true,
            center: true,
            reorder: false
        }
    ];

    return (
        <>
            <Row>
                <Col>
                    <Card
                        bg="success"
                        text="white"
                        className="p-0"
                    >
                        <Card.Body className="p-2">
                            <p className="fs-6 mb-0">Total de {contadorVentas} ventas:</p>
                            <h3>$ {totalTotal}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card
                        bg="success"
                        text="white"
                        className="p-0"
                    >
                        <Card.Body className="p-2">
                            <p className="fs-6 mb-0">Total en Efectivo:</p>
                            <h3>$ {totalEfectivo}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card
                        bg="success"
                        text="white"
                        className="p-0"
                    >
                        <Card.Body className="p-2">
                            <p className="fs-6 mb-0">Total en Transferencia:</p>
                            <h3>$ {totalTransferencia}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card
                        bg="success"
                        text="white"
                        className="p-0"
                    >
                        <Card.Body className="p-2">
                            <p className="fs-6 mb-0">Total en TDC:</p>
                            <h3>$ {totalTDC}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Container
                        className="p-0"
                        text="black"
                        border="0"
                    >
                        <div className="d-flex justify-content-around">
                            <ReportePDF
                                listVentas={listVentas}
                                fechaInicial={fechaInicial}
                                fechaFinal={fechaFinal}
                            />
                        </div>
                        <div className="mt-2 d-flex justify-content-center">
                            <Button 
                                className="" 
                                variant="secondary"
                                onClick={() => detallesListaVentas(
                                    <DetallesListaVentas
                                        listCategorias={listCategorias}
                                        listVentas={listVentas}
                                        setShow={setShowModal}
                                        fechaInicial={fechaInicial}
                                        fechaFinal={fechaFinal}
                                    />
                                )}
                            >
                                <FontAwesomeIcon icon={faCircleInfo}/> Ver detalles
                            </Button>
                        </div>
                    </Container>
                </Col>
            </Row>
    
            <DataTable
                columns={columns} // Cambia content a columns
                data={listVentas}
                customStyles={estilos}
            />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListVentas;
