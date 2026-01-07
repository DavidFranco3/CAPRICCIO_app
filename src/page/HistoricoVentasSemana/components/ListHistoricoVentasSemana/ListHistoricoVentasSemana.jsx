import { useState, useEffect } from 'react';
import { map } from "lodash";
import { Badge, Image, Container, Dropdown } from "react-bootstrap";
import "../../../../scss/styles.scss";
import Total from "../../Total";
import BasicModal from "../../../../components/Modal/BasicModal";
import HistorialVentasSemana from "../../../HistorialVentasSemana";
import LogoHistorial from "../../../../assets/png/historial.png";
import LogoGrafica from "../../../../assets/png/graficas.png";
import GraficaMensual from '../../../GraficaMensual';
import ProcesamientoCSV from "../ProcesamientoCSV";
import { estilos } from "../../../../utils/tableStyled";
import DataTablecustom from "../../../../components/Generales/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faBars, faEye, faChartBar } from "@fortawesome/free-solid-svg-icons";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListHistoricoVentasSemana(props) {
    const { listVentas, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas, setRefreshCheckLogin } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const [listaDias, setListaDias] = useState([]);
    const [listaAños, setListaAños] = useState([]);

    const filtrarLista = () => {
        let listaFechasTemp = []
        map(listVentas, (ventas, index) => {
            const tempFecha = ventas.semana.split("T");
            //console.log(tempFecha)
            listaFechasTemp.push(tempFecha[0]);
        })
        //console.log(listaFechasTemp)
        let listaDias = listaFechasTemp.filter((item, index) => {
            return listaFechasTemp.indexOf(item) === index;
        })
        setListaDias(listaDias)
        //console.log(listaDias);
    }

    const filtrarListaAños = () => {
        let listaFechasTemp = []
        map(listVentas, (ventas, index) => {
            const tempFecha = ventas.año.split("T");
            //console.log(tempFecha)
            listaFechasTemp.push(tempFecha[0]);
        })
        //console.log(listaFechasTemp)
        let listaDias = listaFechasTemp.filter((item, index) => {
            return listaFechasTemp.indexOf(item) === index;
        })
        setListaAños(listaDias)
        //console.log(listaDias);
    }

    useEffect(() => {
        filtrarLista();
        filtrarListaAños();
    }, [listVentas]);

    //Para ver detalles
    const detallesHistorial = (content) => {
        setTitulosModal("Historial de la semana");
        setContentModal(content);
        setShowModal(true);
    }

    //Para ver detalles
    const grafica = (content) => {
        setTitulosModal("Grafica de la semana");
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
            name: "Ventas de la semana",
            selector: row => row,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Detalles de la semana",
            selector: row => (
                <>
                    <Total
                        semana={row}
                        año={listaAños[0]}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            cell: row => (
                <Dropdown className="dropdown-js">
                    <Dropdown.Toggle className="botonDropdown" id={`dropdown-basic-${row}`} variant="link">
                        <FontAwesomeIcon icon={faBars} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            grafica(
                                <GraficaMensual
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    semana={row}
                                    año={listaAños[0]}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}>
                            <FontAwesomeIcon icon={faChartBar} style={{ color: "#17a2b8" }} />
                            &nbsp; Ver gráfica
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => {
                            detallesHistorial(
                                <HistorialVentasSemana
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    semana={row}
                                    año={listaAños[0]}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}
                        >
                            <FontAwesomeIcon icon={faEye} style={{ color: "#ffc107" }} />
                            &nbsp; Ver ventas
                        </Dropdown.Item>

                        <div className="dropdown-divider"></div>
                        <div className="px-3 py-2">
                            <ProcesamientoCSV dia={row} año={listaAños[0]} />
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            ),
            sortable: false,
            center: true,
            reorder: false,
            ignoreRowClick: true,
            width: "120px",
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
                    title="Historial Ventas Semana"
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListHistoricoVentasSemana;
