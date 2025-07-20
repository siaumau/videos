<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          影視產業財務管理系統
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          請登入您的帳號
        </p>
      </div>
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="rules" 
        class="mt-8 space-y-6"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="使用者名稱"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密碼"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember" label="記住我" />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            class="w-full"
            :loading="loading"
            @click="handleLogin"
          >
            登入
          </el-button>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <p class="text-sm text-gray-500">
          系統版本：v1.0.0 | 
          <el-button type="text" size="small">忘記密碼？</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '請輸入使用者名稱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度至少6個字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模擬登入 API 調用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 簡單的模擬驗證
    if (loginForm.username && loginForm.password) {
      ElMessage.success('登入成功！')
      // 存儲使用者信息到 localStorage (實際應用中應該使用更安全的方式)
      localStorage.setItem('userInfo', JSON.stringify({
        username: loginForm.username,
        role: loginForm.username === 'admin' ? '系統管理員' : '會計人員'
      }))
      router.push('/dashboard')
    } else {
      ElMessage.error('使用者名稱或密碼錯誤')
    }
  } catch (error) {
    ElMessage.error('登入失敗，請重試')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定義樣式 */
.el-form-item {
  margin-bottom: 24px;
}
</style>