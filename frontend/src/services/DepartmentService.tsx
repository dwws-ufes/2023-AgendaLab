import { ApiResponse } from "../models/models";

class DepartmentService {
  static deleteDepartment = async (id: number) => {
    let apiResponse: ApiResponse;

    const response = await fetch(
      `http://localhost:8080/request/department/${id}/`,
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

  static listDepartments = async () => {
    let apiResponse: ApiResponse;

    const response = await fetch(`http://localhost:8080/request/department/`);

    if (response.ok) {
      const departments = await response.json();
      apiResponse = { ok: true, data: departments };
    } else {
      apiResponse = { ok: false, data: null };
    }

    return apiResponse;
  };
}

export default DepartmentService;
