import { useEffect } from "react";
import { useState } from "react";
import SchedulingComponent from "../components/scheduler";
import HeaderComponent from "../components/headerComponent";
import DataTableComponent from "../components/dataTable";
import TabViewComponent from "../components/tabView";
import SchedulingController from "../controllers/SchedulingController";
import { Lab, Scheduling, SchedulingTable, Teacher } from "../models/models";
import LabController from "../controllers/LabController";
import { Dropdown } from "primereact/dropdown";
import TeacherController from "../controllers/TeachersController";
import { format } from "date-fns";

function SchedulingPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);

  const [schedulingTable, setSchedulingsTable] = useState<SchedulingTable[]>(
    []
  );

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [updateSchedulingKey, setUpdateSchedulingKey] = useState(0);

  const [updateSchedulingTableKey, setUpdateSchedulingTableKey] = useState(0);

  const [labs, setLabs] = useState<Lab[]>([]);

  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await SchedulingController.listSchedulings();
      if (response.ok) {
        const arr = [...response.data];
        setSchedulings(arr);
      }

      const labList = await LabController.listLabs();
      if (labList) {
        setLabs(labList);
      }

      const teacherResponse = await TeacherController.listTeachers();
      if (teacherResponse.ok) {
        setTeachers(teacherResponse.data);
      }

      if (labList.length > 0) {
        setSelectedLab(labList[0]);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const table: SchedulingTable[] = schedulings.map((scheduling) => ({
      Aula: scheduling.title,
      Inicio: format(scheduling.startDate, "dd/MM/yyyy HH:mm"),
      Fim: format(scheduling.endDate, "dd/MM/yyyy HH:mm"),
      Lab: labs.find((lab) => lab.id === scheduling.laboratory)?.code,
      Professor: teachers.find(
        (teacher) => teacher.id === scheduling.created_by
      )?.name,
    }));

    setSchedulingsTable(table);
    setUpdateSchedulingTableKey((prevKey) => prevKey + 1);
  }, [schedulings, labs, teachers]);

  const handleChangeScheduler = async () => {
    const response = await SchedulingController.listSchedulings();
    if (response.ok) {
      const arr = [...response.data];
      setSchedulings(arr);
      setUpdateSchedulingKey((prevKey) => prevKey + 1);
    }
  };

  const renderScheduler = (selectedLab: any) => {
    if (selectedLab) {
      const filtered = schedulings.filter(
        (scheduling) => scheduling.laboratory === selectedLab.id
      );

      return (
        <SchedulingComponent
          key={updateSchedulingKey}
          schedulings={filtered}
          selectedLabCode={selectedLab.code}
          selectedLabId={selectedLab.id}
          onChangedSchedules={handleChangeScheduler}
        />
      );
    }

    return null;
  };

  const renderSchedulingTable = () => {
    return (
      <DataTableComponent
        key={updateSchedulingTableKey}
        products={schedulingTable}
        collumns={
          schedulingTable.length > 0 ? Object.keys(schedulingTable[0]) : []
        }
      />
    );
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
        return <div>{renderSchedulingTable()}</div>;
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
