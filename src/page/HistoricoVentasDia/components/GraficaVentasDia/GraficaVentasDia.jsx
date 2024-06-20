import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { map } from "lodash";

Chart.register(...registerables);

function GraficaVentasDia(props) {
    const { listDetallesDia, dia } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const [total, setTotal] = useState(0);
    const [efectivo, setEfectivo] = useState(0);
    const [tarjeta, setTarjeta] = useState(0);
    const [transferencia, setTransferencia] = useState(0);

    const cargarGrafica = () => {
        let efectivo = 0;
        let tarjeta = 0;
        let transferencia = 0;
        map(listDetallesDia, (totales, index) => {
            // Sumatoria de ventas realizadas con efectivo
            if (totales.tipoPago === "Efectivo") {
                efectivo += parseFloat(totales.total);
                // console.log(totales.total)
            }

            // Sumatoria de ventas realizadas con tarjeta
            if (totales.tipoPago === "Tarjeta") {
                tarjeta += parseFloat(totales.total);
                // console.log(totales.total)
            }

            // Sumatoria de ventas realizadas con transferencia
            if (totales.tipoPago === "Transferencia") {
                transferencia += parseFloat(totales.total);
                // console.log(totales.total)
            }
        })
        setEfectivo(efectivo);
        setTarjeta(tarjeta);
        setTransferencia(transferencia);
        setTotal(efectivo + tarjeta + transferencia);
    }

    useEffect(() => {
        cargarGrafica();
    }, []);

    const data = {
        labels: ["Totales del dia"],
        datasets: [{
            label: "Efectivo",
            backgroundColor: "rgb(255, 0, 0)",
            borderColor: "rgb(255, 0, 0)",
            borderWidth: 1,
            data: [efectivo]
        },
        {
            label: "Tarjeta",
            backgroundColor: "rgb(0, 255, 0)",
            borderColor: "rgb(0, 255, 0)",
            borderWidth: 1,
            data: [tarjeta]
        },
        {
            label: "Transferencia",
            backgroundColor: "rgb(255, 128, 0)",
            borderColor: "rgb(255, 128, 0)",
            borderWidth: 1,
            data: [transferencia]
        }]
    };

    const opciones = {
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <>
            <div className='App' style={{ width: "100%", height: "500px" }}>
                <h2>Total de dinero ingresado: ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(total)} MXN</h2>
                <Bar data={data} options={opciones} />
            </div>
        </>
    );

}

export default GraficaVentasDia;