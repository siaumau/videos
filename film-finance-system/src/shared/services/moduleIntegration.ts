/**
 * 模組間數據整合服務
 * 確保各模組間的數據流正確且一致
 */

import { employeeApi } from '@/modules/employees/services/employeeApi'
import type { Employee } from '@/modules/employees/types/employee'

export interface PayrollEmployeeData {
  id: number
  name: string
  baseSalary: number
  allowances: number
  laborInsuranceLevel: number
  healthInsuranceLevel: number
  laborInsuranceFee: number
  healthInsuranceFee: number
  pensionContribution: number
}

export interface InsuranceRates {
  laborInsurance: {
    employeeFee: number
    employerFee: number
    pensionContribution: number
  }
  healthInsurance: {
    employeeFee: number
    employerFee: number
    supplementaryFeeRate: number
  }
}

export class ModuleIntegrationService {
  /**
   * 為薪資計算獲取員工完整資料
   */
  static async getEmployeeForPayroll(employeeId: number): Promise<PayrollEmployeeData | null> {
    try {
      const employee = await employeeApi.getEmployeeById(employeeId)
      if (!employee) return null

      // 獲取勞健保費率
      const laborRates = await this.getLaborInsuranceRates(employee.laborInsurance.level)
      const healthRates = await this.getHealthInsuranceRates(employee.healthInsurance.level)

      return {
        id: employee.id!,
        name: employee.name,
        baseSalary: employee.salary.baseSalary,
        allowances: employee.salary.allowances,
        laborInsuranceLevel: employee.laborInsurance.level,
        healthInsuranceLevel: employee.healthInsurance.level,
        laborInsuranceFee: laborRates.employeeFee,
        healthInsuranceFee: healthRates.employeeFee,
        pensionContribution: laborRates.pensionContribution
      }
    } catch (error) {
      console.error('獲取薪資計算員工資料失敗:', error)
      return null
    }
  }

  /**
   * 批量獲取員工薪資計算資料
   */
  static async getEmployeesForPayroll(employeeIds: number[]): Promise<PayrollEmployeeData[]> {
    const results = await Promise.allSettled(
      employeeIds.map(id => this.getEmployeeForPayroll(id))
    )

    return results
      .filter((result): result is PromiseFulfilledResult<PayrollEmployeeData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  }

  /**
   * 獲取勞保費率
   */
  static async getLaborInsuranceRates(level: number): Promise<InsuranceRates['laborInsurance']> {
    try {
      const levels = await employeeApi.getLaborInsuranceLevels()
      const levelData = levels.find(l => l.level === level)
      
      if (!levelData) {
        throw new Error(`勞保級距 ${level} 不存在`)
      }

      // 計算各項費率（這裡使用模擬數據，實際應從 API 獲取）
      const insuredSalary = levelData.amount
      const employeeFee = Math.round(insuredSalary * 0.2 * 0.105) // 勞工負擔 20%，費率 10.5%
      const employerFee = Math.round(insuredSalary * 0.7 * 0.105) // 雇主負擔 70%
      const pensionContribution = Math.round(insuredSalary * 0.06) // 勞退提撥 6%

      return {
        employeeFee,
        employerFee,
        pensionContribution
      }
    } catch (error) {
      console.error('獲取勞保費率失敗:', error)
      throw error
    }
  }

  /**
   * 獲取健保費率
   */
  static async getHealthInsuranceRates(level: number): Promise<InsuranceRates['healthInsurance']> {
    try {
      const levels = await employeeApi.getHealthInsuranceLevels()
      const levelData = levels.find(l => l.level === level)
      
      if (!levelData) {
        throw new Error(`健保級距 ${level} 不存在`)
      }

      // 計算各項費率（模擬數據）
      const insuredSalary = levelData.amount
      const employeeFee = Math.round(insuredSalary * 0.3 * 0.0517) // 個人負擔 30%，費率 5.17%
      const employerFee = Math.round(insuredSalary * 0.6 * 0.0517) // 雇主負擔 60%
      const supplementaryFeeRate = 0.0211 // 補充保費費率 2.11%

      return {
        employeeFee,
        employerFee,
        supplementaryFeeRate
      }
    } catch (error) {
      console.error('獲取健保費率失敗:', error)
      throw error
    }
  }

  /**
   * 驗證員工是否存在且狀態為活躍
   */
  static async validateActiveEmployee(employeeId: number): Promise<boolean> {
    try {
      const employee = await employeeApi.getEmployeeById(employeeId)
      return employee?.status === 'active'
    } catch (error) {
      console.error('驗證員工狀態失敗:', error)
      return false
    }
  }

  /**
   * 獲取部門所有活躍員工
   */
  static async getActiveDepartmentEmployees(department: string): Promise<Employee[]> {
    try {
      const result = await employeeApi.getEmployees({
        department,
        status: 'active',
        pageSize: 1000 // 獲取所有員工
      })
      return result.data
    } catch (error) {
      console.error('獲取部門員工失敗:', error)
      return []
    }
  }

  /**
   * 同步員工薪資資料變更
   * 當員工基本資料或勞健保資料變更時，通知薪資模組更新
   */
  static async notifyPayrollUpdate(employeeId: number, changeType: 'salary' | 'insurance' | 'status') {
    try {
      // TODO: 實現薪資模組更新通知
      console.log(`通知薪資模組：員工 ${employeeId} 的 ${changeType} 資料已變更`)
      
      // 可以考慮使用事件總線或者直接調用薪資模組的更新方法
      // EventBus.emit('employee-data-changed', { employeeId, changeType })
    } catch (error) {
      console.error('通知薪資模組更新失敗:', error)
    }
  }
}

export default ModuleIntegrationService