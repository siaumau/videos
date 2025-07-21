<template>
  <div class="labor-insurance-container">
    <!-- 面包屑導航 -->
    <el-breadcrumb separator="/" class="breadcrumb" role="navigation">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>人力資源</el-breadcrumb-item>
      <el-breadcrumb-item>勞健保資訊管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 模組標題 -->
    <div class="module-header">
      <div class="title-section">
        <el-icon class="module-icon">
          <DocumentCopy />
        </el-icon>
        <div>
          <h1 class="module-title">勞健保資訊管理</h1>
          <p class="module-subtitle">管理勞保健保級距、費率設定與員工保險狀況</p>
        </div>
      </div>
      <div class="action-section">
        <el-tag type="success" effect="dark">已上線</el-tag>
        <el-button type="primary" @click="handleUpdateRates">更新費率</el-button>
        <el-button @click="handleExport">匯出報表</el-button>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="module-content">
      <el-tabs v-model="activeTab" class="insurance-tabs">
      <!-- 勞保級距管理 -->
      <el-tab-pane label="勞保級距" name="labor">
        <div class="tab-content">
          <div class="section-header">
            <h3>勞保投保級距表</h3>
            <el-button size="small" @click="handleAddLaborLevel">新增級距</el-button>
          </div>
          
          <el-table :data="laborLevels" stripe>
            <el-table-column prop="level" label="級距" width="80" />
            <el-table-column prop="salaryRange" label="月投保薪資範圍" width="200">
              <template #default="{ row }">
                {{ formatCurrency(row.minSalary) }} - {{ formatCurrency(row.maxSalary) }}
              </template>
            </el-table-column>
            <el-table-column prop="insuredSalary" label="月投保薪資" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.insuredSalary) }}
              </template>
            </el-table-column>
            <el-table-column prop="employeeFee" label="個人負擔" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.employeeFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="employerFee" label="雇主負擔" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.employerFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="pensionContribution" label="勞退提撥" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.pensionContribution) }}
              </template>
            </el-table-column>
            <el-table-column label="員工人數" width="100">
              <template #default="{ row }">
                {{ getLevelEmployeeCount(row.level, 'labor') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditLevel(row, 'labor')">編輯</el-button>
                <el-button size="small" type="danger" @click="handleDeleteLevel(row, 'labor')">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 健保級距管理 -->
      <el-tab-pane label="健保級距" name="health">
        <div class="tab-content">
          <div class="section-header">
            <h3>全民健保投保級距表</h3>
            <el-button size="small" @click="handleAddHealthLevel">新增級距</el-button>
          </div>
          
          <el-table :data="healthLevels" stripe>
            <el-table-column prop="level" label="級距" width="80" />
            <el-table-column prop="salaryRange" label="月投保薪資範圍" width="200">
              <template #default="{ row }">
                {{ formatCurrency(row.minSalary) }} - {{ formatCurrency(row.maxSalary) }}
              </template>
            </el-table-column>
            <el-table-column prop="insuredSalary" label="月投保薪資" width="120">
              <template #default="{ row }">
                {{ formatCurrency(row.insuredSalary) }}
              </template>
            </el-table-column>
            <el-table-column prop="employeeFee" label="個人負擔" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.employeeFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="employerFee" label="雇主負擔" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.employerFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="supplementaryFee" label="補充保費" width="100">
              <template #default="{ row }">
                {{ formatPercentage(row.supplementaryFee) }}
              </template>
            </el-table-column>
            <el-table-column label="員工人數" width="100">
              <template #default="{ row }">
                {{ getLevelEmployeeCount(row.level, 'health') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditLevel(row, 'health')">編輯</el-button>
                <el-button size="small" type="danger" @click="handleDeleteLevel(row, 'health')">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 員工保險資訊 -->
      <el-tab-pane label="員工保險狀況" name="employees">
        <div class="tab-content">
          <div class="section-header">
            <h3>員工勞健保投保狀況</h3>
            <div class="filters">
              <el-input
                v-model="employeeFilter"
                placeholder="搜尋員工姓名"
                style="width: 200px"
                clearable
              />
              <el-button @click="fetchEmployeeInsurance">搜尋</el-button>
            </div>
          </div>

          <el-table :data="employeeInsurance" stripe>
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="idNumber" label="身分證字號" width="140">
              <template #default="{ row }">
                {{ formatIdNumber(row.idNumber) }}
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部門" width="100">
              <template #default="{ row }">
                {{ formatDepartment(row.department) }}
              </template>
            </el-table-column>
            <el-table-column prop="laborLevel" label="勞保級距" width="100" />
            <el-table-column prop="laborFee" label="勞保費" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.laborFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="healthLevel" label="健保級距" width="100" />
            <el-table-column prop="healthFee" label="健保費" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.healthFee) }}
              </template>
            </el-table-column>
            <el-table-column prop="pensionContribution" label="勞退提撥" width="100">
              <template #default="{ row }">
                {{ formatCurrency(row.pensionContribution) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditEmployee(row)">調整</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 編輯級距對話框 -->
    <InsuranceLevelDialog
      v-model="dialogVisible"
      :level-data="currentLevel"
      :type="editType"
      @confirm="handleLevelConfirm"
    />

    <!-- 員工保險調整對話框 -->
    <EmployeeInsuranceDialog
      v-model="employeeDialogVisible"
      :employee="currentEmployee"
      @confirm="handleEmployeeConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { formatCurrency, formatPercentage, formatIdNumber, formatDepartment } from '@/shared/utils/format'
import InsuranceLevelDialog from '../components/InsuranceLevelDialog.vue'
import EmployeeInsuranceDialog from '../components/EmployeeInsuranceDialog.vue'

const activeTab = ref('labor')
const dialogVisible = ref(false)
const employeeDialogVisible = ref(false)
const employeeFilter = ref('')
const editType = ref<'labor' | 'health'>('labor')

const laborLevels = ref([])
const healthLevels = ref([])
const employeeInsurance = ref([])
const currentLevel = ref(null)
const currentEmployee = ref(null)

const getLevelEmployeeCount = (level: number, type: 'labor' | 'health') => {
  return employeeInsurance.value.filter((emp: any) => 
    type === 'labor' ? emp.laborLevel === level : emp.healthLevel === level
  ).length
}

const fetchLaborLevels = async () => {
  // TODO: 實現 API 調用
  console.log('獲取勞保級距')
}

const fetchHealthLevels = async () => {
  // TODO: 實現 API 調用
  console.log('獲取健保級距')
}

const fetchEmployeeInsurance = async () => {
  // TODO: 實現 API 調用
  console.log('獲取員工保險資訊')
}

const handleAddLaborLevel = () => {
  editType.value = 'labor'
  currentLevel.value = null
  dialogVisible.value = true
}

const handleAddHealthLevel = () => {
  editType.value = 'health'
  currentLevel.value = null
  dialogVisible.value = true
}

const handleEditLevel = (level: any, type: 'labor' | 'health') => {
  editType.value = type
  currentLevel.value = level
  dialogVisible.value = true
}

const handleDeleteLevel = async (level: any, type: 'labor' | 'health') => {
  // TODO: 實現刪除邏輯
  ElMessage.success('刪除成功')
}

const handleEditEmployee = (employee: any) => {
  currentEmployee.value = employee
  employeeDialogVisible.value = true
}

const handleLevelConfirm = () => {
  dialogVisible.value = false
  if (editType.value === 'labor') {
    fetchLaborLevels()
  } else {
    fetchHealthLevels()
  }
}

const handleEmployeeConfirm = () => {
  employeeDialogVisible.value = false
  fetchEmployeeInsurance()
}

const handleUpdateRates = () => {
  ElMessage.info('更新費率功能開發中')
}

const handleExport = () => {
  ElMessage.info('匯出報表功能開發中')
}

onMounted(() => {
  fetchLaborLevels()
  fetchHealthLevels()
  fetchEmployeeInsurance()
})
</script>

<style scoped>
.labor-insurance-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.breadcrumb {
  margin-bottom: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.module-icon {
  font-size: 32px;
  color: #409eff;
}

.module-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.module-subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.insurance-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.tab-content {
  padding: 20px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  color: #303133;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>