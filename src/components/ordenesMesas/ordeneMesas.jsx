import { useState, useEffect, Suspense } from "react";

import Tablaordenesmesas from "./tablaordenesmesas";
import TablaVentasTerminadas from "./tablaVentasTerminadas";

const OrdeneMesas = (props) => {
  const [mostrarTablaVentasTerminadas, setMostrarTablaVentasTerminadas] = useState(false);

  const handleClick = () => {
    setMostrarTablaVentasTerminadas(true);
  };
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
                onClick={handleClick}
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
              <Tablaordenesmesas />
            </div>
            <div
              className="tab-pane fade"
              id="custom-content-below-profile"
              role="tabpanel"
              aria-labelledby="custom-content-below-profile-tab"
            >
              {mostrarTablaVentasTerminadas && <TablaVentasTerminadas />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdeneMesas;
