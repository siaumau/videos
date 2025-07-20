<template>
  <div class="welcome-container">
    <!-- 歡迎區塊 -->
    <div class="welcome-header">
      <div class="welcome-content">
        <h1 class="welcome-title">歡迎使用影視產業財務管理系統</h1>
        <p class="welcome-subtitle">一站式財務管理解決方案，從預算規劃到實際支出全程監控</p>
      </div>
      <div class="system-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="總模組數" :value="11" />
              <template #suffix>
                <el-icon class="stat-icon"><Grid /></el-icon>
              </template>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="財務管理模組" :value="7" />
              <template #suffix>
                <el-icon class="stat-icon"><Money /></el-icon>
              </template>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="營運管理模組" :value="2" />
              <template #suffix>
                <el-icon class="stat-icon"><Operation /></el-icon>
              </template>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="系統管理模組" :value="2" />
              <template #suffix>
                <el-icon class="stat-icon"><Setting /></el-icon>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 系統特色 -->
    <div class="features-section">
      <h2 class="section-title">系統特色</h2>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon class="feature-icon"><TrendCharts /></el-icon>
              <h3>預算差異分析</h3>
              <p>所有模組均內建預算與實際費用差異分析機制，即時發現超支或節餘並提醒管理者調整。</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon class="feature-icon"><Connection /></el-icon>
              <h3>會計軟體整合</h3>
              <p>支援與 QuickBooks、Xero 等主流會計系統整合，實現財務數據同步。</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-content">
              <el-icon class="feature-icon"><Lock /></el-icon>
              <h3>權限控制</h3>
              <p>採用 RBAC 角色權限管理，確保使用者只可存取授權範圍內的功能與資料。</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速入門 -->
    <div class="quick-start-section">
      <h2 class="section-title">快速入門</h2>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card class="quick-start-card">
            <template #header>
              <div class="card-header">
                <el-icon><Money /></el-icon>
                <span>財務管理</span>
              </div>
            </template>
            <div class="module-list">
              <el-button 
                v-for="module in financeModules" 
                :key="module.key"
                type="text" 
                class="module-link"
                @click="goToModule(module.key)"
              >
                <el-icon><component :is="module.icon" /></el-icon>
                {{ module.name }}
              </el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="quick-start-card">
            <template #header>
              <div class="card-header">
                <el-icon><Operation /></el-icon>
                <span>營運管理</span>
              </div>
            </template>
            <div class="module-list">
              <el-button 
                v-for="module in operationModules" 
                :key="module.key"
                type="text" 
                class="module-link"
                @click="goToModule(module.key)"
              >
                <el-icon><component :is="module.icon" /></el-icon>
                {{ module.name }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 系統版本資訊 -->
    <div class="version-info">
      <el-card class="version-card">
        <div class="version-content">
          <div class="version-left">
            <h3>系統版本資訊</h3>
            <p><strong>版本：</strong>v1.0.0 開發預覽版</p>
            <p><strong>更新日期：</strong>{{ new Date().toLocaleDateString('zh-TW') }}</p>
            <p><strong>技術架構：</strong>Vue.js 3 + Element Plus + TypeScript</p>
          </div>
          <div class="version-right">
            <el-button type="primary" @click="goToModule('dashboard')">
              <el-icon><DataAnalysis /></el-icon>
              查看儀表板
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  Grid,
  Money,
  Operation,
  Setting,
  TrendCharts,
  Connection,
  Lock,
  DataAnalysis,
  UserFilled,
  Camera,
  OfficeBuilding,
  Promotion,
  Film,
  Document,
  DocumentCopy,
  Calendar,
  Clock
} from '@element-plus/icons-vue'

const router = useRouter()

const financeModules = [
  { key: 'payroll', name: '員工薪資管理', icon: 'UserFilled' },
  { key: 'equipment', name: '影視器材管理', icon: 'Camera' },
  { key: 'venue', name: '場地租金管理', icon: 'OfficeBuilding' },
  { key: 'marketing', name: '行銷推廣支出', icon: 'Promotion' },
  { key: 'production', name: '製作成本控制', icon: 'Film' },
  { key: 'admin-expense', name: '行政管理費用', icon: 'Document' },
  { key: 'tax', name: '稅務財務支出', icon: 'DocumentCopy' }
]

const operationModules = [
  { key: 'schedule', name: '排班行事曆', icon: 'Calendar' },
  { key: 'attendance', name: '考勤管理', icon: 'Clock' }
]

const goToModule = (moduleKey: string) => {
  router.push(`/modules/${moduleKey}`)
}
</script>

<style scoped>
.welcome-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.welcome-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.welcome-content {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.system-stats {
  margin-top: 24px;
}

.stat-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card :deep(.el-statistic__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stat-icon {
  font-size: 20px;
  color: #667eea;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 24px 0;
  text-align: center;
}

.features-section {
  margin-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto 40px auto;
  width: 100%;
}

.feature-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-content {
  text-align: center;
  padding: 20px 16px;
}

.feature-icon {
  font-size: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.feature-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.feature-content p {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
}

.quick-start-section {
  margin-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto 40px auto;
  width: 100%;
}

.quick-start-card {
  height: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-link {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.module-link:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  transform: translateX(4px);
}

.version-info {
  margin-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto 40px auto;
  width: 100%;
}

.version-card {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.version-card :deep(.el-card__body) {
  background: transparent;
}

.version-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.version-left h3 {
  margin: 0 0 12px 0;
  color: white;
}

.version-left p {
  margin: 4px 0;
  opacity: 0.9;
}

.version-right {
  text-align: right;
}
</style>