import { HashRouter as Router, Routes, Route } from "react-router-dom";
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

const cashiersRoutes = configRouting.filter((route) =>
  route.roles.includes("cajero")
);

const Routing = ({ setRefreshCheckLogin, userRole, turno, setTurno }) => (
  <Router>
    <Routes>
      {map(
        userRole === "administrador"
          ? adminRoutes
          : userRole === "vendedor"
            ? sellerRoutes
            : userRole === "cajero"
              ? cashiersRoutes
              : clientRoutes,
        (route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
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
            }
          ></Route>
        )
      )}
    </Routes>
  </Router>
);

export default Routing;
