import { useState, useEffect } from 'react';
import { map } from "lodash";
import { Badge, Image, Container } from "react-bootstrap";
import "../../../scss/styles.scss";
import Total from "../../../page/HistoricoVentasSemana/Total";
import BasicModal from "../../Modal/BasicModal";
import HistorialVentasSemana from "../../../page/HistorialVentasSemana";
import LogoHistorial from "../../../assets/png/historial.png";
import LogoGrafica from "../../../assets/png/graficas.png";
import GraficaMensual from '../../../page/GraficaMensual';
import ProcesamientoCSV from "../ProcesamientoCSV";
import { estilos } from "../../../utils/tableStyled";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
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
            selector: row => (
                <>
                    <div className="flex justify-end items-center space-x-4">
                    <Badge
                            bg="light"
                            className="vistaDetalles"
                            onClick={() => {
                                grafica(
                                    <GraficaMensual
                                        setRefreshCheckLogin={setRefreshCheckLogin}
                                        semana={row}
                                        año={listaAños[0]}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            <Image
                                title="Ver la grafica de la semana"
                                alt="Ver la grafica de la semana"
                                src={LogoGrafica}
                                className="logoHistorial"
                            />
                        </Badge>
                        <Badge
                            title="Ver las ventas de la semana"
                            bg="light"
                            className="vistaDetalles"
                            onClick={() => {
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
                            <Image
                                src={LogoHistorial}
                                className="logoHistorial"
                            />
                        </Badge>

                        <ProcesamientoCSV dia={row} año={listaAños[0]} />

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
                <DataTable
                    columns={columns}
                    data={listaDias}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalVentas}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListHistoricoVentasSemana;
