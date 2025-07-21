<template>
  <div class="search-form">
    <el-form :model="formData" inline>
      <el-form-item
        v-for="filter in filters"
        :key="filter.prop"
        :label="filter.label"
      >
        <el-input
          v-if="filter.type === 'input'"
          v-model="formData[filter.prop]"
          :placeholder="`請輸入${filter.label}`"
          clearable
          style="width: 200px"
        />
        
        <el-select
          v-else-if="filter.type === 'select'"
          v-model="formData[filter.prop]"
          :placeholder="`請選擇${filter.label}`"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="option in filter.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-date-picker
          v-else-if="filter.type === 'date'"
          v-model="formData[filter.prop]"
          type="date"
          :placeholder="`請選擇${filter.label}`"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 200px"
        />

        <el-date-picker
          v-else-if="filter.type === 'daterange'"
          v-model="formData[filter.prop]"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 240px"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          搜尋
        </el-button>
        <el-button @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { FilterOption } from '../types/common'

interface Props {
  filters: FilterOption[]
  modelValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  search: [filters: Record<string, any>]
  reset: []
}>()

const formData = reactive<Record<string, any>>({ ...props.modelValue })

watch(() => props.modelValue, (newValue) => {
  Object.assign(formData, newValue)
}, { deep: true })

watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

const handleSearch = () => {
  emit('search', { ...formData })
}

const handleReset = () => {
  const resetData: Record<string, any> = {}
  props.filters.forEach(filter => {
    resetData[filter.prop] = filter.type === 'daterange' ? [] : ''
  })
  Object.assign(formData, resetData)
  emit('reset')
}
</script>

<style scoped>
.search-form {
  margin-bottom: 20px;
}
</style>