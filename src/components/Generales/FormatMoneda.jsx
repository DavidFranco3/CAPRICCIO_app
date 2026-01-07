// 📁 components/FormatearMoneda.jsx
import { Badge } from "react-bootstrap";
import { estilos } from "../../utils/tableStyled";

export const formatMoneda = (valor) => {
    if (valor === undefined || valor === null || valor === "") {
        return (
            <Badge bg="success" className="estado">
                $0.00 MXN
            </Badge>
        );
    }

    const montoFormateado = new Intl.NumberFormat("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(valor);

    return (
        <Badge bg="success" className="estado">
            ${''}
            {montoFormateado} MXN
        </Badge>
    );
};
