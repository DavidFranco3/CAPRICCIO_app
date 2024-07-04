import { useState } from "react";
import BasicModal from "../../components/Modal/BasicModal";
import ListInsumos from "./components/ListInsumos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RegistroInsumo from "./components/Registro";

function Insumos(props) {
  // Para modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState("");

  const registroInsumo = (content) => {
    setShowModal(true);
    setContentModal(content);
    setTitulosModal("Registro Insumo");
  };

  return (
    <>
      <div className="card card-outline m-3">
        <div className="card-header bg-gray">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="font-bold mb-0">Insumos</h4>
            <div>
              <button
                className="btn btn-outline-light"
                onClick={() => registroInsumo(<RegistroInsumo />)}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Registrar
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <ListInsumos />
        </div>
      </div>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}
export default Insumos;
