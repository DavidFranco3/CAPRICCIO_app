import { useEffect, useState } from "react";
import { listarInsumos } from "../../../api/insumos";
import { Badge, Col, FormControl, Dropdown } from "react-bootstrap";
import DataTablecustom from "../../../components/Generales/DataTable";
import { formatMoneda } from "../../../components/Generales/FormatMoneda";
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPen,
  faTrashCan,
  faX,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../../components/Modal/BasicModal";
import ModificarInsumos from "./Modificar";
import EliminarInsumos from "./Eliminar";

function ListInsumos(props) {
  const { showModIns, datosUsuario } = props;

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
      selector: (row) => formatMoneda(row.precioCompra),
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
      selector: (row) => formatMoneda(row.precioCompra * row.stock),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Dropdown className="dropdown-js">
          <Dropdown.Toggle className="botonDropdown" id={`dropdown-basic-${row._id}`} variant="link">
            <FontAwesomeIcon icon={faBars} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() =>
              modificarInsumos(
                <ModificarInsumos
                  datosInsumos={row}
                  setShow={setShowModal}
                  datosUsuario={datosUsuario}
                />
              )
            }
            >
              <FontAwesomeIcon icon={faPen} style={{ color: "#ffc107" }} />
              &nbsp; Editar
            </Dropdown.Item>

            {datosUsuario.rol === "administrador" && (
              <Dropdown.Item onClick={() =>
                eliminarInsumo(
                  <EliminarInsumos
                    datosInsumo={row}
                    setShow={setShowModal}
                  />
                )
              }
              >
                <FontAwesomeIcon icon={faTrashCan} style={{ color: "#dc3545" }} />
                &nbsp; Eliminar
              </Dropdown.Item>
            )}
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

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const modificarInsumos = (content) => {
    setTitulosModal("Modificar el insumo");
    setContentModal(content);
    setShowModal(true);
  };

  const eliminarInsumo = (content) => {
    setTitulosModal("Eliminar el insumo");
    setContentModal(content);
    setShowModal(true);
  };

  useEffect(() => {
    cargarInsumos();
  }, [showModIns, showModal]);

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
      <DataTablecustom
        columnas={columnsMateriaPrima}
        datos={filteredInsumos}
        title="Lista de Insumos"
      />

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListInsumos;
