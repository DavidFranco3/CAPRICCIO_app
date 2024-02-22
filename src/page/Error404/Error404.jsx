import { useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import "../../scss/styles.scss";

function Error404(props) {
    const { setRefreshCheckLogin } = props;

    const cierreSesion = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
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
