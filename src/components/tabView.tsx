

import { TabPanel, TabView } from 'primereact/tabview';
import DataTableComponent from './dataTable';
import { appointments } from '../demo/appointments';

function TabViewComponent() {

    const titles = [ 'title',
        'id',
        'location'
    ]

    return (
        <div>
            <TabView>
                <TabPanel header="Header I">
                    <DataTableComponent products={appointments} collumns={titles}/>
                </TabPanel>
                <TabPanel header="Header II">
                    <DataTableComponent products={appointments} collumns={titles}/>
                </TabPanel>
                <TabPanel header="Header III">
                    <DataTableComponent products={appointments} collumns={titles}/>
                </TabPanel>
            </TabView>
        </div>
    );
}

export default TabViewComponent;