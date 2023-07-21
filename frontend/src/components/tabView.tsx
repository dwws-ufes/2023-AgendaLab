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
      <TabPanel header="Sobre a UFES">
        <h2>{props.infoUfes.name}</h2>
        <p className="m-0 pt-2">
          {props.infoUfes.comment_pt}
        </p>
        <p className="m-0 pt-2">
          Ano de criação: {props.infoUfes.established}
        </p>

        <p className="m-0 pt-2">
          Reitor: {props.infoUfes.rector}
        </p>

        <p className="m-0 pt-2">
          Total de estudantes: {props.infoUfes.students}
        </p>

        
      </TabPanel>
    </TabView>
  );
}

export default TabViewComponent;
