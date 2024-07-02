import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { map } from "lodash";

import configRouting from "./configRouting";
import LayoutAdminLTE from "../layout/adminlte/layout";

const adminRoutes = configRouting.filter((route) =>
  route.roles.includes("administrador")
);

const sellerRoutes = configRouting.filter((route) =>
  route.roles.includes("vendedor")
);

const clientRoutes = configRouting.filter((route) =>
  route.roles.includes("cliente")
);

const waitersRoutes = configRouting.filter((route) =>
  route.roles.includes("mesero")
);

const Routing = ({ setRefreshCheckLogin, userRole, turno, setTurno }) => {
  const routes =
    userRole === "administrador"
      ? adminRoutes
      : userRole === "vendedor"
      ? sellerRoutes
      : userRole === "mesero"
      ? waitersRoutes
      : clientRoutes;

  return (
    <Router>
      <Routes>
        {map(routes, (route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.path === "/TerminalPV" ? (
                turno ? (
                  <LayoutAdminLTE
                    setRefreshCheckLogin={setRefreshCheckLogin}
                    turno={turno}
                    setTurno={setTurno}
                  >
                    <route.page
                      setRefreshCheckLogin={setRefreshCheckLogin}
                      turno={turno}
                      setTurno={setTurno}
                    />
                  </LayoutAdminLTE>
                ) : (
                  <Navigate to="/otro-lugar" />
                )
              ) : (
                <LayoutAdminLTE
                  setRefreshCheckLogin={setRefreshCheckLogin}
                  turno={turno}
                  setTurno={setTurno}
                >
                  <route.page
                    setRefreshCheckLogin={setRefreshCheckLogin}
                    turno={turno}
                    setTurno={setTurno}
                  />
                </LayoutAdminLTE>
              )
            }
          ></Route>
        ))}
      </Routes>
    </Router>
  );
};

export default Routing;
