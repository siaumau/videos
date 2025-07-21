<template>
  <el-dialog
    :model-value="modelValue"
    title="調整員工保險資訊"
    width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <!-- 員工基本資訊（只讀） -->
      <el-form-item label="員工姓名">
        <el-input :model-value="employee?.name" disabled />
      </el-form-item>

      <el-form-item label="身分證字號">
        <el-input :model-value="formatIdNumber(employee?.idNumber || '')" disabled />
      </el-form-item>

      <el-form-item label="部門">
        <el-input :model-value="formatDepartment(employee?.department || '')" disabled />
      </el-form-item>

      <el-divider content-position="left">勞保資訊</el-divider>

      <el-form-item label="勞保級距" prop="laborLevel">
        <el-select v-model="formData.laborLevel" style="width: 100%" @change="handleLaborLevelChange">
          <el-option
            v-for="level in laborLevels"
            :key="level.level"
            :label="`第${level.level}級 (${formatCurrency(level.amount)})`"
            :value="level.level"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="勞保費">
        <el-input :model-value="formatCurrency(formData.laborFee)" disabled />
      </el-form-item>

      <el-form-item label="勞退提撥">
        <el-input :model-value="formatCurrency(formData.pensionContribution)" disabled />
      </el-form-item>

      <el-divider content-position="left">健保資訊</el-divider>

      <el-form-item label="健保級距" prop="healthLevel">
        <el-select v-model="formData.healthLevel" style="width: 100%" @change="handleHealthLevelChange">
          <el-option
            v-for="level in healthLevels"
            :key="level.level"
            :label="`第${level.level}級 (${formatCurrency(level.amount)})`"
            :value="level.level"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="健保費">
        <el-input :model-value="formatCurrency(formData.healthFee)" disabled />
      </el-form-item>

      <el-divider content-position="left">生效日期</el-divider>

      <el-form-item label="異動生效日" prop="effectiveDate">
        <el-date-picker
          v-model="formData.effectiveDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="異動原因" prop="changeReason">
        <el-input
          v-model="formData.changeReason"
          type="textarea"
          :rows="3"
          placeholder="請輸入級距調整原因"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">確定調整</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { formatCurrency, formatIdNumber, formatDepartment } from '@/shared/utils/format'

interface Employee {
  id: number
  name: string
  idNumber: string
  department: string
  laborLevel: number
  healthLevel: number
  laborFee: number
  healthFee: number
  pensionContribution: number
}

interface InsuranceLevel {
  level: number
  amount: number
  employeeFee: number
  pensionContribution?: number
}

interface EmployeeInsuranceForm {
  laborLevel: number
  healthLevel: number
  laborFee: number
  healthFee: number
  pensionContribution: number
  effectiveDate: string
  changeReason: string
}

interface Props {
  modelValue: boolean
  employee?: Employee | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

const formRef = ref<FormInstance>()
const laborLevels = ref<InsuranceLevel[]>([])
const healthLevels = ref<InsuranceLevel[]>([])

const initFormData = (): EmployeeInsuranceForm => ({
  laborLevel: 1,
  healthLevel: 1,
  laborFee: 0,
  healthFee: 0,
  pensionContribution: 0,
  effectiveDate: '',
  changeReason: ''
})

const formData = reactive<EmployeeInsuranceForm>(initFormData())

const rules: FormRules = {
  laborLevel: [
    { required: true, message: '請選擇勞保級距', trigger: 'change' }
  ],
  healthLevel: [
    { required: true, message: '請選擇健保級距', trigger: 'change' }
  ],
  effectiveDate: [
    { required: true, message: '請選擇生效日期', trigger: 'change' }
  ],
  changeReason: [
    { required: true, message: '請輸入異動原因', trigger: 'blur' }
  ]
}

// 模擬數據，實際應從 API 獲取
const mockLaborLevels: InsuranceLevel[] = [
  { level: 1, amount: 25200, employeeFee: 504, pensionContribution: 1512 },
  { level: 2, amount: 26400, employeeFee: 528, pensionContribution: 1584 },
  { level: 3, amount: 27600, employeeFee: 552, pensionContribution: 1656 },
  { level: 4, amount: 28800, employeeFee: 576, pensionContribution: 1728 },
  { level: 5, amount: 30300, employeeFee: 606, pensionContribution: 1818 }
]

const mockHealthLevels: InsuranceLevel[] = [
  { level: 1, amount: 25200, employeeFee: 390 },
  { level: 2, amount: 26400, employeeFee: 408 },
  { level: 3, amount: 27600, employeeFee: 427 },
  { level: 4, amount: 28800, employeeFee: 446 },
  { level: 5, amount: 30300, employeeFee: 469 }
]

const fetchInsuranceLevels = async () => {
  try {
    // TODO: 實際 API 調用
    laborLevels.value = mockLaborLevels
    healthLevels.value = mockHealthLevels
  } catch (error) {
    console.error('獲取保險級距失敗:', error)
  }
}

const handleLaborLevelChange = (level: number) => {
  const selectedLevel = laborLevels.value.find(l => l.level === level)
  if (selectedLevel) {
    formData.laborFee = selectedLevel.employeeFee
    formData.pensionContribution = selectedLevel.pensionContribution || 0
  }
}

const handleHealthLevelChange = (level: number) => {
  const selectedLevel = healthLevels.value.find(l => l.level === level)
  if (selectedLevel) {
    formData.healthFee = selectedLevel.employeeFee
  }
}

watch(() => props.employee, (employee) => {
  if (employee) {
    Object.assign(formData, {
      laborLevel: employee.laborLevel,
      healthLevel: employee.healthLevel,
      laborFee: employee.laborFee,
      healthFee: employee.healthFee,
      pensionContribution: employee.pensionContribution,
      effectiveDate: '',
      changeReason: ''
    })
  } else {
    Object.assign(formData, initFormData())
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    // TODO: 實現 API 調用
    console.log('員工保險調整數據:', {
      employeeId: props.employee?.id,
      ...formData
    })
    
    ElMessage.success('保險資訊調整成功')
    emit('confirm')
  } catch (error) {
    console.error('表單驗證失敗:', error)
  }
}

const handleCancel = () => {
  emit('update:modelValue', false)
}

const handleClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchInsuranceLevels()
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.el-divider {
  margin: 20px 0;
}
</style>