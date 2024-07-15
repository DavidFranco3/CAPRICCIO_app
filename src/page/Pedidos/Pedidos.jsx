import VentasTerminadas from "./components/PedidosCobrados";
import PedidosEnMesa from "./components/PedidosEnMesa";
import PedidosPagoPendiente from "./components/PedidosPagoPendiente";
import "./styles/styles.css";

function Pedidos(props) {
  const { turno } = props;

  return (
    <>
      <div className="card m-3">
        <div className="card-header bg-gray">
          <ul
            className="nav nav-tabs card-header-tabs"
            id="custom-content-below-tab"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                id="custom-content-below-home-tab"
                data-toggle="pill"
                href="#custom-content-below-home"
                role="tab"
                aria-controls="custom-content-below-home"
                aria-selected="true"
              >
                <h4 className="font-bold">Pedidos Activos</h4>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="custom-content-below-profile-tab"
                data-toggle="pill"
                href="#custom-content-below-profile"
                role="tab"
                aria-controls="custom-content-below-profile"
                aria-selected="false"
              >
                <h4 className="font-bold">Pedidos Concluidos</h4>
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <div className="tab-content" id="custom-content-below-tabContent">
            <div
              className="tab-pane fade active show"
              id="custom-content-below-home"
              role="tabpanel"
              aria-labelledby="custom-content-below-home-tab"
            >
              <div className="d-flex">
                <div className="card w-50 mt-2 mx-1 border-danger ">
                  <div className="card-header bg-red">
                    <h4 className="card-title mb-0">Pedidos por pagar</h4>
                  </div>
                  <div className="card-body">
                    <PedidosPagoPendiente turno={turno} />
                  </div>
                </div>
                <div className="card w-50 mt-2 mx-1 border-warning">
                  <div className="card-header bg-warning d-flex align-items-end">
                    <h4 className="card-title mb-0">Pedidos en mesa</h4>
                  </div>
                  <div className="card-body">
                    <PedidosEnMesa turno={turno} />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="custom-content-below-profile"
              role="tabpanel"
              aria-labelledby="custom-content-below-profile-tab"
            >
              <div className="d-flex">
                <div className="mt-2 card w-100 border-success">
                  <div className="card-header bg-success">
                    Ventas terminadas
                  </div>
                  <div className="card-body">
                    <VentasTerminadas />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pedidos;
