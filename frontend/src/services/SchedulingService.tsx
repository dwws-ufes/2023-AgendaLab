
class SchedulingService {

    static addScheduling = () => {
        
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
        const response = await fetch(`http://localhost:8080/request/schedule`);
        const schedulings = await response.json();
        return schedulings
    }
    
}

export default SchedulingService;