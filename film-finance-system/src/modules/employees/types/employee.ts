export interface Employee {
  id?: number
  name: string
  idNumber: string
  position: string
  department: string
  hireDate: string
  salary: {
    baseSalary: number
    allowances: number
    totalSalary: number
  }
  laborInsurance: {
    level: number
    amount: number
    pensionContribution: number
  }
  healthInsurance: {
    level: number
    amount: number
  }
  status: 'active' | 'inactive' | 'terminated'
  createdAt?: string
  updatedAt?: string
}

export interface EmployeeFilters {
  name?: string
  department?: string
  position?: string
  status?: string
}

export interface EmployeeFormData {
  name: string
  idNumber: string
  position: string
  department: string
  hireDate: string
  baseSalary: number
  allowances: number
  laborInsuranceLevel: number
  healthInsuranceLevel: number
  status: 'active' | 'inactive' | 'terminated'
}