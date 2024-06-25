import { useEffect, useState } from "react";
import "../../components/scss/difStyles.scss";
import { obtenerUsuario } from "../../api/usuarios";
import {
  getTokenApi,
  isExpiredToken,
  logoutApi,
  obtenidusuarioLogueado,
} from "../../api/auth";
import { toast } from "react-toastify";
import { LogsInformativosLogout } from "../Logs/components/LogsSistema/LogsSistema";
import ListVentas from "./components/ListaVentas";
import dayjs from "dayjs";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  FormControl,
  InputGroup,
} from "react-bootstrap";

function Historial(props) {
  const { setRefreshCheckLogin } = props;
  const hoy = dayjs();

  const [datosUsuario, setDatosUsuario] = useState("");
  const [fechaInicial, setFechaInicial] = useState(hoy.format('YYYY-MM-DD'));
  const [fechaFinal, setFechaFinal] = useState(hoy.format('YYYY-MM-DD'));

  const obtenerDatosUsuario = () => {
    try {
      obtenerUsuario(obtenidusuarioLogueado(getTokenApi()))
        .then((response) => {
          const { data } = response;
          setDatosUsuario(data);
        })
        .catch((e) => {
          if (e.message === "Network Error") {
            toast.error("Conexión al servidor no disponible");
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  const cierreSesion = () => {
    if (getTokenApi()) {
      if (isExpiredToken(getTokenApi())) {
        LogsInformativosLogout(
          "Sesión finalizada",
          datosUsuario,
          setRefreshCheckLogin
        );
        logoutApi();
        setRefreshCheckLogin(true);
        toast.warning("Sesión expirada");
        toast.success("Sesión cerrada por seguridad");
      }
    }
  };

  useEffect(() => {
    cierreSesion();
  }, []);

  const [filtros, setFiltros] = useState({
    efectivo: false,
    tdcTransf: false,
  });

  const handleSelectMes = () => {

    // Obtener el primer y ultimo día del mes
    const iniDate = hoy.startOf('month').format('YYYY-MM-DD');
    const finDate = hoy.endOf('month').format('YYYY-MM-DD');
    
    setFechaInicial(iniDate);
    setFechaFinal(finDate);
  };

  const handleSelectSemana = () => {
      
    // Obtener el primer y ultimo día de la semana
    const iniDate = hoy.startOf('week').format('YYYY-MM-DD');
    const finDate = hoy.endOf('week').format('YYYY-MM-DD');
    
    setFechaInicial(iniDate);
    setFechaFinal(finDate);
  };

  const handleSelectDia = () => {
    
    // Obtener el primer y ultimo día de la semana
    const iniDate = hoy.format('YYYY-MM-DD');
    const finDate = hoy.format('YYYY-MM-DD');
    
    setFechaInicial(iniDate);
    setFechaFinal(finDate);
  };

  return (
    <div className="card card-outline m-3">
      <div className="card-header bg-gray">
        <h4 className="font-bold mb-0">Historial de ventas</h4>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="row">
            <div className="col">
              <label htmlFor="fechas">Rango de fechas</label>
              <InputGroup>
                <FormControl
                  type="date"
                  placeholder="Fecha inicial"
                  aria-label="Fecha inicial"
                  value={fechaInicial}
                  onChange={(e) => setFechaInicial(e.target.value)}
                />
                <span className="input-group-text">-</span>
                <FormControl
                  type="date"
                  className=""
                  placeholder="Fecha final"
                  aria-label="Fecha final"
                  value={fechaFinal}
                  onChange={(e) => setFechaFinal(e.target.value)}
                />
                <DropdownButton
                  className=""
                  variant="primary"
                  title="Selecciona"
                  align="end"
                  id="input-group-dropdown-1"
                >
                  <Dropdown.Item as="button" onClick={handleSelectMes}>
                    Mes
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={handleSelectSemana}>
                    Semana
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={handleSelectDia}>
                    Día
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </div>
            <div className="col">
              <div className="row">
                <div className="col">
                  <label htmlFor="efectivo">Efectivo</label>
                  <div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckEfectivo"
                      />
                    </div>
                  </div>
                </div>
                <div className="col">
                  <label htmlFor="tdc">TDC / Transferencia</label>
                  <div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckTdc"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li className="list-group-item">
          <ListVentas fechaInicial={fechaInicial} fechaFinal={fechaFinal} />
        </li>
        <li className="list-group-item">A third item</li>
      </ul>
    </div>
  );
}

export default Historial;
