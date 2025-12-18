import { API_HOST, TOKEN } from "../utils/constants";
import { ENDPOINTLoginAdministrador } from "./endpoints";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// Validar inicio de sesion
export async function login(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    return await axios.post(API_HOST + ENDPOINTLoginAdministrador, data, config);
}

// colocar el token
export function setTokenApi(token) {
    localStorage.setItem(TOKEN, token);
}

// obtener el token
export function getTokenApi() {
    return localStorage.getItem(TOKEN);
}

// Cerrar sesion
export function logoutApi() {
    return localStorage.removeItem(TOKEN);
}

// obtener los datos del usuario logueado
export function isUserLogedApi() {
    const token = getTokenApi();
    if (!token) {
        logoutApi();
        return null;
    }
    if (isExpired(token)) {
        logoutApi();
    }
    return jwtDecode(token);
}

// cerrar sesion porque el tiempo de sesion expiro
function isExpired(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0) {
        return true;
    }
    return false;
}

// eliminar el token porque el tiempo de sesion expiro
export function isExpiredToken(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0) {
        return true;
    }
    return false;
}

export function obtenidusuarioLogueado(token) {
    const { _ } = jwtDecode(token);

    return _;
}
