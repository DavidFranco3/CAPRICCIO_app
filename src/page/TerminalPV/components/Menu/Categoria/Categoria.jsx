import { Image } from "react-bootstrap";
import "../../../../../scss/styles.scss";

function Categoria(props) {
  const { imagen, nombre } = props;
  const dividirTexto = (texto) => {
    // Usa un estilo de cadena de plantilla para dividir el texto en líneas
    // Usando un salto de línea (\n) después de cada espacio en blanco
    return texto.split(' ').join('\n');
  };
  const Card = ({ imagen, nombre }) => {
    return (
        <>
        <div
          className="position-relative p-3 bg-gray"
          style={{
            height: 180,
            width:"14vw",
            backgroundImage: `url(${imagen})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius:"10px",
          }}
        >
          <div className="ribbon-wrapper ribbon-lg">
            <div className="ribbon bg-danger">
                {nombre}
            </div>
          </div>
          <br />
          <br />
          <p style={{color: '#fff', fontWeight: 'bold', fontSize: '1.2em'}}>{nombre}</p>
          <small>_________________________________________</small>
        </div>
        {/** 
      <div className="categoria">
        <div className="categoria__image">
          <Image src={imagen} alt={nombre} title={nombre} />
        </div>
        <div className="categoria__name">
        <p>{dividirTexto(nombre)}</p>
        </div>
      </div>
      */}
      </>
    );
  };

  return (
    <>
      <Card imagen={imagen} nombre={nombre} />
    </>
  );
}

export default Categoria;
