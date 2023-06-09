export interface Scheduling {
  id: number;
  notes: string;
  startDate: Date;
  endDate: Date;
  title: string;
  laboratory: number;
  created_by: number;
  rRule?: string;
  allDay?: string;
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

export interface Department {
  id: number;
  code: string;
  name: string;
  opening_time: string;
  closing_time: string;
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

export interface SchedulingTable {
  Aula: string;
  Inicio: string;
  Fim: string;
  Lab?: string;
  Professor?: string;
}

export interface TeacherTable {
  Nome: string;
  Email: string;
  Registro: number;
  Departamento?: string;
}

export interface LabTable {
  Codigo: string;
  Computadores: number;
  Quadro: string;
  Departamento?: string;
}

export interface DepartmentTable {
  Codigo: string;
  Nome: string;
  Abertura: string;
  Fechamento: string;
}
