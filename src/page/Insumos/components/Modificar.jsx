import {
  faMinus,
  faPenAlt,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useActionState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { actualizaProductos, listarProductos } from "../../../api/productos";
import { actualizaInsumo, registrarMovInsumo } from "../../../api/insumos";
import Swal from 'sweetalert2';
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

  // ACTION
  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombre = fd.get("nombre");
    const precioCompra = parseFloat(fd.get("precioCompra"));
    const umCompra = fd.get("umCompra");
    const stock = parseFloat(fd.get("stock")); // Hidden input
    const razonMov = fd.get("razon");

    // Derived values
    const precioUnitario = calcularPrecioUnitario(precioCompra, umCompra, formData.umTrabajo);

    const dataTemp = {
      ...formData, // Keep other original fields
      nombre,
      precioCompra,
      umCompra,
      stock,
      precioUnitario,
      // umTrabajo is from formData/props
    };

    try {
      // 1. Update Insumo
      const response = await actualizaInsumo(datosInsumos._id, dataTemp);
      if (response.status !== 200) throw new Error("Failed to update insumo");

      const { data } = response;

      // 2. Register Movement if stock changed
      if (stock !== datosInsumos.stock) {
        let tipoMov = stock < datosInsumos.stock ? "Salida" : "Entrada";
        const movimiento = {
          nombreInsumo: dataTemp.nombre,
          movimiento: tipoMov,
          cantidad: Math.abs(stock - datosInsumos.stock), // Should match cantidadAgregar logic, but simpler to diff
          umInsumo: dataTemp.umCompra,
          razon: razonMov,
          fecha: dayjs().tz("America/Mexico_City").format(),
        };
        await registrarMovInsumo(movimiento);
      }

      // 3. Update related products
      const insumoId = datosInsumos._id;
      const insumoActualizado = {
        id: insumoId,
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
        await actualizaProductos(producto._id, producto);
      }

      Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
      setShow(false);
      return null;

    } catch (error) {
      console.error("Error actualizando el insumo:", error);
      Swal.fire({ icon: 'error', title: "Error actualizando el insumo", timer: 1600, showConfirmButton: false });
      return { error: error.message };
    }
  }, null);

  return (
    <>
      <Container>
        <Form action={action}>
          <input type="hidden" name="stock" value={formData.stock} />
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
                step="0.01"
              />
            </Col>
            <Col>
              <Form.Label>Unidad de medida</Form.Label>
              <Form.Select
                name="umCompra"
                defaultValue={formData.umCompra}
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
                value={formData.stock} // Visual only, real value sent via hidden input
                disabled
              />
            </Col>
            <Col className="">
              <Form.Label>Cantidad a modificar</Form.Label>

              <div className=" d-flex justify-content-center">
                <Form.Control
                  className="me-2"
                  type="number" // Just for UI logic
                  defaultValue={cantidadAgregar}
                  onChange={(e) => setCantidadAgregar(Number(e.target.value))}
                />
                <Button
                  variant="success"
                  onClick={handleAgregarStock}
                  disabled={cantidadAgregar <= 0}
                  type="button"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                <Button
                  variant="danger"
                  onClick={handleRestarStock}
                  className="ms-2"
                  disabled={cantidadAgregar <= 0}
                  type="button"
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
                  name="razon"
                  placeholder="¿Por qué se hizo el movimiento?"
                  value={razon}
                  onChange={(e) => setRazon(e.target.value)}
                />
              </Col>
            </Row>
          )}
          <div className="mt-2 d-flex justify-content-evenly">
            <Button className="btn btn-success" type="submit" disabled={isPending}>
              <FontAwesomeIcon icon={faPenAlt} /> {!isPending ? "Editar" : <Spinner animation="border" size="sm" />}
            </Button>
            <Button className="btn btn-danger" type="button" onClick={() => setShow(false)} disabled={isPending}>
              <FontAwesomeIcon icon={faX} /> Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ModificarInsumos;

