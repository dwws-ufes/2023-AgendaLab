class LabService {
  static updateScheduling = () => {};

  static deleteScheduling = () => {};

  static getScheduling = () => {};

  static listLabs = async () => {
    const response = await fetch(`http://localhost:8080/request/laboratory/`);
    const labs = await response.json();
    return labs;
  };
}

export default LabService;
