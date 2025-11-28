import React from "react";
import { FaStore, FaLink, FaSignInAlt } from "react-icons/fa";

function StoreCard({ store, onLogin }) {
  return (
    <div className="col-5-per-row mb-4">
      <div className="card shadow-sm h-100 bg-body text-body">
        {/* Cabecera */}

        {store.logo && (
          <img
            src={store.logo}
            alt={`${store.name} logo`}
            className="centered-absolute"
          />
        )}

    
        {store.image && <img src={store.image} alt={`${store.name} image`} />}

        <div className="store-info-badges">
          <a href={store.url} target="_blank" rel="noopener noreferrer" className="store-name-badge text-decoration-none">
            <FaStore className="me-2" />
            <span className="badge bg-transparent text-white">{store.name}</span>
          </a>

          {/* Plataforma */}
          {store.platform && <div className="platform-badge">{store.platform.toUpperCase()}</div>}

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
