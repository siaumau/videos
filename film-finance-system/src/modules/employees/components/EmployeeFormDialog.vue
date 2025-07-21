<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '編輯員工' : '新增員工'"
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身分證字號" prop="idNumber">
            <el-input v-model="formData.idNumber" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="職位" prop="position">
            <el-input v-model="formData.position" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部門" prop="department">
            <el-select v-model="formData.department" style="width: 100%">
              <el-option label="製作部" value="production" />
              <el-option label="會計部" value="accounting" />
              <el-option label="行政部" value="administration" />
              <el-option label="行銷部" value="marketing" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="入職日期" prop="hireDate">
            <el-date-picker
              v-model="formData.hireDate"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="狀態" prop="status">
            <el-select v-model="formData.status" style="width: 100%">
              <el-option label="在職" value="active" />
              <el-option label="停職" value="inactive" />
              <el-option label="離職" value="terminated" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">薪資資訊</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="底薪" prop="baseSalary">
            <el-input-number
              v-model="formData.baseSalary"
              :min="0"
              :precision="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="津貼" prop="allowances">
            <el-input-number
              v-model="formData.allowances"
              :min="0"
              :precision="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">勞健保資訊</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="勞保級距" prop="laborInsuranceLevel">
            <el-input-number
              v-model="formData.laborInsuranceLevel"
              :min="1"
              :max="45"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="健保級距" prop="healthInsuranceLevel">
            <el-input-number
              v-model="formData.healthInsuranceLevel"
              :min="1"
              :max="50"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? '更新' : '新增' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Employee, EmployeeFormData } from '../types/employee'

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
const isEdit = computed(() => !!props.employee)

const initFormData = (): EmployeeFormData => ({
  name: '',
  idNumber: '',
  position: '',
  department: '',
  hireDate: '',
  baseSalary: 0,
  allowances: 0,
  laborInsuranceLevel: 1,
  healthInsuranceLevel: 1,
  status: 'active'
})

const formData = reactive<EmployeeFormData>(initFormData())

const rules: FormRules = {
  name: [
    { required: true, message: '請輸入姓名', trigger: 'blur' }
  ],
  idNumber: [
    { required: true, message: '請輸入身分證字號', trigger: 'blur' },
    { pattern: /^[A-Z][12]\d{8}$/, message: '身分證字號格式不正確', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '請輸入職位', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '請選擇部門', trigger: 'change' }
  ],
  hireDate: [
    { required: true, message: '請選擇入職日期', trigger: 'change' }
  ],
  baseSalary: [
    { required: true, message: '請輸入底薪', trigger: 'blur' },
    { type: 'number', min: 0, message: '底薪不能小於0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '請選擇狀態', trigger: 'change' }
  ]
}

watch(() => props.employee, (employee) => {
  if (employee) {
    Object.assign(formData, {
      name: employee.name,
      idNumber: employee.idNumber,
      position: employee.position,
      department: employee.department,
      hireDate: employee.hireDate,
      baseSalary: employee.salary.baseSalary,
      allowances: employee.salary.allowances,
      laborInsuranceLevel: employee.laborInsurance.level,
      healthInsuranceLevel: employee.healthInsurance.level,
      status: employee.status
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
    ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
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
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.el-divider {
  margin: 20px 0;
}
</style>