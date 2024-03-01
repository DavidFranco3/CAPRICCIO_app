import { useState, useEffect, Suspense } from "react";
import { obtenerMesaOcupadas } from "../../api/ventas";
import DataTable from "react-data-table-component";
import BasicModal from "../Modal/BasicModal";
import TerminalPV from "../../page/TerminalPV";

const Tablaordenesmesas = () => {
  const [listarventaenmesas, setListMesasocupadas] = useState([]);
  const cargarMesasOcupadas = () => {
    try {
      obtenerMesaOcupadas()
        .then((response) => {
          const { data } = response;
          //console.log("mesas", data);
          setListMesasocupadas(data);
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
  };useEffect(() => {
    if (!showModal) {
        cargarMesasOcupadas();
      }
  }, [showModal]);

  const columns = [
    {
      name: "Mesa",
      selector: (row) => row.ventas_mesa.mesa,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Total",
      selector: (row) => row.ventas_mesa.total,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="btn-group">
          <button
            type="button"
            class="btn btn-danger"
            onClick={() =>clicMesa(
              <TerminalPV
                agregar={true}
                setShow={setShowModal}
                estado={"abierto"}
                mesaticket={row.ventas_mesa.mesa}
                idmesa={row._id}
                idTicket={row.ventas_mesa.numeroTiquet}
              />
            )}
          >
            <span class="icon-ticket">
              <i class="fas fa-ticket-alt mr-1"></i>
            </span>
            Ver Ticket
          </button>
        </div>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        noDataComponent="No hay registros para mostrar"
        data={listarventaenmesas}
      />
      <BasicModal show={showModal} setShow={setShowModal} title={titulosModal} size={"xl"} fullscreen={"true"}>
        {contentModal}
      </BasicModal>
    </>
  );
};

export default Tablaordenesmesas;
