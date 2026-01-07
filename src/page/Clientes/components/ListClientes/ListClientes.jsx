import { useState, useEffect } from 'react';
import "../../../../scss/styles.scss";
import DataTablecustom from '../../../../components/Generales/DataTable';
import { formatFecha } from '../../../../components/Generales/FormatFecha';

function ListClientes(props) {
    const { listClientes } = props;

    const columns = [
        {
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Modificación",
            selector: row => formatFecha(row.fechaActualizacion),
            sortable: false,
            center: true,
            reorder: false
        }
    ];

    return (
        <>
            <DataTablecustom datos={listClientes} columnas={columns} title={"Clientes"} />
        </>
    );
}

export default ListClientes;
