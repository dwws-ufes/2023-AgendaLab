import React from 'react';
import {useState} from 'react'
import SchedulingComponent from '../components/scheduler';
import HeaderComponent from '../components/headerComponent';
import { TabView, TabPanel } from 'primereact/tabview';
import { appointments } from '../demo/appointments';
import DataTableComponent from '../components/dataTable';

function SchedulingPage() {

  const [activeIndex, setActiveIndex] = useState(0);

  const titles = [ 'title',
    'id',
    'location'
  ]

  return (
    <div className='vh-100'>
      <HeaderComponent/>
      <div className='d-flex' style={{height: "calc(100vh - 60px)"}}>
        <div className='bg-red w-25 d-flex justify-content-center pt-5'>
          <div className='bg-primary h-100 w-50 rounded d-flex flex-column justify-content-center align-items-center'>
            <div className='btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column' style={{height: "160px", width: "160px"}} onClick={() => setActiveIndex(0)}>
              <i className="pi pi-calendar" style={{ fontSize: '3rem' }}></i>
              Agenda
            </div>
            <div className='btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column' style={{height: "160px", width: "160px"} } onClick={() => setActiveIndex(1)}>
              <i className="pi pi-bookmark" style={{ fontSize: '3rem' }}></i>
              Agendamentos
            </div>
            <div className='btn btn-outline-light my-5 d-flex align-items-center justify-content-evenly flex-column' style={{height: "160px", width: "160px"}} onClick={() => setActiveIndex(2)}>
              <i className="pi pi-book" style={{ fontSize: '3rem' }}></i>
              Cadastros
            </div>
          </div>
        </div>
        <div className='w-75' style={{overflow:"auto"}}>
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel>
            <SchedulingComponent/>
          </TabPanel>
          <TabPanel>
              <DataTableComponent products={appointments} collumns={titles}/>
          </TabPanel>
          <TabPanel>
              <p className="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                  quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                  culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. 
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
              </p>
          </TabPanel>
        </TabView>
        </div>
      </div>
    </div>
  )
}

export default SchedulingPage;
