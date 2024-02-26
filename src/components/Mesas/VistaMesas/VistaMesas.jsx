import React, { useState, useEffect } from "react";
import "../style.css";
import { Button } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import RegistoMesas from "../RegistroMesas/RegistoMesas";
import TerminalPV from "../../../page/TerminalPV";
import { obtenerMesas } from "../../../api/mesas";
import { toast } from "react-toastify";

const VistaMesas = () => {
  /*const mesas = [
    {
      nombre: "Mesa 1",
      numero: "1",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "0",
    },
    {
      nombre: "Mesa 2",
      numero: "2",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 3",
      numero: "3",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "0",
    },
    {
      nombre: "Mesa 4",
      numero: "4",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 5",
      numero: "5",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 6",
      numero: "6",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 7",
      numero: "7",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 8",
      numero: "8",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 9",
      numero: "9",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "1",
    },
    {
      nombre: "Mesa 10",
      numero: "10",
      nPersonas: "4",
      descripcion: "mesa para 4 personas",
      estado: "0",
    },
  ];*/


  // Para guardar el listado de categorias
    const [listMesas, setListMesas] = useState([]);

    const cargarMesas = () => {
        try {
          obtenerMesas().then(response => {
                const { data } = response;
                console.log("mesas", data);
                if (!listMesas && data) {
                  setListMesas(formatModelMesas(data));
                  
                } else {
                    const datosMesas = formatModelMesas(data);
                    setListMesas(datosMesas);
                    console.log("mesas", datosMesas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

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
              onClick={() =>
                clicMesa(<TerminalPV setShow={setShowModal} />)
              }
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
                <span class="info-box-number titMesa">{mesa.nombre}</span>
                <span class="info-box-text">N. Personas: {mesa.nPersonas}</span>
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
  const tempmesas = []
  mesas.forEach((mesas) => {
    tempmesas.push({
          id: mesas._id,
          numeroMesa: mesas.numeroMesa,
          descripcion: mesas.descripcion,
          numeroPersonas: mesas.numeroPersonas,
          estado: mesas.estado,
          
      });
  });
  return tempmesas;
}

export default VistaMesas;
