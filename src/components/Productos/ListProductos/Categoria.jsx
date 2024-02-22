import { useState, useEffect } from 'react';
import { obtenerCategoria } from "../../../api/categorias";

function Categoria(props) {
    const { id } = props;

    // Para almacenar el nombre del cliente
    const [nombreCategoria, setNombreCategoria] = useState("");

    const cargarCategoria = () => {
        //
        try {
            obtenerCategoria(id).then(response => {
                const { data } = response;
                const { nombre } = data;
                setNombreCategoria(nombre)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarCategoria();
    }, [id]);

    return (
        <>
            {nombreCategoria}
        </>
    );
}

export default Categoria;
