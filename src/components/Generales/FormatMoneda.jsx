// 📁 components/FormatearMoneda.jsx
import React from "react";

export const formatMoneda = (valor) => {
    if (valor === undefined || valor === null || valor === "") return <>$0.00 MXN</>;

    const montoFormateado = new Intl.NumberFormat("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor);

    return (
        <>
            ${''}
            {montoFormateado} MXN
        </>
    );
};
