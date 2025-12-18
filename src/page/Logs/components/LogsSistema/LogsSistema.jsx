import { obtenerNumeroLog, obtenIP } from "../../../../api/logsGenerales";
import { registraLog } from "../../../../api/logsGenerales";
import { obtenerUsuario } from "../../../../api/usuarios";
import { getTokenApi, obtenidusuarioLogueado, logoutApi } from "../../../../api/auth";

export function LogsInformativos(mensaje, datos){
    try {
        obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response =>
        {
            const { data: { usuario } } = response;
            obtenIP().then(response => {
                const { data } = response;
                const IpTemp = data;

                // Obten el numero de log que corresponda
                obtenerNumeroLog().then(response => {
                    const { data: { noLog } } = response;

                    // Verifica si se reciben datos de información extra en los parametros
                    if(datos){
                        const dataTemp = {
                            folio: noLog,
                            usuario: usuario,
                            dispositivo: navigator.platform,
                            ip: IpTemp,
                            descripcion: navigator.userAgent,
                            detalles: {
                                mensaje: mensaje,
                                datos: datos
                            }
                        }

                        registraLog(dataTemp).then(response => {
                            const { data } = response;
                            //console.log(data)
                        }).catch(e => {
                            console.log(e)
                            console.log(e.response)
                        })
                    } else {
                        //
                        const dataTemp = {
                            folio: noLog,
                            usuario: usuario,
                            dispositivo: navigator.platform,
                            ip: IpTemp,
                            descripcion: navigator.userAgent,
                            detalles: {
                                mensaje: mensaje
                            }
                        }

                        registraLog(dataTemp).then(response => {
                            const { data } = response;
                            //console.log(data)
                        }).catch(e => {
                            console.log(e);
                            console.log(e.response);
                        })
                    }

                }).catch(e => {
                    console.log(e);
                })

            }).catch(e => {
                console.log(e);
            })
        })
    } catch (e) {
        console.log(e);
    }
}

export function LogsInformativosLogout(mensaje, datos, setRefreshCheckLogin){
    try {
        obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response =>
        {
            const { data: { usuario } } = response;
            obtenIP().then(response => {
                const { data } = response;
                const IpTemp = data;

                // Obten el numero de log que corresponda
                obtenerNumeroLog().then(response => {
                    const { data: { noLog } } = response;

                    const dataTemp = {
                        folio: noLog,
                        usuario: usuario,
                        dispositivo: navigator.platform,
                        ip: IpTemp,
                        descripcion: navigator.userAgent,
                        detalles: {
                            mensaje: mensaje,
                            datos: datos
                        }
                    }

                    registraLog(dataTemp).then(response => {
                        const { data } = response;
                        //console.log(data)
                        logoutApi();
                        setRefreshCheckLogin(true);
                    }).catch(e => {
                        console.log(e)
                        console.log(e.response)
                    })

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })
        })
    } catch (e) {
        console.log(e);
    }
}
