import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found!");
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log("App rendered successfully!");
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;">Ошибка загрузки приложения. Пожалуйста, обновите страницу.</div>';
}
