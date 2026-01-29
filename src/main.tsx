import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // <- esta linha nova

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>         {/* <- aqui envolve o App */}
      <App />
    </BrowserRouter>        {/* <- fecha o BrowserRouter */}
  </React.StrictMode>
);
