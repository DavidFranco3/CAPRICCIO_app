import { useState, useEffect } from 'react';
import "../../../scss/styles.scss";
import { Badge, Col, Row, Container, Button } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import GeneraPDF from "../GeneraPDF";
import GeneraPdfProductosAdicionales from '../GeneraPDFProductosAdicionales';
import GeneraPdfFinal from '../GeneraPDFFinal';
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";

function DetallesVenta(props) {
    const { datos } = props;

    const { numeroTiquet, articulosVendidos, cliente } = datos;

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para cancelar la venta
    const handlePrint = (content) => {
        setTitulosModal("Detalles del ticket No. " + numeroTiquet.toString());
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const handlePrintAdicionales = (content) => {
        setTitulosModal("Productos adicionales del tiquet. " + numeroTiquet.toString());
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const handlePrintFinal = (content) => {
        setTitulosModal("Productos finales del tiquet. " + numeroTiquet.toString());
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: 'Producto',
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: ' Precio',
            selector: row => (
                <>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(row.precio)} MXN
                    </Badge>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(articulosVendidos);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                Mesa: {cliente}
                <DataTable
                    columns={columns}
                    data={articulosVendidos}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                />
                <br />
                <br />
                <Row>
                    <Col sm={4}>
                        <button
                            className="btnImprimirdeNuevo"
                            title="Ver ticket"
                            onClick={() => handlePrint(
                                <GeneraPDF
                                    datos={datos}
                                />
                            )}
                        > 🖨︎</button>
                        <h4 align="center">Pedido Inicial</h4>
                    </Col>
                    <Col sm={4}>
                        <button
                            className="btnImprimirdeNuevo"
                            title="Ver ticket"
                            onClick={() => handlePrintAdicionales(
                                <GeneraPdfProductosAdicionales
                                    datos={datos}
                                />
                            )}
                        > 🖨︎</button>
                        <h4 align="center">Productos adicionales</h4>
                    </Col>
                    <Col sm={4}>
                        <button
                            className="btnImprimirdeNuevo"
                            title="Ver ticket"
                            onClick={() => handlePrintFinal(
                                <GeneraPdfFinal
                                    datos={datos}
                                />
                            )}
                        > 🖨︎</button>
                        <h4 align="center">Ticket final</h4>
                    </Col>
                </Row>
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default DetallesVenta;
