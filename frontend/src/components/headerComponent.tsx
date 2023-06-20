import { useNavigate } from "react-router-dom";
import AuthController from "../controllers/AuthController";
import { useEffect } from "react";
import { useState } from "react";

function HeaderComponent() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const username = AuthController.getName();
    if (username) setUsername(username);
  }, []);

  const navigateToLogin = () => {
    AuthController.logout()
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center bg-primary p-3"
      style={{ height: "60px" }}
    >
      <span className="h5 text-white">
        AgendaLab
        <i className="pi pi-calendar px-2" style={{ fontSize: "1rem" }}></i>
      </span>
      <div className="d-flex align-items-center">
        <span className="text-white px-4">Bem vindo {username} !</span>
        <button className="btn btn-outline-light" onClick={navigateToLogin}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default HeaderComponent;
