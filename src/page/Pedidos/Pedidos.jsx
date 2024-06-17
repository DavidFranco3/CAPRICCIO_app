import PedidosEnMesa from "./components/PedidosEnMesa";
import PedidosPagoPendiente from "./components/PedidosPagoPendiente";

function Pedidos() {
  return (
    <>
      <div className="card card-danger card-outline m-3">
        <div className="card-header">
          <h3 className="card-title">Ventas del dia</h3>
        </div>
        <div className="card-body">
          <ul
            className="nav nav-tabs"
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
                Ventas Activas
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
                Ventas Concluidas
              </a>
            </li>
          </ul>
          <div className="tab-content" id="custom-content-below-tabContent">
            <div
              className="tab-pane fade active show"
              id="custom-content-below-home"
              role="tabpanel"
              aria-labelledby="custom-content-below-home-tab"
            >
            <div className="d-flex">
                <div className="card w-50 mt-3 mx-1 border-warning">
                    <div className="card-header text-bg-warning">
                        <h4 className="card-title">Pedidos por pagar</h4>
                    </div>
                    <div className="card-body">
                        <PedidosPagoPendiente/>
                    </div>
                </div>
                    
                <div className="card w-50 mt-3 mx-1 border-warning">
                    <div className="card-header text-bg-warning d-flex align-items-end">
                        <h4 className="card-title align-self-end">Pedidos en mesa</h4>
                    </div>
                    <div className="card-body">
                        <PedidosEnMesa/>
                    </div>
                </div>
            </div>

            </div>
            <div
              className="tab-pane fade"
              id="custom-content-below-profile"
              role="tabpanel"
              aria-labelledby="custom-content-below-profile-tab"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pedidos;