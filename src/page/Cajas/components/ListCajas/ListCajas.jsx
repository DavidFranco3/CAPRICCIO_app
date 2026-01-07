import { useState, useEffect } from 'react';
import "../../../../scss/styles.scss";
import { Badge, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import BasicModal from '../../../../components/Modal/BasicModal';
import DataTablecustom from '../../../../components/Generales/DataTable';
import { useNavigate } from "react-router-dom";
import { formatFecha } from '../../../../components/Generales/FormatFecha';
import { formatMoneda } from '../../../../components/Generales/FormatMoneda';

function ListCajas(props) {
    const { listCajas } = props;

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la modificacion de productos
    const movimientos = (id) => {
        enrutamiento(`/MovimientosCajas/${id}`);
    }

    const columns = [
        {
            name: "Cajero",
            selector: row => row.cajero,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Saldo",
            selector: row => formatMoneda(row.saldo),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => formatFecha(row.fechaCreacion),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                        <Badge
                            title="Movimientos"
                            bg="primary"
                            className="editar cursor-pointer"
                            onClick={() => {
                                movimientos(row.id);
                            }}>
                            <FontAwesomeIcon icon={faEye} className="text-lg" />
                        </Badge>
                    </div>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listCajas);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <>
            <DataTablecustom datos={listCajas} columnas={columns} title={"Cajas"} />
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListCajas;
