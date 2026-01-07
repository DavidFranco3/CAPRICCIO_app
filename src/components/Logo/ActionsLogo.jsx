import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { subeArchivosCloudinary } from "../../api/cloudinary";
import { actualizaLogo, listarLogo, registraLogo } from "../../api/logo";
import { LogsInformativos } from "../../page/Logs/components/LogsSistema/LogsSistema";
import Swal from 'sweetalert2';
import Logo from "./Logo";

function ActionsLogo(props) {
  const { setShow } = props;

  const [logo, setLogo] = useState(null);
  const [selector, setSelector] = useState("URL");
  const [logoURL, setLogoURL] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [listLogo, setListLogo] = useState([]);

  const cargarLogo = async () => {
    const response = await listarLogo();
    const { data } = response;
    setListLogo(data);
  };

  console.log(listLogo);

  useEffect(() => {
    cargarLogo();
  }, []);

  const handleSwitchChange = () => {
    setSelector(selector === "URL" ? "File" : "URL");
    setLogo(null);
    setLogoURL("");
    setLogoFile(null);
  };

  const handleURLChange = (e) => {
    setLogoURL(e.target.value);
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const cancelarRegistro = () => {
    setShow(false);
  };

  const onSubmit = async () => {
    if (selector === "File") {
      try {
        const response = await subeArchivosCloudinary(logoFile, "logosLaNena");
        const { data } = response;
        const dataTemp = {
          imagen: data.secure_url,
        };
        if (listLogo) {
          const logoResponse = await actualizaLogo(listLogo[0]._id, dataTemp);
          const { data: logoData } = logoResponse;
          LogsInformativos("Se ha cambiado el logo por " + logoData.datos);
          Swal.fire({ icon: 'success', title: logoData.mensaje + " actualizados", timer: 1600, showConfirmButton: false });
          cancelarRegistro();
        } else {
          const logoResponse = await registraLogo(dataTemp);
          const { data: logoData } = logoResponse;
          LogsInformativos("Se ha cambiado el logo por " + logoData.datos);
          Swal.fire({ icon: 'success', title: logoData.mensaje, timer: 1600, showConfirmButton: false });
          cancelarRegistro();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const dataTemp = {
          imagen: logoURL,
        };

        if (listLogo.length === 0) {
          const response = await registraLogo(dataTemp);
          const { data } = response;
          LogsInformativos("Se ha registrado el logo " + logoURL);
          Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
          cancelarRegistro();
        } else {
          const response = await actualizaLogo(listLogo[0]._id, dataTemp);
          const { data } = response;
          LogsInformativos("Se ha actualizado el logo " + logoURL);
          Swal.fire({ icon: 'success', title: data.mensaje, timer: 1600, showConfirmButton: false });
          cancelarRegistro();
        }
      } catch (error) {
        console.log(error);
        Swal.fire({ icon: 'error', title: "Error al registrar el logo", timer: 1600, showConfirmButton: false });
      }
    }
  };

  return (
    <>
      <Container>
        <div className="d-flex flex-column">
          <Row>
            <Col>
              <Form.Label>Logo</Form.Label>
            </Col>
            <Col>
              <div className="d-flex align-content-center">
                <span className="me-1">URL</span>
                <Form.Check type="switch" onChange={handleSwitchChange} />
                <span>Archivo</span>
              </div>
            </Col>
          </Row>
        </div>

        <div className="mt-2">
          {selector === "URL" ? (
            <>
              <span className="text-sm">Inserta el URL de la imagen</span>
              <Form.Control
                type="text"
                value={logoURL}
                onChange={handleURLChange}
                placeholder="http//:URLlogo.com"
              />
            </>
          ) : (
            <>
              <span className="text-sm">
                Elige la imagen del logo del negocio
              </span>
              <Form.Control type="file" size="sm" onChange={handleFileChange} />
            </>
          )}
        </div>
        <Container className="mt-2 d-flex justify-content-center">
          {logoURL ? (
            <>
              <img src={logoURL} alt="logo" />
            </>
          ) : (
            <>
              <div>
                <span>Logo actual</span>
                <Logo />
              </div>
            </>
          )}
        </Container>
        <div className="mt-3 d-flex justify-content-center ">
          <button className="btn btn-primary" onClick={onSubmit}>
            <FontAwesomeIcon icon={faCheck} /> Aceptar
          </button>
        </div>
      </Container>
    </>
  );
}

export default ActionsLogo;

