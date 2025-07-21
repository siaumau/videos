<template>
  <div class="employee-list-container">
    <!-- 面包屑導航 -->
    <el-breadcrumb separator="/" class="breadcrumb" role="navigation">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>人力資源</el-breadcrumb-item>
      <el-breadcrumb-item>員工基本資料管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 模組標題 -->
    <div class="module-header">
      <div class="title-section">
        <el-icon class="module-icon">
          <User />
        </el-icon>
        <div>
          <h1 class="module-title">員工基本資料管理</h1>
          <p class="module-subtitle">管理員工基本資訊、職位配置與薪資結構設定</p>
        </div>
      </div>
      <div class="action-section">
        <el-tag type="success" effect="dark">已上線</el-tag>
        <el-button type="primary" @click="handleAdd">新增員工</el-button>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="module-content">
      <!-- 功能操作區域 -->
      <el-card class="content-card" shadow="never">
        <div class="filters">
      <el-form :model="filters" inline>
        <el-form-item label="姓名">
          <el-input v-model="filters.name" placeholder="請輸入姓名" clearable />
        </el-form-item>
        <el-form-item label="部門">
          <el-select v-model="filters.department" placeholder="請選擇部門" clearable>
            <el-option label="製作部" value="production" />
            <el-option label="會計部" value="accounting" />
            <el-option label="行政部" value="administration" />
            <el-option label="行銷部" value="marketing" />
          </el-select>
        </el-form-item>
        <el-form-item label="狀態">
          <el-select v-model="filters.status" placeholder="請選擇狀態" clearable>
            <el-option label="在職" value="active" />
            <el-option label="停職" value="inactive" />
            <el-option label="離職" value="terminated" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜尋</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

        <div class="toolbar">
          <el-button @click="handleExport">匯出 Excel</el-button>
          <el-upload
            :show-file-list="false"
            :before-upload="handleImport"
            accept=".xlsx,.xls"
          >
            <el-button>匯入 Excel</el-button>
          </el-upload>
        </div>
      </el-card>

      <!-- 員工列表 -->
      <el-card class="content-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><List /></el-icon>
            <span>員工清單</span>
          </div>
        </template>
        
        <el-table
      :data="employees"
      v-loading="loading"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="idNumber" label="身分證字號" />
      <el-table-column prop="position" label="職位" />
      <el-table-column prop="department" label="部門" />
      <el-table-column prop="salary.totalSalary" label="薪資" />
      <el-table-column prop="status" label="狀態">
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            size="small"
            @click="handleEdit(row)"
          >
            編輯
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>

    <EmployeeFormDialog
      v-model="dialogVisible"
      :employee="currentEmployee"
      @confirm="handleFormConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, List } from '@element-plus/icons-vue'
import type { Employee, EmployeeFilters } from '../types/employee'
import EmployeeFormDialog from '../components/EmployeeFormDialog.vue'

const employees = ref<Employee[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const currentEmployee = ref<Employee | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const filters = ref<EmployeeFilters>({
  name: '',
  department: '',
  position: '',
  status: ''
})

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    terminated: 'danger'
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '在職',
    inactive: '停職',
    terminated: '離職'
  }
  return textMap[status] || status
}

const fetchEmployees = async () => {
  loading.value = true
  try {
    // TODO: 實現 API 調用
    console.log('獲取員工列表')
  } catch (error) {
    ElMessage.error('獲取員工列表失敗')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentEmployee.value = null
  dialogVisible.value = true
}

const handleEdit = (employee: Employee) => {
  currentEmployee.value = employee
  dialogVisible.value = true
}

const handleDelete = async (employee: Employee) => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除員工 ${employee.name} 嗎？`,
      '刪除確認',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 實現刪除 API
    ElMessage.success('刪除成功')
    fetchEmployees()
  } catch {
    // 用戶取消刪除
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchEmployees()
}

const handleReset = () => {
  filters.value = {
    name: '',
    department: '',
    position: '',
    status: ''
  }
  fetchEmployees()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchEmployees()
}

const handleFormConfirm = () => {
  dialogVisible.value = false
  fetchEmployees()
}

const handleExport = () => {
  // TODO: 實現匯出功能
  ElMessage.info('匯出功能開發中')
}

const handleImport = (file: File) => {
  // TODO: 實現匯入功能
  ElMessage.info('匯入功能開發中')
  return false
}

onMounted(() => {
  fetchEmployees()
})
</script>

<style scoped>
.employee-list-container {
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

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.filters {
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>