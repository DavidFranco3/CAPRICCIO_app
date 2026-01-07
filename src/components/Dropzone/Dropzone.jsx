import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from "react-dropzone";
import Swal from 'sweetalert2';
import { Image, Form } from "react-bootstrap";
import "../../scss/styles.scss";

function Dropzone(props) {
    const { setImagenFile, imagenProductoBD } = props;
    //console.log(imagenProductoBD)

    const [slide, setSlide] = useState([]);

    const onDropImagen = useCallback((acceptedFiles) => {
        //console.log(acceptedFiles);

        setSlide(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));

        const file = acceptedFiles[0];
        //setURLFinal(URL.createObjectURL(file));
        setImagenFile(file);
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: onDropImagen,
    });

    const cargaImagen = () => {
        slide.map((file, key) => {
            const tempType = file.type.split("/");
            const type = tempType[0];
            //console.log(Ext);
            //console.log(type);
            if (type !== "image") {
                //const tempP = file.preview;
                //slider1(tempP);
                Swal.fire({ icon: 'error', title: "Archivo no permitido", timer: 1600, showConfirmButton: false });
            }
            return "";
        });
    }

    useEffect(() => {
        cargaImagen();
    }, [slide]);

    const visualizarSlide1 = slide.map(file => (
        <div key={file?.name}>
            <div>
                <Image
                    src={file?.preview}
                    alt="logo"
                />
            </div>
        </div>
    ));

    return (
        <div className="archivoimg"
            {...getRootProps()}
        >
            {imagenProductoBD && slide.length === 0 ?
                (
                    <>
                        <aside>
                            <Image
                                src={imagenProductoBD}
                                alt="logo"
                            />
                        </aside>
                    </>
                )
                :
                slide.length !== 0 &&
                (
                    <>
                        <aside>
                            {visualizarSlide1}
                        </aside>
                    </>
                )
            }
            <Form.Control {...getInputProps()} />
        </div>
    );
}

export default Dropzone;

