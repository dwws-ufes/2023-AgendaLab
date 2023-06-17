import {
  ApiResponse,
  SchedulingDB,
  SchedulingSaveDTO,
  SchedulingUpdateDTO,
} from "../models/models";

class SchedulingService {
  static addScheduling = async (
    scheduling: SchedulingSaveDTO[]
  ): Promise<ApiResponse> => {
    let apiResponse: ApiResponse;

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

    if (response.ok) {
      const data: SchedulingDB = await response.json();
      apiResponse = { ok: true, data };
    } else {
      apiResponse = { ok: false, data: null };
    }

    return apiResponse;
  };

  static updateScheduling = async (
    id: number,
    update: SchedulingUpdateDTO
  ): Promise<ApiResponse> => {
    let apiResponse: ApiResponse;

    const response = await fetch(
      `http://localhost:8080/request/schedule/${id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      }
    );

    apiResponse = { ok: response.ok, data: update };

    return apiResponse;
  };

  static deleteScheduling = async (id: number) => {
    let apiResponse: ApiResponse;

    const response = await fetch(
      `http://localhost:8080/request/schedule/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    apiResponse = { ok: response.ok, data: null };

    return apiResponse;
  };

  static listSchedulings = async (): Promise<ApiResponse> => {
    let apiResponse: ApiResponse;
    const response = await fetch(`http://localhost:8080/request/schedule/`);

    if (response.ok) {
      const data = await response.json();
      apiResponse = { ok: true, data };
    } else {
      apiResponse = { ok: false, data: null };
    }

    return apiResponse;
  };
}

export default SchedulingService;
