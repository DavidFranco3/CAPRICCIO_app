import {
  faMinus,
  faPenAlt,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { actualizaProductos, listarProductos } from "../../../api/productos";
import { actualizaInsumo, registrarMovInsumo } from "../../../api/insumos";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configuración de dayjs para usar la zona horaria de la Ciudad de México
dayjs.extend(utc);
dayjs.extend(timezone);

function ModificarInsumos(props) {
  const { datosInsumos, setShow, datosUsuario } = props;

  const [listProductos, setListProductos] = useState([]);
  const [formData, setFormData] = useState(datosInsumos);
  const [cantidadAgregar, setCantidadAgregar] = useState(0);
  const [razon, setRazon] = useState("");

  const cargarProductos = async () => {
    const response = await listarProductos();
    const { data } = response;
    const listProdsPrev = data.filter((producto) =>
      producto.insumos.some((insumo) => insumo.id === datosInsumos._id)
    );
    setListProductos(listProdsPrev);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleAgregarStock = () => {
    setFormData({ ...formData, stock: formData.stock + cantidadAgregar });
  };

  const handleRestarStock = () => {
    setFormData({ ...formData, stock: formData.stock - cantidadAgregar });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const actualizarProdsConInsumo = async (dataTemp) => {
    console.log(dataTemp);

    const insumoId = datosInsumos._id;
    const insumoActualizado = {
      id: datosInsumos._id,
      nombre: dataTemp.nombre,
      precioCompra: dataTemp.precioCompra,
      precioUnitario: dataTemp.precioUnitario,
      categoria: dataTemp.categoria,
      umCompra: dataTemp.umCompra,
      umTrabajo: dataTemp.umTrabajo,
      stock: dataTemp.stock,
      estado: dataTemp.estado,
    };

    const productosActualizados = listProductos.map((producto) => {
      const insumosActualizados = producto.insumos.map((insumo) =>
        insumo.id === insumoId
          ? { ...insumoActualizado, cantidad: insumo.cantidad }
          : insumo
      );

      const nuevoCostoProduccion = insumosActualizados.reduce(
        (acc, insumo) => acc + insumo.precioUnitario * insumo.cantidad,
        0
      );

      return {
        ...producto,
        insumos: insumosActualizados,
        costoProduccion: nuevoCostoProduccion,
      };
    });

    for (const producto of productosActualizados) {
      try {
        await actualizaProductos(producto._id, producto);
        console.log(`Producto ${producto.nombre} actualizado con éxito`);
      } catch (error) {
        console.error(
          `Error al actualizar el producto ${producto.nombre}:`,
          error
        );
      }
    }
  };

  const calcularPrecioUnitario = (precioCompra, umCompra, umTrabajo) => {
    if (umCompra === umTrabajo) return precioCompra;
    if (umCompra === "Kilogramos" && umTrabajo === "Gramos")
      return precioCompra / 1000;
    if (umCompra === "Litros" && umTrabajo === "Mililitros")
      return precioCompra / 1000;
    if (umCompra === "Gramos" && umTrabajo === "Kilogramos")
      return precioCompra * 1000;
    if (umCompra === "Mililitros" && umTrabajo === "Litros")
      return precioCompra * 1000;
    return precioCompra;
  };

  const mandarMovInsumo = async () => {
    let tipoMov = "";
    const fecha = dayjs().tz("America/Mexico_City").format();

    if (formData.stock !== datosInsumos.stock) {
      if (formData.stock < datosInsumos.stock) {
        tipoMov = "Salida";
      }
      if (formData.stock > datosInsumos.stock) {
        tipoMov = "Entrada";
      }

      const movimiento = {
        nombreInsumo: datosInsumos.nombre,
        movimiento: tipoMov,
        cantidad: cantidadAgregar,
        umInsumo: datosInsumos.umCompra,
        razon,
        fecha,
      };

      try {
        const response = await registrarMovInsumo(movimiento);
        if (response.status === 200) {
          toast.success("Movimiento registrado con éxito");
        } else {
          toast.error("Error al registrar el movimiento");
        }
        setShow(false);
      } catch (error) {
        console.error("Error registrando el movimiento:", error);
        toast.error(
          "Error registrando el movimiento. Por favor intenta de nuevo."
        );
      }
    }
  };

  const onSubmit = async () => {
    const precioUnitario = calcularPrecioUnitario(
      formData.precioCompra,
      formData.umCompra,
      formData.umTrabajo
    );

    try {
      const dataTemp = {
        ...formData,
        precioCompra: parseFloat(formData.precioCompra),
        precioUnitario: parseFloat(precioUnitario),
      };

      const response = await actualizaInsumo(dataTemp._id, dataTemp);
      if (dataTemp.stock !== datosInsumos.stock) await mandarMovInsumo();
      if (response.status !== 200) {
        throw new Error("Failed to update insumo");
      }

      const { data } = response;
      toast.success(data.mensaje);

      await actualizarProdsConInsumo(dataTemp);
      setShow(false);
    } catch (error) {
      console.error("Error actualizando el insumo:", error);
      toast.error("Error actualizando el insumo. Por favor intenta de nuevo.");
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              defaultValue={formData.nombre}
              onChange={handleInputChange}
              disabled={datosUsuario.rol === "cajero"}
            />
          </Col>
          <Col>
            <Form.Label>Precio de compra (Unitario)</Form.Label>
            <Form.Control
              type="number"
              name="precioCompra"
              defaultValue={formData.precioCompra}
              onChange={handleInputChange}
              disabled={datosUsuario.rol === "cajero"}
            />
          </Col>
          <Col>
            <Form.Label>Unidad de medida</Form.Label>
            <Form.Select
              name="umCompra"
              value={formData.umCompra}
              onChange={handleInputChange}
              disabled={datosUsuario.rol === "cajero"}
            >
              <option value="">Elige una opción</option>
              <option value="Gramos">Gramos</option>
              <option value="Kilogramos">Kilogramos</option>
              <option value="Litros">Litros</option>
              <option value="Mililitros">Mililitros</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-1 align-items-center">
          <Col>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              disabled
              onChange={handleInputChange}
            />
          </Col>
          <Col className="">
            <Form.Label>Cantidad a modificar</Form.Label>

            <div className=" d-flex justify-content-center">
              <Form.Control
                className="me-2"
                type="number"
                defaultValue={cantidadAgregar}
                onChange={(e) => setCantidadAgregar(Number(e.target.value))}
              />
              <Button
                variant="success"
                onClick={handleAgregarStock}
                disabled={cantidadAgregar <= 0}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button
                variant="danger"
                onClick={handleRestarStock}
                className="ms-2"
                disabled={cantidadAgregar <= 0}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
            </div>
          </Col>
        </Row>
        {cantidadAgregar > 0 && (
          <Row>
            <Col>
              <Form.Label>Razón del movimiento</Form.Label>
              <Form.Control
                type="text"
                placeholder="¿Por qué se hizo el movimiento?"
                value={razon}
                onChange={(e) => setRazon(e.target.value)}
              />
            </Col>
          </Row>
        )}
        <div className="mt-2 d-flex justify-content-evenly">
          <button className="btn btn-success" onClick={onSubmit}>
            <FontAwesomeIcon icon={faPenAlt} /> Editar
          </button>
          <button className="btn btn-danger" onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faX} /> Cancelar
          </button>
        </div>
      </Container>
    </>
  );
}

export default ModificarInsumos;
