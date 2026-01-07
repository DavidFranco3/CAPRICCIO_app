import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { listarCategorias } from "../../../../api/categorias";
import { listarInsumos } from "../../../../api/insumos";
import { map } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faX,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { registraProductos } from "../../../../api/productos";
import { subeArchivosCloudinary } from "../../../../api/cloudinary";
import RegistraProductos from "./RegistraProductos";
import { LogsInformativos } from "../../../Logs/components/LogsSistema/LogsSistema";
import Swal from 'sweetalert2';

function RegsitroProds(props) {
  const { setShow } = props;

  const [listInsumos, setListInsumos] = useState([]);
  const [listCategorias, setListCategorias] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [cantidadInsumo, setCantidadInsumo] = useState(1);
  const [listInsumosReceta, setListInsumosReceta] = useState([]);
  const [costoProduccion, setCostoProduccion] = useState(0);
  const [formData, setFormData] = useState({
    nombreProducto: "",
    categoria: "",
    negocio: "LA NENA",
    costoProduccon: 0,
    precio: 0,
    imagen: null,
    insumos: [],
    estado: "true",
  });

  const cargarInsumos = async () => {
    const response = await listarInsumos();
    const { data } = response;
    const insumosFiltrados = data.filter(
      (insumo) => insumo.categoria === "Materia prima"
    );
    insumosFiltrados.sort();
    setListInsumos(insumosFiltrados);
  };

  const cargarCategorias = async () => {
    const response = await listarCategorias();
    const { data } = response;
    setListCategorias(data);
  };

  useEffect(() => {
    cargarCategorias();
    cargarInsumos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
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
    return precioCompra; // Caso por defecto
  };

  const handleInsumoChange = (e) => {
    const selectedValue = e.target.value;
    const [nombre, umTrabajo, categoria, precioCompra, umCompra, id] =
      selectedValue.split("/");
    const insumo = {
      nombre,
      umTrabajo,
      categoria,
      precioCompra: parseFloat(precioCompra),
      umCompra,
      precioUnitario: calcularPrecioUnitario(
        parseFloat(precioCompra),
        umCompra,
        umTrabajo
      ),
      id,
    };
    setSelectedInsumo(insumo);
  };

  const handleCantidadInsumoChange = (e) => {
    setCantidadInsumo(e.target.value);
  };

  const añadirInsumosReceta = () => {
    if (selectedInsumo && cantidadInsumo > 0) {
      const nuevoInsumo = {
        ...selectedInsumo,
        cantidad: cantidadInsumo,
        total: selectedInsumo.precioUnitario * cantidadInsumo,
      };
      const nuevaListaInsumos = [...listInsumosReceta, nuevoInsumo];
      setListInsumosReceta(nuevaListaInsumos);
      calcularCostoProduccion(nuevaListaInsumos); // Actualiza el costo de producción
      setSelectedInsumo(null);
      setCantidadInsumo(1);
    }
  };

  const eliminarInsumoReceta = (index) => {
    const nuevaListaInsumos = listInsumosReceta.filter((_, i) => i !== index);
    setListInsumosReceta(nuevaListaInsumos);
    calcularCostoProduccion(nuevaListaInsumos); // Actualiza el costo de producción
  };

  const calcularCostoProduccion = (insumos) => {
    const costoProd = insumos.reduce((acc, insumo) => acc + insumo.total, 0);
    setCostoProduccion(costoProd);
  };

  const cancelarRegistro = () => {
    setShow(false);
  };

  const registrarProducto = async () => {
  try {
    let imageUrl = "";

    // Check if there's an image to upload
    if (imagePreview) {
      const response = await subeArchivosCloudinary(imagePreview, "productos");
      const { data } = response;
      imageUrl = data.secure_url;
    }

    const dataTemp = {
      nombre: formData.nombreProducto,
      categoria: formData.categoria,
      precio: formData.precio,
      imagen: imageUrl, // Use imageUrl, which is either the uploaded URL or an empty string
      negocio: formData.negocio,
      costoProduccion: costoProduccion,
      insumos: listInsumosReceta,
      estado: "true",
    };

    const productoResponse = await registraProductos(dataTemp);
    const { data: productoData } = productoResponse;
    LogsInformativos(
      "Se ha registrado el producto " + formData.nombreProducto,
      productoData.datos
    );
    Swal.fire({ icon: 'success', title: productoData.mensaje, timer: 1600, showConfirmButton: false });
    cancelarRegistro();
  } catch (error) {
    console.log(error);
    Swal.fire({ icon: 'error', title: "Error al registrar el producto", timer: 1600, showConfirmButton: false });
  }
};
  return (
    <>
      <Container>
        <Row>
          <div className="">
            <h5 className="font-bold">Información del producto</h5>
          </div>
          <Col>
            <Row>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del producto"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleInputChange}
              />
            </Row>
            <Row>
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                <option value="">Selecciona una categoría</option>
                {listCategorias.map((categoria, index) => (
                  <option key={index} value={categoria._id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Select>
            </Row>
            <Row>
              <Form.Label>Precio de venta</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio de venta"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
              />
            </Row>
          </Col>
          <Col>
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vista previa"
                style={{ marginTop: "10px", maxWidth: "50%", height: "130px" }}
              />
            )}
          </Col>
        </Row>
        <Row>
          <hr className="mt-2 mb-2" />
          <div className="mt-1 d-flex justify-content-between">
            <h5 className="font-bold">Detalles de los ingredientes</h5>
            <div className="d-flex">
              <button
                className="btn btn-sm btn-success mx-1"
                title="Añadir"
                onClick={añadirInsumosReceta}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
              </button>
              <button
                className="btn btn-sm btn-danger mx-1"
                title="Cancelar"
                onClick={() => {
                  setSelectedInsumo(null);
                  setCantidadInsumo(1);
                }}
              >
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
          </div>
          <Col>
            <Form.Label>Ingrediente</Form.Label>
            <Form.Control
              type="number"
              value={listInsumosReceta.length + 1}
              disabled
            />
          </Col>
          <Col>
            <Form.Label>Nombre</Form.Label>
            <Form.Select
              onChange={handleInsumoChange}
              value={
                selectedInsumo
                  ? `${selectedInsumo.nombre}/${selectedInsumo.umTrabajo}/${selectedInsumo.categoria}/${selectedInsumo.precioCompra}/${selectedInsumo.umCompra}/${selectedInsumo.id}`
                  : ""
              }
            >
              <option value="">Selecciona un insumo</option>
              {map(listInsumos, (insumo, index) => (
                <option
                  key={index}
                  value={`${insumo.nombre}/${insumo.umTrabajo}/${insumo.categoria}/${insumo.precioCompra}/${insumo.umCompra}/${insumo._id}`}
                >
                  {insumo.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={cantidadInsumo}
              onChange={handleCantidadInsumoChange}
            />
          </Col>
          <Col>
            <Form.Label>Unidad Medida</Form.Label>
            <Form.Control
              type="text"
              value={selectedInsumo ? selectedInsumo.umTrabajo : ""}
              disabled
            />
          </Col>
          <Col>
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              value={
                selectedInsumo
                  ? selectedInsumo.precioUnitario * cantidadInsumo
                  : ""
              }
              disabled
            />
          </Col>
        </Row>
        <Row>
          <hr className="mt-2 mb-2" />
          <div className="mt-1">
            <h5 className="font-bold">Lista de ingredientes añadidos</h5>
          </div>
          <Col md={8}>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col">ITEM</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">UM</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Total</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {map(listInsumosReceta, (insumo, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{insumo.nombre}</td>
                    <td className="text-center">{insumo.umTrabajo}</td>
                    <td className="text-center">
                      ${insumo.precioUnitario.toFixed(2)}
                    </td>
                    <td className="text-center">{insumo.cantidad}</td>
                    <td className="text-center">${insumo.total.toFixed(2)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarInsumoReceta(index)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
          <Col className="d-flex align-items-center">
            <div className="font-bold">
              Costo de producción: ${costoProduccion.toFixed(2)}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-around">
          <button className="btn btn-success" onClick={registrarProducto}>
            <FontAwesomeIcon icon={faUpload} /> Registrar
          </button>
          <button className="btn btn-danger" onClick={() => cancelarRegistro()}>
            <FontAwesomeIcon icon={faX} /> Cancelar
          </button>
        </div>
      </Container>
    </>
  );
}

export default RegsitroProds;

