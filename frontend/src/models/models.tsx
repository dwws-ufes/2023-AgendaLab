export interface Scheduling {
  id: number;
  notes: string;
  startDate: Date;
  endDate: Date;
  title: string;
  laboratory?: number;
  teacher?: number;
  rRule: string;
}
export interface Lab {
  id: number,
  code: string,
  num_computers: number,
  has_blackboard: boolean,
  created_by: number
}