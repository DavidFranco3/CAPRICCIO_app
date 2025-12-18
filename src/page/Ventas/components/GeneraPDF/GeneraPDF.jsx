import { Col, Row, Table } from "react-bootstrap";
import "../../../../scss/styles.scss";
import { toast } from "react-toastify";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import printJS from 'print-js';  // Importar print-js

function GeneraPdf(props) {
    const { datos } = props;

    const { numeroTiquet, mesa, articulosVendidos, cliente, detalles, tipoPago, efectivo, cambio, subtotal, tipoPedido, hacerPedido, total, iva, comision, fechaCreacion } = datos;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const logo = "https://res.cloudinary.com/omarlestrella/image/upload/v1730506157/TPV_LA_NENA/msdxqnu7gehwjru0jhvs.jpg";

    const handlePrint = () => {
        toast.info("Generando... espere por favor");
    
        const timer = setTimeout(() => {
            printJS({
                printable: 'tiquetAutogenerado',  // ID del contenedor a imprimir
                type: 'html',  // Tipo de contenido a imprimir
                style: `
                    @page {
                        size: 58mm 100mm; /* Establece el tamaño del ticket */
                        margin: 0; /* Eliminar márgenes */
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        width: 58mm; /* Ajustar al ancho del ticket */
                        font-family: Arial, sans-serif;
                    }
                    .ticket__autogenerado {
                        padding: 5mm;
                    }
                    .tabla {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0;
                    }
                    .tabla th,
                    .tabla td {
                        border: 1px solid #ddd;
                        text-align: left;
                        font-size: 10px; /* Ajustar tamaño de fuente */
                        padding: 2px;
                    }
                    .tabla th {
                        background-color: #d4eefd;
                        text-align: left;
                    }
                    .tabla td {
                        padding: 4px;
                    }
                    p {
                        margin-top: 0 !important;
                        font-size: 10px; /* Ajustar tamaño de fuente */
                        line-height: 1.2;
                    }
                    .cafe__number {
                        margin-top: 0 !important;
                        font-size: 10px; /* Ajustar tamaño de fuente */
                    }
                    .logotipo img {
                        width: 50px; /* Ajustar logo a un tamaño adecuado */
                        display: block;
                        margin: 0 auto;
                    }
                    .detallesTitulo {
                        margin-top: 5mm;
                        font-size: 10px;
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
                    .subtotal__price,
                    .subtotal__cambio {
                        font-size: 10px; /* Ajustar tamaño de fuente */
                    }
                    .subtotal__price {
                        padding-top: 2mm;
                    }
                `,
                scanStyles: true  // Escanea y aplica estilos del documento
            });
        }, 2500);
    
        return () => clearTimeout(timer);
    };

    const Encabezado = ({ logo, mesa, numeroTiquet, nombreCliente, tipoPedido, hacerPedido, fechayHora }) => {
        return (
            <div className="cafe">
                <div className="logotipo">
                    <img src={logo} alt="Logo" />
                </div>

                <div className="detallesTitulo">
                    <p className="cafe__number">Teléfono para pedidos</p>
                    <p className="cafe__number">442-714-09-79</p>
                    <p className="cafe__number">Ticket #{numeroTiquet}</p>
                    {nombreCliente !== "" && (
                        <>
                            {mesa && !isNaN(mesa) && (
                                <p className="invoice__cliente">Mesa: {mesa}</p>
                            )}
                            {nombreCliente && mesa && !isNaN(mesa) && (
                                <p className="invoice__cliente">Cliente: {nombreCliente}</p>
                            )}
                        </>
                    )}
                    <p className="invoice__cliente">Pedido {tipoPedido}</p>
                    <p className="invoice__cliente">Hecho {hacerPedido}</p>
                    <p className="cafe__number">{fechayHora}</p>
                </div>
            </div>
        );
    };

    const Cuerpo = ({ products }) => {
        return (
            <div className="ticket__table">
                <Table>
                    <thead>
                        <tr>
                            <th className="items__numeracion">#</th>
                            <th className="items__description">Descripción</th>
                            <th className="items__qty">Cantidad</th>
                            <th className="items__price">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}.- </td>
                                <td className="items__description">{item.nombre}</td>
                                <td>1</td>
                                <td>
                                    ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.precio)} MXN
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    const Pie = ({ detalles, tipoPago, comision, iva, subtotal, total, efectivo, cambio }) => {
        return (
            <div className="subtotal">
                <hr />
                <Row>
                    <Col>
                        <p className="observaciones__tiquet">{detalles}</p>
                    </Col>
                    <Col>
                        <div className="subtotal__cambio">Pago realizado con {tipoPago}</div>
                        {tipoPago === "Tarjeta" && (
                            <>
                                <div className="subtotal__cambio">
                                    Comisión ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(comision)} MXN
                                </div>
                            </>
                        )}
                        {iva != "0" && (
                            <div className="subtotal__price">
                                IVA ${''}
                                {new Intl.NumberFormat('es-MX', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(iva)} MXN
                            </div>
                        )}
                        <div className="subtotal__price">
                            Subtotal ${''}
                            {new Intl.NumberFormat('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(subtotal)} MXN
                        </div>
                        <div className="subtotal__price">
                            Total ${''}
                            {new Intl.NumberFormat('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(total)} MXN
                        </div>
                        {tipoPago === "Efectivo" && (
                            <>
                                <div className="subtotal__cambio">
                                    Efectivo ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(efectivo)} MXN
                                </div>
                                <div className="subtotal__cambio">
                                    Cambio ${''}
                                    {new Intl.NumberFormat('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(cambio)} MXN
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
                <hr />
            </div>
        );
    };

    const Imprimir = ({ onClick }) => {
        return (
            <Row>
                <Col sm={8}></Col>
                <Col sm={4}>
                    <button
                        className="btnImprimirdeNuevo"
                        title="Imprimir ticket"
                        onClick={onClick}
                    > 🖨︎</button>
                </Col>
            </Row>
        );
    };

    return (
        <>
            <div id="tiquetAutogenerado" className="ticket__autogenerado">
                <div className="ticket__information">
                    <Encabezado
                        logo={logo}
                        numeroTiquet={numeroTiquet}
                        nombreCliente={cliente}
                        mesa={mesa}
                        tipoPedido={tipoPedido}
                        hacerPedido={hacerPedido}
                        fechayHora={dayjs.utc(fechaCreacion).format('dddd, LL hh:mm A')}
                    />
                    <Cuerpo products={articulosVendidos} />
                    <Pie
                        detalles={detalles}
                        tipoPago={tipoPago}
                        comision={comision}
                        iva={iva}
                        subtotal={subtotal}
                        total={total}
                        efectivo={efectivo}
                        cambio={cambio}
                    />
                </div>
            </div>

            <Imprimir onClick={() => handlePrint()} />
        </>
    );
}

export default GeneraPdf;
