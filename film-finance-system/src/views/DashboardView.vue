<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1 class="system-title">影視產業財務管理系統</h1>
      </div>
      <div class="header-right">
        <span class="welcome-text">歡迎, {{ userInfo.username }}</span>
        <el-tag :type="getRoleType(userInfo.role)" class="role-tag">{{ userInfo.role }}</el-tag>
        <el-button type="primary" plain @click="handleLogout">登出</el-button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Sidebar -->
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
          router
        >
          <!-- 財務管理模組群 -->
          <el-sub-menu index="finance">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>財務管理</span>
            </template>
            <el-menu-item index="/modules/payroll">
              <el-icon><UserFilled /></el-icon>
              員工薪資管理
            </el-menu-item>
            <el-menu-item index="/modules/equipment">
              <el-icon><Camera /></el-icon>
              影視器材管理
            </el-menu-item>
            <el-menu-item index="/modules/venue">
              <el-icon><OfficeBuilding /></el-icon>
              場地租金管理
            </el-menu-item>
            <el-menu-item index="/modules/marketing">
              <el-icon><Promotion /></el-icon>
              行銷推廣支出
            </el-menu-item>
            <el-menu-item index="/modules/production">
              <el-icon><Film /></el-icon>
              製作成本控制
            </el-menu-item>
            <el-menu-item index="/modules/admin-expense">
              <el-icon><Document /></el-icon>
              行政管理費用
            </el-menu-item>
            <el-menu-item index="/modules/tax">
              <el-icon><DocumentCopy /></el-icon>
              稅務財務支出
            </el-menu-item>
          </el-sub-menu>

          <!-- 營運管理模組群 -->
          <el-sub-menu index="operation">
            <template #title>
              <el-icon><Operation /></el-icon>
              <span>營運管理</span>
            </template>
            <el-menu-item index="/modules/schedule">
              <el-icon><Calendar /></el-icon>
              排班行事曆
            </el-menu-item>
            <el-menu-item index="/modules/attendance">
              <el-icon><Clock /></el-icon>
              考勤管理
            </el-menu-item>
          </el-sub-menu>

          <!-- 系統管理 -->
          <el-sub-menu index="system" v-if="userInfo.role === '系統管理員'">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系統管理</span>
            </template>
            <el-menu-item index="/modules/permission">
              <el-icon><Lock /></el-icon>
              權限帳號管理
            </el-menu-item>
          </el-sub-menu>

          <!-- 報表分析 -->
          <el-menu-item index="/modules/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>儀表板分析</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Money,
  UserFilled,
  Camera,
  OfficeBuilding,
  Promotion,
  Film,
  Document,
  DocumentCopy,
  Operation,
  Calendar,
  Clock,
  Setting,
  Lock,
  DataAnalysis
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('')
const userInfo = ref({
  username: '',
  role: ''
})

onMounted(() => {
  // 獲取使用者信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  } else {
    router.push('/login')
  }
  
  // 設置當前活躍菜單
  activeMenu.value = route.path
})

const getRoleType = (role: string) => {
  switch (role) {
    case '系統管理員':
      return 'danger'
    case '會計人員':
      return 'warning'
    case '製片':
      return 'info'
    default:
      return 'info'
  }
}

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

const handleLogout = () => {
  ElMessage.success('已登出')
  localStorage.removeItem('userInfo')
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.header {
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.system-title {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.role-tag {
  margin-left: 8px;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background: #2c3e50;
  border-right: none;
  overflow-y: auto;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  border: none;
  height: 100%;
  background: #2c3e50;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
  padding-left: 24px !important;
  color: #ecf0f1 !important;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #34495e !important;
  color: #3498db !important;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  padding-left: 48px !important;
  color: #bdc3c7 !important;
  background-color: #34495e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: #3498db !important;
  color: white !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #e74c3c !important;
  color: white !important;
  border-right: 3px solid #c0392b;
}

.sidebar-menu :deep(.el-sub-menu .el-menu) {
  background-color: #34495e;
}

.sidebar-menu :deep(.el-sub-menu__icon-arrow) {
  color: #ecf0f1 !important;
}

.content-area {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 64px);
}
</style>