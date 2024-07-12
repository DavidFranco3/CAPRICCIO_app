import { useEffect, useState } from "react";
import { listarInsumos } from "../../../api/insumos";
import { Badge, Col, FormControl } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../components/Modal/BasicModal";
import ModificarInsumos from "./Modificar";

function ListInsumos(props) {
  const [listInsumos, setListInsumos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredInsumos, setFilteredInsumos] = useState([]);

  const cargarInsumos = async () => {
    const response = await listarInsumos();
    const { data } = response;
    setListInsumos(data);
    setFilteredInsumos(data);
  };

  useEffect(() => {
    cargarInsumos();
  }, []);

  useEffect(() => {
    setFilteredInsumos(
      listInsumos.filter((insumo) =>
        insumo.nombre.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, listInsumos]);

  const columnsMateriaPrima = [
    {
      name: "Insumos",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Precio compra",
      selector: (row) => (
        <>
          <Badge bg="success">
            ${" "}
            {new Intl.NumberFormat("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.precioCompra)}{" "}
            MXN
          </Badge>
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Stock",
      selector: (row) => row.stock.toFixed(3),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "UM",
      selector: (row) => row.umCompra,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Dinero en stock",
      selector: (row) => (
        <>
          <Badge bg="info">
            ${" "}
            {new Intl.NumberFormat("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.precioCompra * row.stock)}{" "}
            MXN
          </Badge>
        </>
      ),
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
              className="cursor-pointer"
              bg="success"
              onClick={() =>
                modificarInsumos(
                  <ModificarInsumos datosInsumos={row} setShow={setShowModal} />
                )
              }
            >
              <FontAwesomeIcon icon={faPen} className="text-lg" />
            </Badge>
            <Badge className="cursor-pointer" bg="danger">
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

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const modificarInsumos = (content) => {
    setTitulosModal("Modificar el insumo");
    setContentModal(content);
    setShowModal(true);
  };

  return (
    <>
      <div className="row mb-3">
        <Col>
          <FormControl
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col></Col>
      </div>
      <DataTable
        columns={columnsMateriaPrima}
        noDataComponent="No hay registros de insumos"
        data={filteredInsumos}
        customStyles={estilos}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10]}
      />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListInsumos;
