import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { map } from "lodash";
import configRouting from "./configRouting";
import LayoutAdminLTE from "../layout/adminlte/layout";
import Error404 from "../page/Error404";

const Routing = ({ setRefreshCheckLogin, userRole, turno, setTurno }) => {
  const routes =
    userRole === "administrador"
      ? configRouting.filter(r => r.roles.includes("administrador"))
      : userRole === "vendedor"
        ? configRouting.filter(r => r.roles.includes("vendedor"))
        : userRole === "cajero"
          ? configRouting.filter(r => r.roles.includes("cajero"))
          : configRouting.filter(r => r.roles.includes("cliente"));

  return (
    <BrowserRouter>
      <Routes>
        {map(routes, (route, index) => (
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
          />
        ))}

        {/* 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
