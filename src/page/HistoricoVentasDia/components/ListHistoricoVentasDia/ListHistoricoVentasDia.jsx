import { useState, useEffect } from 'react';
import { map } from "lodash";
import { Badge, Image, Container } from "react-bootstrap";
import "../../../../scss/styles.scss";
import Total from "../../Total";
import BasicModal from "../../../../components/Modal/BasicModal";
import HistorialVentasDia from "../../../HistoricoVentasDia/HistoricoVentasDia";
import LogoHistorial from "../../../../assets/png/historial.png";
import LogoGrafica from "../../../../assets/png/graficas.png";
import ProcesamientoCSV from "../ProcesamientoCSV";
import GraficaDiaria from '../../../GraficaDiaria';
import { estilos } from "../../../../utils/tableStyled";
import DataTablecustom from "../../../../components/Generales/DataTable";
import { formatFecha } from "../../../../components/Generales/FormatFecha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListHistoricoVentasDia(props) {
    const { listVentas, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas, setRefreshCheckLogin } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const [listaDias, setListaDias] = useState([]);

    const filtrarLista = () => {
        let listaFechasTemp = [];
        map(listVentas, (ventas, index) => {
            const tempFecha = ventas.fechaCreacion.split("T");
            listaFechasTemp.push(tempFecha[0])
        })
        let listaDias = listaFechasTemp.filter((item, index) => {
            return listaFechasTemp.indexOf(item) === index;
        })
        setListaDias(listaDias);
    }

    useEffect(() => {
        filtrarLista();
    }, [listVentas]);

    //Para ver detalles
    const detallesHistorial = (content) => {
        setTitulosModal("Historial del día");
        setContentModal(content);
        setShowModal(true);
    }

    //Para ver detalles
    const grafica = (content) => {
        setTitulosModal("Grafica del día");
        setContentModal(content);
        setShowModal(true);
    }

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const columns = [
        {
            name: "Ventas del día",
            selector: row => formatFecha(row),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Detalles del día",
            selector: row => (
                <>
                    <Total
                        dia={row}
                    />
                </>
            ),
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
                            bg="light"
                            className="vistaDetalles"
                            onClick={() => {
                                grafica(
                                    <GraficaDiaria
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        dia={row}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            <Image
                                title="Ver la grafica del dia"
                                alt="Ver la grafica del dia"
                                src={LogoGrafica}
                                className="logoHistorial"
                            />
                        </Badge>
                        <Badge
                            bg="light"
                            className="vistaDetalles"
                            onClick={() => {
                                detallesHistorial(
                                    <HistorialVentasDia
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        dia={row}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            <Image
                                title="Ver las ventas del dia"
                                alt="Ver ventas del dia"
                                src={LogoHistorial}
                                className="logoHistorial"
                            />
                        </Badge>

                        <ProcesamientoCSV dia={row} />

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
            setRows(listaDias);
            setPending(false);
        }, 2000);
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
                <DataTablecustom
                    columnas={columns}
                    datos={listaDias}
                    title="Historial Ventas Día"
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListHistoricoVentasDia;
