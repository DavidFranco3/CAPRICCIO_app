import { useState, useEffect } from 'react';
import "../../../scss/styles.scss";
import { Badge, Container, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LogRegistroSalida } from "../../MovimientosIngredientes/Gestion/GestionMovimientos";
import { map } from "lodash";

function ListIngredientesConsumidosDia(props) {
    const { listIngredientesConsumidos, location, navigate, rowsPerPage, setRowsPerPage, page, setPage, noTotalIngredientes } = props;

    const listIngredientesSinDuplicados = listIngredientesConsumidos.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento.id === valorActual.id);
        if (elementoYaExiste) {
            return acumulador.map((elemento) => {
                if (elemento.id === valorActual.id) {
                    return {
                        ...elemento,
                        cantidad: parseFloat(elemento.cantidad) + parseFloat(valorActual.cantidad)
                    }
                }

                return elemento;
            });
        }

        return [...acumulador, valorActual];
    }, []);

    const registrarSalida = () => {
        map(listIngredientesSinDuplicados, (ingrediente, index) => {
            const { id, cantidad, um } = ingrediente
            LogRegistroSalida(id, cantidad, um);
        })
    }

    const subHeaderComponent = () => {

        return (
            <>
                <Col>
                    <Button
                        title="Limpiar la busqueda"
                        onClick={registrarSalida()}
                    >
                        Registrar los movimientos del dia
                    </Button>
                </Col>
            </>
        );
    };


    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    //Para el modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de categorias
    const eliminaIngredientes = (content) => {
        setTitulosModal("Eliminación ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de categorias
    const modificaIngredientes = (content) => {
        setTitulosModal("Modificación ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const cancelarIngrediente = (content) => {
        setTitulosModal("Cancelar ingrediente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para cancelar la venta
    const recuperarIngrediente = (content) => {
        setTitulosModal("Recuperar ingrediente");
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
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad + " " + row.um,
            sortable: false,
            center: true,
            reorder: false
        }
    ];

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listIngredientesConsumidos);
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
                <Col>
                    <Button
                        title="Limpiar la busqueda"
                        onClick={() => {
                            registrarSalida();
                        }}
                    >
                        Registrar los movimientos del dia
                    </Button>
                </Col>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listIngredientesSinDuplicados}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListIngredientesConsumidosDia;
