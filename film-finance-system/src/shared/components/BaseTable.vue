<template>
  <div class="base-table">
    <el-table
      :data="data"
      :loading="loading"
      stripe
      style="width: 100%"
      v-bind="$attrs"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sortable"
        :align="column.align || 'left'"
      >
        <template #default="scope" v-if="$slots[column.prop]">
          <slot :name="column.prop" :row="scope.row" :column="column" :$index="scope.$index" />
        </template>
      </el-table-column>
      
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionWidth"
        align="center"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <el-button
              v-if="showEdit"
              size="small"
              @click="$emit('edit', row)"
            >
              編輯
            </el-button>
            <el-button
              v-if="showDelete"
              size="small"
              type="danger"
              @click="$emit('delete', row)"
            >
              刪除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="pagination" class="pagination">
      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="$emit('page-change', $event)"
        @size-change="$emit('size-change', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '../types/common'

interface PaginationData {
  page: number
  pageSize: number
  total: number
}

interface Props {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  pagination?: PaginationData
  showActions?: boolean
  showEdit?: boolean
  showDelete?: boolean
  actionWidth?: string
}

defineProps<Props>()

defineEmits<{
  edit: [row: any]
  delete: [row: any]
  'page-change': [page: number]
  'size-change': [size: number]
}>()
</script>

<style scoped>
.base-table {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>