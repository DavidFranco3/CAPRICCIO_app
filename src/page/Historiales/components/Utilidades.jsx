import { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";

function Utilidades(props) {
  const { listVentas, totalVentas } = props;

  const [gastoProds, setGastoProds] = useState(0);

  const calcularGastoProds = () => {
    let totalGasto = 0;
    listVentas.forEach((venta) => {
      venta.productos.forEach((producto) => {
        totalGasto += producto.costoProduccion;
      });
    });
    setGastoProds(totalGasto);
  };

  useEffect(() => {
    calcularGastoProds();
  }, [listVentas]);

  return (
    <>
      <div className="ms-5">
        <table className="table table-borderless align-middle">
          <tbody>
            <tr>
              <th>Ventas prods:</th>
              <td>
                <h5>
                  <Badge bg="primary">$ {totalVentas.toFixed(2)}</Badge>
                </h5>
              </td>
            </tr>
            <tr>
              <th>Gastos prods:</th>
              <td>
                <h5>
                  <Badge bg="warning">$ {gastoProds.toFixed(2)}</Badge>
                </h5>
              </td>
            </tr>
            <tr>
              <th>Utilidad:</th>
              <td>
                <h5>
                  <Badge bg="success">
                    $ {(totalVentas - gastoProds).toFixed(2)}
                  </Badge>
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Utilidades;
