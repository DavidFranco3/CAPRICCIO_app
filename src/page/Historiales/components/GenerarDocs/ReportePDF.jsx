import { useState } from "react";

function ReportePDF(params) {
    const { listVentas, fechaInicial, fechaFinal } = params;
    console.log(params);

    const [totales, setTotales] = useState(null);

    const headers = {
        numeroTiquet: "Número de Tiquet",
        estado: "Estado venta",
        cliente: "Cliente",
        nombre: "Producto",
        precio: "Precio",
        tipoPago: "Tipo de pago",
        tipoPedido: "Tipo de pedido",
        hacerPedido: "Pedido realizado",
        totalVenta: "Total de venta en el tiquet",
        fecha: "Fecha", 
    };

    const generateCSV = () => {
        const headerKeys = Object.keys(headers);
        const headerLabels = headerKeys.map(key => headers[key]);

        const csvContent = [
            headerLabels.join(","),
            ...listVentas.map(venta => 
                headerKeys.map(key => venta[key]).join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_ventas_${fechaInicial}_a_${fechaFinal}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <button className="btn btn-success" onClick={generateCSV}><i className="fas fa-file-excel"></i> CSV</button>
        </div>
    );
}

export default ReportePDF;
