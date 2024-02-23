import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Producto from "../Producto";
import Categoria from "../Categoria";
import { getTokenApi, isExpiredToken, logoutApi } from "../../../api/auth";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import "./menu.css";

function Menu(props) {
    const { addItems, setRefreshCheckLogin, listProductos, listCategorias, setCategoriaActual, categoriaActual } = props;

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
    // Termina cerrado de sesión automatico

    const clickHandler = (product) => {
        addItems(product);
    }

    const clickHomeHandler = () => {
        setCategoriaActual("")
    }

const ButtonBack = ({ icon, onClick }) => {
    return (
        <>
        <div className="regresarCategorias"  onClick={onClick}>
            <i className="fas fa-tags"></i>
            <span style={{ marginLeft: '10px' }}>Categorias</span>
        </div>
        <br/>
        <br/>
        </>
    )
}






    const MenuCategorias = ({ index, nombre, onClick, imagen }) => {
        return (
            <Button
                className='btnCategorias'
                key={index}
                title={nombre}
                onClick={onClick}>
                <Categoria
                    key={index}
                    imagen={imagen}
                    nombre={nombre}
                />
            </Button>
        )
    }

    const MenuProductos = ({ index, nombre, onClick, imagen, precio }) => {
        return (
            <Button
            className='btnCategorias'
                key={index}
                title={nombre + " " + "$" + precio}
                onClick={onClick}>
                <Producto
                    key={index}
                    imagen={imagen}
                    nombre={nombre}
                    precio={precio}
                />
            </Button>
        )
    }

    return (
        <>
            <div className="menu">
                {
                    !categoriaActual ?
                        (
                            listCategorias &&
                            (
                                listCategorias.map((categoria, index) => {
                                    return (
                                        <MenuCategorias
                                            index={index}
                                            nombre={categoria?.nombre}
                                            imagen={categoria?.imagen}
                                            onClick={() => setCategoriaActual(categoria?.id)}
                                        />
                                    )
                                })
                            )
                        )
                        :
                        (
                            <>
                                <ButtonBack
                                    icon={faHouse}
                                    onClick={() => {
                                        clickHomeHandler()
                                    }}
                                />
                                {
                                    listProductos &&
                                    (
                                        listProductos.map((product, index) => {
                                            return (
                                                <MenuProductos
                                                    index={index}
                                                    nombre={product?.nombre}
                                                    imagen={product?.imagen}
                                                    precio={product?.precio}
                                                    onClick={() => clickHandler(product)}
                                                />
                                            )
                                        })
                                    )

                                }
                            </>
                        )
                }
            </div>
        </>
    );
}

export default Menu;
