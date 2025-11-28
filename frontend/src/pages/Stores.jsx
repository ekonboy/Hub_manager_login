import { useEffect, useState } from "react";
// import { fetchStores, loginStore } from '../services/storeService';
import { loginStore, fetchStores } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import ToggleTheme from "../components/ToggleTheme";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStores()
      .then((data) => {
        console.log("Stores recibidos:", data);
        setStores(data.stores || []); // <-- aquí accedemos al array real
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetchStores:", err);
        setError("No se pudieron cargar los CMS");
        setLoading(false);
      });
  }, []);

  const handleLogin = async (store) => {
    try {
      const userId = 1; // temporal
      console.log("Clic en login automático, store:", store);

      // Llamada a tu backend, NO al StoreService de Node
      const res = await loginStore(store.id, userId);
      console.log("Respuesta del backend:", res);

      if (res?.data?.login_url) {
        console.log("Login URL generada (React):", res.data.login_url);
        window.open(res.data.login_url, "_blank");
      } else {
        alert("No se pudo generar la URL de login");
      }
    } catch (err) {
      console.error("Error loginStore:", err);
      alert("Error al generar login automático");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mt-5 text-center text-danger">{error}</div>;
  }

  if (!stores.length) {
    return <div className="container mt-5 text-center text-muted">No hay CMS registrados todavía</div>;
  }

  return (
    <div className="container mt-5">
      <div className="text-end mb-4">
        <ToggleTheme />
      </div>

      <h1 className="mb-4 text-center">Hub Manager Login</h1>
      <div className="row">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onLogin={() => handleLogin(store)} />
        ))}
      </div>
    </div>
  );
}
