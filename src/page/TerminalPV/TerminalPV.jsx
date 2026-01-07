import React, { useEffect } from "react";
import VistaMesasVenta from "./components/Mesas/VistaMesasVenta";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const TerminalVenta = (props) => {
  const { turno } = props;

  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
    Swal.fire({ icon: 'warning', title: "Se necesita un turno activo para agregar la venta", timer: 1600, showConfirmButton: false });
  };

  useEffect(() => {
    if (!turno) {
      rutaRegreso();
    }
  }, []);

  return (
    <>
      <VistaMesasVenta turno={turno} />
    </>
  );
};

export default TerminalVenta;

