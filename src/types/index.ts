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
export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: EmployeeRole;
  departmentName: string | null;
  dateOfJoining: string | null;
  active: boolean;
}

export interface AttendanceRecord {
  id: number;
  attendanceDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
}

export interface LeaveRequestItem {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
  employee?: { firstName: string; lastName: string };
}

export interface Payslip {
  id: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyanceAllowance: number;
  medicalAllowance: number;
  grossSalary: number;
  pfDeduction: number;
  professionalTax: number;
  netSalary: number;
}

export interface PerformanceReviewItem {
  id: number;
  reviewYear: number;
  reviewPeriod: string;
  goals: string;
  achievements: string | null;
  managerFeedback: string | null;
  rating: number | null;
  status: 'DRAFT' | 'SUBMITTED' | 'ACKNOWLEDGED';
}
export interface AttritionInsight {
  employeeId: number;
  employeeName: string;
  leaveCount: number;
  latestRating: number | null;
  tenureMonths: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}