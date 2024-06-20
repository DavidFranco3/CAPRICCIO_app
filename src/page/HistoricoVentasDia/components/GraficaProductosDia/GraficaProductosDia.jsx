import { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { map } from "lodash";

Chart.register(...registerables);

function GraficaProductosDia(props) {
    const { listDetallesDia, dia } = props;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const [total, setTotal] = useState(0);
    const [bebidas, setbebidas] = useState(0);
    const [tortas, setTortas] = useState(0);
    const [extras, setExtras] = useState(0);
    const [sandwiches, setSandwiches] = useState(0);
    const [desayunos, setDesayunos] = useState(0);

    const cargarGrafica = () => {
        let productos_vendidos = 0;
        let bebidas_vendidas = 0;
        let extras_vendidos = 0;
        let sandwiches_vendidos = 0;
        let desayunos_vendidos = 0;
        map(listDetallesDia, (totales, indexPrincipal) => {

            // Sumatoria de artículos vendidos
            map(totales.articulosVendidos, (producto, index) => {
                if (producto.categoria === "623b7f2fe94614410f810a47" || producto.categoria === "623b7f24e94614410f810a44" || producto.categoria === "623b7f1be94614410f810a41" || producto.categoria === "623b7f0be94614410f810a3e") {
                    productos_vendidos += 1;
                }
                if (producto.categoria === "62397cbaf67f5c7c54a0560b") {
                    bebidas_vendidas += 1;
                }
                if (producto.categoria === "625d8b798bb242960f22ae56") {
                    extras_vendidos += 1;
                }
                if (producto.categoria === "627a86119d083324e156bda8") {
                    sandwiches_vendidos += 1;
                }
                if (producto.categoria === "631b541c05ab0cb5a3c1dbd6") {
                    desayunos_vendidos += 1;
                }
            })
        })
        setTortas(productos_vendidos);
        setbebidas(bebidas_vendidas);
        setExtras(extras_vendidos);
        setSandwiches(sandwiches_vendidos);
        setDesayunos(desayunos_vendidos);
        setTotal(productos_vendidos + bebidas_vendidas + extras_vendidos + sandwiches_vendidos + desayunos_vendidos);
    }

    useEffect(() => {
        cargarGrafica();
    }, []);

    const data = {
        labels: ["Totales del dia"],
        datasets: [{
            label: "Tortas",
            backgroundColor: "rgb(255, 0, 0)",
            borderColor: "rgb(255, 0, 0)",
            borderWidth: 1,
            data: [tortas]
        },
        {
            label: "Bebidas y postres",
            backgroundColor: "rgb(0, 255, 0)",
            borderColor: "rgb(0, 255, 0)",
            borderWidth: 1,
            data: [bebidas]
        },
        {
            label: "Extras",
            backgroundColor: "rgb(255, 128, 0)",
            borderColor: "rgb(255, 128, 0)",
            borderWidth: 1,
            data: [extras]
        },
        {
            label: "Sandwiches y ensaladas",
            backgroundColor: "rgb(255, 0, 128)",
            borderColor: "rgb(255, 0, 128)",
            borderWidth: 1,
            data: [sandwiches]
        },
        {
            label: "Desayunos",
            backgroundColor: "rgb(128, 64, 0)",
            borderColor: "rgb(128, 64, 0)",
            borderWidth: 1,
            data: [desayunos]
        }]
    };

    const opciones = {
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <>
            <div className='App' style={{ width: "100%", height: "500px" }}>
                <h2>Total de productos vendidos: {total}</h2>
                <Bar data={data} options={opciones} />
            </div>
        </>
    );

}

export default GraficaProductosDia;