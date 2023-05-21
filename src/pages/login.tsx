import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';                             


function LoginPage() {
  const navigate = useNavigate();

  const navigateToScheduling = () => {
    navigate('/scheduling');
  };

  return (
    <div className="login-page">
      <h1>Login</h1>

      <Button onClick={navigateToScheduling}>
        Entrar
      </Button>
    </div>
  );
}

export default LoginPage;
