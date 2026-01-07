import { useState, useEffect } from 'react';
import { Badge, Container } from "react-bootstrap";
import "../../../scss/styles.scss";
import BasicModal from "../../../components/Modal/BasicModal";
import ListProductoTiquet from "../../Ventas/components/DetallesVenta";
import DataTablecustom from '../../../components/Generales/DataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { formatMoneda } from '../../../components/Generales/FormatMoneda';

function ListHistorialVentasDia(props) {
    const { listDetallesDia, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas } = props;

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para ver los producto vendidos en el tiquet
    const detallesTiquet = (content) => {
        setTitulosModal("Detalles del tiquet");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: "No. Ticket",
            selector: row => row.numeroTiquet,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Productos",
            selector: row => row.productosVendidos,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total",
            selector: row => formatMoneda(row.total),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <>
                            <Badge
                                title="ver productos vendidos"
                                bg="primary"
                                className="vistaDetalle"
                                onClick={() => {
                                    detallesTiquet(
                                        <ListProductoTiquet
                                            datos={row}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                        </>
                    </div>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    return (
        <>
            <DataTablecustom datos={listDetallesDia} columnas={columns} title={"Detalles del día"} />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );

}

export default ListHistorialVentasDia;
