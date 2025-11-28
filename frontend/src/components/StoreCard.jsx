import React from "react";
import { FaStore, FaLink, FaSignInAlt } from "react-icons/fa";

function StoreCard({ store, onLogin }) {
  return (
    <div className="col-5-per-row mb-4">
      <div className="card shadow-sm h-100 bg-body text-body">
        {/* Cabecera */}

        {store.logo && <img src={store.logo} alt={`${store.name} logo`} className="centered-absolute" />}







        {(() => {
        

     
          return (
            <div
  className="platform-icons d-flex flex-column"
  style={{
    position: "absolute",
    left: "11px",
    gap: "10px", // espacio de 10px entre iconos
  }}
>
  {Array.isArray(store.platform_icons) && store.platform_icons.length > 0
    ? [...new Set(["bi bi-wordpress", ...store.platform_icons])].map((icon, index) => (
        <i
          key={index}
          className={icon}
          style={{
            fontSize: "2.8rem",
            color: "inherit",
            textShadow: "1px 1px 2px rgba(0,0,0,0.8)", // sombra negra
          }}
        ></i>
      ))
    : (
      <i
        className="bi bi-wordpress"
        style={{
          fontSize: "2.8rem",
          color: "inherit",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
        }}
      ></i>
    )}
</div>

          );
        })()}

        {store.image && <img src={store.image} alt={`${store.name} image`} />}

        <div className="store-info-badges">
          <a href={store.url} target="_blank" rel="noopener noreferrer" className="store-name-badge text-decoration-none">
            <FaStore className="me-2" />
            <span className="badge bg-transparent text-white">{store.name}</span>
          </a>

          {/* Estado */}
          {store.active !== undefined && <div className={`status-badge ${Boolean(store.active) ? "active" : "inactive"}`}>{Boolean(store.active) ? "Activa" : "Inactiva"}</div>}

          {/* Botón Login */}
          <button className="login-button-badge" onClick={onLogin}>
            <FaSignInAlt />
            Acceder
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreCard;
