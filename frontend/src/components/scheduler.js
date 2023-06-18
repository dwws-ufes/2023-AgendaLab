import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import Grid from "@mui/material/Grid";
import {
  Scheduler,
  Toolbar,
  MonthView,
  WeekView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  DragDropProvider,
  EditRecurrenceMenu,
  AllDayPanel,
  TodayButton,
  DateNavigator,
  DayView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import SchedulingController from "../controllers/SchedulingController";
import TeacherController from "../controllers/TeachersController";
import AuthController from "../controllers/AuthController";

const PREFIX = "Demo";
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
};

const StyledFab = styled(Fab)(({ theme }) => ({
  [`&.${classes.addButton}`]: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(4),
  },
}));

export default class SchedulingComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.schedulings,
      currentDate: "2018-06-27",
      confirmationVisible: false,
      editingFormVisible: false,
      deletedAppointmentId: undefined,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      startDayHour: 9,
      endDayHour: 19,
      isNewAppointment: false,
      selectedLabCode: props.selectedLabCode,
      selectedLabId: props.selectedLabId,
    };

    this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
    this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
    this.toggleEditingFormVisibility =
      this.toggleEditingFormVisibility.bind(this);

    this.commitChanges = this.commitChanges.bind(this);
    this.onEditingAppointmentChange =
      this.onEditingAppointmentChange.bind(this);
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
  }

  componentDidUpdate() {
    // this.appointmentForm.update();
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment });
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment });
    const { editingAppointment } = this.state;
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment,
      });
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true });
  }

  setDeletedAppointmentId(id) {
    this.setState({ deletedAppointmentId: id });
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state;
    this.setState({
      editingFormVisible: !editingFormVisible,
    });
  }

  toggleConfirmationVisible() {
    const { confirmationVisible } = this.state;
    this.setState({ confirmationVisible: !confirmationVisible });
  }

  async commitDeletedAppointment() {
    const response = await SchedulingController.deleteScheduling(
      this.state.deletedAppointmentId
    );

    if (response.ok) {
      this.setState((state) => {
        const { data, deletedAppointmentId } = state;
        const nextData = data.filter(
          (appointment) => appointment.id !== deletedAppointmentId
        );

        return { data: nextData, deletedAppointmentId: null };
      });
      this.toggleConfirmationVisible();
      this.props.onChangedSchedules();
    }
  }

  async commitChanges({ added, changed, deleted }) {
    const userId = AuthController.getId();
    const response = await TeacherController.getTeacher(userId);
    const teacher = response?.data;

    if (!teacher || !teacher.id) return;

    if (added) {
      const response = await SchedulingController.registerScheduling({
        ...added,
        laboratory: this.state.selectedLabId,
        created_by: teacher.id,
      });

      if (response.ok) {
        this.props.onChangedSchedules();
      }
    }

    if (changed) {
      const updateId = parseInt(Object.keys(changed)[0]);

      const updateObj = changed[updateId];

      const oldObj = SchedulingController.schedules.find(
        (scheduler) => scheduler.id === updateId
      );

      const response = await SchedulingController.updateScheduling(updateId, {
        title: updateObj.title,
        description: updateObj.notes,
        start_time: updateObj.startDate || oldObj.startDate,
        end_time: updateObj.endDate || oldObj.endDate,
      });

      if (response.ok) {
        this.props.onChangedSchedules();
      }
    }

    this.setState((state) => {
      let { data } = state;
      if (added) {
        data = SchedulingController.schedules;
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        this.setDeletedAppointmentId(deleted);
        this.toggleConfirmationVisible();
      }
      return { data, addedAppointment: {} };
    });
  }

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

  render() {
    const {
      currentDate,
      data,
      confirmationVisible,
      editingFormVisible,
      startDayHour,
      endDayHour,
    } = this.state;

    const AppointmentContent = ({ style, ...restProps }) => {
      return (
        <Appointments.AppointmentContent {...restProps}>
          <div className={restProps.container}>
            <div>{restProps.data.location}</div>
            <div>{/*PUXAR NOME DA AULA*/ }RESERVADO</div>
          </div>
        </Appointments.AppointmentContent>
      );
    };

    const Content = ({ children, appointmentData, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      >
        <Grid container alignItems="center">
          <Grid item xs={10}>
            <span>{appointmentData.location}</span>
            <div>Your information</div>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    );

    return (
      <Paper>
        <Scheduler data={data}>
          <ViewState defaultCurrentDate="2018-07-27" />
          <EditingState
            onCommitChanges={this.commitChanges}
            onEditingAppointmentChange={this.onEditingAppointmentChange}
            onAddedAppointmentChange={this.onAddedAppointmentChange}
          />
          <DayView startDayHour={0} endDayHour={24} />
          <WeekView startDayHour={startDayHour} endDayHour={endDayHour} />
          <MonthView />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <Appointments
            appointmentContentComponent={AppointmentContent}
            // appointmentContentComponent={AppointmentContent}
          />
          <AppointmentTooltip
            showOpenButton
            showCloseButton
            showDeleteButton
            contentComponent={Content}
          />
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <AppointmentForm
            visible={editingFormVisible}
            onVisibilityChange={this.toggleEditingFormVisibility}
          />
          <DragDropProvider />
        </Scheduler>

        <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
          <DialogTitle>Delete Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this appointment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.toggleConfirmationVisible}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={this.commitDeletedAppointment}
              color="secondary"
              variant="outlined"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <StyledFab
          color="secondary"
          className={classes.addButton}
          onClick={() => {
            this.setState({ editingFormVisible: true });
            this.onEditingAppointmentChange(undefined);
            this.onAddedAppointmentChange({
              startDate: new Date(currentDate).setHours(startDayHour),
              endDate: new Date(currentDate).setHours(startDayHour + 1),
            });
          }}
        >
          <AddIcon />
        </StyledFab>
      </Paper>
    );
  }
}
