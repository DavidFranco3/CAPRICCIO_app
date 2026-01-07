import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faArrowDownLong,
  faEye,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import EliminaProductos from "../EliminaProductos";
import { Badge, Container, Dropdown } from "react-bootstrap";
import CancelarProductos from "../CancelarProductos";
import ListIngredientesProductos from "../ListIngredientesProductos";
import "../../../../scss/styles.scss";
import DataTablecustom from "../../../../components/Generales/DataTable";
import { formatMoneda } from "../../../../components/Generales/FormatMoneda";
import { formatFecha } from "../../../../components/Generales/FormatFecha";
import { estilos } from "../../../../utils/tableStyled";
import Categoria from "./Categoria";
import "dayjs/locale/es";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useNavigate } from "react-router-dom";
import ModificarProductos from "../ModificaProductos/Modificar";

function ListProductos(props) {
  const {
    listProductos,
    listCategorias,
    location,
    navigate,
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    noTotalProductos,
    setRefreshCheckLogin,
  } = props;

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  dayjs.locale("es");
  dayjs.extend(localizedFormat);

  //Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  //Para la eliminacion de productos
  const eliminaProductos = (content) => {
    setTitulosModal("Eliminación producto");
    setContentModal(content);
    setShowModal(true);
  };

  //Para la modificacion de productos
  const modificaProductos = (id) => {
    enrutamiento(`/ModificaProductos/${id}`);
  };

  // Para cancelar la venta
  const cancelarProducto = (content) => {
    setTitulosModal("Cancelar producto");
    setContentModal(content);
    setShowModal(true);
  };

  // Para cancelar la venta
  const recuperarProducto = (content) => {
    setTitulosModal("Recuperar producto");
    setContentModal(content);
    setShowModal(true);
  };

  // Para cancelar la venta
  const ingredientes = (content) => {
    setTitulosModal("Ingredientes");
    setContentModal(content);
    setShowModal(true);
  };

  const handleChangePage = (page) => {
    // console.log("Nueva pagina "+ newPage)
    setPage(page);
  };

  const handleChangeRowsPerPage = (newPerPage) => {
    // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
    setRowsPerPage(newPerPage);
    //setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const modificarProds = (content) => {
    setTitulosModal("Editar producto");
    setContentModal(content);
    setShowModal(true);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Categoría",
      selector: (row) => (
        <>
          <Categoria id={row.categoria} />
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Precio de venta",
      selector: (row) => formatMoneda(row.precio),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Costo de producción",
      selector: (row) => formatMoneda(row.costoProduccion),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Utilidad",
      selector: (row) => formatMoneda(row.precio - row.costoProduccion),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Estado",
      selector: (row) => (
        <>
          {row.estado === "true" ? (
            <>
              <Badge
                bg="success"
                //className="estado"
                className="indicadorCancelarVenta cursor-pointer"
                title="Cancelar categoria"
                onClick={() => {
                  cancelarProducto(
                    <CancelarProductos
                      datosProducto={row}
                      listCategorias={listCategorias}
                      location={location}
                      navigate={navigate}
                      setShowModal={setShowModal}
                    />
                  );
                }}
              >
                Habilitado
              </Badge>
            </>
          ) : (
            <>
              <Badge
                bg="danger"
                //className="estado"
                className="indicadorCancelarVenta cursor-pointer"
                title="Recuperar categoria"
                onClick={() => {
                  recuperarProducto(
                    <CancelarProductos
                      datosProducto={row}
                      listCategorias={listCategorias}
                      location={location}
                      navigate={navigate}
                      setShowModal={setShowModal}
                    />
                  );
                }}
              >
                Deshabilitado
              </Badge>
            </>
          )}
        </>
      ),

      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Modificación",
      selector: (row) =>
        formatFecha(row.fechaActualizacion),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Acciones",
      cell: (row) => {
        return (
          <>
            <Dropdown className="dropdown-js">
              <Dropdown.Toggle className="botonDropdown" id={`dropdown-basic-${row.id}`} variant="link">
                <FontAwesomeIcon icon={faBars} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => ingredientes(<ListIngredientesProductos listInsumos={row.insumos} />)}
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: "#17a2b8" }} />
                  &nbsp; Ver ingredientes
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => modificarProds(<ModificarProductos datosProd={row} setShow={setShowModal} />)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffc107" }} />
                  &nbsp; Editar
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    eliminaProductos(
                      <EliminaProductos
                        datosProducto={row}
                        listCategorias={listCategorias}
                        location={location}
                        navigate={navigate}
                        setShowModal={setShowModal}
                        setRefreshCheckLogin={setRefreshCheckLogin}
                      />
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} style={{ color: "#dc3545" }} />
                  &nbsp; Eliminar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        );
      },
      ignoreRowClick: true,
      width: "120px",
      center: true,
    },
  ];

  // Configurando animacion de carga
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);

  const cargarDatos = () => {
    const timeout = setTimeout(() => {
      setRows(listProductos);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
  };

  const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

  return (
    <>
      <Container fluid>
        <DataTablecustom
          columnas={columns}
          datos={listProductos}
          title="Lista de Productos"
        />
      </Container>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListProductos;
