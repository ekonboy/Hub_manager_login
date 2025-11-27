import React from 'react';

function StoreCard({ store, onLogin }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{store.name}</h5>
          <p className="card-text">{store.url}</p>
          <button className="btn btn-success" onClick={onLogin}>
            Login automático
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreCard;
