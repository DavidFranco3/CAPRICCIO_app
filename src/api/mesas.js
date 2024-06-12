import { API_HOST } from "../utils/constants";
import axios from 'axios';
import { getTokenApi } from "./auth";
import {ENDPOINTRegistroMesas,
        ENDPOINTObtenerMesas,
        ENDPOINTOcuparDesocuparMesas} from "./endpoints";


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
export async function obtenerMesas(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMesas , config);
}

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

