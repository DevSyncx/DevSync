import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./Context/AppContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* ✅ Wrap App in Router */}
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
