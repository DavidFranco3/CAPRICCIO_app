import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { listarVentasTurno } from "../../api/ventas";
import { listarTurno } from "../../api/turnos";
import { listarMovimientoTurno } from "../../api/movimientosTurnoCajas";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

const GenerarExcel = (props) => {
    const { idTurno } = props;
    const [listVentas, setListVentas] = useState([]);
    const [listTurnos, setListTurnos] = useState([]);
    const [listMovimientos, setListMovimientos] = useState([]);
    const [totalEfectivo, setTotalEfectivo] = useState(0);
    const [totalTransferencia, setTotalTransferencia] = useState(0);
    const [totalTDC, setTotalTDC] = useState(0);

    const cargarTurnos = async () => {
        const response = await listarTurno();
        const { data } = response;

        // Filtrar los turnos que coincidan con la variable idTurno
        const turnosFiltrados = data.filter(turno => turno.idTurno === idTurno);
        setListTurnos(turnosFiltrados);
    };

    const cargarMovimientos = async () => {
        const response = await listarMovimientoTurno(idTurno);
        const { data } = response;

        // Filtrar los turnos que coincidan con la variable idTurno
        const movimientosFiltrados = data.filter(movimiento => movimiento.movimiento === "Retiro efectivo");
        setListMovimientos(movimientosFiltrados);
    };

    const cargarVentas = async () => {
        const response = await listarVentasTurno(idTurno);
        const { data } = response;
        setListVentas(data);
    };

    useEffect(() => {
        cargarVentas();
        cargarTurnos();
        cargarMovimientos();
    }, [idTurno]);

    const obtenerTotalesVentas = (ventas) => {
        let totalEfectivo = ventas
            .filter((venta) => venta.tipoPago === "Efectivo")
            .reduce((acc, venta) => acc + venta.total, 0);
        let totalTransferencia = ventas
            .filter((venta) => venta.tipoPago === "Transferencia")
            .reduce((acc, venta) => acc + venta.total, 0);
        let totalTDC = ventas
            .filter((venta) => venta.tipoPago === "TDC")
            .reduce((acc, venta) => acc + venta.total, 0);
        setTotalEfectivo(totalEfectivo);
        setTotalTransferencia(totalTransferencia);
        setTotalTDC(totalTDC);
    };

    useEffect(() => {
        obtenerTotalesVentas(listVentas);
    }, [idTurno]);

    const exportarExcel = () => {
        // Objeto para agrupar productos y acumular cantidades
        const productosAgrupados = {};

        listVentas.forEach(item => {
            item.productos.forEach(producto => {
                const cantidad = producto.cantidad || 1;
                if (productosAgrupados[producto.nombre]) {
                    productosAgrupados[producto.nombre].cantidad += cantidad;
                } else {
                    productosAgrupados[producto.nombre] = {
                        nombre: producto.nombre,
                        cantidad: cantidad,
                        precio: producto.precio
                    };
                }
            });
        });

        // Estructura de los datos para Excel
        const ws_data = [
            ["TOTAL EFECTIVO: ", totalEfectivo],
            ["TOTAL TARJETA: ", totalTDC],
            ["TOTAL TRANSFERENCIA: ", totalTransferencia],
            ["CORTE FINAL DE CAJA EN EFECTIVO", "", ""], // Título que se combinará
            ["Valor", "Cantidad", "Total"] // Encabezado de productos
        ];

        let totalGeneral = 0;

        Object.values(productosAgrupados).forEach(producto => {
            const totalProducto = producto.cantidad * producto.precio;
            totalGeneral += totalProducto;
            ws_data.push([producto.precio, producto.cantidad, totalProducto]);
        });

        // Agregar una fila con el total general
        ws_data.push(["TOTAL", "", totalGeneral]);
        ws_data.push(["DINERO INICIAL", "", listTurnos.length > 0 ? listTurnos[0].fondoCaja : "N/A"]);

        // Nueva fila para los pedidos de Uber, Rappi y Didi
        ws_data.push(["PEDIDOS UBER/RAPPI/DIDI", "", "", "Comidad del dia", "Prestamos de comida/sueldos"]); // Encabezado principal combinado
        ws_data.push(["APP/CLIENTES", "FORMA DE PAGO", "TOTAL", "NOMBRE", "TOTAL PROPORCIONAL DE COMIDA", "NOMBRE"]); // Subencabezados

        // Filtrar las ventas que sean de Uber, Rappi o Didi
        const pedidosPlataforma = listVentas.filter(venta =>
            ["didi", "rappi", "uber"].includes(venta.hacerPedido)
        );

        pedidosPlataforma.forEach(venta => {
            ws_data.push([venta.cliente + " " + venta.hacerPedido, venta.tipoPago, venta.total]);
        });

        ws_data.push(["", "", ""]);
        ws_data.push(["BILLETES QUE LA JEFA SE LLEVO", "", ""]);
        ws_data.push(["Quedo en caja de billetes", "Quedo en caja de monedas"]);
        ws_data.push(["", "", ""]);
        ws_data.push(["Gastos de caja", "", ""]);

        Object.values(listMovimientos).forEach(movimiento => {
            ws_data.push([movimiento.razon, movimiento.cantidad, ""]);
        });
        const totalMovimientos = listMovimientos.reduce((acumulador, movimiento) =>
            acumulador + movimiento.cantidad, 0
        );
        ws_data.push(["GASTOS", "", totalMovimientos]);
        ws_data.push(["TOTAL", "", totalGeneral - totalMovimientos]);


        // Crear hoja de Excel
        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Agregar colores y estilos a las celdas
        // Asegúrate de que la estructura del estilo esté bien aplicada
        ws["A1"].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } }; // Amarillo y negrita
        ws["B1"].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } }; // Amarillo y negrita
        ws["A2"].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } }; // Amarillo y negrita
        ws["B2"].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } }; // Amarillo y negrita
        ws["A3"].s = { fill: { fgColor: { rgb: "FFFF00" } }, font: { bold: true } }; // Amarillo y negrita

        // Agregar colores a las celdas de los encabezados
        ws["A4"].s = { fill: { fgColor: { rgb: "ADD8E6" } }, font: { bold: true } }; // Azul claro y negrita
        ws["B4"].s = { fill: { fgColor: { rgb: "ADD8E6" } }, font: { bold: true } }; // Azul claro y negrita
        ws["C4"].s = { fill: { fgColor: { rgb: "ADD8E6" } }, font: { bold: true } }; // Azul claro y negrita

        // Combinar celdas (MERGES)
        ws["!merges"] = [
            { s: { r: 4, c: 0 }, e: { r: 4, c: 2 } }, // "CORTE FINAL DE CAJA EN EFECTIVO" combinada en 3 columnas
            { s: { r: ws_data.length - pedidosPlataforma.length - 2, c: 0 }, e: { r: ws_data.length - pedidosPlataforma.length - 2, c: 2 } } // "PEDIDOS UBER/RAPPI/DIDI" combinada en 3 columnas
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Productos");

        // Convertir y descargar el archivo Excel
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "productos.xlsx");
    };

    if (props.asMenuItem) {
        return (
            <div onClick={exportarExcel} style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faFileExcel} style={{ color: "#28a745" }} />
                &nbsp; Descargar Excel
            </div>
        );
    }

    return (
        <Badge
            className="cursor-pointer"
            bg="success"
            onClick={() => exportarExcel()}
        >
            <FontAwesomeIcon className="text-lg" icon={faFileExcel} />
        </Badge>
    );
};

export default GenerarExcel;
