import { useState, useEffect, Suspense } from 'react';
import "../../scss/styles.scss";
import { Alert, Button, Col, Row, Tabs, Form, Tab, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import { LogsInformativosLogout } from '../../components/Logs/LogsSistema/LogsSistema';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Ventas from '../Ventas';
import HistoricoVentasDia from '../HistoricoVentasDia';
import HistoricoVentasMes from '../HistoricoVentasMes';
import HistoricoVentasSemana from '../HistoricoVentasSemana';

function Historiales(props) {
    const { setRefreshCheckLogin, location, navigate } = props;

    const [tab, setTab] = useState('general');

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const rutaRegreso = () => {
        enrutamiento("/")
    }

    const [datosUsuario, setDatosUsuario] = useState("");

    const obtenerDatosUsuario = () => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                //console.log(data)
                setDatosUsuario(data);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerDatosUsuario();
    }, []);

    const cierreSesion = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", datosUsuario, setRefreshCheckLogin);
                logoutApi();
                setRefreshCheckLogin(true);
                toast.warning('Sesión expirada');
                toast.success('Sesión cerrada por seguridad');
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreSesion();
    }, []);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={4}>
                        <h1 className="font-bold">
                            Historiales
                        </h1>
                    </Col>
                    <Col xs={6} md={8}>
                        <div style={{ float: 'right' }}>
                            <Button
                                title="Regresar a la pagina anterior"
                                className="btnRegistro"
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    rutaRegreso();
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Alert>

            <Tabs
                activeKey={tab}
                onSelect={(k) => setTab(k)}
                className="flex w-full"
                id="uncontrolled-tab-estados"
            >
                <Tab
                    key={0}
                    tabClassName="font-semibold text-lg"
                    eventKey="general"
                    title="General"
                >
                    <br />
                    <Suspense fallback={< Spinner />}>
                        <Ventas
                            setRefreshCheckLogin={setRefreshCheckLogin}
                        />
                    </Suspense>
                </Tab>
                <Tab
                    key={1}
                    tabClassName="font-semibold text-lg"
                    eventKey="dia"
                    title="Por día"
                >
                    <br />
                    <Suspense fallback={< Spinner />}>
                        <HistoricoVentasDia
                            setRefreshCheckLogin={setRefreshCheckLogin}
                        />
                    </Suspense>
                </Tab>
                <Tab
                    key={2}
                    tabClassName="font-semibold text-lg"
                    eventKey="semana"
                    title="Por semana"
                >
                    <br />
                    <Suspense fallback={< Spinner />}>
                        <HistoricoVentasSemana
                            setRefreshCheckLogin={setRefreshCheckLogin}
                        />
                    </Suspense>
                </Tab>
                <Tab
                    key={3}
                    tabClassName="font-semibold text-lg"
                    eventKey="mes"
                    title="Por mes"
                >
                    <br />
                    <Suspense fallback={< Spinner />}>
                        <HistoricoVentasMes
                            setRefreshCheckLogin={setRefreshCheckLogin}
                        />
                    </Suspense>
                </Tab>
            </Tabs>
        </>
    );
}

export default withRouter(Historiales);
