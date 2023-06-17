import {
  ApiResponse,
  Scheduling,
  SchedulingDB,
  SchedulingSaveDTO,
  SchedulingUpdateDTO,
} from "../models/models";
import SchedulingService from "../services/SchedulingService";

class SchedulingController {
  static schedules: Scheduling[] = [];

  static registerScheduling = async (scheduling: Scheduling) => {
    let schedulingToSave: SchedulingSaveDTO[] = [];
    let responseController: ApiResponse;

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
          schedulingToSave.push({
            title: scheduling.title,
            description: scheduling.notes,
            start_time: newStartDate,
            end_time: newEndingtDate,
            laboratory: scheduling.laboratory,
            repeat: false,
            created_by: scheduling.created_by,
          });
        }
      }
    } else {
      schedulingToSave.push({
        title: scheduling.title,
        description: scheduling.notes,
        start_time: new Date(scheduling.startDate),
        end_time: new Date(scheduling.endDate),
        laboratory: scheduling.laboratory,
        repeat: false,
        created_by: scheduling.created_by,
      });
    }

    const response = await SchedulingService.addScheduling(schedulingToSave);

    if (response.ok) {
      response.data.forEach((schedule: SchedulingDB) => {
        SchedulingController.schedules.push({
          id: schedule.id,
          notes: schedule.description,
          startDate: new Date(schedule.start_time),
          endDate: new Date(schedule.end_time),
          title: schedule.title,
          laboratory: schedule.laboratory,
          created_by: schedule.created_by,
        });
      });
      responseController = {
        ok: true,
        data: SchedulingController.schedules.filter((schedule) =>
          response.data.map((el: SchedulingDB) => el.id).includes(schedule.id)
        ),
      };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };

  static updateScheduling = async (
    id: number,
    update: SchedulingUpdateDTO
  ): Promise<ApiResponse> => {
    const response = await SchedulingService.updateScheduling(id, update);

    let responseController: ApiResponse;

    if (response.ok) {
      const scheduleToUpdate = SchedulingController.schedules.find(
        (schedule) => schedule.id === response.data.id
      );

      if (scheduleToUpdate) {
        const idx = SchedulingController.schedules.indexOf(scheduleToUpdate);
        SchedulingController.schedules[idx] = {
          ...SchedulingController.schedules[idx],
          ...response.data,
        };
        responseController = {
          ok: true,
          data: SchedulingController.schedules[idx],
        };
      } else {
        responseController = { ok: false, data: null };
      }
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };

  static deleteScheduling = async (id: number) => {
    let responseController: ApiResponse;

    const response = await SchedulingService.deleteScheduling(id);

    if (response.ok) {
      SchedulingController.schedules.filter((schedule) => schedule.id !== id);
      responseController = { ok: true, data: null };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };

  static listSchedulings = async (): Promise<ApiResponse> => {
    if (SchedulingController.schedules.length > 0) {
      return { ok: true, data: SchedulingController.schedules };
    }
    const response = await SchedulingService.listSchedulings();

    let responseController: ApiResponse;

    if (response.ok) {
      SchedulingController.schedules = response.data.map(
        (scheduling: SchedulingDB) => ({
          id: scheduling.id,
          title: scheduling.title,
          notes: scheduling.description,
          startDate: new Date(scheduling.start_time),
          endDate: new Date(scheduling.end_time),
          laboratory: scheduling.laboratory,
          created_by: scheduling.created_by,
        })
      );

      responseController = { ok: true, data: SchedulingController.schedules };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };
}

export default SchedulingController;
