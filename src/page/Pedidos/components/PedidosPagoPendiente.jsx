import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import { listarPedidosPendientes, obtenerVentas } from "../../../api/ventas";
import "./styles/stylesTabla.css";
import TerminalPVprev from "../../TerminalPV/TerminalPVprev";
import BasicModal from "../../../components/Modal/BasicModal";
import DatosExtraVenta from "../../TerminalPV/components/DatosExtraVenta";
import CancelarVenta from "./CancelarPedido";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../../api/auth";
import { obtenerUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";

dayjs.extend(utc);
dayjs.extend(timezone);

function PedidosPagoPendiente(props) {
  console.log(props);
  const { turno } = props;

  const [datosUsuario, setDatosUsuario] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("");

  const [estadoUsuario, setEstadoUsuario] = useState(null);

  const [idUsuario, setIdUsuario] = useState("");


  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log(data)
          const { tipo, admin, _id } = data;
          setTipoUsuario(tipo);
          setEstadoUsuario(admin);
          setDatosUsuario(data);
          setIdUsuario(_id);
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            //console.log("No hay internet")
            toast.error("Conexión al servidor no disponible");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  console.log(datosUsuario)

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const [listaPedidosPendientes, setListaPedidosPendientes] = useState([]);
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const cargarPedidosPendientes = async () => {
    try {
      await listarPedidosPendientes()
        .then((response) => {
          const { data } = response;
          setListaPedidosPendientes(data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarPedidosPendientes();
  }, []);

  useEffect(() => {
    if (!showModal) {
      cargarPedidosPendientes();
    }
  }, [showModal]);

  const clicMesa = (content) => {
    setTitulosModal("Ticket");
    setContentModal(content);
    setShowModal(true);
  };

  const clicCancelar = (content) => {
    setTitulosModal("Cancelar");
    setContentModal(content);
    setShowModal(true);
  };

  const datosVenta = (content) => {
    setTitulosModal("Cobro");
    setContentModal(content);
    setShowModal(true);
  };

  useEffect(() => {
    if (!showModal) {
      cargarPedidosPendientes();
    }
  }, [showModal]);

  const cargarTicket = async (numTicket) => {
    try {
      const response = await obtenerVentas(numTicket);
      const { data } = response;
      if (data && data.length > 0) {
        const ticketData = data[0];
        setFormData(ticketData);
      }
    } catch (error) {
      console.error("Error al cargar los datos del ticket:", error);
    }
  };

  const datosExtra = async (numTicket) => {
    console.log(numTicket);
    await cargarTicket(numTicket);
  };

  useEffect(() => {
    if (formData) {
      datosVenta(
        <DatosExtraVenta
          setShow={setShowModal}
          formData={formData}
          isVenta={true}
          turno={turno}
        />
      );
    }
  }, [formData]);

  return (
    <>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Tipo Pedido</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaPedidosPendientes.length > 0 ? (
            listaPedidosPendientes.map((row, index) => (
              <tr key={index}>
                <td>{row.numeroTiquet}</td>
                <td>{row.cliente}</td>
                <td>
                  ${" "}
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(row.total)}{" "}
                </td>
                <td>
                  {row.hacerPedido} | {row.tipoPedido}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success btn-sm me-1"
                    onClick={() => datosExtra(row.numeroTiquet)}
                  >
                    <span className="icon-ticket">
                      <i className="fas fa-dollar-sign mr-1"></i>
                    </span>
                    Cobrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      clicMesa(
                        <TerminalPVprev
                          agregar={true}
                          setShow={setShowModal}
                          estado={"abierto"}
                          mesaticket={row.mesa}
                          idmesa={row._id}
                          idTicket={row.numeroTiquet}
                        />
                      )
                    }
                  >
                    <span className="icon-ticket">
                      <i className="fas fa-ticket-alt mr-1"></i>
                    </span>
                    Ticket
                  </button>
                  {datosUsuario?.rol == "administrador" && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        clicCancelar(
                          <CancelarVenta
                            agregar={true}
                            setShow={setShowModal}
                            estado={"abierto"}
                            mesaticket={row.mesa}
                            idmesa={row._id}
                            idTicket={row.numeroTiquet}
                            datosVentas={row}
                          />
                        )
                      }
                    >
                      <span className="icon-ticket">
                        <i className="fas fa-times-circle mr-1"></i>
                      </span>
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"xl"}
        fullscreen={"true"}
      >
        {contentModal}
      </BasicModal>
    </>
  );
}

export default PedidosPagoPendiente;
