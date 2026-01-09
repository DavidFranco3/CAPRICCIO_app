import {
  faMinus,
  faPenAlt,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useActionState, startTransition } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { actualizaProductos, listarProductos } from "../../../api/productos";
import { actualizaInsumo, registrarMovInsumo } from "../../../api/insumos";
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useForm } from "react-hook-form";

// Configuración de dayjs para usar la zona horaria de la Ciudad de México
dayjs.extend(utc);
dayjs.extend(timezone);

function ModificarInsumos(props) {
  const { datosInsumos, setShow, datosUsuario } = props;

  const [listProductos, setListProductos] = useState([]);
  const [cantidadAgregar, setCantidadAgregar] = useState(0);

  // Custom state for stock logic as it's button-driven, not direct input
  const [currentStock, setCurrentStock] = useState(datosInsumos.stock || 0);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      nombre: datosInsumos.nombre,
      precioCompra: datosInsumos.precioCompra,
      umCompra: datosInsumos.umCompra,
      razon: ""
    }
  });

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
    setCurrentStock(prev => prev + cantidadAgregar);
  };

  const handleRestarStock = () => {
    setCurrentStock(prev => prev - cantidadAgregar);
  };

  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombre = fd.get("nombre");
    const precioCompra = parseFloat(fd.get("precioCompra"));
    const umCompra = fd.get("umCompra");
    const stock = parseFloat(fd.get("stock")); // We will append this manually
    const razonMov = fd.get("razon");

    const precioUnitario = calcularPrecioUnitario(precioCompra, umCompra, datosInsumos.umTrabajo);

    const dataTemp = {
      ...datosInsumos,
      nombre,
      precioCompra,
      umCompra,
      stock,
      precioUnitario,
    };

    try {
      const response = await actualizaInsumo(datosInsumos._id, dataTemp);
      if (response.status !== 200) throw new Error("Failed to update insumo");
      const { data } = response;

      if (stock !== datosInsumos.stock) {
        let tipoMov = stock < datosInsumos.stock ? "Salida" : "Entrada";
        const movimiento = {
          nombreInsumo: dataTemp.nombre,
          movimiento: tipoMov,
          cantidad: Math.abs(stock - datosInsumos.stock),
          umInsumo: dataTemp.umCompra,
          razon: razonMov,
          fecha: dayjs().tz("America/Mexico_City").format(),
        };
        await registrarMovInsumo(movimiento);
      }

      // Update related products logic...
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

  const calcularPrecioUnitario = (precioCompra, umCompra, umTrabajo) => {
    if (umCompra === umTrabajo) return precioCompra;
    if (umCompra === "Kilogramos" && umTrabajo === "Gramos") return precioCompra / 1000;
    if (umCompra === "Litros" && umTrabajo === "Mililitros") return precioCompra / 1000;
    if (umCompra === "Gramos" && umTrabajo === "Kilogramos") return precioCompra * 1000;
    if (umCompra === "Mililitros" && umTrabajo === "Litros") return precioCompra * 1000;
    return precioCompra;
  };

  const onSubmit = (data) => {
    // Validate reason if stock changed
    if (currentStock !== datosInsumos.stock && !data.razon) {
      Swal.fire({ icon: 'warning', title: "Se requiere una razón para el ajuste de stock", timer: 1600, showConfirmButton: false });
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    // Manually append stock from state
    formData.append("stock", currentStock);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                disabled={datosUsuario.rol === "cajero"}
                {...register("nombre", { required: "El nombre es obligatorio" })}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Precio de compra (Unitario)</Form.Label>
              <Form.Control
                type="number"
                disabled={datosUsuario.rol === "cajero"}
                step="0.01"
                {...register("precioCompra", { required: "El precio es obligatorio", min: 0 })}
                isInvalid={!!errors.precioCompra}
              />
              <Form.Control.Feedback type="invalid">
                {errors.precioCompra?.message}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Unidad de medida</Form.Label>
              <Form.Select
                disabled={datosUsuario.rol === "cajero"}
                {...register("umCompra", { required: "Selecciona una unidad de medida" })}
                isInvalid={!!errors.umCompra}
              >
                <option value="">Elige una opción</option>
                <option value="Gramos">Gramos</option>
                <option value="Kilogramos">Kilogramos</option>
                <option value="Litros">Litros</option>
                <option value="Mililitros">Mililitros</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.umCompra?.message}
              </Form.Control.Feedback>
            </Col>
          </Row>
          <Row className="mt-1 align-items-center">
            <Col>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={currentStock}
                disabled
              />
            </Col>
            <Col className="">
              <Form.Label>Cantidad a modificar</Form.Label>
              <div className=" d-flex justify-content-center">
                <Form.Control
                  className="me-2"
                  type="number"
                  value={cantidadAgregar}
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

          <Row>
            <Col>
              <Form.Label>Razón del movimiento</Form.Label>
              <Form.Control
                type="text"
                placeholder="¿Por qué se hizo el movimiento?"
                {...register("razon")}
              />
            </Col>
          </Row>

          <br />
          <div className="d-flex w-100 botonSubirProducto">
            <div className="w-50 pe-2">
              <Button
                title="Actualizar insumo"
                variant="success"
                className="registrar w-100"
                type="submit"
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faPenAlt} /> {!isPending ? "Actualizar" : <Spinner animation="border" size="sm" />}
              </Button>
            </div>
            <div className="w-50 ps-2">
              <Button
                title="Cerrar ventana"
                variant="danger"
                className="cancelar w-100"
                type="button"
                onClick={() => setShow(false)}
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faX} /> Cancelar
              </Button>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ModificarInsumos;

