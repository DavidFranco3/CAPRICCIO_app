import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faArrowDownLong,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../../components/Modal/BasicModal";
import EliminaProductos from "../EliminaProductos";
import { Badge, Container } from "react-bootstrap";
import CancelarProductos from "../CancelarProductos";
import ListIngredientesProductos from "../ListIngredientesProductos";
import "../../../../scss/styles.scss";
import DataTable from "react-data-table-component";
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
      selector: (row) => (
        <>
          <Badge bg="success" className="estado">
            ${""}
            {new Intl.NumberFormat("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.precio)}{" "}
            MXN
          </Badge>
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Costo de producción",
      selector: (row) => (
        <>
          <Badge bg="success" className="estado">
            ${""}
            {new Intl.NumberFormat("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.costoProduccion)}{" "}
            MXN
          </Badge>
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Utilidad",
      selector: (row) => (
        <>
          <Badge bg="success" className="estado">
            ${""}
            {new Intl.NumberFormat("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.precio - row.costoProduccion)}{" "}
            MXN
          </Badge>
        </>
      ),
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
        dayjs(row.fechaActualizacion).format("dddd, LL hh:mm A"),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Acciones",
      selector: (row) => (
        <>
          <div className="flex justify-end items-center space-x-4">
            <Badge
              bg="primary"
              title="Ver ingredientes del producto"
              className="eliminar cursor-pointer"
              onClick={() => {
                ingredientes(
                  <ListIngredientesProductos
                    listIngredientes={row.ingredientes}
                  />
                );
              }}
            >
              <FontAwesomeIcon icon={faEye} className="text-lg" />
            </Badge>

            <Badge
              bg="success"
              title="Modificar producto"
              className="editar cursor-pointer"
              onClick={() =>
                modificarProds(
                  <ModificarProductos datosProd={row} setShow={setShowModal} />
                )
              }
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
            </Badge>

            <Badge
              title="Eliminar producto"
              bg="danger"
              className="eliminar cursor-pointer"
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
              <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
            </Badge>
          </div>
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
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
        <DataTable
          columns={columns}
          noDataComponent="No hay registros para mostrar"
          data={listProductos}
          progressPending={pending}
          paginationComponentOptions={paginationComponentOptions}
          paginationResetDefaultPage={resetPaginationToogle}
          customStyles={estilos}
          sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
          pagination
          paginationServer
          paginationTotalRows={noTotalProductos}
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

export default ListProductos;
