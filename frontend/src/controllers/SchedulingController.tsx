import { Scheduling } from "../models/models";
import SchedulingService from "../services/SchedulingService";

class SchedulingController {
  static idNumber: number = 2;

  static registerScheduling = async (scheduling: Scheduling) => {
    let schedulingToSave = [];

    if (scheduling.rRule) {
      const rule = scheduling.rRule.substring(
        scheduling.rRule.indexOf(":") + 1
      );
      const parts = rule.split(";");

      let interval = null;
      let count = null;

      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key === "INTERVAL") interval = parseInt(value);
        else if (key === "COUNT") count = parseInt(value);
      });

      if (count && interval) {
        for (let i = 0; i < count; i++) {
          const newStartDate = new Date(scheduling.startDate);
          const newEndingtDate = new Date(scheduling.endDate);

          newStartDate.setDate(newStartDate.getDate() + interval * i);
          newEndingtDate.setDate(newEndingtDate.getDate() + interval * i);

          this.idNumber += 1;

          schedulingToSave.push({
            title: scheduling.title,
            description: scheduling.notes,
            start_time: newStartDate,
            end_time: newEndingtDate,
            laboratory: 6,
            created_by: 4,
          });
        }
      }
    } else {
      schedulingToSave.push({
        title: scheduling.title,
        description: scheduling.notes,
        start_time: new Date(scheduling.startDate),
        end_time: new Date(scheduling.endDate),
        laboratory: 6,
        created_by: 4,
      });
    }

    const response = await SchedulingService.addScheduling(schedulingToSave);
    return response;
  };

  static updateScheduling = () => {};

  static registerManyScheduling = () => {};

  static deleteScheduling = () => {};

  static getScheduling = () => {};

  static listSchedulings = async () => {
    const response = await SchedulingService.listSchedulings();
    const schedulings = response.map((scheduling: any) => ({
      id: scheduling.id,
      title: scheduling.title,
      desc: scheduling.description,
      startDate: new Date(scheduling.start_time),
      endDate: new Date(scheduling.end_time),
    }));
    return schedulings;
  };
}

export default SchedulingController;
