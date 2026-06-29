export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface AuthResponse {
  token: string;
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: EmployeeRole;
}

export interface CurrentUser {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: EmployeeRole;
}