import axios from 'axios'
import type { Employee, EmployeeFilters } from '../types/employee'

const API_BASE = '/api/employees'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface EmployeeQueryParams extends EmployeeFilters {
  page?: number
  pageSize?: number
}

export const employeeApi = {
  async getEmployees(params: EmployeeQueryParams = {}): Promise<PaginatedResponse<Employee>> {
    const response = await axios.get(API_BASE, { params })
    return response.data
  },

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await axios.get(`${API_BASE}/${id}`)
    return response.data
  },

  async createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const response = await axios.post(API_BASE, employee)
    return response.data
  },

  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    const response = await axios.put(`${API_BASE}/${id}`, employee)
    return response.data
  },

  async deleteEmployee(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`)
  },

  async exportEmployees(format: 'excel' | 'pdf' = 'excel', filters: EmployeeFilters = {}): Promise<Blob> {
    const response = await axios.get(`${API_BASE}/export`, {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  },

  async importEmployees(file: File): Promise<{ success: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axios.post(`${API_BASE}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async getDepartments(): Promise<string[]> {
    const response = await axios.get(`${API_BASE}/departments`)
    return response.data
  },

  async getPositions(): Promise<string[]> {
    const response = await axios.get(`${API_BASE}/positions`)
    return response.data
  },

  async getLaborInsuranceLevels(): Promise<{ level: number; amount: number }[]> {
    const response = await axios.get(`${API_BASE}/labor-insurance-levels`)
    return response.data
  },

  async getHealthInsuranceLevels(): Promise<{ level: number; amount: number }[]> {
    const response = await axios.get(`${API_BASE}/health-insurance-levels`)
    return response.data
  },

  async bulkUpdateStatus(ids: number[], status: 'active' | 'inactive' | 'terminated'): Promise<void> {
    await axios.patch(`${API_BASE}/bulk-status`, { ids, status })
  },

  async getDashboardStats(): Promise<{
    totalEmployees: number
    activeEmployees: number
    totalSalaryCost: number
    departmentStats: Record<string, number>
  }> {
    const response = await axios.get(`${API_BASE}/stats`)
    return response.data
  }
}