import React, { useState } from "react";
import "../style.css";
import { Button } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import RegistoMesas from "../RegistroMesas/RegistoMesas";

const VistaMesas = () => {
  const mesas = [
    "Mesa 1",
    "Mesa 2",
    "Mesa 3",
    "Mesa 4",
    "Mesa 5",
    "Mesa 6",
    "Mesa 7",
    "Mesa 8",
    "Mesa 9",
    "Mesa 10",
  ];

  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const registroUsuarios = (content) => {
    setTitulosModal("Registar mesa");
    setContentModal(content);
    setShowModal(true);
  };

  return (
    <>
      <div className="generalMesas">
        <div style={{ textAlign: "center" }}>
          <h3>Mesas del establecimiento</h3>
        </div>
        <div className="divButtonMesas">
          <Button
            onClick={() =>
              registroUsuarios(
                <RegistoMesas setShow={setShowModal} />
              )
            }
          >
            <i class="fa fa-solid fa-plus" /> Agregar
          </Button>
        </div>
        <div className="divMesasView">
          {mesas.map((mesa, index) => (
            <div key={index} className="childMesasView">
              {mesa}
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

export default VistaMesas;
