import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function DataTableComponent(props: any) {
  return (
    <div className="card">
      <DataTable value={props.products} tableStyle={{ minWidth: "50rem" }}>
        {props.collumns.map((collumn: string) => (
          <Column
            field={collumn}
            header={collumn[0].toUpperCase() + collumn.slice(1).toLowerCase()}
          ></Column>
        ))}
      </DataTable>
    </div>
  );
}

export default DataTableComponent;
