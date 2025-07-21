import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee, EmployeeFilters } from '../types/employee'
import { employeeApi } from '../services/employeeApi'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  
  const filters = ref<EmployeeFilters>({
    name: '',
    department: '',
    position: '',
    status: ''
  })

  const activeEmployees = computed(() => 
    employees.value.filter(emp => emp.status === 'active')
  )

  const departmentStats = computed(() => {
    const stats: Record<string, number> = {}
    employees.value.forEach(emp => {
      stats[emp.department] = (stats[emp.department] || 0) + 1
    })
    return stats
  })

  const totalSalaryCost = computed(() => {
    return activeEmployees.value.reduce((sum, emp) => {
      return sum + emp.salary.totalSalary
    }, 0)
  })

  const fetchEmployees = async (params?: {
    page?: number
    pageSize?: number
    filters?: EmployeeFilters
  }) => {
    loading.value = true
    try {
      const { page = 1, pageSize: size = 20, filters: searchFilters } = params || {}
      
      const result = await employeeApi.getEmployees({
        page,
        pageSize: size,
        ...searchFilters
      })
      
      employees.value = result.data
      total.value = result.total
      currentPage.value = page
      pageSize.value = size
      
      if (searchFilters) {
        filters.value = { ...searchFilters }
      }
    } catch (error) {
      console.error('獲取員工列表失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getEmployeeById = async (id: number): Promise<Employee | null> => {
    try {
      return await employeeApi.getEmployeeById(id)
    } catch (error) {
      console.error('獲取員工詳情失敗:', error)
      return null
    }
  }

  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEmployee = await employeeApi.createEmployee(employeeData)
      employees.value.unshift(newEmployee)
      total.value += 1
      return newEmployee
    } catch (error) {
      console.error('創建員工失敗:', error)
      throw error
    }
  }

  const updateEmployee = async (id: number, employeeData: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeeApi.updateEmployee(id, employeeData)
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      return updatedEmployee
    } catch (error) {
      console.error('更新員工失敗:', error)
      throw error
    }
  }

  const deleteEmployee = async (id: number) => {
    try {
      await employeeApi.deleteEmployee(id)
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value.splice(index, 1)
        total.value -= 1
      }
    } catch (error) {
      console.error('刪除員工失敗:', error)
      throw error
    }
  }

  const exportEmployees = async (format: 'excel' | 'pdf' = 'excel') => {
    try {
      return await employeeApi.exportEmployees(format, filters.value)
    } catch (error) {
      console.error('匯出員工資料失敗:', error)
      throw error
    }
  }

  const importEmployees = async (file: File) => {
    try {
      const result = await employeeApi.importEmployees(file)
      await fetchEmployees({ page: 1 })
      return result
    } catch (error) {
      console.error('匯入員工資料失敗:', error)
      throw error
    }
  }

  const searchEmployees = async (searchFilters: EmployeeFilters) => {
    await fetchEmployees({
      page: 1,
      pageSize: pageSize.value,
      filters: searchFilters
    })
  }

  const resetFilters = () => {
    filters.value = {
      name: '',
      department: '',
      position: '',
      status: ''
    }
  }

  const clearEmployees = () => {
    employees.value = []
    total.value = 0
    currentPage.value = 1
    resetFilters()
  }

  return {
    // State
    employees,
    loading,
    total,
    currentPage,
    pageSize,
    filters,
    
    // Getters
    activeEmployees,
    departmentStats,
    totalSalaryCost,
    
    // Actions
    fetchEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployees,
    importEmployees,
    searchEmployees,
    resetFilters,
    clearEmployees
  }
})