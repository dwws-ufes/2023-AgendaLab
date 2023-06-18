import { ApiResponse, Department } from "../models/models";
import DepartmentService from "../services/DepartmentService";

class DepartmentController {
  static departments: Department[] = [];

  static registerDepartment = async (departments: Department) => {};

  static deleteDepartment = async (id: number) => {
    let responseController: ApiResponse;

    const response = await DepartmentService.deleteDepartment(id);

    if (response.ok) {
      DepartmentController.departments =
        DepartmentController.departments.filter(
          (department) => department.id !== id
        );
      responseController = { ok: true, data: null };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };

  static listDepartments = async (): Promise<ApiResponse> => {
    if (DepartmentController.departments.length > 0) {
      return { ok: true, data: DepartmentController.departments };
    }
    const response = await DepartmentService.listDepartments();

    let responseController: ApiResponse;

    if (response.ok) {
      DepartmentController.departments = response.data;
      responseController = { ok: true, data: DepartmentController.departments };
    } else {
      responseController = { ok: false, data: null };
    }

    return responseController;
  };
}

export default DepartmentController;
