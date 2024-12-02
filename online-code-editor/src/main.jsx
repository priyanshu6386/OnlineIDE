import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Ensure the path matches your file structure
import "./index.css"; // Optional: Add this if you have global styles

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
