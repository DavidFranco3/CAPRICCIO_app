import { useState, useEffect } from 'react';
import { Badge, Col, Row } from "react-bootstrap";
import { listarVentasPorMes } from "../../api/ventas";
import "../../scss/styles.scss";

function Total(props) {
    const { mes, año } = props;

    // Para almacenar total vendido en efectivo
    const [totalEfectivo, setTotalEfectivo] = useState(0);

    // Para almacenar total vendido con tarjeta
    const [totalTarjeta, setTotalTarjeta] = useState(0);

    // Para almacenar total vendido con tarjeta
    const [totalTransferencia, setTotalTransferencia] = useState(0);

    // Para almacenar total vendido pero que esta pendiente de pagar
    const [totalPendiente, setTotalPendiente] = useState(0);

    // Para almacenar el total de articulos vendidos
    const [totalTortas, setTotalTortas] = useState(0);

    // Para almacenar el total de bebidas y postres vendidos
    const [totalBebidas, setTotalBebidas] = useState(0);

    // Para almacenar el total de hamburguesas y papas fritas vendidas
    const [totalHamburguesas, setTotalHamburguesas] = useState(0);

    // Para almacenar el total de productos de cafeteria vendidos
    const [totalCafeteria, setTotalCafeteria] = useState(0);

    // Para almacenar el total de extras vendidos
    const [totalExtras, setTotalExtras] = useState(0);

    // Para almacenar el total de sandwiches y ensaladas vendidas
    const [totalSandwiches, setTotalSandwiches] = useState(0);

    // Para almacenar el total de desayunos vendidos
    const [totalDesayunos, setTotalDesayunos] = useState(0);

    // Para almacenar el total de envios vendidos
    const [totalEnvios, setTotalEnvios] = useState(0);

    // Para almacenar el total de envios vendidos
    const [totalTacos, setTotalTacos] = useState(0);

    // Para almacenar el total de envios vendidos
    const [totalPostres, setTotalPostres] = useState(0);

    // Para almacenar el total de envios vendidos
    const [totalPromociones, setTotalPromociones] = useState(0);

    useEffect(() => {
        try {
            listarVentasPorMes(mes, año).then(response => {
                const { data } = response;
                const { efectivo, tarjeta, transferencia, pendiente, hamburguesasVendidas, cafeteriaVendida, tortasVendidas, bebidasVendidas, extrasVendidos, sandwichesVendidos, desayunosVendidos, enviosVendidos, tacosVendidos, postresVendidos, promocionesVendidas } = data;
                // console.log(data)
                setTotalEfectivo(efectivo);
                setTotalTarjeta(tarjeta);
                setTotalTransferencia(transferencia);
                setTotalPendiente(pendiente);
                setTotalTortas(tortasVendidas);
                setTotalBebidas(bebidasVendidas);
                setTotalExtras(extrasVendidos);
                setTotalHamburguesas(hamburguesasVendidas);
                setTotalCafeteria(cafeteriaVendida);
                setTotalSandwiches(sandwichesVendidos);
                setTotalDesayunos(desayunosVendidos);
                setTotalEnvios(enviosVendidos);
                setTotalTacos(tacosVendidos);
                setTotalPostres(postresVendidos);
                setTotalPromociones(promocionesVendidas);
            });
        } catch (e) {
            console.log(e);
        }
    }, [mes]);

    return (
        <>
            <Row align="center">
                <Col>
                    Efectivo
                </Col>
                <Col>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(totalEfectivo)} MXN
                    </Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Tarjeta
                </Col>
                <Col>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(totalTarjeta)} MXN
                    </Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Transferencia
                </Col>
                <Col>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(totalTransferencia)} MXN
                    </Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Pendiente
                </Col>
                <Col>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(totalPendiente)} MXN
                    </Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Total
                </Col>
                <Col>
                    <Badge bg="success">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(totalEfectivo + totalTarjeta + totalTransferencia + totalPendiente)} MXN</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Tortas
                </Col>
                <Col>
                    <Badge bg="success">{totalTortas} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Bebidas y postres
                </Col>
                <Col>
                    <Badge bg="success">{totalBebidas} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Extras
                </Col>
                <Col>
                    <Badge bg="success">{totalExtras} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Sandwiches y ensaladas
                </Col>
                <Col>
                    <Badge bg="success">{totalSandwiches} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Hamburguesas y papas fritas
                </Col>
                <Col>
                    <Badge bg="success">{totalHamburguesas} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Productos de cafeteria
                </Col>
                <Col>
                    <Badge bg="success">{totalCafeteria} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Desayunos
                </Col>
                <Col>
                    <Badge bg="success">{totalDesayunos} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Promociones
                </Col>
                <Col>
                    <Badge bg="success">{totalPromociones} promociones</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Tacos
                </Col>
                <Col>
                    <Badge bg="success">{totalTacos} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Postres
                </Col>
                <Col>
                    <Badge bg="success">{totalPostres} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Total
                </Col>
                <Col>
                    <Badge bg="success">{totalPostres + totalPromociones + totalTacos + totalTortas + totalHamburguesas + totalCafeteria + totalBebidas + totalExtras + totalSandwiches + totalDesayunos} piezas</Badge>
                </Col>
            </Row>
            <Row align="center">
                <Col>
                    Envíos
                </Col>
                <Col>
                    <Badge bg="success">{totalEnvios} entregas</Badge>
                </Col>
            </Row>
        </>
    );
}

export default Total;
