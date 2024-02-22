import { Image } from "react-bootstrap";
import "../../../scss/styles.scss";

function Categoria(props) {
    const { imagen, nombre } = props;

    const Card = ({ imagen, nombre }) => {
        return (
            <div className="categoria">
                <div className="categoria__image">
                    <Image src={imagen} alt={nombre} title={nombre} />
                </div>
                <div className="categoria__name">
                    <p>{nombre}</p>
                </div>
            </div>
        )
    }
    
    return (
        <>
            <Card
                imagen={imagen}
                nombre={nombre}
            />
        </>
    );
}

export default Categoria;
