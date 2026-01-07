import { useEffect, useState, useRef } from "react";
import { Badge, Container } from "react-bootstrap";
import DataTablecustom from "../../../components/Generales/DataTable";
import { estilos } from "../../../utils/tableStyled";

function DetallesListaVentas(props) {
  console.log(props);

  const { listVentas, fechaInicial, fechaFinal, listCategorias } = props;
  const categoriasIniciales = useRef([...listCategorias]);

  // Función para contar productos
  const contarProds = () => {
    const categoriasActualizadas = categoriasIniciales.current.map(
      (categoria) => ({
        ...categoria,
        cantProds: 0, // Reiniciar el conteo antes de sumar los productos
      })
    );

    listVentas.forEach((venta) => {
      venta.productos.forEach((producto) => {
        const encontrado = categoriasActualizadas.find(
          (cat) => cat.id === producto.categoria
        );
        if (encontrado) {
          encontrado.cantProds += 1;
        }
      });
    });

    // Actualizar las categorías con los productos contados
    categoriasIniciales.current = categoriasActualizadas;
    return categoriasActualizadas;
  };

  // Actualizar la lista de categorías con productos contados solo una vez
  const [categoriasContadas, setCategoriasContadas] = useState(contarProds);

  const columns = [
    {
      name: "Categoria",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Cantidad",
      selector: (row) => (
        <>
          <Badge bg={row.cantProds < 5 ? "warning" : "success"}>
            {row.cantProds}
          </Badge>
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <div>
      <h5>
        Detalles de los productos vendidos entre{" "}
        <span className="bg-warning">{fechaInicial}</span> y{" "}
        <span className="bg-warning">{fechaFinal}</span>{" "}
      </h5>
      <DataTablecustom datos={categoriasContadas} columnas={columns} title={"Detalles de ventas"} />
    </div>
  );
}

export default DetallesListaVentas;
