import { useEffect, useState } from "react";
import { listarTurno } from "../../api/turnos";
import DataTable from "react-data-table-component";
import { Badge } from "react-bootstrap";
import { estilos } from "../../utils/tableStyled";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../Modal/BasicModal";
import MovimientosTurnos from "./MovimientosTurno/MovimientosTurnos";

function ListTurnos(params) {
  const { turno } = params;
  const [listTurnos, setListTurnos] = useState([]);

  const cargarTurnos = async () => {
    const response = await listarTurno();
    const { data } = response;
    setListTurnos(data);
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const adjustTimeToMexico = (dateString) => {
    const date = dayjs(dateString);
    return date.add(6, "hour").format("DD/MM/YYYY h:mm A"); // Ajuste manual de la hora
  };

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
      selector: (row) => adjustTimeToMexico(row.fechaInicio),
      sortable: false,
      center: true,
      reorder: false,
    },
    {
      name: "Fecha Final",
      selector: (row) =>
        row.fechaFinal ? adjustTimeToMexico(row.fechaFinal) : "Turno activo",
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
        </>
      ),
      sortable: false,
      center: true,
      reorder: false,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={listTurnos}
        customStyles={estilos}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20]}
      />
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
