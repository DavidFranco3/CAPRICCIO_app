import React, { useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { CurrencyDollarIcon, ShoppingBagIcon, TicketIcon, ChartBarIcon } from '@heroicons/react/24/outline'; // Using outline icons for a clean look

const KPICards = ({ ventas }) => {

    const metrics = useMemo(() => {
        if (!ventas || ventas.length === 0) {
            return {
                totalVentas: 0,
                totalPedidos: 0,
                ticketPromedio: 0,
                productosVendidos: 0
            };
        }

        const totalVentas = ventas.reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0);
        const totalPedidos = ventas.length;
        const ticketPromedio = totalVentas / totalPedidos;
        const productosVendidos = ventas.reduce((acc, curr) => acc + (curr.productos ? curr.productos.length : 0), 0);

        return {
            totalVentas,
            totalPedidos,
            ticketPromedio,
            productosVendidos
        };
    }, [ventas]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    };

    const cardStyles = "shadow-sm border-0 h-100";
    const iconStyles = "h-8 w-8 text-white opacity-75";

    return (
        <Row className="mb-4 g-3">
            <Col xl={3} md={6}>
                <Card className={`${cardStyles} glass-kpi-card kpi-blue`}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-0 opacity-75 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Ventas Hoy</p>
                                <h3 className="fw-bold mb-0">{formatCurrency(metrics.totalVentas)}</h3>
                            </div>
                            <div className="icon-bubble">
                                <CurrencyDollarIcon className={iconStyles} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xl={3} md={6}>
                <Card className={`${cardStyles} glass-kpi-card kpi-green`}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-0 opacity-75 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Pedidos</p>
                                <h3 className="fw-bold mb-0">{metrics.totalPedidos}</h3>
                            </div>
                            <div className="icon-bubble">
                                <TicketIcon className={iconStyles} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xl={3} md={6}>
                <Card className={`${cardStyles} glass-kpi-card kpi-purple`}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-0 opacity-75 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Ticket Promedio</p>
                                <h3 className="fw-bold mb-0">{formatCurrency(metrics.ticketPromedio)}</h3>
                            </div>
                            <div className="icon-bubble">
                                <ChartBarIcon className={iconStyles} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col xl={3} md={6}>
                <Card className={`${cardStyles} glass-kpi-card kpi-orange`}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-0 opacity-75 fw-bold text-uppercase" style={{ fontSize: '0.8rem' }}>Productos</p>
                                <h3 className="fw-bold mb-0">{metrics.productosVendidos}</h3>
                            </div>
                            <div className="icon-bubble">
                                <ShoppingBagIcon className={iconStyles} />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default KPICards;
