import { useEffect, useState } from "react";
import { listarMovsInsumo } from "../../../api/insumos";
import { Container, Button, Collapse, Fade } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { estilos } from "../../../utils/tableStyled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configuración de dayjs para usar la zona horaria de la Ciudad de México
dayjs.extend(utc);
dayjs.extend(timezone);

function ListMovsInsumos() {
  const [listMovsInsumos, setListMovsInsumos] = useState([]);
  const [open, setOpen] = useState(false);

  const cargarListMovsInsumos = async () => {
    const response = await listarMovsInsumo();
    const { data } = response;
    setListMovsInsumos(data);
  };

  useEffect(() => {
    cargarListMovsInsumos();
  }, []);

  const columns = [
    {
      name: "Insumo",
      selector: (row) => row.nombreInsumo || "",
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Tipo mov",
      selector: (row) => row.movimiento,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad + " " + row.umInsumo,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Razón",
      selector: (row) => row.razon || "No se encontró una razón",
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Fecha",
      selector: (row) =>
        dayjs(row.fecha).tz("America/Mexico_City").format("DD-MM-YYYY HH:mm A"),
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <>
      <Container>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-fade-text"
          aria-expanded={open}
        >
          Mostrar movimientos de Insumos
        </Button>
        <Fade in={open}>
          <div id="example-fade-text">
            <DataTable
              columns={columns}
              noDataComponent="No hay registros de movimientos"
              data={listMovsInsumos}
              customStyles={estilos}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10]}
            />
          </div>
        </Fade>
      </Container>
    </>
  );
}

export default ListMovsInsumos;
