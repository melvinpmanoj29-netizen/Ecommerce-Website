import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";

import "./styles/variables.css";
import "./styles/typography.css";
import "./styles/utilities.css";
import "./styles/globals.css";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
  <Toaster position="top-center"/>
   <App />
</BrowserRouter>
  </React.StrictMode>
  
);
