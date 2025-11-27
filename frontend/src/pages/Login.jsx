import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // login ficticio para pruebas
    navigate('/stores');
  };

  return (
    <div className="container mt-5">
      <h1>Backoffice Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input type="text" className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
