import { useEffect, useState, useActionState, startTransition } from "react";
import Dropzone from "../../../../components/Dropzone";
import {
  Button,
  Col,
  Form,
  Row,
  Badge,
  Alert,
  Spinner,
  Container,
} from "react-bootstrap";
import { map } from "lodash";
import { subeArchivosCloudinary } from "../../../../api/cloudinary";
import Swal from 'sweetalert2';
import {
  actualizaProductos,
  obtenerProductos,
} from "../../../../api/productos";
import { listarCategorias } from "../../../../api/categorias";
import { listarIngredientes } from "../../../../api/ingredientes";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faSave,
  faArrowCircleLeft,
  faCirclePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import "../../../../scss/styles.scss";
import { LogsInformativos } from "../../../Logs/components/LogsSistema/LogsSistema";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

function ModificaProductos(props) {
  const { setRefreshCheckLogin } = props;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const params = useParams();
  const { id } = params;

  const [listProductosCargados, setListProductosCargados] = useState([]);

  // Para guardar el listado de categorias
  const [listCategorias, setListCategorias] = useState([]);

  const cargarListaCategorias = () => {
    try {
      listarCategorias()
        .then((response) => {
          const { data } = response;
          if (!listCategorias && data) {
            setListCategorias(formatModelCategorias(data));
          } else {
            const datosCategorias = formatModelCategorias(data);
            setListCategorias(datosCategorias);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarListaCategorias();
  }, []);

  // Para guardar el listado de ingredientes
  const [listIngredientes, setListIngredientes] = useState([]);

  const cargarListaIngredientes = () => {
    try {
      listarIngredientes()
        .then((response) => {
          const { data } = response;
          if (!listIngredientes && data) {
            setListIngredientes(formatModelIngredientes(data));
          } else {
            const datosIngredientes = formatModelIngredientes(data);
            setListIngredientes(datosIngredientes);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarListaIngredientes();
  }, []);

  const [productData, setProductData] = useState(null);

  //Para almacenar la imagen del producto que se guardara a la bd
  const [imagenProducto, setImagenProducto] = useState(null);

  const cargarDatos = () => {
    try {
      obtenerProductos(id)
        .then((response) => {
          const { data } = response;
          setProductData(data);
          setImagenProducto(data.imagen);
          setListProductosCargados(data.ingredientes);

          reset({
            nombreProducto: data.nombre,
            categoria: data.categoria,
            precioVenta: data.precio
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  // Para cancelar el registro
  const cancelarRegistro = () => {
    enrutamiento("/Productos");
  };

  const [errorState, action, isPending] = useActionState(async (prevState, fd) => {
    const nombreProducto = fd.get("nombreProducto");
    const categoria = fd.get("categoria");
    const precioVenta = fd.get("precioVenta");

    if (!imagenProducto || !nombreProducto || !categoria || !precioVenta || categoria === "Elige una opción") {
      Swal.fire({ icon: 'warning', title: "Completa el formulario", timer: 1600, showConfirmButton: false });
      return { error: "Incompleto" };
    }

    try {
      let finalImageUrl = imagenProducto;
      if (typeof imagenProducto !== 'string') {
        // Sube a cloudinary la imagen principal del producto si no es una URL string
        const responseCloudy = await subeArchivosCloudinary(imagenProducto, "productos");
        const { data: dataCloudy } = responseCloudy;
        finalImageUrl = dataCloudy.secure_url;
      }

      const dataTemp = {
        nombre: nombreProducto,
        categoria: categoria,
        precio: precioVenta,
        imagen: finalImageUrl,
        negocio: "LA NENA",
        costoProduccion: totalSinIVA,
        ingredientes: listProductosCargados,
      };

      const responseAct = await actualizaProductos(id, dataTemp);
      const { data: dataAct } = responseAct;

      LogsInformativos("Se ha modificado el producto " + nombreProducto, dataTemp);
      Swal.fire({ icon: 'success', title: dataAct.mensaje, timer: 1600, showConfirmButton: false });
      cancelarRegistro();
      return null;
    } catch (e) {
      console.log(e);
      Swal.fire({ icon: 'error', title: "Error al modificar producto", timer: 1600, showConfirmButton: false });
      return { error: e.message };
    }
  }, null);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    startTransition(() => {
      action(formData);
    });
  };

  // Para la carga y el listado de productos
  const [cargaProductos, setCargaProductos] = useState(
    initialFormDataProductos()
  );
  const [productoCargado, setProductoCargado] = useState("");

  const cargarDatosProducto = () => {
    setProductoCargado(cargaProductos.nombre);
    if (!cargaProductos.nombre || cargaProductos.nombre === "Elige una opción") return;
    const dataTempProductos = cargaProductos.nombre.split("/");
    const dataTemp = {
      id: dataTempProductos[4],
      um: dataTempProductos[1],
      tipoUM: dataTempProductos[2],
      precio: dataTempProductos[3],
    };
    setCargaProductos(cargaFormDataProductos(dataTemp));
  };

  useEffect(() => {
    cargarDatosProducto();
  }, [cargaProductos.nombre]);

  const renglon = listProductosCargados.length + 1;

  const addItems = () => {
    const nombre = document.getElementById("nombre").value;

    if (
      !cargaProductos.um ||
      !cargaProductos.precio ||
      !cargaProductos.cantidad
    ) {
      Swal.fire({ icon: 'warning', title: "Completa la información del ingrediente", timer: 1600, showConfirmButton: false });
    } else {
      const temp = nombre.split("/");

      const dataTemp = {
        id: cargaProductos.id,
        nombre: temp[0],
        um: cargaProductos.um,
        precio: cargaProductos.precio,
        cantidad: cargaProductos.cantidad,
        total:
          parseFloat(cargaProductos.precio) *
          parseFloat(cargaProductos.cantidad),
      };

      setListProductosCargados([...listProductosCargados, dataTemp]);

      setCargaProductos(initialFormDataProductos());
      document.getElementById("nombre").value = "Elige una opción";
      document.getElementById("cantidad").value = "";
    }
  };

  // Para limpiar el formulario de detalles de producto
  const cancelarCargaProducto = () => {
    setCargaProductos(initialFormDataProductos());
    document.getElementById("nombre").value = "Elige una opción";
    document.getElementById("cantidad").value = "";
  };

  // Para eliminar productos del listado
  const removeItem = (producto) => {
    let newArray = [...listProductosCargados];
    newArray.splice(
      newArray.findIndex((a) => a.nombre === producto.nombre),
      1
    );
    setListProductosCargados(newArray);
  };

  const totalSinIVA = listProductosCargados.reduce(
    (amount, item) => amount + parseFloat(item.total),
    0
  );

  if (!productData) {
    return <div className="p-5 text-center"><Spinner animation="border" /> Cargando datos...</div>
  }

  return (
    <>
      <Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Modificando producto</h1>
          </Col>
          <Col xs={6} md={8}>
            <div style={{ float: "right" }}>
              <Button
                title="Regresar a la pagina anterior"
                className="btnRegistro"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  cancelarRegistro();
                }}
              >
                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
              </Button>
            </div>
          </Col>
        </Row>
      </Alert>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Container fluid>
          <div className="imagenPrincipal">
            <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
            <div
              title="Seleccionar imagen del producto"
              className="imagenProducto"
            >
              <Dropzone
                setImagenFile={setImagenProducto}
                imagenProductoBD={productData.imagen}
              />
            </div>
          </div>

          <div className="datosDelProducto">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribe el nombre"
                  defaultValue={productData.nombre}
                  {...register("nombreProducto", { required: "El nombre es obligatorio" })}
                  isInvalid={!!errors.nombreProducto}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombreProducto?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCategoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  defaultValue={productData.categoria}
                  {...register("categoria", {
                    required: "Selecciona una opción",
                    validate: value => value !== "Elige una opción" || "Selecciona una opción válida"
                  })}
                  isInvalid={!!errors.categoria}
                >
                  <option>Elige una opción</option>
                  {map(listCategorias, (cat, index) => (
                    <option
                      key={index}
                      value={cat?.id}
                    >
                      {cat?.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoria?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPrecio">
                <Form.Label>Precio de venta</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Precio"
                  defaultValue={productData.precio}
                  step="0.01"
                  {...register("precioVenta", { required: "El precio es obligatorio", min: 0 })}
                  isInvalid={!!errors.precioVenta}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.precioVenta?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <hr />
            <Badge bg="secondary" className="tituloFormularioDetalles">
              <h4>
                A continuación, especifica los detalles del ingrediente y
                agregalo
              </h4>
            </Badge>
            <br />
            <hr />

            <Row>
              <Form.Group as={Col} controlId="formGridIndex">
                <Form.Label>ITEM</Form.Label>
                <Form.Control
                  type="number"
                  id="index"
                  value={renglon}
                  name="index"
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridIngredienteNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Select
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={(e) => setCargaProductos({ ...cargaProductos, nombre: e.target.value })}
                >
                  <option>Elige una opción</option>
                  {map(listIngredientes, (ingrediente, index) => (
                    <option
                      key={index}
                      value={
                        ingrediente?.nombre +
                        "/" +
                        ingrediente?.umProduccion +
                        "/" +
                        ingrediente?.tipoUM +
                        "/" +
                        ingrediente?.costoProduccion +
                        "/" +
                        ingrediente?.id
                      }
                    >
                      {ingrediente?.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridUM">
                <Form.Label>UM</Form.Label>
                <Form.Control
                  id="um"
                  type="text"
                  placeholder="UM"
                  name="um"
                  value={cargaProductos.um}
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPrecioUnitario">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  id="precio"
                  type="number"
                  placeholder="Precio"
                  name="precio"
                  value={cargaProductos.precio}
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  id="cantidad"
                  type="number"
                  name="cantidad"
                  value={cargaProductos.cantidad}
                  placeholder="Cantidad"
                  step="0.001"
                  onChange={(e) => setCargaProductos({ ...cargaProductos, cantidad: e.target.value })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridTotal">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  id="total"
                  type="text"
                  placeholder="Total"
                  name="total"
                  value={
                    cargaProductos.precio && cargaProductos.cantidad ?
                      parseFloat(cargaProductos.precio) *
                      parseFloat(cargaProductos.cantidad) : 0
                  }
                  disabled
                />
              </Form.Group>

              <Col sm="1">
                <div role="group" className="d-flex h-100 align-items-end pb-3">
                  <Button
                    variant="success"
                    title="Agregar el producto"
                    className="me-2"
                    type="button"
                    onClick={() => {
                      addItems();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      className="text-lg"
                    />
                  </Button>
                  <Button
                    variant="danger"
                    title="Cancelar el producto"
                    type="button"
                    onClick={() => {
                      cancelarCargaProducto();
                    }}
                  >
                    <FontAwesomeIcon icon={faX} className="text-lg" />
                  </Button>
                </div>
              </Col>
            </Row>

            <hr />

            {/* Listado de productos  */}
            <div className="tablaProductos">
              {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
              {/* Inicia tabla informativa  */}
              <Badge
                bg="secondary"
                className="tituloListadoProductosSeleccionados"
              >
                <h4>Listado de ingredientes seleccionados</h4>
              </Badge>
              <br />
              <hr />
              <table className="responsive-tableRegistroVentas">
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
                <tfoot></tfoot>
                <tbody>
                  {map(listProductosCargados, (producto, index) => (
                    <tr key={index}>
                      <td scope="row">{index + 1}</td>
                      <td data-title="Descripcion">{producto.nombre}</td>
                      <td data-title="Material">{producto.um}</td>
                      <td data-title="Orden de compra">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(producto.precio)}{" "}
                        MXN
                      </td>
                      <td data-title="Descripción">{producto.cantidad}</td>
                      <td data-title="Observaciones">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(producto.total)}{" "}
                        MXN
                      </td>
                      <td data-title="Eliminar">
                        <Badge
                          bg="danger"
                          title="Eliminar"
                          className="eliminar"
                          onClick={() => {
                            removeItem(producto);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-lg"
                          />
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Termina tabla informativa */}

              {/* Inicia tabla definida con totales */}
              <Row>
                <Col xs={12} md={8}></Col>
                <Col xs={6} md={4}>
                  {/* Subtotal */}
                  <Row>
                    <Col>Costo de producción</Col>
                    <Col>
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(totalSinIVA)}{" "}
                      MXN
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* Termina tabla definida con totales */}
            </div>
          </div>
        </Container>

        <br />

        <Container fluid>
          <div className="d-flex w-100">
            <div className="w-50 pe-2">
              <Button
                title="Registrar producto"
                type="submit"
                variant="success"
                className="registrar w-100"
                disabled={isPending}
              >
                <FontAwesomeIcon icon={faSave} />{" "}
                {!isPending ? "Registrar" : <Spinner animation="border" />}
              </Button>
            </div>
            <div className="w-50 ps-2">
              <Button
                title="Cerrar ventana"
                variant="danger"
                className="cancelar w-100"
                disabled={isPending}
                type="button"
                onClick={() => {
                  cancelarRegistro();
                }}
              >
                <FontAwesomeIcon icon={faX} /> Cancelar
              </Button>
            </div>
          </div>
        </Container>
        <br />
      </Form>
    </>
  );
}

function initialFormDataProductos() {
  return {
    id: "",
    nombre: "",
    um: "",
    tipoUM: "",
    precio: "",
    cantidad: 0,
  };
}

function cargaFormDataProductos(data) {
  const { id, um, tipoUM, precio } = data;

  return {
    id: id,
    nombre: "",
    um: um,
    tipoUM: tipoUM,
    precio: precio,
    cantidad: 0,
  };
}

function formatModelCategorias(categorias) {
  const tempCategorias = [];
  categorias.forEach((categoria) => {
    tempCategorias.push({
      id: categoria._id,
      nombre: categoria.nombre,
      negocio: categoria.negocio,
      imagen: categoria.imagen,
      estado: categoria.estado,
      fechaCreacion: categoria.createdAt,
      fechaActualizacion: categoria.updatedAt,
    });
  });
  return tempCategorias;
}

function formatModelIngredientes(insumos) {
  const tempInsumos = [];
  insumos.forEach((insumo) => {
    tempInsumos.push({
      id: insumo._id,
      nombre: insumo.nombre,
      umCompra: insumo.umCompra,
      precioCompra: parseFloat(insumo.precioCompra),
      umTrabajo: insumo.umTrabajo,
      stock: insumo.stock,
      estado: insumo.estado,
      fechaCreacion: insumo.createdAt,
      fechaActualizacion: insumo.updatedAt,
    });
  });
  return tempInsumos;
}

export default ModificaProductos;
