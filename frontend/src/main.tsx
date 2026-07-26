import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from "./lib/ErrorBoundary.tsx";
import App from "./App.tsx";
import "./index.css";
import {
  suppressConsoleinProd,
  startDevtoolsDetection,
} from "./lib/security";

// ── Security bootstrap ────────────────────────────────────────────────────────
// Suppress console output in production to prevent logic enumeration
suppressConsoleinProd();

// Detect DevTools open in production (passive detection — no aggressive disruption)
if (import.meta.env.PROD) {
  startDevtoolsDetection(() => {
    // When devtools open: clear sessionStorage tokens from memory.
    // Auth tokens persist in obfuscated localStorage so the user isn't
    // immediately logged out, but in-memory session refs are gone.
    sessionStorage.clear();
  });
}

// ── App mount ────────────────────────────────────────────────────────────────
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element with id 'root' not found in index.html");
}
const root = createRoot(container);

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
if (!clientId && import.meta.env.DEV) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set");
}

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);