import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';
import SchedulingPage from './pages/scheduling';
import PasswordPage from './pages/password';
import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/password" element={<PasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
