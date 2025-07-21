# 員工薪資管理模組

## 功能範圍

### 🎯 核心功能（調整後）
此模組專注於薪資計算和發放相關功能，員工基本資料和勞健保資訊管理已移至「人力資源」模組。

#### 1. 薪資計算
- 自動薪資計算引擎
- 基本薪資 + 津貼 + 獎金計算
- 加班費計算
- 請假扣薪計算

#### 2. 扣款處理
- 所得稅扣繳計算
- 勞健保費扣除（從人力資源模組獲取費率）
- 二代健保補充保費
- 其他扣款項目

#### 3. 薪資發放管理
- 薪資單生成
- 薪資發放記錄
- 銀行轉帳檔產生
- 薪資發放確認

#### 4. 薪資報表
- 月薪資彙總表
- 年度薪資總表
- 扣繳憑單
- 會計傳票產生

## 🔄 數據流整合

### 從人力資源模組獲取
```typescript
// 從員工管理模組獲取基本資料
const employeeData = await employeeApi.getEmployeeById(employeeId)

// 從勞健保管理獲取保險費率
const insuranceRates = await laborInsuranceApi.getEmployeeInsurance(employeeId)
```

### 與其他模組的關聯
- **人力資源** → 提供員工基本資料、勞健保級距
- **考勤管理** → 提供出勤時數、請假記錄
- **會計系統** → 接收薪資會計傳票

## 📁 模組結構

```
payroll/
├── views/
│   ├── PayrollCalculationView.vue    # 薪資計算頁面
│   ├── PayrollPaymentView.vue        # 薪資發放頁面
│   └── PayrollReportView.vue         # 薪資報表頁面
├── components/
│   ├── SalaryCalculator.vue          # 薪資計算器
│   ├── DeductionManager.vue          # 扣款管理
│   └── PayslipGenerator.vue          # 薪資單生成器
├── stores/
│   └── payroll.ts                    # 薪資狀態管理
├── services/
│   └── payrollApi.ts                 # 薪資 API 服務
└── types/
    └── payroll.ts                    # 薪資相關類型定義
```

## 🚀 開發優先級

1. **第一階段**：薪資計算引擎
2. **第二階段**：扣款處理邏輯  
3. **第三階段**：薪資發放功能
4. **第四階段**：報表生成系統

## 🔗 API 整合點

```typescript
// 薪資計算時需要的外部數據
interface PayrollCalculationInput {
  employeeId: number
  period: string
  workingHours: number      // 來自考勤模組
  overtimeHours: number     // 來自考勤模組
  leaveHours: number        // 來自考勤模組
  baseSalary: number        // 來自員工管理
  insuranceRates: {         // 來自勞健保管理
    laborInsurance: number
    healthInsurance: number
    pension: number
  }
}
```