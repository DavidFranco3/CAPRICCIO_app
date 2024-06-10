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
        <div className="card card-outline card-danger m-3">
            <div className="card-header align-items-center align-items-center">
                <div className="">
                    <div className="row">
                        <div className="col-md-10 align-middle">
                            <h4 className="align-middle">Mesas del establecimiento</h4>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-danger"
                                onClick={() =>
                                    actVenta(<TerminalPVprev 
                                        setShow={setShowModal}
                                        idTicket={""}
                                        idmesa={""}
                                        // PENDIENTE
                                    />)
                                }
                            >
                                🧾 Hacer Venta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="divMesasView">
                    {listMesas.map((mesa, index) => (
                    <div
                        class="info-box"
                        onClick={() =>
                            clicMesa(
                                <TerminalPVprev
                                    agregar={"true"}
                                    setShow={setShowModal}
                                    estado={"abierto"}
                                    numMesa={mesa.numeroMesa}
                                    idTicket={mesa.idTicket}
                                    tipoPedido = {"Para comer aquí"}
                                    hacerPedido = {"Presencial"}
                                    mesaClick = {true}
                                />
                            )
                        }
                    >
                        <span
                        class={
                            "info-box-icon " +
                            (mesa.estado === "1" ? "mesaDisponible" : "bg-secondary")
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