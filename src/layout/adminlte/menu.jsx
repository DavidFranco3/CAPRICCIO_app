import React from "react";
import { useNavigate } from "react-router-dom";

const Menu = ({ datosUsuario }) => {
  const enrutamiento = useNavigate();
  const goTo = (ruta) => enrutamiento(ruta);

  const ItemCard = ({ path, title, logo }) => (
    <li className="nav-item">
      <a className="nav-link" target="_blank" rel="noopener noreferrer" onClick={() => goTo(path)}>
        <i className={`nav-icon fas ${logo}`} />
        <p>{title}</p>
      </a>
    </li>
  );
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
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
                alt="User Image"
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
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
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

              {/**   <li className="nav-item">
                <a href="pages/widgets.html" className="nav-link">
                  <i className="nav-icon fas fa-shopping-cart" />
                  <p>
                    Pedidos en línea
                    <span className="right badge badge-danger">New</span>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="pages/gallery.html" className="nav-link">
                  <i className="nav-icon fas fa-tags" />
                  <p>Categorías</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="https://adminlte.io/docs/3.1/" className="nav-link">
                  <i className="nav-icon fas fa-box-open" />
                  <p>Productos</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-flask" />
                  <p>Ingredientes</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-history" />
                  <p>Historiales</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-cash-register" />
                  <p>Cajas</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>Usuarios</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-user-friends" />
                  <p>Clientes</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-clipboard-list" />
                  <p>Logs</p>
                </a>
              </li>*/}
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
