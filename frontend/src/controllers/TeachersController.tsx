import { ApiResponse, Teacher } from "../models/models";
import TeacherService from "../services/TeachersService";

class TeacherController {
  static teacherList: Teacher[] = [];

  static getTeacher = async (id: number) => {
    let responseController: ApiResponse;

    const teacher = this.teacherList.find((teacher) => teacher.id === id);

    if (teacher) {
      responseController = { ok: true, data: teacher };
      return responseController;
    }

    const response = await TeacherService.getTeacher(id);

    if (response.ok) {
      responseController = { ok: true, data: response.data };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };

  static listTeachers = async () => {
    if (TeacherController.teacherList.length > 0) {
      return { ok: true, data: TeacherController.teacherList };
    }
    const response = await TeacherService.listTeachers();

    let responseController: ApiResponse;

    if (response.ok) {
      TeacherController.teacherList = response.data;
      responseController = { ok: true, data: TeacherController.teacherList };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };
}

export default TeacherController;
