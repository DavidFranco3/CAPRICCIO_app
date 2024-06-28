import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Producto from "./Producto";
import Categoria from "./Categoria";
import { getTokenApi, isExpiredToken, logoutApi } from "../../../../api/auth";
import { toast } from "react-toastify";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import "./menu.css";

function Menu(props) {
  const {
    addItems,
    setRefreshCheckLogin,
    listProductos,
    listCategorias,
    setCategoriaActual,
    categoriaActual,
  } = props;

  // Estado para manejar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Cerrado de sesión automatico
  useEffect(() => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        toast.warning("Sesión expirada");
        toast.success("Sesión cerrada por seguridad");
        logoutApi();
        setRefreshCheckLogin(true);
      }
    }
  }, []);

  const clickHandler = (product) => {
    addItems(product);
  };

  const clickHomeHandler = () => {
    setCategoriaActual("");
  };

  const ButtonBack = ({ icon, onClick }) => {
    return (
      <>
        <div className="regresarCategorias" onClick={onClick}>
          <i className="fas fa-tags"></i>
          <span style={{ marginLeft: "10px" }}>Categorias</span>
        </div>
        <br />
        <br />
      </>
    );
  };

  const MenuCategorias = ({ index, nombre, onClick, imagen }) => {
    return (
      <Button
        className="btnCategorias"
        key={index}
        title={nombre}
        onClick={onClick}
      >
        <Categoria key={index} imagen={imagen} nombre={nombre} />
      </Button>
    );
  };

  const MenuProductos = ({ index, nombre, onClick, imagen, precio }) => {
    return (
      <Button
        className="btnCategorias"
        key={index}
        title={nombre + " " + "$" + precio}
        onClick={onClick}
      >
        <Producto key={index} imagen={imagen} nombre={nombre} precio={precio} />
      </Button>
    );
  };

  // Filtrar los productos basados en el término de búsqueda
  const filteredProductos = listProductos.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar las categorías basadas en el término de búsqueda
  const filteredCategorias = listCategorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="menu">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar producto o categoría"
            aria-label="Buscar producto o categoría"
            aria-describedby="basic-addon1"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        {!categoriaActual ? (
          filteredCategorias &&
          filteredCategorias.map((categoria, index) => {
            return (
              <MenuCategorias
                index={index}
                nombre={categoria?.nombre}
                imagen={categoria?.imagen}
                onClick={() => setCategoriaActual(categoria?.id)}
              />
            );
          })
        ) : (
          <>
            <ButtonBack
              icon={faHouse}
              onClick={() => {
                clickHomeHandler();
              }}
            />
            {filteredProductos &&
              filteredProductos.map((product, index) => {
                return (
                  <MenuProductos
                    index={index}
                    nombre={product?.nombre}
                    imagen={product?.imagen}
                    precio={product?.precio}
                    onClick={() => clickHandler(product)}
                  />
                );
              })}
          </>
        )}
      </div>
    </>
  );
}

export default Menu;
