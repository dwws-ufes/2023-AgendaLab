export interface Scheduling {
  id: number;
  notes: string;
  startDate: Date;
  endDate: Date;
  title: string;
  laboratory: number;
  created_by: number;
  rRule?: string;
}

export interface SchedulingDB {
  id: number;
  code: number;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  repeat: boolean;
  laboratory: number;
  created_by: number;
}

export interface SchedulingSaveDTO {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  repeat: boolean;
  laboratory: number;
  created_by: number;
}

export interface SchedulingUpdateDTO {
  title: string;
  notes: string;
  startDate: Date;
  endDate: Date;
}

export interface ApiResponse {
  code?: number;
  data: any;
  ok: boolean;
}

export interface Lab {
  id: number;
  code: string;
  num_computers: number;
  has_blackboard: boolean;
  created_by: number;
}

export interface Teacher {
  id: number;
  password: string;
  last_login: Date;
  name: string;
  email: string;
  register: number;
  department: number;
}
