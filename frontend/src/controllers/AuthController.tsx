import AuthService from "../services/AuthService";

class LabController {
  private static email: string;
  private static username: string;
  private static id: number;

  static login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.err) {
      return response.err;
    } else if (response.email && response.name && response.id) {
      this.email = response.email;
      this.username = response.name;
      this.id = response.id;
      return response;
    }

    return { err: "Erro desconhecido" };
  };

  static getMail = () => this.email;
  static getName = () => this.username;
  static getId = () => this.id;
}

export default LabController;
