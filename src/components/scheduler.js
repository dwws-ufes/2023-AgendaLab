import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DateNavigator,
  Toolbar,
  DayView,
  TodayButton,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

import Grid from '@mui/material/Grid';


import appointments from '../demo/today-appointments';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
} from '@devexpress/dx-react-scheduler-material-ui';

function SchedulingComponent() {
    const initialState = {
        data: [],
        loading: false,
        currentDate: '2017-05-23',
        currentViewName: 'Day',
        location: ''
      };

    const mapAppointmentData = (appointment) => ({
        id: appointment.id,
        startDate: appointment.start.dateTime,
        endDate: appointment.end.dateTime,
        title: appointment.summary,
        location: appointment.location,
    });
      
    const reducer = (state, action) => {
        switch (action.type) {
            case 'setLoading':
            return { ...state, loading: action.payload };
            case 'setData':
            return { ...state, data: action.payload.map(mapAppointmentData) };
            case 'setCurrentViewName':
            return { ...state, currentViewName: action.payload };
            case 'setCurrentDate':
            return { ...state, currentDate: action.payload };
            default:
            return state;
        }
    };
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const {
      data, loading, currentViewName, currentDate,
    } = state;
    const setCurrentViewName = React.useCallback((nextViewName) => dispatch({
      type: 'setCurrentViewName', payload: nextViewName,
    }), [dispatch]);
    const setData = React.useCallback((nextData) => dispatch({
      type: 'setData', payload: nextData,
    }), [dispatch]);
    const setCurrentDate = React.useCallback((nextDate) => dispatch({
      type: 'setCurrentDate', payload: nextDate,
    }), [dispatch]);
    const setLoading = React.useCallback((nextLoading) => dispatch({
      type: 'setLoading', payload: nextLoading,
    }), [dispatch]);


    // const CustomAppointment = ({ style, ...restProps }) => {
    //   if (restProps.data.location === "Room 1")
    //     return (
    //       <Appointments.Appointment
    //         {...restProps}
    //         style={{ ...style, backgroundColor: "red" }}
    //         className="CLASS_ROOM1"
    //         data={restProps.data.location}
    //       />
    //     );
    //   if (restProps.data.location === "Room 2")
    //     return (
    //       <Appointments.Appointment
    //         {...restProps}
    //         style={{ ...style, backgroundColor: "green" }}
    //         className="CLASS_ROOM2"
    //       />
    //     );
    //   return (
    //     <Appointments.Appointment
    //       {...restProps}
    //       style={style}
    //       className="CLASS_ROOM3"
    //     />
    //   );
    // };
        

    const AppointmentContent = ({ style, ...restProps }) => {
      return (
        <Appointments.AppointmentContent {...restProps}>
          <div className={restProps.container}>
            <div>{restProps.data.location}</div>
            <div>Your information</div>
          </div>
        </Appointments.AppointmentContent>
      );
    };

    const Content = (({
      children, appointmentData, ...restProps
    }) => (
      <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <span>{appointmentData.location}</span>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    ));

    return (
    <div className="scheduling-page">
        <Paper>
          <Scheduler
            data={appointments}
            height={600}
          >
            <ViewState
                currentDate={currentDate}
                currentViewName={currentViewName}
                onCurrentViewNameChange={setCurrentViewName}
                onCurrentDateChange={setCurrentDate}
            />
            <DayView
                startDayHour={7.5}
                endDayHour={17.5}
            />
            <WeekView
                startDayHour={7.5}
                endDayHour={17.5}
            />
            <Appointments
              appointmentContentComponent={AppointmentContent} 
              // appointmentContentComponent={AppointmentContent}
            />
            <Toolbar/>
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <AppointmentTooltip
                showCloseButton
                showOpenButton
                contentComponent={Content}
            />
            <AppointmentForm/>
          </Scheduler>
        </Paper>
    </div>
    )
}

export default SchedulingComponent;


