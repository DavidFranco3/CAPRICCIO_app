import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { Badge, Container } from "react-bootstrap";
import "../../../../scss/styles.scss";
import DataTablecustom from "../../../../components/Generales/DataTable";
import { formatMoneda } from "../../../../components/Generales/FormatMoneda";
import { estilos } from "../../../../utils/tableStyled";

function ListIngredientesProductos(props) {
  console.log(props);
  const { listInsumos } = props;

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "UM",
      selector: (row) => row.umTrabajo,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Precio",
      selector: (row) => formatMoneda(row.precioCompra),
      sortable: false,
      center: true,
      reorder: false,
    },

    {
      name: "Total",
      selector: (row) => formatMoneda(row.total),
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
      setRows(listInsumos);
      setPending(false);
    }, 0);
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
          datos={listInsumos}
          title="Ingredientes del Producto"
        />
      </Container>
    </>
  );
}

export default ListIngredientesProductos;
