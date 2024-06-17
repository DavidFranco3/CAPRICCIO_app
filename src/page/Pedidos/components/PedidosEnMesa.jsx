import { useEffect, useState } from "react";
import { obtenerMesaOcupadas, obtenerVentas } from "../../../api/ventas";
import TerminalPVprev from "../../TerminalPV/TerminalPVprev";
import BasicModal from "../../../components/Modal/BasicModal";
import DatosExtraVenta from "../../TerminalPV/components/DatosExtraVenta";

function PedidosEnMesa() {
    const [formData, setFormData] = useState(null);
    const [listPedidosMesa, setListPedidosMesa] = useState([]);

    const cargarMesasOcupadas = () => {
        try {
          obtenerMesaOcupadas()
            .then((response) => {
              const { data } = response;
              console.log("mesas", data);
              setListPedidosMesa(data);
            })
            .catch((e) => {
              console.log(e);
            });
        } catch (e) {
          console.log(e);
        }
    };    
    
    useEffect(() => {
        cargarMesasOcupadas();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const clicMesa = (content) => {
        setTitulosModal("Ticket");
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
            cargarMesasOcupadas();
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
                        <th>Mesa</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {listPedidosMesa.length > 0 ? (
                        listPedidosMesa.map((row, index) => (
                            <tr key={index} >
                                <td>{row.ventas_mesa.numeroTiquet}</td>
                                <td>{row.ventas_mesa.mesa}</td>
                                <td>{row.ventas_mesa.subtotal}</td>
                                <td>
                                    <button
                                        type="button"
                                        class="btn btn-success btn-sm me-1"
                                        onClick={() => datosExtra(row.ventas_mesa.numeroTiquet)}
                                        >
                                        <span class="icon-ticket">
                                            <i class="fas fa-dollar-sign mr-1"></i>
                                        </span>
                                        Cobrar
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm"
                                        onClick={() =>clicMesa(
                                            <TerminalPVprev
                                            agregar={true}
                                            setShow={setShowModal}
                                            estado={"abierto"}
                                            mesaticket={row.ventas_mesa.mesa}
                                            idmesa={row.ventas_mesa._id}
                                            idTicket={row.ventas_mesa.numeroTiquet}
                                            />
                                        )}
                                        >
                                        <span class="icon-ticket">
                                            <i class="fas fa-plus mr-1"></i>
                                        </span>
                                        Añadir
                                    </button>
                                </td>
                            </tr> 
                        ))
                    ) : (
                        <tr>
                            <td>No hay datos disponibles</td>
                        </tr>)}
                </tbody>
            </table>
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal} size={"xl"} fullscreen={"true"}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default PedidosEnMesa;