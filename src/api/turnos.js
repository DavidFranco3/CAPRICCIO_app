import axios from "axios";
import { getTokenApi } from "./auth";
import { API_HOST } from "../utils/constants";
import {
  ENDPOINTCerrarTurno,
  ENDPOINTListarTurnos,
  ENDPOINTObtenerUltimoTurno,
  ENDPOINTRegistroTurnos,
} from "./endpoints";

export async function registrarTurno(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.post(API_HOST + ENDPOINTRegistroTurnos, data, config);
}

export async function listarTurno() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.get(API_HOST + ENDPOINTListarTurnos, config);
}

export async function obtenerUltimoTurno() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.get(API_HOST + ENDPOINTObtenerUltimoTurno, config);
}

export async function cerrarTurno(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTCerrarTurno + `/${id}`,
    data,
    config
  );
}
