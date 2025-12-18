import { useState, useEffect } from "react";
import Routing from "./routers/Routing";
import Login from "./page/Login";
import { AuthContext } from "./utils/contexts";
import { ToastContainer } from "react-toastify";
import "./App.scss";
import {
  isUserLogedApi,
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "./api/auth";
import { obtenerUsuario } from "./api/usuarios";
import { obtenerUltimoTurno } from "./api/turnos";

function App() {
  const [user, setUser] = useState(null);
  const [LoadUser, setLoadUser] = useState(false);
  const [refreshCheckLogin, setRefreshCheckLogin] = useState(false);
  const [userRole, setUserRole] = useState("");

  const obtenerDatos = () => {
    setUser(isUserLogedApi());
    setRefreshCheckLogin(false);
    setLoadUser(true);
  };

  useEffect(() => {
    obtenerDatos();
  }, [refreshCheckLogin]);

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log(data)
          setUserRole(data.rol);
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            console.log("No hay internet");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, [refreshCheckLogin]);

  const [turno, setTurno] = useState(null);

  const obtUltTurno = async () => {
    try {
      const response = await obtenerUltimoTurno();
      const { data } = response;
      if (data.estado === "abierto" && !data.fechaFinal) {
        setTurno(data);
      } else {
        setTurno(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtUltTurno();
  }, []);

  console.log(turno);

  if (!LoadUser) return null;

  return (
    <>
      <AuthContext.Provider value={user}>
        {user ? (
          <>
            <Routing
              setRefreshCheckLogin={setRefreshCheckLogin}
              userRole={userRole}
              turno={turno}
              setTurno={setTurno}
            />
          </>
        ) : (
          <>
            <Login setRefreshCheckLogin={setRefreshCheckLogin} />
          </>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </AuthContext.Provider>
    </>
  );
}

export default App;
