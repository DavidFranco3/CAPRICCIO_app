import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Spinner,
  Container,
  Alert,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { map } from "lodash";
import { registraProductos } from "../../../../api/productos";
import { listarCategorias } from "../../../../api/categorias";
import { listarInsumos } from "../../../../api/insumos";
import Dropzone from "../../../../components/Dropzone";
import { subeArchivosCloudinary } from "../../../../api/cloudinary";
import "../../../../scss/styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faSave,
  faArrowCircleLeft,
  faCirclePlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { LogsInformativos } from "../../../Logs/components/LogsSistema/LogsSistema";
import { useNavigate } from "react-router-dom";

function RegistraProductos(props) {
  const { setRefreshCheckLogin } = props;
  const [formData, setFormData] = useState(initialFormValue());
  const [loading, setLoading] = useState(false);

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

  // Para guardar el listado de insumos
  const [listInsumos, setListInsumos] = useState([]);

  const cargarListaInsumos = () => {
    try {
      listarInsumos()
        .then((response) => {
          const { data } = response;
          if (!listInsumos && data) {
            setListInsumos(formatModelInsumos(data));
          } else {
            const datosInsumos = formatModelInsumos(data);
            setListInsumos(datosInsumos);
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
    cargarListaInsumos();
  }, []);

  //Para almacenar la imagen del producto que se guardara a la bd
  const [imagenProducto, setImagenProducto] = useState(null);

  // Para definir el enrutamiento
  const enrutamiento = useNavigate();

  // Para cancelar el registro
  const cancelarRegistro = () => {
    enrutamiento("/Productos");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      !imagenProducto ||
      !formData.nombreProducto ||
      !formData.categoria ||
      !formData.precioVenta
    ) {
      toast.warning("Completa el formulario");
    } else {
      try {
        setLoading(true);
        // Sube a cloudinary la imagen principal del producto
        subeArchivosCloudinary(imagenProducto, "productos")
          .then((response) => {
            const { data } = response;
            const dataTemp = {
              nombre: formData.nombreProducto,
              categoria: formData.categoria,
              precio: formData.precioVenta,
              imagen: data.secure_url,
              negocio: "LA NENA",
              costoProduccion: totalSinIVA,
              insumos: listProductosCargados,
              estado: "true",
            };
            registraProductos(dataTemp).then((response) => {
              const { data } = response;
              LogsInformativos(
                "Se ha registrado el producto " + formData.nombreProducto,
                data.datos
              );
              toast.success(data.mensaje);
              cancelarRegistro();
            });
          })
          .then((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Para la carga y el listado de productos
  const [cargaProductos, setCargaProductos] = useState(
    initialFormDataProductos()
  );
  const [productoCargado, setProductoCargado] = useState("");

  const cargarDatosProducto = () => {
    setProductoCargado(cargaProductos.nombre);
    const dataTempProductos = productoCargado.split("/");
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
      toast.warning("Completa la información del insumo");
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
      setCargaProductos(initialFormDataProductos);
      document.getElementById("nombre").value = "Elige una opción";
      document.getElementById("cantidad").value = "";
    }
  };

  // Para limpiar el formulario de detalles de producto
  const cancelarCargaProducto = () => {
    setCargaProductos(initialFormDataProductos);
    document.getElementById("nombre").value = "Elige una opción";
    document.getElementById("cantidad").value = "";
  };

  // Para eliminar productos del listado
  const removeItem = (producto) => {
    let newArray = listProductosCargados;
    newArray.splice(
      newArray.findIndex((a) => a.nombre === producto.nombre),
      1
    );
    setListProductosCargados([...newArray]);
  };

  const totalSinIVA = listProductosCargados.reduce(
    (amount, item) => amount + parseFloat(item.total),
    0
  );

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCargaProductos({ ...cargaProductos, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Alert className="fondoPrincipalAlert">
        <Row>
          <Col xs={12} md={4} className="titulo">
            <h1 className="font-bold">Registro de producto</h1>
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

      <Form onSubmit={onSubmit} onChange={onChange}>
        <Container fluid>
          <div className="imagenPrincipal">
            <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
            <div
              title="Seleccionar imagen del producto"
              className="imagenProducto"
            >
              <Dropzone setImagenFile={setImagenProducto} />
            </div>
          </div>

          <div className="datosDelProducto">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProducto"
                  placeholder="Escribe el nombre"
                  defaultValue={formData.nombreProducto}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCategoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={formData.categoria}
                  name="categoria"
                >
                  <option>Elige una opción</option>
                  {map(listCategorias, (cat, index) => (
                    <option key={index} value={cat?.id}>
                      {cat?.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPrecio">
                <Form.Label>Precio de venta</Form.Label>
                <Form.Control
                  type="number"
                  name="precioVenta"
                  placeholder="Precio"
                  defaultValue={formData.precioVenta}
                />
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
              <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                <Form.Label>ITEM</Form.Label>
                <Form.Control
                  type="number"
                  id="index"
                  value={renglon}
                  name="index"
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  as="select"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  defaultValue={cargaProductos.nombre}
                >
                  <option>Elige una opción</option>
                  {map(listInsumos, (insumo, index) => (
                    <option
                      key={index}
                      value={
                        insumo?.nombre +
                        "/" +
                        insumo?.umCompra +
                        "/" +
                        insumo?.categoria +
                        "/" +
                        insumo?.precioCompra +
                        "/" +
                        insumo?.id
                      }
                    >
                      {insumo?.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCliente">
                <Form.Label>UM</Form.Label>
                <Form.Control
                  id="um"
                  type="text"
                  placeholder="UM"
                  name="um"
                  defaultValue={cargaProductos.um}
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCliente">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  id="precio"
                  type="number"
                  placeholder="Precio"
                  name="precio"
                  defaultValue={cargaProductos.precio}
                  disabled
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  id="cantidad"
                  type="number"
                  name="cantidad"
                  defaultValue={cargaProductos.cantidad}
                  placeholder="Cantidad"
                  onChange={(e) =>
                    setCargaProductos({
                      ...cargaProductos,
                      cantidad: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridCliente">
                <Form.Label>Total</Form.Label>
                <Form.Control
                  id="total"
                  type="text"
                  placeholder="Total"
                  name="total"
                  value={
                    cargaProductos.cantidad && cargaProductos.precio
                      ? parseFloat(cargaProductos.precio) *
                        parseFloat(cargaProductos.cantidad)
                      : 0
                  }
                  disabled
                />
              </Form.Group>

              <Col sm="1">
                <Form.Group as={Row} className="formGridCliente">
                  <Form.Label>&nbsp;</Form.Label>

                  <Col>
                    <Button
                      variant="success"
                      title="Agregar el producto"
                      className="editar"
                      onClick={() => {
                        addItems();
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        className="text-lg"
                      />
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="danger"
                      title="Cancelar el producto"
                      className="editar"
                      onClick={() => {
                        cancelarCargaProducto();
                      }}
                    >
                      <FontAwesomeIcon icon={faX} className="text-lg" />
                    </Button>
                  </Col>
                </Form.Group>
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
          <Form.Group as={Row} className="botonSubirProducto">
            <Col>
              <Button
                title="Registrar producto"
                type="submit"
                variant="success"
                className="registrar"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSave} />{" "}
                {!loading ? "Registrar" : <Spinner animation="border" />}
              </Button>
            </Col>
            <Col>
              <Button
                title="Cerrar ventana"
                variant="danger"
                className="cancelar"
                disabled={loading}
                onClick={() => {
                  cancelarRegistro();
                }}
              >
                <FontAwesomeIcon icon={faX} /> Cancelar
              </Button>
            </Col>
          </Form.Group>
        </Container>

        <br />
      </Form>
    </>
  );
}

function initialFormValue() {
  return {
    nombreProducto: "",
    categoria: "",
    precioVenta: "",
  };
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

function formatModelInsumos(insumos) {
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

export default RegistraProductos;
