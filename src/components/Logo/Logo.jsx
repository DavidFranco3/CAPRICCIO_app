import { useEffect, useState } from "react";
import { listarLogo } from "../../api/logo";

function Logo(props) {
  const { width, height, bsclass } = props;

  const [logo, setLogo] = useState(null);

  const cargarLogo = async () => {
    const response = await listarLogo();
    const { data } = response;
    setLogo(data[0].imagen);
  };

  useEffect(() => {
    cargarLogo();
  }, []);

  return (
    <img
      src={logo}
      alt="logo"
      width={width}
      height={height}
      className={bsclass}
    />
  );
}

export default Logo;
