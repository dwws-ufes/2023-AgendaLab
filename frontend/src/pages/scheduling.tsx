import  { useEffect } from 'react';
import {useState} from 'react'
import SchedulingComponent from '../components/scheduler';
import HeaderComponent from '../components/headerComponent';
import DataTableComponent from '../components/dataTable';
import TabViewComponent from '../components/tabView';
import SchedulingController from '../controllers/SchedulingController'
import { Scheduling } from '../models/models';

function SchedulingPage() {

  const [activeIndex, setActiveIndex] = useState(0);

  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);

  useEffect(() => {
    async function fetchData() {
      const schedulingsList = await SchedulingController.listSchedulings()
      if (schedulingsList) {
        setSchedulings(schedulingsList)
      }
    }
    fetchData();
  }, [])

  const titles = [ 'title',
    'id',
    'location'
  ]

  const renderPage = () => {
    switch(activeIndex) {
      case 0:
        return <SchedulingComponent schedulings={schedulings}/>;
      case 1:
        return <DataTableComponent products={schedulings} collumns={titles}/>
      case 2:
        return <TabViewComponent/>
    }
  }

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
          <div className='p-2'>
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulingPage;
