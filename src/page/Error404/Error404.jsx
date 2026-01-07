import { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import Swal from 'sweetalert2';
import "../../scss/styles.scss";

function Error404(props) {
    const { setRefreshCheckLogin } = props;

    const cierreSesion = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                Swal.fire({ icon: 'warning', title: "Sesión expirada", timer: 1600, showConfirmButton: false });
                Swal.fire({ icon: 'success', title: "Sesión cerrada por seguridad", timer: 1600, showConfirmButton: false });
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreSesion();
    }, []);
    // Termina cerrado de sesión automatico

    return (
        <>
            <Navigate to="/" />
        </>
    );
}

export default withRouter(Error404);

