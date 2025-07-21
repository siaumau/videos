export interface BaseEntity {
  id?: number
  createdAt?: string
  updatedAt?: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export type Status = 'active' | 'inactive' | 'terminated'

export interface SelectOption {
  label: string
  value: string | number
}

export interface TableColumn {
  prop: string
  label: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  label: string
  prop: string
  type: 'input' | 'select' | 'date' | 'daterange'
  options?: SelectOption[]
}

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv'
  filename?: string
  columns?: string[]
}

export type Permission = 
  | 'employee:read'
  | 'employee:write'
  | 'employee:delete'
  | 'payroll:read'
  | 'payroll:write'
  | 'admin:all'