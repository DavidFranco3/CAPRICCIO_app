import { useEffect, useState } from "react";
import { listarVentasDia } from "../../../api/ventas";
import DataTable from "react-data-table-component";
import BasicModal from "../../../components/Modal/BasicModal";
import ModalProductos from "../../../components/ordenesMesas/modalProductos";
import dayjs from "dayjs";

function VentasTerminadas() {
    const [ventasHoy, setVentasHoy] = useState([]);

    const cargarVentasDelDia = async () => {
      const hoy = dayjs().format("YYYY-MM-DD");
      try {
          await listarVentasDia(hoy).then((response) => {
            const { data } = response;
            setVentasHoy(data);
            console.log(data);
          })
          console.log(ventasHoy);
        } catch (e) {
          console.log(e);
        }
    };

    useEffect(() => {
        cargarVentasDelDia();
    }, []);

    const ventasAgrupadasPorTipoPago = ventasHoy.reduce(
        (acumulador, venta) => {
          const tipoPago = venta.tipoPago;
    
          if (!acumulador[tipoPago]) {
            acumulador[tipoPago] = [];
          }
    
          acumulador[tipoPago].push(venta);
    
          return acumulador;
        },
        {}
    );

    // Calcular el total por tipo de pago
    const totalesPorTipoPago = {};
    for (const tipoPago in ventasAgrupadasPorTipoPago) {
      const ventas = ventasAgrupadasPorTipoPago[tipoPago];
      const total = ventas.reduce(
        (acumulador, venta) => acumulador + parseFloat(venta.total),
        0
      );
      totalesPorTipoPago[tipoPago] = total;
    }
    // Calcular el total de todos los métodos de pago
    const totalGeneral = Object.values(totalesPorTipoPago).reduce(
      (total, subtotal) => total + subtotal,
      0
    );

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const clicMesa = (content) => {
        setTitulosModal("Ticket");
        setContentModal(content);
        setShowModal(true);
    };

    const columns = [
      {
        name: "Folio",
        selector: (row) => row.numeroTiquet,
        sortable: false,
        center: true,
        reorder: false,
      },
      {
        name: "Productos",
        cell: (row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                clicMesa(
                  <ModalProductos
                    setShow={setShowModal}
                    productos={row.productos}
                  />
                )
              }
            >
              <span className="icon-list">
                <i className="fas fa-list"></i>
              </span>
            </button>
          </div>
        ),
        sortable: false,
        center: true,
        reorder: false,
      },
      {
        name: "Forma de Pago",
        selector: (row) => row.tipoPago,
        sortable: false,
        center: true,
        reorder: false,
      },
      {
        name: "Total",
        selector: (row) => row.total,
        sortable: false,
        center: true,
        reorder: false,
      },
      {
        name: "Acciones",
        cell: (row) => (
          <div className="btn-group">
            <button type="button" class="btn btn-danger">
              -
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
      <div>
        <div className="row mt-2">
          {Object.entries(totalesPorTipoPago).map(
            ([tipoPago, total], index) => (
              <div className="col-md-3 col-sm-6 col-12" key={index}>
                <div className="info-box">
                  <span className="info-box-icon bg-success">
                    <i className="fas fa-dollar-sign"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">{tipoPago}</span>
                    <span className="info-box-number">{total}</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-3 col-sm-6 col-12">
          <div className="info-box">
            <span className="info-box-icon bg-success">
              <i className="fas fa-dollar-sign"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Total General</span>
              <span className="info-box-number">{totalGeneral}</span>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        noDataComponent="No hay registros para mostrar"
        data={ventasHoy}
      />

      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"xl"}
      >
        {contentModal}
      </BasicModal>
    </>
    )
}

export default VentasTerminadas;
