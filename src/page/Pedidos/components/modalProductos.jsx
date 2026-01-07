import React from "react";
import DataTablecustom from "../../../components/Generales/DataTable";

const ModalProductos = (props) => {
  const productosv = props.productos;
  //const total = productosv.precio;
  //console.log(total);
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Precio",
      selector: (row) => row.precio,
      sortable: false,
      center: true,
      reorder: false,
    },
  ];
  return (
    <>
      <DataTablecustom columnas={columns} title={"Productos"} datos={productosv} />
    </>
  );
};

export default ModalProductos;
