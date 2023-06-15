class SchedulingService {
  static addScheduling = async (scheduling: any) => {
    console.log("SCHEDULING => ", JSON.stringify(scheduling));
    const response = await fetch(
      "http://localhost:8080/request/schedule/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduling), // Coloque os dados que você deseja enviar no corpo da solicitação
      }
    );
    const schedulings = await response.json();
    return schedulings;
  };

  static updateScheduling = () => {};

  static deleteScheduling = () => {};

  static getScheduling = () => {};

  static listSchedulings = async () => {
    const response = await fetch(`http://localhost:8080/request/schedule/`);
    const schedulings = await response.json();
    return schedulings;
  };
}

export default SchedulingService;
