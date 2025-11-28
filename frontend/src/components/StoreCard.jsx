import React from "react";
import { FaStore, FaLink, FaSignInAlt } from "react-icons/fa";

function StoreCard({ store, onLogin }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm border border-secondary-subtle h-100 bg-body text-body">
        {/* Cabecera */}
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <FaStore className="me-2" />
          <strong>{store.name}</strong>
        </div>

        {store.logo && (
          <img
            src={store.logo}
            alt={`${store.name} logo`}
            style={{
              width: "20%",
              position: "absolute",
              top: "6%",
              right: "11px",
            }}
          />
        )}
        {store.image && <img src={store.image} alt={`${store.name} image`} />}

        <div className="card-body">
          {/* URL */}
          <p className="card-text text-muted mb-2">
            <FaLink className="me-2 opacity-75" />
            <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none link-info">
              {store.url}
            </a>
          </p>

          {/* Plataforma */}
          {store.platform && <span className="badge rounded-pill text-bg-info mb-3">{store.platform.toUpperCase()}</span>}

          {/* Estado */}
          {store.active !== undefined && <div className="mb-3">{Boolean(store.active) ? <span className="badge text-bg-success">Activa</span> : <span className="badge text-bg-danger">Inactiva</span>}</div>}

          {/* App Password */}
          {store.app_password && (
            <div className="mb-3">
              <label className="form-label small text-muted mb-1">App Password</label>
              <div className="input-group input-group-sm">
                <input type="text" className="form-control" value={store.app_password} readOnly />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(store.app_password);
                    alert("Contraseña copiada!");
                  }}
                  title="Copiar contraseña"
                >
                  <FaLink />
                </button>
              </div>
            </div>
          )}

          {/* Botón Login */}
          <button className="btn btn-success w-100 d-flex justify-content-center align-items-center" onClick={onLogin}>
            <FaSignInAlt className="me-2" />
            Acceder
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreCard;
