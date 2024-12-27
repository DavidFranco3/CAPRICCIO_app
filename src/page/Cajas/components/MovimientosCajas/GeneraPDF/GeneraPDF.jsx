import { useState, useEffect } from "react"
import { Col, Row, Table } from "react-bootstrap";
import "../../../../../scss/styles.scss";
import { logoTiquetGris } from "../../../../../assets/base64/logo-tiquet";
import { toast } from "react-toastify";
import { map } from "lodash";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import printJS from 'print-js';

function GeneraPdf(props) {
    const { datos } = props;
    const { idCaja, movimientosAcumulados, dineroAcumulado, observaciones, fechaCreacion } = datos;
    console.log(datos);
    
    const movimientosTotales = movimientosAcumulados.concat(datos);

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const handlePrint = () => {
        toast.info("Generando... espere por favor");
      
        const timer = setTimeout(() => {
          // Usando print-js para imprimir el contenido del ticket
          printJS({
            printable: 'tiquetAutogenerado', // El ID del contenedor que contiene el ticket
            type: 'html',                   // Tipo de contenido (HTML)
            style: `
              @page {
                size: 58mm 120mm; /* Establecer el tamaño del ticket */
                margin: 0; /* Eliminar márgenes */
              }
              body {
                margin: 0; /* Eliminar márgenes del cuerpo */
                padding: 0;
                width: 58mm;
              }
              .tabla {
                width: 100%;
                border-collapse: collapse;
                margin: 0;
              }
              .tabla th {
                border: 1px solid #ddd;
                padding: 4px;
                background-color: #d4eefd;
                text-align: left;
                font-size: 12px; /* Ajustar tamaño de fuente */
              }
              .tabla td {
                border: 1px solid #ddd;
                text-align: left;
                padding: 6px;
                font-size: 10px; /* Ajustar tamaño de fuente */
              }
              p {
                margin-top: -10px !important;
                font-size: 10px; /* Ajustar tamaño de fuente */
              }
              .cafe__number {
                margin-top: -10px !important;
                font-size: 10px; /* Ajustar tamaño de fuente */
              }
              .logotipo {
                width: 50px !important;
                margin: 0 auto;
              }
              img {
                width: 50px !important;
                margin: 0 auto;
              }
              .detallesTitulo {
                margin-top: 10px !important;
                font-size: 12px;
              }
              .ticket__actions {
                display: none !important;
              }
              .remove-icon {
                display: none !important;
              }
              .items__price {
                color: #000000 !important;
                font-size: 10px; /* Ajustar tamaño de fuente */
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
                        <div id="logo" className="logotipo">
                            <img src={logoTiquetGris} alt="logo" />
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
