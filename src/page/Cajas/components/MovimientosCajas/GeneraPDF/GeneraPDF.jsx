import { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import "../../../../../scss/styles.scss";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import Swal from 'sweetalert2';
import { map } from "lodash";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import printJS from 'print-js';

function GeneraPdf(props) {
    const { datos } = props;
    const { idCaja, movimientosAcumulados, dineroAcumulado, observaciones, fechaCreacion } = datos;

    const movimientosTotales = [...movimientosAcumulados, ...datos]; // Combina los movimientos

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

    const handlePrint = () => {
        Swal.fire({ icon: 'info', title: "Generando... espere por favor", timer: 1600, showConfirmButton: false });

        const timer = setTimeout(() => {
            // Usando print-js para imprimir el contenido del ticket
            printJS({
                printable: 'tiquetAutogenerado', // El ID del contenedor que contiene el ticket
                type: 'html',                   // Tipo de contenido (HTML)
                style: `
                    @page {
                        size: 58mm 100mm; /* Establecer el tamaño del ticket */
                        margin: 0; /* Eliminar márgenes */
                    }
                    body {
                        margin: 0; /* Eliminar márgenes del cuerpo */
                        padding: 0;
                        width: 58mm;
                    }
                    .ticket__autogenerado {
                        width: 58mm; /* Ajustar el contenedor al tamaño del ticket */
                        font-family: Arial, sans-serif;
                        font-size: 10px; /* Tamaño de fuente más pequeño para ajustarse al tamaño del ticket */
                        line-height: 1.4;
                    }
                    .logotipo {
                        width: 50px !important;
                        margin: 0 auto;
                        display: block;
                    }
                    img {
                        width: 50px !important;
                        display: block;
                        margin: 0 auto;
                    }
                    .detallesTitulo p {
                        margin: 0;
                        font-size: 9px;
                        text-align: center;
                    }
                    .tabla {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0;
                    }
                    .tabla th, .tabla td {
                        border: 1px solid #ddd;
                        padding: 2px;
                        font-size: 8px; /* Ajustar tamaño de fuente */
                        text-align: left;
                    }
                    .subtotal__price {
                        font-size: 8px;
                        text-align: right;
                    }
                    .observaciones__tiquet {
                        font-size: 8px;
                        text-align: center;
                    }
                    .items__price {
                        font-size: 8px; /* Ajustar tamaño de fuente para montos */
                    }
                    .ticket__actions {
                        display: none !important;
                    }
                    .remove-icon {
                        display: none !important;
                    }
                `,
                showModal: true
            });
        }, 2500);

        return () => clearTimeout(timer);
    };

    const [totalTarjeta, setTotalTarjeta] = useState(0);
    let cantidadTotalTarjeta = 0;

    const [totalTransferencia, setTotalTransferencia] = useState(0);
    let cantidadTotalTransferencia = 0;

    const obtenerTotales = () => {
        map(movimientosTotales, (item, index) => {
            const { monto, pago } = item;
            if (pago === "Tarjeta") {
                cantidadTotalTarjeta += parseFloat(monto);
            } else if (pago === "Transferencia") {
                cantidadTotalTransferencia += parseFloat(monto);
            }
            setTotalTarjeta(cantidadTotalTarjeta);
            setTotalTransferencia(cantidadTotalTransferencia);
        });
    }

    useEffect(() => {
        obtenerTotales();
    }, []);

    return (
        <>
            <div id="tiquetAutogenerado" className="ticket__autogenerado">
                <div className="ticket__information">
                    <div className="cafe">
                        <div className="logotipo">
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className="detallesTitulo">
                            <p className="cafe__number">Teléfono para pedidos</p>
                            <p className="cafe__number">442-714-09-79</p>
                            <p className="cafe__number">
                                {dayjs(fechaCreacion).format('dddd, LL hh:mm A')}
                            </p>
                        </div>
                    </div>
                    <div className="ticket__table">
                        <Table>
                            <thead>
                                <tr>
                                    <th className="items__numeracion">#</th>
                                    <th className="items__description">Movimiento</th>
                                    <th className="items__description">Detalles</th>
                                    <th className="items__price">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientosTotales?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}.- </td>
                                        <td className="items__description">{item.movimiento}</td>
                                        <td className="items__description">
                                            {item.pago === "" ? item.concepto === "" ? "No disponibles" : item.concepto : item.pago}
                                        </td>
                                        <td>
                                            ${''}
                                            {new Intl.NumberFormat('es-MX', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(item.monto)} MXN
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className="subtotal">
                        <hr />
                        <Row>
                            <Col>
                                <p className="observaciones__tiquet">
                                    {observaciones}
                                </p>
                            </Col>
                            <Col>
                                <div className="subtotal__price">
                                    Total de tarjeta ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(totalTarjeta / 2)} MXN
                                </div>
                                <div className="subtotal__price">
                                    Total de transferencia ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(totalTransferencia / 2)} MXN
                                </div>
                                <div className="subtotal__price">
                                    Total de efectivo ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(dineroAcumulado)} MXN
                                </div>
                            </Col>
                        </Row>
                        <hr />
                    </div>
                </div>
            </div>

            <Row>
                <Col sm={8}></Col>
                <Col sm={4}>
                    <button
                        className="btnImprimirdeNuevo"
                        title="Imprimir ticket"
                        onClick={() => handlePrint()}
                    > 🖨︎</button>
                </Col>
            </Row>
        </>
    );
}

function formatModelMovimientosCajas(movimientos) {
    const tempMovimientos = [];
    movimientos.forEach((movimiento) => {
        tempMovimientos.push({
            id: movimiento._id,
            idCaja: movimiento.idCaja,
            idCajero: movimiento.idCajero,
            cajero: movimiento.cajero,
            movimiento: movimiento.movimiento,
            monto: movimiento.monto,
            pago: movimiento.pago,
            estado: movimiento.estado,
            fechaCreacion: movimiento.createdAt,
            fechaActualizacion: movimiento.updatedAt
        });
    });
    return tempMovimientos;
}

export default GeneraPdf;

