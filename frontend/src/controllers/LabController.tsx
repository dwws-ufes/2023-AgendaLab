import LabService from "../services/LabService";

class LabController {
  static labList = [];

  static listLabs = async () => {
    const response = await LabService.listLabs();
    this.labList = response
    return response;
  };
}

export default LabController;
