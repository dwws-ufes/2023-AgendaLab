import { TabPanel, TabView } from "primereact/tabview";
import DataTableComponent from "./dataTable";

function TabViewComponent(props: any) {
  const teacherTableHeaders =
    props.teachersTable?.length > 0 ? Object.keys(props.teachersTable[0]) : [];

  const labTableHeaders =
    props.labTable?.length > 0 ? Object.keys(props.labTable[0]) : [];

  const departmentTableHeaders =
    props.departmentTable?.length > 0
      ? Object.keys(props.departmentTable[0])
      : [];

  return (
    <div>
      <div className="d-flex justify-content-end p-2">
        <button className="btn btn-outline-light">Adicionar</button>
      </div>
      <TabView>
        <TabPanel header="Professores">
          <DataTableComponent
            products={props.teachersTable}
            collumns={teacherTableHeaders}
          />
        </TabPanel>
        <TabPanel header="Laboratórios">
          <DataTableComponent
            products={props.labTable}
            collumns={labTableHeaders}
          />
        </TabPanel>
        <TabPanel header="Departamentos">
          <DataTableComponent
            products={props.departmentTable}
            collumns={departmentTableHeaders}
          />
        </TabPanel>
      </TabView>
    </div>
  );
}

export default TabViewComponent;
