import { useState, useEffect, Suspense } from 'react';
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import Swal from 'sweetalert2';
import { listarPaginacionProductosActivos, totalProductosActivos, listarPaginacionProductosCancelados, totalProductosCancelados } from "../../api/productos";
import ListProductos from "../../components/Productos/ListProductos";
import { listarCategorias } from "../../api/categorias";
import { Spinner, Button, Col, Row, Alert, Image } from "react-bootstrap";
import BasicModal from "../../components/Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Lottie from "react-lottie-player";
import AnimacionLoading from "../../assets/json/loading.json";
import "../../scss/styles.scss";
import { Switch } from '@headlessui/react';
import { useNavigate } from "react-router-dom";
import paso1 from "../../assets/slider/paso1.png";
import paso2 from "../../assets/slider/paso2.png";
import paso3 from "../../assets/slider/paso3.png";
import paso4 from "../../assets/slider/paso4.png";

function Slider(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    return (
        <>
            <div className="slider-frame">
                <ul>
                    <li><Image src={paso1} alt="paso1"/></li>
                    <li><Image src={paso2} alt="paso2"/></li>
                    <li><Image src={paso3} alt="paso3"/></li>
                    <li><Image src={paso4} alt="paso4"/></li>
                </ul>
            </div>
        </>
    );
}

export default withRouter(Slider);

