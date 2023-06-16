class TeacherService {
  static deleteTeacher = () => {};

  static addTeacher = () => {};

  static getTeacher = async (id: number) => {
    const response = await fetch(`http://localhost:8080/request/teacher/${id}`);
    const teacher = await response.json();
    return teacher;
  };

  static listTeachers = async () => {
    const response = await fetch(`http://localhost:8080/request/teacher/`);
    const teachers = await response.json();
    return teachers;
  };
}

export default TeacherService;
