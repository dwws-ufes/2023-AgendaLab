import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import SchedulingPage from "./pages/scheduling";
import PasswordPage from "./pages/password";
import NewPasswordPage from "./pages/newPassword";
import "primereact/resources/themes/vela-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

class App extends React.Component {
  componentDidMount() {
    const { pathname } = window.location;

    if (pathname === "/scheduling") {
      window.location.href = "/";
    }
  }

  render() {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/newPassword" element={<NewPasswordPage />} />
      </Routes>
    );
  }
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
