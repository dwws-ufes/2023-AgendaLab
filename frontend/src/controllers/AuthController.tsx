import AuthService from "../services/AuthService";

class LabController {
  private static email: string | null;
  private static username: string | null;
  private static id: number | null;

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
  
  static logout = () => {
    this.email = null
    this.username = null
    this.id = null
  }
}

export default LabController;
