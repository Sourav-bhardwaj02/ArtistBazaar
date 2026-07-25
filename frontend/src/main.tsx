import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from "./lib/ErrorBoundary.tsx";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element with id 'root' not found in index.html");
}
const root = createRoot(container);
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
if (!clientId) {
  console.error("VITE_GOOGLE_CLIENT_ID is not set");
}
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);