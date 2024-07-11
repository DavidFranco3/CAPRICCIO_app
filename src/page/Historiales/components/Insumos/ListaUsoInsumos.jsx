import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { listarVentasRangoFechas } from "../../../../api/ventas";
import { listarInsumos } from "../../../../api/insumos";
import DataTable from "react-data-table-component";
import { estilos } from "../../../../utils/tableStyled";
import { Form } from "react-bootstrap";

function ListUsoInsumos(props) {
  const { fechaInicial, fechaFinal, filtros } = props;

  const [listVentas, setListVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [listInsumos, setListInsumos] = useState([]);
  const [insumosContados, setInsumosContados] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("Gramos");

  const filtrarVentas = (ventas) => {
    let ventasFiltradas = ventas;

    if (filtros.efectivo || filtros.tdc || filtros.transferencia) {
      ventasFiltradas = ventasFiltradas.filter((venta) => {
        return (
          (filtros.efectivo && venta.tipoPago === "Efectivo") ||
          (filtros.tdc && venta.tipoPago === "TDC") ||
          (filtros.transferencia && venta.tipoPago === "Transferencia")
        );
      });
    }

    setVentasFiltradas(ventasFiltradas);
  };

  const obtenerVentasPorFechas = async () => {
    try {
      const fechaInicio = dayjs(fechaInicial).format("YYYY-MM-DD");
      const fechaFin = dayjs(fechaFinal).format("YYYY-MM-DD");

      const response = await listarVentasRangoFechas(fechaInicio, fechaFin);
      const { data } = response;
      setListVentas(data);
      filtrarVentas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerInsumos = async () => {
    const response = await listarInsumos();
    const { data } = response;
    setListInsumos(data);
  };

  useEffect(() => {
    if (fechaInicial && fechaFinal) {
      obtenerVentasPorFechas();
    }
    obtenerInsumos();
  }, [fechaInicial, fechaFinal]);

  useEffect(() => {
    if (ventasFiltradas.length > 0 && listInsumos.length > 0) {
      const insumosActualizados = calcularCantidadInsumosVendidos();
      setInsumosContados(insumosActualizados);
    }
  }, [ventasFiltradas, listInsumos]);

  const calcularCantidadInsumosVendidos = () => {
    const insumosActualizados = listInsumos.map((insumo) => ({
      ...insumo,
      cantidad: 0,
    }));

    ventasFiltradas.forEach((venta) => {
      venta.productos.forEach((producto) => {
        producto.insumos.forEach((insumo) => {
          const encontrado = insumosActualizados.find(
            (ins) => ins._id === insumo.id
          );
          if (encontrado) {
            encontrado.cantidad += parseFloat(insumo.cantidad);
          }
        });
      });
    });

    return insumosActualizados;
  };

  const convertirUnidades = (cantidad, umTrabajo, umCompra) => {
    if (unidadSeleccionada === "Kilogramos") {
      if (umTrabajo === "Gramos") return cantidad / 1000;
      if (umTrabajo === "Kilogramos") return cantidad;
      if (umTrabajo === "Mililitros") return cantidad / 1000;
      if (umTrabajo === "Litros") return cantidad;
    } else if (unidadSeleccionada === "Gramos") {
      if (umTrabajo === "Gramos") return cantidad;
      if (umTrabajo === "Kilogramos") return cantidad * 1000;
      if (umTrabajo === "Mililitros") return cantidad;
      if (umTrabajo === "Litros") return cantidad * 1000;
    }
    return cantidad; // Caso por defecto si no se requiere conversión
  };

  const columns = [
    {
      name: "Insumo",
      selector: (row) => row.nombre,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Cantidad gastada",
      selector: (row) => {
        const cantidadConvertida = convertirUnidades(
          row.cantidad,
          row.umTrabajo,
          row.umCompra
        );
        return `${cantidadConvertida.toFixed(2)} ${unidadSeleccionada}`;
      },
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <>
      <div>
        <h3>Uso de Insumos</h3>
        <Form>
          <div className="d-flex align-items-center">
            <span className="me-2">gr / ml</span>
            <Form.Check
              type="switch"
              id="unidad-switch"
              label=""
              checked={unidadSeleccionada === "Kilogramos"}
              onChange={() =>
                setUnidadSeleccionada(
                  unidadSeleccionada === "Gramos" ? "Kilogramos" : "Gramos"
                )
              }
            />
            <span className="ms-2">Kg / Lt</span>
          </div>
        </Form>
        <DataTable
          columns={columns}
          data={insumosContados}
          customStyles={estilos}
        />
      </div>
    </>
  );
}

export default ListUsoInsumos;
