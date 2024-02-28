import React, { useState, useEffect } from "react";
import "../style.css";
import { Button } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import RegistoMesas from "../RegistroMesas/RegistoMesas";
import TerminalPV from "../../../page/TerminalPV";
import { obtenerMesas } from "../../../api/mesas";
import { toast } from "react-toastify";

const VistaMesas = () => {
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

  const registroUsuarios = (content) => {
    setTitulosModal("Registar mesa");
    setContentModal(content);
    setShowModal(true);
  };

  const clicMesa = (content) => {
    setTitulosModal("Tomar Orden");
    setContentModal(content);
    setShowModal(true);


  };useEffect(() => {
    if (!showModal) {
      cargarMesas();
    }
  }, [showModal]);

  return (
    <>
      <div className="generalMesas">
        <div style={{ textAlign: "center" }}>
          <h3>Mesas del establecimiento</h3>
        </div>
        <div className="divButtonMesas">
          <Button
            onClick={() =>
              registroUsuarios(<RegistoMesas setShow={setShowModal} />)
            }
          >
            <i class="fa fa-solid fa-plus" /> Agregar
          </Button>
        </div>
        <div className="divMesasView">
          {listMesas.map((mesa, index) => (
            <div
              class="info-box"
              onClick={() => clicMesa(<TerminalPV setShow={setShowModal} estado={"abierto"} mesaticket={mesa.numeroMesa} idmesa={mesa.id} idTicket={mesa.idTicket}/>)}
            >
              <span
                class={
                  "info-box-icon " +
                  (mesa.estado == "1" ? "mesaDisponible" : "bg-secondary")
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
      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
};

function formatModelMesas(mesas) {
  const tempmesas = [];
  mesas.forEach((mesas) => {
    tempmesas.push({
      id: mesas._id,
      numeroMesa: mesas.numeroMesa,
      descripcion: mesas.descripcion,
      numeroPersonas: mesas.numeroPersonas,
      estado: mesas.estado,
      idTicket : mesas.idTicket,
    });
  });
  return tempmesas;
}

export default VistaMesas;
