import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

const zapisanyOdcien = localStorage.getItem("motyw_kolor") || "239";
document.documentElement.style.setProperty("--p-odcien", zapisanyOdcien);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
