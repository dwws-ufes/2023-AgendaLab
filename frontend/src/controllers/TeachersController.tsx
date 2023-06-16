import { Teacher } from "../models/models";
import TeachersService from "../services/TeachersService";

class TeacherController {
  static teacherList: Teacher[] = [];

  static getTeacher = async (id: number) => {
    const teacher = this.teacherList.find((teacher) => teacher.id === id);

    if (teacher) {
      return teacher;
    }

    const response = await TeachersService.getTeacher(id);
    return response;
  };

  static listTeachers = async () => {
    const response = await TeachersService.listTeachers();
    this.teacherList = response;
    return response;
  };
}

export default TeacherController;
