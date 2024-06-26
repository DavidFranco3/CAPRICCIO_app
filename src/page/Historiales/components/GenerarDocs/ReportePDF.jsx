import { useRef, useState, useEffect } from "react";

function ReportePDF(params) {
  const { listCategorias, listVentas, fechaInicial, fechaFinal } = params;
  const [categoriasContadas, setCategoriasContadas] = useState([]);

  // Función para contar productos
  const contarProds = () => {
    const categoriasActualizadas = listCategorias.map((categoria) => ({
      ...categoria,
      cantProds: 0, // Reiniciar el conteo antes de sumar los productos
    }));

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

    return categoriasActualizadas;
  };

  useEffect(() => {
    const categoriasActualizadas = contarProds();
    setCategoriasContadas(categoriasActualizadas);
  }, [listVentas, listCategorias]);

  const headers = {
    numeroTiquet: "Num de Tiquet",
    estado: "Estado venta",
    cliente: "Cliente",
    nombre: "Producto",
    precio: "Precio",
    tipoPago: "Tipo de pago",
    tipoPedido: "Tipo de pedido",
    hacerPedido: "Pedido realizado",
    total: "Total de venta en el tiquet",
    fecha: "Fecha",
  };

  const generateCSV = () => {
    const headerKeys = Object.keys(headers);
    const headerLabels = headerKeys.map((key) => headers[key]);

    const csvContent = [
      headerLabels.join(","),
      ...listVentas.flatMap((venta) =>
        venta.productos.map((producto) => {
          return headerKeys
            .map((key) => {
              if (key in producto) {
                return producto[key];
              }
              return venta[key];
            })
            .join(",");
        })
      ),
    ];

    // Agregar totales por categoría al final del CSV
    csvContent.push("\nTotales por categoría:");
    categoriasContadas.forEach((categoria) => {
      csvContent.push(`${categoria.nombre}, ${categoria.cantProds}`);
    });

    // Sumar el total de todas las ventas y agregarlo al final del CSV
    const totalVentas = listVentas.reduce(
      (total, venta) => total + venta.total,
      0
    );
    csvContent.push(`\nTotal de todas las ventas:, ${totalVentas}`);

    const blob = new Blob([csvContent.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte_ventas_${fechaInicial}_a_${fechaFinal}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button className="btn btn-success" onClick={generateCSV}>
        <i className="fas fa-file-excel"></i> CSV
      </button>
    </div>
  );
}
export default ReportePDF;
