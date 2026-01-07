import React, { useState, useEffect, Fragment } from "react";
import { obtenerUsuario } from "../../api/usuarios";
import { getTokenApi, obtenidusuarioLogueado } from "../../api/auth";
import Header from "./header";
import Menu from "./menu";
import Footer from "./footer";
import Swal from 'sweetalert2';
import { obtenerUltimoTurno } from "../../api/turnos";

const LayoutAdminLTE = (props) => {
  const { setRefreshCheckLogin, children, turno, setTurno } = props;
  const [datosUsuario, setDatosUsuario] = useState("");

  //const redirecciona = useNavigate();

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          //console.log("usuarios",data)
          setDatosUsuario(data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  return (
    <>
      <div className="wrapper">
        <Header datosUsuario={datosUsuario} turno={turno} setTurno={setTurno} />
        <Menu datosUsuario={datosUsuario} turno={turno} setTurno={setTurno} />
        <div className="content-wrapper">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { datosUsuario, turno, setTurno })
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LayoutAdminLTE;

