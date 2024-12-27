import React from "react"; 
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error(
        "Root element not found. Make sure <div id='root'></div> exists in your index.html"
    );
}

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);