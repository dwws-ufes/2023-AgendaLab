import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import Img from 'primereact/image'
import logo from "../images/LogoTeste.png"

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const navigateToLogin = () => {
    navigate("/");
  };

  const defaultValues = {
    email: '',
    password: '',
	codigo: '',
  }

  const onSubmit = (data: any) => {
    setFormData(data);
    reset();
  };

  const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

  return (
    <div className="login-page d-flex vh-100">
      <div className="w-50 d-flex justify-content-center align-items-end p-5" style={{backgroundColor: "var(--indigo-500)"}}>
      <img src={logo} />
          {/*Agenda Lab{" "}   
          <i className="pi pi-calendar" style={{ fontSize: "1.5rem" }}></i>
          */}
      </div>

      <div className="w-50 d-flex align-items-center justify-content-center ">
        <div>
          <h1 className="text-white">Inserir nova Senha</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field py-4">
                <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                    <Controller name="password" control={control}
						rules={{ required: 'Senha é obrigatória.', minLength: { value: 5, message: 'Senha deve ter no mínimo 5 caracteres.' } }}
                        render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                    )} />
                    <label htmlFor="password" className={classNames({ 'p-error': !!errors.password })}>Nova Senha*</label>
                </span>
            </div>
            <Button type="submit" label="Mudar Senha" className="mt-5" />
            {/*<Button label="Esqueci minha senha" className="mt-2 mb-5" outlined/>*/}
            <></>

            <Button onClick={navigateToLogin} label="Voltar" className="mt-5" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
