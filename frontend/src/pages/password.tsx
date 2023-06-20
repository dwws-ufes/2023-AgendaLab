import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import logo from "../images/LogoTeste.png";
import AuthController from "../controllers/AuthController";
import { Toast } from "primereact/toast";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [email, setEmail] = useState<string>();

  const toast = useRef<Toast>(null);

  const navigateToLogin = () => {
    navigate("/");
  };

  const defaultValues = {
    email: "",
    password: "",
    codigo: "",
    senha: "",
  };

  const onSubmit = async (data: any) => {
    setFormData(data);

    const response = await AuthController.forgotPassword(data.email);

    setEmail(data.email);

    if (response.status === 200) {
      toast.current?.show({
        severity: "success",
        summary: "Senha",
        detail: "Código enviado",
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Senha",
        detail: "Erro ao enviar código",
      });
    }
    reset();
  };

  const onCodeSubmit = async (data: any) => {
    setFormData(data);

    if (email) {
      const response = await AuthController.checkCode(
        data.codigo,
        email,
        data.password
      );

      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Senha",
          detail: "Senha Alterada com sucesso",
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Senha",
          detail: "Código inválido",
        });
      }
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Senha",
        detail: "Email não informado",
      });
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
        {/*Agenda Lab{" "}   
          <i className="pi pi-calendar" style={{ fontSize: "1.5rem" }}></i>
          */}
      </div>

      <div className="w-50 d-flex align-items-center justify-content-center ">
        <div>
          <h1 className="text-white">Recuperar senha</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field py-4">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="email"
                  control={control}
                  rules={{
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
            <Button
              type="submit"
              label="Enviar código de recuperação"
              className="mt-5"
            />
          </form>
          <form onSubmit={handleSubmit(onCodeSubmit)} className="p-fluid">
            <div className="field py-4">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="codigo"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^[0-9]{6}$/i,
                      message: "Invalid code. E.g. 123456",
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
                  htmlFor="codigo"
                  className={classNames({ "p-error": !!errors.codigo })}
                >
                  Codigo*
                </label>
              </span>
            </div>

            <div className="field py-4">
              <span className="p-float-label p-input-icon-right">
                <i className="pi pi-envelope" />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    minLength: {
                      value: 5,
                      message: "Senha deve ter no mínimo 5 caracteres.",
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
                  htmlFor="password"
                  className={classNames({ "p-error": !!errors.password })}
                >
                  Nova Senha*
                </label>
              </span>
            </div>
            <Button type="submit" label="Mudar Senha" className="mt-5" />

            <Button onClick={navigateToLogin} label="Voltar" className="mt-5" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
