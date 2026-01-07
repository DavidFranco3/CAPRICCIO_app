import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../scss/styles.scss";
import ModalHeader from "react-bootstrap/ModalHeader";

function BasicModal(props) {
    const { show, setShow, title, children, footer, size, scrollable } = props;

    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            centered
            backdrop="static"
            keyboard={false}
            size={size || "lg"}
            scrollable={scrollable}
            className="premium-modal"
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
                <button
                    className="modal-close-custom"
                    onClick={() => setShow(false)}
                    title="Cerrar ventana"
                >
                    <FontAwesomeIcon icon={faTimesCircle} />
                </button>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {footer && (
                <Modal.Footer>
                    {footer}
                </Modal.Footer>
            )}
        </Modal>
    );
}

export default BasicModal;
