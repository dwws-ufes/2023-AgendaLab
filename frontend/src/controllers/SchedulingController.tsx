import SchedulingService from '../services/SchedulingService'

class SchedulingController {

    static registerScheduling = () => {
         
    }

    static updateScheduling = () => {
         
    }

    static registerManyScheduling = () => {
         
    }

    static deleteScheduling = () => {
         
    }

    static getScheduling = () => {
         
    }

    static listSchedulings = async () => {
        const response = await SchedulingService.listSchedulings()
        const schedulings = response.map((scheduling: any) => ({id: 0, title: scheduling.title, desc:scheduling.description, startDate: new Date(scheduling.start_time), endDate:  new Date(scheduling.end_time)}))
        return schedulings
    }
    
}

export default SchedulingController;