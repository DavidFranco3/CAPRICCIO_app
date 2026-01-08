import VentasTerminadas from "./components/PedidosCobrados";
import PedidosEnMesa from "./components/PedidosEnMesa";
import PedidosPagoPendiente from "./components/PedidosPagoPendiente";
import "./styles/styles.css";
import {
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";

function Pedidos(props) {
  const { turno } = props;

  dayjs.extend(utc);

  const hoy = dayjs().utc();

  const [fechaInicial, setFechaInicial] = useState(hoy.format("YYYY-MM-DD"));
  const [fechaFinal, setFechaFinal] = useState(hoy.format("YYYY-MM-DD"));

  console.log(fechaInicial, fechaFinal)

  return (
    <>
      <div className="m-3">
        <div className="dashboard-header-glass">
          <h4 className="font-bold text-white mb-0">Gestión de Pedidos</h4>
        </div>
        <div className="card card-outline glass-card">
          <div className="card-body">
            <Tabs
              defaultActiveKey="activos"
              id="pedidos-tabs"
              className="mb-3 custom-tabs"
            >
              <Tab eventKey="activos" title="Pedidos Activos">
                <div className="d-flex flex-wrap">
                  <div className="card flex-fill mt-2 mx-1 border-danger" style={{ minWidth: '300px' }}>
                    <div className="card-header bg-red">
                      <h4 className="card-title mb-0">Pedidos por pagar</h4>
                    </div>
                    <div className="card-body">
                      <PedidosPagoPendiente turno={turno} />
                    </div>
                  </div>
                  <div className="card flex-fill mt-2 mx-1 border-warning" style={{ minWidth: '300px' }}>
                    <div className="card-header bg-warning d-flex align-items-end">
                      <h4 className="card-title mb-0">Pedidos en mesa</h4>
                    </div>
                    <div className="card-body">
                      <PedidosEnMesa turno={turno} />
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="concluidos" title="Pedidos Concluidos">
                <div className="mt-3">
                  <label htmlFor="fechas">Rango de fechas</label>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="date"
                      placeholder="Fecha inicial"
                      aria-label="Fecha inicial"
                      value={fechaInicial}
                      onChange={(e) => setFechaInicial(e.target.value)}
                    />
                    <InputGroup.Text>-</InputGroup.Text>
                    <FormControl
                      type="date"
                      placeholder="Fecha final"
                      aria-label="Fecha final"
                      value={fechaFinal}
                      onChange={(e) => setFechaFinal(e.target.value)}
                    />
                  </InputGroup>
                  <div className="d-flex">
                    <div className="card w-100 border-success">
                      <div className="card-header bg-success text-white">
                        <h4 className="card-title mb-0">Ventas terminadas</h4>
                      </div>
                      <div className="card-body">
                        <VentasTerminadas fechaInicial={fechaInicial} fechaFinal={fechaFinal} />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pedidos;
