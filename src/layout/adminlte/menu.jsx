import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = ({ datosUsuario, turno }) => {
  //console.log("datos usuario menu", datosUsuario);
  console.log(turno);
  const enrutamiento = useNavigate();

  const goTo = (ruta) => enrutamiento(ruta);

  const ItemCard = ({ path, title, logo }) => (
    <li className="nav-item">
      <a
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => goTo(path)}
      >
        <i className={`nav-icon fas ${logo}`} />
        <p>{title}</p>
      </a>
    </li>
  );

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="#" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">Restaurante</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User"
              />
            </div>
            <div className="info">
              <span
                className="brand-text font-weight-light"
                style={{ color: "#fff" }}
              >
                {datosUsuario.nombre}
              </span>
            </div>
          </div>
          {/* SidebarSearch Form */}

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column cursor-pointer"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {datosUsuario.estadoUsuario === "true" &&
                datosUsuario.rol === "administrador" &&
                datosUsuario.tipo === "interno" && (
                  <>
                    <ItemCard
                      path={"/TerminalPV"}
                      logo={"fa-chart-line"}
                      title={"Ventas"}
                    />
                    <ItemCard
                      path={"/Ordenes"}
                      logo={"fa-clipboard"}
                      title={"Pedidos"}
                    />
                    <ItemCard
                      path={"/Historiales"}
                      logo={"fa-history"}
                      title={"Historiales"}
                    />
                    <ItemCard
                      path={"/Productos"}
                      logo={"fa-box-open"}
                      title={"Productos"}
                    />
                    <ItemCard
                      path={"/Categorias"}
                      logo={"fa-tags"}
                      title={"Categorías"}
                    />
                    <ItemCard
                      path={"/Ingredientes"}
                      logo={"fa-flask"}
                      title={"Ingredientes"}
                    />
                    <ItemCard
                      path={"/Cajas"}
                      logo={"fa-cash-register"}
                      title={"Cajas"}
                    />
                    <ItemCard
                      path={"/Mesas"}
                      logo={"fa-table"}
                      title={"Mesas"}
                    />
                    <ItemCard
                      path={"/Usuarios"}
                      logo={"fa-users"}
                      title={"Usuarios"}
                    />
                    <ItemCard
                      path={"/Clientes"}
                      logo={"fa-user-friends"}
                      title={"Clientes"}
                    />
                    <ItemCard
                      path={"/PedidosClientes"}
                      logo={"fa-shopping-cart"}
                      title={"Pedidos en línea"}
                    />
                    <ItemCard
                      path={"/Logs"}
                      logo={"fa-clipboard-list"}
                      title={"Logs"}
                    />
                  </>
                )}
              {/*Vista del Dashboard para un usuario cajero*/}
              {datosUsuario.rol === "vendedor" &&
                datosUsuario.tipo === "interno" && (
                  <>
                    <ItemCard
                      path={"/TerminalPV"}
                      logo={"fa-chart-line"}
                      title={"Ventas"}
                    />
                    <ItemCard
                      path={"/Historiales"}
                      logo={"fa-history"}
                      title={"Historiales"}
                    />
                    <ItemCard
                      path={"/Cajas"}
                      logo={"fa-cash-register"}
                      title={"Cajas"}
                    />
                    <ItemCard
                      path={"/Clientes"}
                      logo={"fa-user-friends"}
                      title={"Clientes"}
                    />
                    <ItemCard
                      path={"/PedidosClientes"}
                      logo={"fa-shopping-cart"}
                      title={"Pedidos en línea"}
                    />
                  </>
                )}
              {/*Vista del Dashboard para un usuario mesero*/}
              {datosUsuario.rol === "mesero" &&
                datosUsuario.tipo === "interno" && (
                  <>
                    <ItemCard
                      path={"/TerminalPV"}
                      logo={"fa-char-line"}
                      title={"Ventas"}
                    />
                    <ItemCard
                      path={"/HistorialesNoAdmin"}
                      logo={"fa-history"}
                      title={"Historiales"}
                    />
                  </>
                )}
              {/*Vista del Dashboard para un usuario cliente*/}
              {datosUsuario.tipo === "externo" && (
                <>
                  <ItemCard
                    path={"/PedidosClientes"}
                    logo={"fa-history"}
                    title={"Pedidos en línea"}
                  />
                </>
              )}
            </ul>
          </nav>

          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default Menu;
