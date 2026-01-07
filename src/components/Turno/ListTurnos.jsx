import { useEffect, useState } from "react";
import { listarTurno } from "../../api/turnos";
import { listarVentasTurno } from "../../api/ventas";
import DataTablecustom from "../Generales/DataTable";
import { formatFecha } from "../Generales/FormatFecha";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../Modal/BasicModal";
import MovimientosTurnos from "./MovimientosTurno/MovimientosTurnos";
import GenerarExcel from "./GenerarExcel";

function ListTurnos(params) {
  const { turno } = params;

  const [listTurnos, setListTurnos] = useState([]);
  const [listVentas, setListVentas] = useState([]);

  const cargarTurnos = async () => {
    const response = await listarTurno();
    const { data } = response;
    setListTurnos(data);
  };

  const cargarVentas = async () => {
    const response = await listarVentasTurno(turno?.idTurno);
    const { data } = response;
    setListVentas(data);
  };

  useEffect(() => {
    cargarTurnos();
    cargarVentas();
  }, []);

  // Para el modal
  const [showModal, setShowModal] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [titulosModal, setTitulosModal] = useState(null);

  const detallesMovsTurno = (content) => {
    setShowModal(true);
    setContentModal(content);
    setTitulosModal("Detalles de turno");
  };

  const columns = [
    {
      name: "ID Turno",
      selector: (row) => row.idTurno,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Empleado",
      selector: (row) => row.empleado,
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Fecha Inicio",
      selector: (row) => formatFecha(row.fechaInicio),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Fecha Final",
      selector: (row) =>
        row.fechaFinal ? formatFecha(row.fechaFinal) : "Turno activo",
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Acciones",
      selector: (row) => (
        <>
          <Badge
            className="cursor-pointer"
            bg="primary"
            onClick={() => detallesMovsTurno(<MovimientosTurnos turno={row} />)}
          >
            <FontAwesomeIcon className="text-lg" icon={faCircleInfo} />
          </Badge>
          <GenerarExcel idTurno={row.idTurno} />
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <>
      <DataTablecustom datos={listTurnos} columnas={columns} title={"Turnos"} />
      <BasicModal
        show={showModal}
        setShow={setShowModal}
        title={titulosModal}
        size={"md"}
      >
        {contentModal}
      </BasicModal>
    </>
  );
}

export default ListTurnos;
