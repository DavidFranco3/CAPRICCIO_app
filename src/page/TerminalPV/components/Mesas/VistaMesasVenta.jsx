import React, { useState, useEffect } from "react";
import "./style.css";
import BasicModal from "../../../../components/Modal/BasicModal";
import { obtenerMesas } from "../../../../api/mesas";
import TerminalPVprev from "../../TerminalPVprev";

const VistaMesasVenta = () => {
  // Para guardar el listado de categorias
  const [listMesas, setListMesas] = useState([]);

  const cargarMesas = () => {
    try {
      obtenerMesas()
        .then((response) => {
          const { data } = response;
          //console.log("mesas", data);
          if (!listMesas && data) {
            setListMesas(formatModelMesas(data));
          } else {
            const datosMesas = formatModelMesas(data);
            setListMesas(datosMesas);
            //console.log("mesas", datosMesas);
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
    cargarMesas();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const actVenta = (content) => {
    setTitulosModal("Hacer venta");
    setContentModal(content);
    setShowModal(true);
  };

  const clicMesa = (content) => {
    setTitulosModal("Tomar Orden");
    setContentModal(content);
    setShowModal(true);
  };
  useEffect(() => {
    if (!showModal) {
      cargarMesas();
    }
  }, [showModal]);

  return (
    <>
      <div className="card card-outline m-3">
        <div className=" card-header bg-gray">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {" "}
              <h4 className="mb-0 font-bold">Ordenes</h4>
              <span>Pedidos para comer aquí dar clic en la mesa </span>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-outline-light btn-lg"
                onClick={() =>
                  actVenta(
                    <TerminalPVprev
                      setShow={setShowModal}
                      idTicket={""}
                      idmesa={""}
                      tpv={true}
                    />
                  )
                }
              >
                <i className="fas fa-receipt me-1 "></i>
                Hacer Venta
              </button>
              <span className="d-block mt-2">
                Para ventas de uber o mostrador dar clic al botón
              </span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="divMesasView">
            {listMesas.map((mesa, index) => (
              <div
                class="info-box border-2 cursor-pointer"
                onClick={() =>
                  clicMesa(
                    <TerminalPVprev
                      agregar={"true"}
                      setShow={setShowModal}
                      estado={"abierto"}
                      numMesa={mesa.numeroMesa}
                      mesaId={mesa.id}
                      idTicket={mesa.idTicket}
                      tipoPedido={"Para comer aquí"}
                      hacerPedido={"Presencial"}
                      mesaClick={true}
                      tpv={true}
                    />
                  )
                }
              >
                <span
                  class={
                    "info-box-icon " +
                    (mesa.estado === "libre" ? "bg-green" : "bg-secondary")
                  }
                >
                  <i class="fas fa-utensils"></i>
                </span>
                <div class="info-box-content">
                  <span class="info-box-number titMesa">
                    N. Mesa: {mesa.numeroMesa}
                  </span>
                  <span class="info-box-text">
                    N. Personas: {mesa.numeroPersonas}
                  </span>
                  <span class="info-box-text descMesa">{mesa.descripcion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
};

export default VistaMesasVenta;

function formatModelMesas(mesas) {
  const tempmesas = [];
  mesas.forEach((mesas) => {
    tempmesas.push({
      id: mesas._id,
      numeroMesa: mesas.numeroMesa,
      descripcion: mesas.descripcion,
      numeroPersonas: mesas.numeroPersonas,
      estado: mesas.estado,
      idTicket: mesas.idTicket,
    });
  });
  return tempmesas;
}
