import React, { useState, useEffect } from "react";
import "../style.css";
import BasicModal from "../../../components/Modal/BasicModal";

import { obtenerMesas } from "../../../api/mesas";
import Swal from 'sweetalert2';
import TerminalPVprev from "../../TerminalPV/TerminalPVprev";
import { Badge, Col } from "react-bootstrap";
import EditarMesa from "../EditarMesas/EditarMesa";
import RegistroMesas from "../RegistroMesas/RegistroMesas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import EliminarMesa from "../EliminarMesa/EliminarMesa";

const VistaMesas = () => {
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

  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const registroMesas = (content) => {
    setTitulosModal("Registar mesa");
    setContentModal(content);
    setShowModal(true);
  };

  const editarMesa = (content) => {
    setTitulosModal("Editar mesa");
    setContentModal(content);
    setShowModal(true);
  };

  const eliminarMesa = (content) => {
    setTitulosModal("Eliminar mesa");
    setContentModal(content);
    setShowModal(true);
  };

  useEffect(() => {
    cargarMesas();
  }, [showModal]);

  return (
    <>
      <div className="m-3">
        <div className="dashboard-header-glass">
          <h4 className="font-bold text-white mb-0">Mesas del establecimiento</h4>
          <div className="col-md-2" style={{ textAlign: "right" }}>
            <button
              className="btn btn-outline-light"
              onClick={() =>
                registroMesas(<RegistroMesas setShow={setShowModal} />)
              }
            >
              <i class="fa fa-plus" /> Agregar
            </button>
          </div>
        </div>
        <div className="card card-outline glass-card">
          <div className="card-body">
            <div className="divMesasView">
              {listMesas && listMesas.length > 0 ? (
                listMesas.map((mesa, index) => (
                  <div className="info-box">
                    <Col
                      className="d-flex cursor-pointer"
                      onClick={() =>
                        editarMesa(
                          <EditarMesa setShow={setShowModal} mesaId={mesa.id} />
                        )
                      }
                    >
                      <span class="info-box-icon bg-blue">
                        <i class="fas fa-utensils"></i>
                      </span>
                      <div class="info-box-content">
                        <span class="info-box-number titMesa">
                          N. Mesa: {mesa.numeroMesa}
                        </span>
                        <span class="info-box-text">
                          N. Personas: {mesa.numeroPersonas}
                        </span>
                        <span class="info-box-text descMesa">
                          {mesa.descripcion}
                        </span>
                      </div>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                      <span
                        class="info-box-icon bg-red h-75 cursor-pointer"
                        onClick={() =>
                          eliminarMesa(
                            <EliminarMesa mesaId={mesa.id} setShow={setShowModal} />
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </span>
                    </Col>
                  </div>
                ))
              ) : (
                <div className="alert alert-warning" role="alert">
                  No hay mesas registradas.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"md"}
        fullscreen={"true"}
      >
        {contentModal}
      </BasicModal>
    </>
  );
};

export default VistaMesas;

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

