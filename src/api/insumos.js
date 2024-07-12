import axios from "axios";
import { API_HOST } from "../utils/constants";
import {
  ENDPOINTActualizarInsumo,
  ENDPOINTCancelarInsumo,
  ENDPOINTEliminarIngredientes,
  ENDPOINTListarInsumos,
  ENDPOINTListarMovimientosInsumo,
  ENDPOINTRegistrarInsumo,
  ENDPOINTRegistroMovimientoInsumo,
} from "./endpoints";
import { getTokenApi } from "./auth";

// Registrar insumo
export async function registraInsumo(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.post(API_HOST + ENDPOINTRegistrarInsumo, data, config);
}

// Para listar los insumos
export async function listarInsumos() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTListarInsumos, config);
}

// Modifica datos del insumo
export async function actualizaInsumo(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.put(
    API_HOST + ENDPOINTActualizarInsumo + `/${id}`,
    data,
    config
  );
}

// Cambiar el estado de los insumos
export async function cancelarInsumo(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.put(
    API_HOST + ENDPOINTCancelarInsumo + `/${id}`,
    data,
    config
  );
}

// Elimina insumo
export async function eliminaInsumo(id) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.delete(
    API_HOST + ENDPOINTEliminarIngredientes + `/${id}`,
    config
  );
}

// Registrar movimiento insumo
export async function registrarMovInsumo(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.post(
    API_HOST + ENDPOINTRegistroMovimientoInsumo,
    data,
    config
  );
}

// Listar movimientos insumo
export async function listarMovsInsumo() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTListarMovimientosInsumo, config);
}
