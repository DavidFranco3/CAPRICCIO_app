import { Image } from "react-bootstrap";
import "../../../scss/styles.scss";

function Producto(props) {
    const { imagen, nombre, precio } = props;

    const Card = ({ imagen, nombre, precio }) => {
        return (
            <div className="product">
                <div className="product__image">
                    <Image src={imagen} alt={nombre + " " + +"$"+ precio} title={nombre + " " + "$" + precio} />
                </div>
                <div className="product__name">
                    <p className="informacionProducto">{nombre}</p>
                </div>
                <div className="product__price">
                    <p className="informacionProducto">
                        ${''}
                        {new Intl.NumberFormat('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(precio)} MXN
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Card
                imagen={imagen}
                nombre={nombre}
                precio={precio}
            />
        </>
    );
}

export default Producto;
