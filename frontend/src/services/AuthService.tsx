class AuthService {
  static login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:8080/request/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Coloque os dados que você deseja enviar no corpo da solicitação
    });
    const loginResponse = await response.json();
    return loginResponse;
  };

  static forgotPassword = async (email: string) => {
    const response = await fetch(
      `http://localhost:8080/request/user/${email}/send_code`
    );
    return response;
  };

  static checkCode = async (
    code: string,
    email: string,
    newPassword: string
  ) => {
    const response = await fetch(
      `http://localhost:8080/request/user/${email}/${code}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );
    return response;
  };
}

export default AuthService;
