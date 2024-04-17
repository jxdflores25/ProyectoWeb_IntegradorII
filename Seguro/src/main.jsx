
import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './pages/LandingPage.jsx'
import './index.css'
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx';


import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <React.StrictMode>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </React.StrictMode>
  </BrowserRouter>
);
