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
    const loadStoresWithWPData = async () => {
      try {
        const data = await fetchStores();
        console.log("Stores recibidos:", data);
        const baseStores = data.stores || [];

        // Para cada store, obtener datos dinámicos de WordPress
        const storesWithWPData = await Promise.all(
          baseStores.map(async (store) => {
            // Solo consultar si es una plataforma WP
            if (store.platform && store.platform.includes("WP")) {
              try {
                const wpResponse = await fetch(`${store.url}/wp-json/filament/v1/stores`);
                const wpData = await wpResponse.json();

                // Combinar datos: usar logo/image de WP si existen
                if (wpData && wpData.length > 0) {
                  return {
                    ...store,
                    logo: wpData[0].logo || store.logo || "",
                    image: wpData[0].image || store.image || "",
                  };
                }
              } catch (wpError) {
                console.warn(`No se pudo obtener datos WP de ${store.name}:`, wpError);
              }
            }
            return store;
          })
        );

        setStores(storesWithWPData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetchStores:", err);
        setError("No se pudieron cargar los CMS");
        setLoading(false);
      }
    };

    loadStoresWithWPData();
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
      <div className="text-end">
        <ToggleTheme />
        <div class="alert alert-success" style={{ width: "20%", position: "absolute", float: "right", top: "46px", right: "0%", marginBottom: "50px" }} role="alert">
          Hub Manager Login
        </div>
      </div>

      <div className="row mt-5">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onLogin={() => handleLogin(store)} />
        ))}
      </div>
    </div>
  );
}
