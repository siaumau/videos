<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
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
      <el-form-item label="級距" prop="level">
        <el-input-number
          v-model="formData.level"
          :min="1"
          :max="50"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="薪資範圍" required>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="11">
            <el-form-item prop="minSalary" style="margin-bottom: 0">
              <el-input-number
                v-model="formData.minSalary"
                :min="0"
                :precision="0"
                placeholder="最低薪資"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center; line-height: 32px">
            <span>至</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="maxSalary" style="margin-bottom: 0">
              <el-input-number
                v-model="formData.maxSalary"
                :min="0"
                :precision="0"
                placeholder="最高薪資"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="月投保薪資" prop="insuredSalary">
        <el-input-number
          v-model="formData.insuredSalary"
          :min="0"
          :precision="0"
          style="width: 100%"
        />
      </el-form-item>

      <template v-if="type === 'labor'">
        <el-divider content-position="left">勞保費率</el-divider>
        
        <el-form-item label="個人負擔" prop="employeeFee">
          <el-input-number
            v-model="formData.employeeFee"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="雇主負擔" prop="employerFee">
          <el-input-number
            v-model="formData.employerFee"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="勞退提撥" prop="pensionContribution">
          <el-input-number
            v-model="formData.pensionContribution"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <template v-if="type === 'health'">
        <el-divider content-position="left">健保費率</el-divider>
        
        <el-form-item label="個人負擔" prop="employeeFee">
          <el-input-number
            v-model="formData.employeeFee"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="雇主負擔" prop="employerFee">
          <el-input-number
            v-model="formData.employerFee"
            :min="0"
            :precision="0"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="補充保費率" prop="supplementaryFee">
          <el-input-number
            v-model="formData.supplementaryFee"
            :min="0"
            :max="10"
            :precision="2"
            :step="0.01"
            style="width: 100%"
          />
          <div class="help-text">單位：%</div>
        </el-form-item>
      </template>
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

interface LevelData {
  level: number
  minSalary: number
  maxSalary: number
  insuredSalary: number
  employeeFee: number
  employerFee: number
  pensionContribution?: number
  supplementaryFee?: number
}

interface Props {
  modelValue: boolean
  levelData?: LevelData | null
  type: 'labor' | 'health'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()

const formRef = ref<FormInstance>()
const isEdit = computed(() => !!props.levelData)

const title = computed(() => {
  const typeText = props.type === 'labor' ? '勞保' : '健保'
  return `${isEdit.value ? '編輯' : '新增'}${typeText}級距`
})

const initFormData = (): LevelData => ({
  level: 1,
  minSalary: 0,
  maxSalary: 0,
  insuredSalary: 0,
  employeeFee: 0,
  employerFee: 0,
  pensionContribution: 0,
  supplementaryFee: 0
})

const formData = reactive<LevelData>(initFormData())

const rules: FormRules = {
  level: [
    { required: true, message: '請輸入級距', trigger: 'blur' },
    { type: 'number', min: 1, message: '級距必須大於0', trigger: 'blur' }
  ],
  minSalary: [
    { required: true, message: '請輸入最低薪資', trigger: 'blur' },
    { type: 'number', min: 0, message: '薪資不能小於0', trigger: 'blur' }
  ],
  maxSalary: [
    { required: true, message: '請輸入最高薪資', trigger: 'blur' },
    { type: 'number', min: 0, message: '薪資不能小於0', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= formData.minSalary) {
          callback(new Error('最高薪資必須大於最低薪資'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  insuredSalary: [
    { required: true, message: '請輸入月投保薪資', trigger: 'blur' },
    { type: 'number', min: 0, message: '投保薪資不能小於0', trigger: 'blur' }
  ],
  employeeFee: [
    { required: true, message: '請輸入個人負擔金額', trigger: 'blur' },
    { type: 'number', min: 0, message: '金額不能小於0', trigger: 'blur' }
  ],
  employerFee: [
    { required: true, message: '請輸入雇主負擔金額', trigger: 'blur' },
    { type: 'number', min: 0, message: '金額不能小於0', trigger: 'blur' }
  ]
}

// 根據類型添加特定的驗證規則
if (props.type === 'labor') {
  rules.pensionContribution = [
    { required: true, message: '請輸入勞退提撥金額', trigger: 'blur' },
    { type: 'number', min: 0, message: '金額不能小於0', trigger: 'blur' }
  ]
} else {
  rules.supplementaryFee = [
    { required: true, message: '請輸入補充保費率', trigger: 'blur' },
    { type: 'number', min: 0, max: 10, message: '費率必須在0-10%之間', trigger: 'blur' }
  ]
}

watch(() => props.levelData, (levelData) => {
  if (levelData) {
    Object.assign(formData, levelData)
  } else {
    Object.assign(formData, initFormData())
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    // TODO: 實現 API 調用
    console.log('保險級距數據:', formData)
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

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>