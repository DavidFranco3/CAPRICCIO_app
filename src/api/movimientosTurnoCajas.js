import axios from "axios";
import { API_HOST } from "../utils/constants";
import { getTokenApi } from "./auth";
import {
  ENDPOINTListarMovimientoTurno,
  ENDPOINTRegistrarMovimientoTurno,
} from "./endpoints";

export async function registrarMovimientoTurnoCaja(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.post(
    API_HOST + ENDPOINTRegistrarMovimientoTurno,
    data,
    config
  );
}

export async function listarMovimientoTurno(idTurno) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.get(
    API_HOST + ENDPOINTListarMovimientoTurno + `/?idTurno=${idTurno}`,
    config
  );
}
