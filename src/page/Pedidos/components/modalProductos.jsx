import React from "react";
import DataTable from "react-data-table-component";

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
      <DataTable columns={columns} title={"Productos"} data={productosv} />
    </>
  );
};

export default ModalProductos;
