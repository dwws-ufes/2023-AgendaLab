import { useEffect } from "react";
import { useState } from "react";
import SchedulingComponent from "../components/scheduler";
import HeaderComponent from "../components/headerComponent";
import DataTableComponent from "../components/dataTable";
import TabViewComponent from "../components/tabView";
import SchedulingController from "../controllers/SchedulingController";
import { Lab, Scheduling } from "../models/models";
import LabController from "../controllers/LabController";
import { Dropdown } from "primereact/dropdown";

function SchedulingPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);

  const [labs, setLabs] = useState<[]>([]);

  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await SchedulingController.listSchedulings();
      if (response.ok) {
        setSchedulings(response.data);
      }

      const labList = await LabController.listLabs();
      if (labList) {
        setLabs(labList);
      }

      if (labList.length > 0) {
        setSelectedLab(labList[0]);
      }
    }
    fetchData();
  }, []);

  const titles = ["title", "id", "location"];

  const handleChangeScheduler = async () => {
    const response = await SchedulingController.listSchedulings();
    if (response.ok) {
      setSchedulings(response.data);
    }
  };

  const renderScheduler = (selectedLab: any) => {
    if (selectedLab) {
      const filtered = schedulings.filter(
        (scheduling) => scheduling.laboratory === selectedLab.id
      );

      return (
        <SchedulingComponent
          key={selectedLab.id}
          schedulings={filtered}
          selectedLabCode={selectedLab.code}
          selectedLabId={selectedLab.id}
          onChangedSchedules={handleChangeScheduler}
        />
      );
    }

    return null;
  };

  const renderPage = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div>
            <Dropdown
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.value)}
              options={labs}
              optionLabel="code"
              placeholder="Selecione um laboratório"
              className="w-full md:w-14rem"
            />
            {renderScheduler(selectedLab)}
          </div>
        );
      case 1:
        return <DataTableComponent products={schedulings} collumns={titles} />;
      case 2:
        return <TabViewComponent />;
    }
  };

  return (
    <div className="vh-100">
      <HeaderComponent />
      <div className="d-flex" style={{ height: "calc(100vh - 60px)" }}>
        <div className="bg-red w-25 d-flex justify-content-center pt-5">
          <div className="bg-primary h-100 w-50 rounded d-flex flex-column justify-content-center align-items-center">
            <div
              className="btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column"
              style={{ height: "160px", width: "160px" }}
              onClick={() => setActiveIndex(0)}
            >
              <i className="pi pi-calendar" style={{ fontSize: "3rem" }}></i>
              Agenda
            </div>
            <div
              className="btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column"
              style={{ height: "160px", width: "160px" }}
              onClick={() => setActiveIndex(1)}
            >
              <i className="pi pi-bookmark" style={{ fontSize: "3rem" }}></i>
              Agendamentos
            </div>
            <div
              className="btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column"
              style={{ height: "160px", width: "160px" }}
              onClick={() => setActiveIndex(2)}
            >
              <i className="pi pi-book" style={{ fontSize: "3rem" }}></i>
              Cadastros
            </div>
          </div>
        </div>
        <div className="w-75" style={{ overflow: "auto" }}>
          <div className="p-2">{renderPage()}</div>
        </div>
      </div>
    </div>
  );
}

export default SchedulingPage;
