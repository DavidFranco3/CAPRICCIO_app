// Importar constantes y módulos necesarios
import { API_CLOUDINARY } from "../utils/constants";
import axios from "axios";

// Función para subir archivos a Cloudinary
export async function subeArchivosCloudinary(imagen, carpeta) {

    // Crear un nuevo objeto FormData
    const data = new FormData()

    // Agregar la imagen y los parámetros necesarios al objeto FormData se cambia a DateNow
    data.append("file", imagen) // Agregar la imagen al FormData
    data.append("upload_preset", "TPV_LA_NENA") // Agregar el preset de carga
    data.append('public_id', `${carpeta}/${Date.now() + "_" + imagen.name}`) // Agregar un ID público único para la imagen
    data.append('folder', `${carpeta}`) // Agregar la carpeta en la que se almacenará la imagen
    data.append("cloud_name", "omarlestrella") // Agregar el nombre de la nube de Cloudinary

    // Configuración de encabezados para la solicitud
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data' // Especificar el tipo de contenido como multipart/form-data
        }
    };

    // Realizar la solicitud POST a la API de Cloudinary con los datos y la configuración
    return await axios.post(API_CLOUDINARY, data, config);
}
