import React from 'react';

import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import SchedulingComponent from '../components/scheduler';

const currentDate = '2018-11-01';
const schedulerData = [
  {
    title: 'Website Re-Design Plan',
    startDate: new Date(2023, 5, 22, 9, 35),
    endDate: new Date(2018, 5, 22, 11, 30),
    id: 0,
    location: 'Room 1',
  }, {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2023, 5, 22, 12, 11),
    endDate: new Date(2023, 5, 22, 13, 0),
    id: 1,
    location: 'Room 1',
  }, 
];

function SchedulingPage() {
  return (
    <SchedulingComponent/>
  )
}

export default SchedulingPage;
