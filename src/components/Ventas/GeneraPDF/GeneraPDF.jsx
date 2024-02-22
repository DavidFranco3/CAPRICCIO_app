import { Col, Row, Image, Button, Table } from "react-bootstrap";
import "../../../scss/styles.scss";
import { logoTiquetGris } from "../../../assets/base64/logo-tiquet";
import { toast } from "react-toastify";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function GeneraPdf(props) {
    const { datos } = props;

    const { numeroTiquet, mesa, articulosVendidos, cliente, detalles, tipoPago, efectivo, cambio, subtotal, tipoPedido, hacerPedido, total, iva, comision, fechaCreacion } = datos;

    dayjs.locale('es');
    dayjs.extend(localizedFormat);

    const handlePrint = () => {
        toast.info("Generando... espere por favor")

        const timer = setTimeout(() => {
            const tiquetGenerado = window.open('Tiquet', 'PRINT', 'height=400,width=600');
            tiquetGenerado.document.write('<html><head>');
            tiquetGenerado.document.write('<style>.tabla{width:100%;border-collapse:collapse;margin:16px 0 16px 0;}.tabla th{border:1px solid #ddd;padding:4px;background-color:#d4eefd;text-align:left;font-size:30px;}.tabla td{border:1px solid #ddd;text-align:left;padding:6px;} p {margin-top: -10px !important;} .cafe__number {margin-top: -10px !important;} .logotipo {width: 91px !important; margin: 0 auto;} img {width: 91px !important; margin: 0 auto;} .detallesTitulo {margin-top: 10px !important;} </style>');
            tiquetGenerado.document.write('</head><body>');
            tiquetGenerado.document.write(document.getElementById('tiquetAutogenerado').innerHTML);
            tiquetGenerado.document.write('</body></html>');

            tiquetGenerado.document.close();
            tiquetGenerado.focus();
            tiquetGenerado.print();
            tiquetGenerado.close();
        }, 2500);
        return () => clearTimeout(timer);
    }

const Encabezado = ({ logo, mesa, numeroTiquet, nombreCliente, tipoPedido, hacerPedido, fechayHora }) => {
    return (
        <div className="cafe">
            {/** Logo de la cafetería */}
            <div id="logo" className="logotipo">
                <Image src={logo} alt="logo" />
            </div>

            {/** Detalles del tiquet */}
            <div className="detallesTitulo">
                <p className="cafe__number">Teléfono para pedidos</p>
                <p className="cafe__number">442-714-09-79</p>
                <p className="cafe__number">Ticket #{numeroTiquet}</p>
                
                {/** Mostrar el número de mesa si está disponible */}
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
                <p className="cafe__number">
                    {fechayHora}
                </p>
            </div>
        </div>
    );
}


    const Cuerpo = ({ products }) => {
        console.log(products)
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
        )
    }

    const Pie = ({ detalles, tipoPago, comision, iva, subtotal, total, efectivo, cambio }) => {
        return (
            <div className="subtotal">
                <hr />
                <Row>
                    <Col>
                        <p className="observaciones__tiquet">
                            {detalles}
                        </p>
                    </Col>
                    <Col>
                        <div className="subtotal__cambio">
                            Pago realizado con {tipoPago}
                        </div>
                        {
                            tipoPago === "Tarjeta" &&
                            (
                                <>
                                    <div className="subtotal__cambio">
                                        Comisión ${''}
                                        {new Intl.NumberFormat('es-MX', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(comision)} MXN
                                    </div>
                                </>
                            )
                        }
                        {
                            iva != "0" &&
                            (
                                <>
                                    <div className="subtotal__price">
                                        IVA ${''}
                                        {new Intl.NumberFormat('es-MX', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(iva)} MXN
                                    </div>
                                </>
                            )
                        }
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
                        {
                            tipoPago === "Efectivo" &&
                            (
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
                            )
                        }
                    </Col>
                </Row>
                <hr />
            </div>
        )
    }

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
        )
    }

    return (
        <>
            <div id="tiquetAutogenerado" className="ticket__autogenerado">
                <div className="ticket__information">
                    <Encabezado
                        logo={logoTiquetGris}
                        numeroTiquet={numeroTiquet}
                        nombreCliente={cliente}
                        mesa={mesa}
                        tipoPedido={tipoPedido}
                        hacerPedido={hacerPedido}
                        fechayHora={dayjs.utc(fechaCreacion).format('dddd, LL hh:mm A')}
                    />
                    <Cuerpo
                        products={articulosVendidos}
                    />

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

            <Imprimir
                onClick={() => handlePrint()}
            />
        </>
    );
}

export default GeneraPdf;
