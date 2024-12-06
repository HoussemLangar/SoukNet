import React from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./MainApp"; 
import { CartProvider } from './context/CartContext';
import Dashboard from "./components/Admin/Dashboard"; 


const container = document.getElementById("root");
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <CartProvider>
      <MainApp />
    </CartProvider>
  </React.StrictMode>
);
