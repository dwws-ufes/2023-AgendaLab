import { TabPanel, TabView } from "primereact/tabview";
import DataTableComponent from "./dataTable";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from "react";
import { InputText } from "primereact/inputtext";

function TabViewComponent(props: any) {

  const [visible, setVisible] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (event: any) => {
    setActiveIndex(event.index);
  };

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
        <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
        <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        <span className="p-float-label">
            <InputText id="username" />
            <label htmlFor="username">Username</label>
        </span>
        </Dialog>
      </div>

      <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
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
