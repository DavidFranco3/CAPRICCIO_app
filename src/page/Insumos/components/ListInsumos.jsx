import { useEffect, useState } from "react";
import { listarInsumos } from "../../../api/insumos";
import { Badge, FormControl } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";

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
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
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
  ];

  return (
    <>
      <div className="mb-3">
        <FormControl
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
    </>
  );
}

export default ListInsumos;
