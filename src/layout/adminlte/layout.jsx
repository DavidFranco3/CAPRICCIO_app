import { useState, useEffect, Fragment } from 'react';
import { obtenerUsuario } from "../../api/usuarios";
import { getTokenApi, obtenidusuarioLogueado } from '../../api/auth';
import Header from './header';
import Menu from './menu';
import Footer from './footer';
import { toast } from "react-toastify";



const LayoutAdminLTE = (props) => {
  const { setRefreshCheckLogin, children } = props;
  const [datosUsuario, setDatosUsuario] = useState("");
  

  //const redirecciona = useNavigate();

  

  const obtenerDatosUsuario = () => {
      try {
        obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
              const { data } = response;
              console.log("usuarios",data)
              setDatosUsuario(data);
          }).catch((e) => {
              console.log(e);
          })
      } catch (e) {
          console.log(e);
      }
  }

  useEffect(() => {
      obtenerDatosUsuario();
  }, []);


  return (
    <>
   <div class="wrapper">
            <Header datosUsuario={datosUsuario}/>
            <Menu datosUsuario={datosUsuario}/>
            <div className='content-wrapper'>
                {children}
            </div>            
            <Footer/>
        </div>
    </>
  )
}

export default LayoutAdminLTE;