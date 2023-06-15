import AuthService from "../services/AuthService";

class LabController {
  private static email: string;
  private static username: string;

  static login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.err) {
      return response.err;
    } else if (response.email && response.name) {
      this.email = response.email;
      this.username = response.name;
      return response;
    }

    return { err: "Erro desconhecido" };
  };

  static getMail = () => this.email;
  static getName = () => this.username;
}

export default LabController;
