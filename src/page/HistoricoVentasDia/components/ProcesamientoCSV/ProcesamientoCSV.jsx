import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { listarDetallesProductosVentasPorDia, listarVentasPorDia } from "../../../../api/ventas";
import { Badge, Image } from "react-bootstrap";
import LogoExcel from "../../../../assets/png/excel.png";
import { exportCSVFile } from "../../../../utils/exportCSV";
import "../../../../scss/styles.scss";

function ProcesamientoCsv(props) {
    const { dia } = props;

    const [listDetallesDia, setListDetallesDia] = useState(null);

    // Para almacenar los totales de la ventas del dia
    const [totales, setTotales] = useState(null);

    // Para almacenar los totales de la ventas del dia
    const [titulos, setTitulos] = useState(null);

    const headers = {
        numeroTiquet: "Número de Tiquet",
        estado: "Estado de la venta",
        cliente: "Cliente",
        nombre: "Nombre del producto",
        precio: "Precio",
        tipoPago: "Tipo de pago",
        tipoPedido: "Tipo de pedido",
        hacerPedido: "Por donde se hizo el pedido",
        totalVenta: "Total de venta en el tiquet",
        fecha: "Fecha en la que se hizo la venta",
    };

    const cargarDatosCSV = () => {
        try {
            // Inicia listado de detalles de los articulos vendidos
            listarDetallesProductosVentasPorDia(dia).then(response => {
                const { data } = response;
                console.log(data)
                setListDetallesDia(data)
            }).catch(e => {
                console.log(e)
            })
            // Termina listado de detalles de los artículos vendidos

            listarVentasPorDia(dia).then(response => {
                const { data } = response;
                const { efectivo, tarjeta, transferencia, pendiente, tortasVendidas, bebidasVendidas, extrasVendidos, sandwichesVendidos, desayunosVendidos, enviosVendidos, tacosVendidos, postresVendidos, promocionesVendidas } = data;
                //console.log(data)
                const dataTitulos = [{
                    efectivo: "Total efectivo",
                    tarjeta: "Total tarjeta",
                    transferencia: "Total transferencia",
                    pendiente: "Total pendiente",
                    total: "Total final",
                    tortasVendidas: "Total de tortas vendidas",
                    bebidasVendidas: "Total de bebidas vendidas",
                    extrasVendidos: "Total de ingredientes extras vendidos",
                    sandwichesVendidos: "Total de sandwiches vendidos",
                    desayunosVendidos: "Total de desayunos vendidos",
                    tacosVendidos: "Total de tacos vendidos",
                    postresVendidos: "Total de postres vedidos",
                    promocionesVendidas: "Total de promociones vendidas",
                    totalProductosVendidos: "Total de los productos vendidos",
                    enviosVendidos: "Total de envios realizados"
                }]
                const dataFinal = {
                    efectivo: efectivo,
                    tarjeta: tarjeta,
                    transferencia: transferencia,
                    pendiente: pendiente,
                    total: efectivo + transferencia + tarjeta + pendiente,
                    tortasVendidas: tortasVendidas,
                    bebidasVendidas: bebidasVendidas,
                    extrasVendidos: extrasVendidos,
                    sandwichesVendidos: sandwichesVendidos,
                    desayunosVendidos: desayunosVendidos,
                    tacosVendidos: tacosVendidos,
                    postresVendidos: postresVendidos,
                    promocionesVendidas: promocionesVendidas,
                    totalProductosVendidos: tacosVendidos + postresVendidos + promocionesVendidas + tortasVendidas + bebidasVendidas + extrasVendidos + sandwichesVendidos + desayunosVendidos,
                    enviosVendidos: enviosVendidos
                }
                //console.log(dataFinal)

                setTotales(dataFinal)
                setTitulos(dataTitulos)
                // Termina procesamiento de la nueva información del corte del día
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosCSV();
    }, []);

    const generacionCSV = () => {
        try {
            Swal.fire({ icon: 'info', title: "Generando contenido, espere por favor ....", timer: 1600, showConfirmButton: false })
            const timer = setTimeout(() => {
            const dataConcatTitulos = titulos.concat(totales)
            const datosTemp = listDetallesDia.concat(dataConcatTitulos)
            exportCSVFile(headers, datosTemp, "CORTE_CAJA_DIA" + "_" + dia)
        }, 5000);
        return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Badge
                bg="light"
                className="iconoExcel"
                onClick={() => {
                    generacionCSV()
                }}
            >
                <Image
                    title="Imprimir CSV"
                    alt="Imprimir CSV"
                    src={LogoExcel}
                    className="descargaExcel"
                />
            </Badge>
        </>
    );
}

export default ProcesamientoCsv;

