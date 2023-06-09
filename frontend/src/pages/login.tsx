import { useNavigate } from "react-router-dom";
import  { useRef } from 'react';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import logo from "../images/LogoTeste.png"
import AuthController from "../controllers/AuthController";
import { Toast } from 'primereact/toast';


function LoginPage() {
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const navigateToScheduling = () => {
    navigate("/scheduling");
  };

  const navigateToPassword = () => {
    navigate("/password");
  };

  const defaultValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (data: any) => {
    const response = await AuthController.login(data.email, data.password);

    if (response.email && response.name) {
      navigateToScheduling();
    } else {
      toast.current?.show({ severity: 'error', summary: 'Falha na autenticação', detail: 'Credenciais inválidas' });
    }
    reset();
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  return (
    <div className="login-page d-flex vh-100">
      <Toast ref={toast} />
      <div
        className="w-50 d-flex justify-content-center align-items-end p-5"
        style={{ backgroundColor: "var(--indigo-500)" }}
      >
        <img src={logo} />
        <p className="text-white h2">
          {/*Agenda Lab{" "}   
          <i className="pi pi-calendar" style={{ fontSize: "1.5rem" }}></i>
          */}
        </p>
      </div>

      <div className="w-50 d-flex align-items-center justify-content-center ">
        <div>
          <h1 className="text-white">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field py-4">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@email.com",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="email"
                  className={classNames({ "p-error": !!errors.email })}
                >
                  Email*
                </label>
              </span>
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required." }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      feedback={false}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="password"
                  className={classNames({ "p-error": errors.password })}
                >
                  Password*
                </label>
              </span>
            </div>

            <Button type="submit" label="Entrar" className="mt-5" />
            <Button
            onClick={navigateToPassword}
              label="Esqueci minha senha"
              className="mt-2 mb-5"
              //outlined
            />
            <Button
              onClick={navigateToScheduling}
              label="Entrar como convidado"
              className="mt-5"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
