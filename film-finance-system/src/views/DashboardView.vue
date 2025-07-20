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
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.system-title {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-text {
  color: #606266;
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
  width: 240px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  padding-left: 20px !important;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding-left: 40px !important;
}

.content-area {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
  padding: 20px;
}
</style>