import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { listarDetallesProductosVentasPorSemana, listarVentasPorSemana } from "../../../../api/ventas";
import { Badge, Image } from "react-bootstrap";
import LogoExcel from "../../../../assets/png/excel.png";   
import { exportCSVFile } from "../../../../utils/exportCSV";
import "../../../../scss/styles.scss";

function ProcesamientoCsv(props) {
    const { dia, año } = props;

    let dia2 = dia;

    const [listDetallesMes, setListDetallesMes] = useState(null);

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
            listarDetallesProductosVentasPorSemana(dia, año).then(response => {
                const { data } = response;
                // console.log(data)
                setListDetallesMes(data)
            }).catch(e => {
                console.log(e)
            })
            // Termina listado de detalles de los artículos vendidos

            listarVentasPorSemana(dia, año).then(response => {
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

                if (dia2 == "1") {
                    dia2 = "ENERO"
                } else if (dia2 == "2") {
                    dia2 = "FEBRERO"
                } else if (dia2 == "3") {
                    dia2 = "MARZO"
                } else if (dia2 == "4") {
                    dia2 = "ABRIL"
                } else if (dia2 == "5") {
                    dia2 = "MAYO"
                } else if (dia2 == "6") {
                    dia2 = "JUNIO"
                } else if (dia2 == "7") {
                    dia2 = "JULIO"
                } else if (dia == "8") {
                    dia2 = "AGOSTO"
                } else if (dia2 == "9") {
                    dia2 = "SEPTIEMBRE"
                } else if (dia2 == "10") {
                    dia2 = "OCTUBRE"
                } else if (dia2 == "11") {
                    dia2 = "NOVIEMBRE"
                } else if (dia2 == "12") {
                    dia2 = "DICIEMBRE"
                }

                setTotales(dataFinal)
                setTitulos(dataTitulos)
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
            const datosTemp = listDetallesMes.concat(dataConcatTitulos)
            exportCSVFile(headers, datosTemp, "CORTE_CAJA_MES" + "_" + dia2)
        }, 5000);
        return () => clearTimeout(timer);
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            <Badge
                title="Imprimir CSV"
                bg="light"
                className="iconoExcel"
                onClick={() => {
                    generacionCSV()
                }}
            >
                <Image
                    src={LogoExcel}
                    className="descargaExcel"
                />
            </Badge>
        </>
    );
}

export default ProcesamientoCsv;

