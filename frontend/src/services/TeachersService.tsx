import { ApiResponse } from "../models/models";

class TeacherService {
  static deleteTeacher = () => {};

  static addTeacher = () => {};

  static getTeacher = async (id: number): Promise<ApiResponse> => {
    let apiResponse: ApiResponse;

    const response = await fetch(`http://localhost:8080/request/teacher/${id}`);

    if (response.ok) {
      const data = await response.json();
      apiResponse = { ok: true, data };
    } else {
      apiResponse = { ok: false, data: null };
    }

    return apiResponse;
  };

  static listTeachers = async (): Promise<ApiResponse> => {
    let apiResponse: ApiResponse;

    const response = await fetch(`http://localhost:8080/request/teacher/`);

    if (response.ok) {
      const data = await response.json();
      apiResponse = { ok: true, data };
    } else {
      apiResponse = { ok: false, data: null };
    }

    return apiResponse;
  };
}

export default TeacherService;
