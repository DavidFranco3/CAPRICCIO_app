import { useEffect, useState, useRef } from "react";
import { listarCategorias } from "../../../api/categorias";
import { Badge, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";

function DetallesListaVentas(props) {
    const { listVentas, fechaInicial, fechaFinal } = props;

    const [listCategorias, setListCategorias] = useState([]);
    const [categoriasCargadas, setCategoriasCargadas] = useState(false);
    const categoriasIniciales = useRef([]);

    const cargarCategorias = async () => {
        try {
            const response = await listarCategorias();
            const { data } = response;

            const categoriasConProds = data.map(categoria => ({
                id: categoria._id,
                nombre: categoria.nombre,
                cantProds: 0
            }));

            categoriasIniciales.current = categoriasConProds;
            setListCategorias(categoriasConProds);
            setCategoriasCargadas(true);
        } catch (error) {
            console.log(error);
        }
    };

    const contarProductos = (listVentas) => {
        const categoriasActualizadas = categoriasIniciales.current.map(categoria => ({
            ...categoria,
            cantProds: 0 // Resetea el contador antes de sumar los productos
        }));

        listVentas.forEach(venta => {
            venta.productos.forEach(producto => {
                const categoria = categoriasActualizadas.find(cat => cat.id === producto.categoria);
                if (categoria) {
                    categoria.cantProds += 1; // Asegurarse de que 'cantidad' está presente en el objeto 'producto'
                }
            });
        });

        setListCategorias(categoriasActualizadas);
        setCategoriasCargadas(true);
    };

    useEffect(() => {
        if (!categoriasCargadas && listCategorias) {
            cargarCategorias();
        }
        if (categoriasCargadas && listVentas.length > 0) {
            contarProductos(listVentas);
        }
    }, [listVentas, categoriasCargadas]);

    const columns = [
        {
            name: "Categoria",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => (
                <>
                    <Badge
                        bg={row.cantProds < 5 ? "warning" : "success"}
                    >
                        {row.cantProds} 
                    </Badge>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        }
    ];

    return (
        <div>
            <h5>Detalles de los productos vendidos entre <span className="bg-warning">{fechaInicial}</span> y <span className="bg-warning">{fechaFinal}</span> </h5>
            <Container className="d-flex justify-content-center">
                <DataTable
                    columns={columns}
                    data={listCategorias}
                    customStyles={estilos}
                />
            </Container>
        </div>
    );
}

export default DetallesListaVentas;
