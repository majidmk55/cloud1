import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

console.log('[ABRAN BOOT] Starting application...');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root not found in index.html');
}
console.log('[ABRAN BOOT] Root container found');

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('[ABRAN BOOT] Application rendered');
