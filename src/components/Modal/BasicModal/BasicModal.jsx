import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/styles.scss";
import ModalHeader from "react-bootstrap/ModalHeader";

function BasicModal(props) {
    const { show, setShow, title, children, size } = props;

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
            backdrop="static"
            keyboard={false}
            size={size || "lg"} // Si size no se pasa, por defecto es "lg"
            
        >
            <ModalHeader>
                <Modal.Title>{title}</Modal.Title>
                <FontAwesomeIcon
                    title="Cerrar ventana"
                    icon={faTimesCircle}
                    onClick={() => setShow(false)}
                />
            </ModalHeader>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default BasicModal;
