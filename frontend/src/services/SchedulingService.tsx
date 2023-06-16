class SchedulingService {
  static addScheduling = async (scheduling: any) => {
    const response = await fetch(
      "http://localhost:8080/request/schedule/create/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduling),
      }
    );

    return response;
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
