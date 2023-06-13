export interface Scheduling {
  id: number;
  notes: string;
  startDate: Date;
  endDate: Date;
  title: string;
  lab?: number;
  teacher?: number;
  rRule: string;
}
