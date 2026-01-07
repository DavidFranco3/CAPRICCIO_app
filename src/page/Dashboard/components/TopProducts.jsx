import React, { useMemo } from 'react';
import { Card, Table } from 'react-bootstrap';
import { TrophyIcon } from '@heroicons/react/24/solid';

const TopProducts = ({ ventas }) => {

    const topProducts = useMemo(() => {
        if (!ventas || ventas.length === 0) return [];

        const counts = {};

        ventas.forEach(venta => {
            const productos = venta.articulosVendidos || venta.productos || [];
            productos.forEach(producto => {
                // Adjust property name based on your data structure. 
                // Using 'nombre' as common convention, fallback to 'name' or 'descripcion' if needed.
                const nombre = producto.nombre || producto.name || producto.descripcion || "Producto sin nombre";

                // If product has a quantity property, use it. Otherwise count as 1.
                const cantidad = producto.cantidad || 1;

                counts[nombre] = (counts[nombre] || 0) + cantidad;
            });
        });

        return Object.entries(counts)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);
    }, [ventas]);

    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-2">
                <div className="d-flex align-items-center mb-0">
                    <TrophyIcon className="h-5 w-5 text-warning me-2" />
                    <h5 className="mb-0 fw-bold text-gray-800">Top 5 Productos</h5>
                </div>
            </Card.Header>
            <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="bg-light text-secondary text-uppercase text-xs">
                        <tr>
                            <th className="ps-4 border-0 font-weight-bolder opacity-7">Producto</th>
                            <th className="text-center border-0 font-weight-bolder opacity-7">Vendidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <tr key={index}>
                                    <td className="ps-4 border-0">
                                        <div className="d-flex flex-column justify-content-center">
                                            <h6 className="mb-0 text-sm">{product.nombre}</h6>
                                        </div>
                                    </td>
                                    <td className="align-middle text-center border-0">
                                        <span className="text-secondary text-sm font-weight-bold">{product.cantidad}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-muted">Aún no hay ventas hoy</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default TopProducts;
