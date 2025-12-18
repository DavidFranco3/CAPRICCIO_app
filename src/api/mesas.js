import { API_HOST } from "../utils/constants";
import axios from 'axios';
import { getTokenApi } from "./auth";
import {ENDPOINTRegistroMesas,
        ENDPOINTObtenerMesas,
        ENDPOINTOcuparDesocuparMesas,
        ENDPOINTEditarMesa,
        ENDPOINTEliminarMesa,
        ENDPOINTOBtenerMesa} from "./endpoints";


// Registra mesas
export async function registraMesas(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMesas, data, config);
}


// Para obtener todos las mesas
export async function obtenerMesas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMesas , config);
}

// Para obtener una mesa en especifíco
export async function obtenerMesa(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTOBtenerMesa + `/${id}` , config);
}

// Para cambiar el estado de la mesa libre/ocupado
export async function ocuparDesocuparMesas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTOcuparDesocuparMesas + `/${id}`, data, config);
}

export async function editarMesa(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTEditarMesa + `/${id}`, data, config);
}

export async function eliminarMesa(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMesa + `/${id}`, config);
}