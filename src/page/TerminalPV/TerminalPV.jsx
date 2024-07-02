import React, { useEffect } from "react";
import VistaMesasVenta from "./components/Mesas/VistaMesasVenta";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TerminalVenta = (props) => {
  const { turno } = props;

  const enrutamiento = useNavigate();

  const rutaRegreso = () => {
    enrutamiento("/");
    toast.warning("Se necesita un turno activo para agregar la venta");
  };

  useEffect(() => {
    if (!turno) {
      rutaRegreso();
    }
  }, []);

  return (
    <>
      <VistaMesasVenta />
    </>
  );
};

export default TerminalVenta;
