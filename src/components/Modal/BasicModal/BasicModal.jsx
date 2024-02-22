import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/styles.scss";
import ModalHeader from "react-bootstrap/ModalHeader";

function BasicModal(props) {
    const { show, setShow, title, children } = props;

    return (
        <Modal
            className="basic-modal"
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            backdrop="static"
            keyboard="false"
        >
            <ModalHeader>
                <h2>{title}</h2>
                <Modal.Title>
                    <FontAwesomeIcon
                        title="Cerrar ventana"
                        icon={faTimesCircle}
                        onClick={() => setShow(false)}
                    />
                </Modal.Title>
            </ModalHeader>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default BasicModal;
