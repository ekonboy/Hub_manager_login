import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
      onClick={toggle}
      style={{ width: "40px", height: "40px", padding: 0 }}
    >
      {theme === "light" ? (
        <i className="bi bi-moon-fill fs-5"></i>
      ) : (
        <i className="bi bi-sun-fill fs-5"></i>
      )}
    </button>
  );
}
