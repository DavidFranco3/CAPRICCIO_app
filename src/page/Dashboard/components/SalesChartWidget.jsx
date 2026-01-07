import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BanknotesIcon, CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Icons for payment types

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesChartWidget = ({ ventas }) => {

    const chartData = useMemo(() => {
        let efectivo = 0;
        let tarjeta = 0;
        let transferencia = 0;

        if (ventas && ventas.length > 0) {
            ventas.forEach((venta) => {
                const total = parseFloat(venta.total) || 0;
                if (venta.tipoPago === "Efectivo") efectivo += total;
                else if (venta.tipoPago === "Tarjeta") tarjeta += total;
                else if (venta.tipoPago === "Transferencia") transferencia += total;
            });
        }

        return {
            labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
            datasets: [
                {
                    label: 'Ventas del Día',
                    data: [efectivo, tarjeta, transferencia],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.7)', // Green for Cash
                        'rgba(54, 162, 235, 0.7)', // Blue for Card
                        'rgba(255, 206, 86, 0.7)', // Yellow for Transfer
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1,
                    borderRadius: 5,
                },
            ],
        };
    }, [ventas]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.8)",
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.8)",
                }
            }
        },
        maintainAspectRatio: false,
    };

    // Quick summary for header
    const totalEfectivo = chartData.datasets[0].data[0];
    const totalTarjeta = chartData.datasets[0].data[1];
    const totalTransferencia = chartData.datasets[0].data[2];

    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

    return (
        <Card className="glass-card shadow-sm border-0 h-100">
            <Card.Header className="border-0 pt-4 pb-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-bold text-white">Desglose de Ingresos</h5>
                </div>
                <div className="d-flex gap-4 text-sm text-white-50">
                    <div className='d-flex align-items-center gap-1'>
                        <span className='w-3 h-3 rounded-circle' style={{ backgroundColor: 'rgba(75, 192, 192, 1)' }}></span>
                        Efectivo: <strong className="text-white">{formatCurrency(totalEfectivo)}</strong>
                    </div>
                    <div className='d-flex align-items-center gap-1'>
                        <span className='w-3 h-3 rounded-circle' style={{ backgroundColor: 'rgba(54, 162, 235, 1)' }}></span>
                        Tarjeta: <strong className="text-white">{formatCurrency(totalTarjeta)}</strong>
                    </div>
                    <div className='d-flex align-items-center gap-1'>
                        <span className='w-3 h-3 rounded-circle' style={{ backgroundColor: 'rgba(255, 206, 86, 1)' }}></span>
                        Transf: <strong className="text-white">{formatCurrency(totalTransferencia)}</strong>
                    </div>
                </div>
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
                <Bar options={options} data={chartData} />
            </Card.Body>
        </Card>
    );
};

export default SalesChartWidget;
