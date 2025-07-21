export const formatCurrency = (amount: number, currency = 'NT$'): string => {
  return `${currency} ${amount.toLocaleString()}`
}

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  if (!date) return ''
  
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
}

export const formatIdNumber = (idNumber: string): string => {
  if (!idNumber || idNumber.length !== 10) return idNumber
  return `${idNumber.slice(0, 4)}****${idNumber.slice(-2)}`
}

export const formatStatus = (status: string): { text: string; type: string } => {
  const statusMap: Record<string, { text: string; type: string }> = {
    active: { text: '在職', type: 'success' },
    inactive: { text: '停職', type: 'warning' },
    terminated: { text: '離職', type: 'danger' }
  }
  return statusMap[status] || { text: status, type: 'info' }
}

export const formatDepartment = (department: string): string => {
  const departmentMap: Record<string, string> = {
    production: '製作部',
    accounting: '會計部',
    administration: '行政部',
    marketing: '行銷部'
  }
  return departmentMap[department] || department
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatPercentage = (value: number, decimal = 1): string => {
  return `${value.toFixed(decimal)}%`
}