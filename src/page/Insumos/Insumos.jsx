import { useState } from "react";
import BasicModal from "../../components/Modal/BasicModal";
import ListInsumos from "./components/ListInsumos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import RegistroInsumo from "./components/Registro";
import { Switch } from "@headlessui/react";
import ListMovsInsumos from "./components/ListMovsInsumos";

function Insumos(props) {
  const { datosUsuario } = props;

  // Para modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState("");

  const registroInsumo = (content) => {
    setShowModal(true);
    setContentModal(content);
    setTitulosModal("Registro Insumo");
  };

  const [estadoSwitch, setEstadoSwitch] = useState(true);

  console.log(showModal);

  return (
    <>
      <div className="m-3">
        <div className="dashboard-header-glass">
          <h4 className="font-bold text-white mb-0">Insumos</h4>
          <div className="d-flex align-items-center">
            {datosUsuario.rol === "administrador" && (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() =>
                    registroInsumo(<RegistroInsumo setShow={setShowModal} />)
                  }
                >
                  <FontAwesomeIcon icon={faPlusCircle} /> Registrar
                </button>
                <Switch
                  title={
                    estadoSwitch === true
                      ? "Ver productos cancelados"
                      : "Ver productos activos"
                  }
                  checked={estadoSwitch}
                  onChange={() => setEstadoSwitch(!estadoSwitch)}
                  className={`${estadoSwitch ? "bg-teal-900" : "bg-red-600"}
              relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${estadoSwitch ? "translate-x-9" : "translate-x-0"
                      }
                pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                  />
                </Switch>
              </>
            )}
          </div>
        </div>
        <div className="card card-outline glass-card">
          <div className="card-body">
            <ListInsumos showModIns={showModal} datosUsuario={datosUsuario} />
            <ListMovsInsumos showModIns={showModal} />
          </div>
        </div>
      </div>

      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
        {contentModal}
      </BasicModal>
    </>
  );
}
export default Insumos;
