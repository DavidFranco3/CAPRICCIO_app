import axios from "axios";
import { API_HOST } from "../utils/constants";
import { getTokenApi } from "./auth";
import {
  ENDPOINTActualizarLogo,
  ENDPOINTListarLogo,
  ENDPOINTRegistroLogo,
} from "./endpoints";

// Registrar insumo
export async function registraLogo(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.post(API_HOST + ENDPOINTRegistroLogo, data, config);
}

// Listar logo
export async function listarLogo() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTListarLogo, config);
}

// Modifica datos del insumo
export async function actualizaLogo(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.put(
    API_HOST + ENDPOINTActualizarLogo + `/${id}`,
    data,
    config
  );
}
