<template>
  <div class="module-detail-container">
    <!-- 面包屑導航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>{{ moduleInfo?.category }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ moduleInfo?.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 模組標題 -->
    <div class="module-header">
      <div class="title-section">
        <el-icon class="module-icon">
          <component :is="moduleInfo?.icon" />
        </el-icon>
        <div>
          <h1 class="module-title">{{ moduleInfo?.name }}</h1>
          <p class="module-subtitle">{{ moduleInfo?.description }}</p>
        </div>
      </div>
      <div class="action-section">
        <el-tag :type="getStatusType(moduleInfo?.status)" effect="dark">
          {{ moduleInfo?.status }}
        </el-tag>
      </div>
    </div>

    <!-- 模組詳細信息 -->
    <div class="module-content">
      <el-row :gutter="20">
        <!-- 左側主要內容 -->
        <el-col :span="16">
          <!-- 功能說明 -->
          <el-card class="content-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><InfoFilled /></el-icon>
                <span>功能說明</span>
              </div>
            </template>
            <div class="function-description">
              <div v-html="moduleInfo?.functionDescription"></div>
            </div>
          </el-card>

          <!-- 主要畫面 -->
          <el-card class="content-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><Monitor /></el-icon>
                <span>主要畫面</span>
              </div>
            </template>
            <div class="screens-list">
              <el-collapse v-model="activeScreens">
                <el-collapse-item 
                  v-for="(screen, index) in moduleInfo?.screens" 
                  :key="index"
                  :title="screen.name" 
                  :name="index.toString()"
                >
                  <div class="screen-detail">
                    <p class="screen-description">{{ screen.description }}</p>
                    <div class="screen-fields" v-if="screen.fields">
                      <h4>主要欄位：</h4>
                      <el-tag 
                        v-for="field in screen.fields" 
                        :key="field" 
                        class="field-tag"
                        type="info"
                        effect="plain"
                      >
                        {{ field }}
                      </el-tag>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>

        <!-- 右側信息面板 -->
        <el-col :span="8">
          <!-- 權限設定 -->
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><Lock /></el-icon>
                <span>權限設定</span>
              </div>
            </template>
            <div class="permissions-list">
              <div 
                v-for="permission in moduleInfo?.permissions" 
                :key="permission.role"
                class="permission-item"
              >
                <div class="permission-role">
                  <el-tag :type="getRoleType(permission.role)" size="small">
                    {{ permission.role }}
                  </el-tag>
                </div>
                <div class="permission-description">
                  {{ permission.description }}
                </div>
              </div>
            </div>
          </el-card>

          <!-- 資料匯入/匯出 -->
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><Upload /></el-icon>
                <span>資料匯入/匯出</span>
              </div>
            </template>
            <div class="import-export-info">
              <!-- 匯入 -->
              <div class="import-section">
                <h4><el-icon><Download /></el-icon> 支援匯入</h4>
                <ul class="format-list">
                  <li v-for="format in moduleInfo?.importFormats" :key="format">
                    <el-tag size="small" type="success">{{ format }}</el-tag>
                  </li>
                </ul>
              </div>
              
              <!-- 匯出 -->
              <div class="export-section">
                <h4><el-icon><Upload /></el-icon> 支援匯出</h4>
                <ul class="format-list">
                  <li v-for="format in moduleInfo?.exportFormats" :key="format">
                    <el-tag size="small" type="warning">{{ format }}</el-tag>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>

          <!-- 開發狀態 -->
          <el-card class="info-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><TrendCharts /></el-icon>
                <span>開發狀態</span>
              </div>
            </template>
            <div class="development-info">
              <div class="info-item">
                <span class="label">開發進度：</span>
                <el-progress 
                  :percentage="moduleInfo?.progress || 0" 
                  :status="getProgressStatus(moduleInfo?.progress)"
                />
              </div>
              <div class="info-item">
                <span class="label">預估工期：</span>
                <span class="value">{{ moduleInfo?.estimatedTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">預估費用：</span>
                <span class="value">{{ moduleInfo?.estimatedCost }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  InfoFilled,
  Monitor,
  Lock,
  Upload,
  Download,
  TrendCharts,
  UserFilled,
  Camera,
  OfficeBuilding,
  Promotion,
  Film,
  Document,
  DocumentCopy,
  Calendar,
  Clock,
  DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()
const activeScreens = ref<string[]>(['0'])

// 模組信息數據
const moduleData = {
  'payroll': {
    name: '員工薪資與勞健保管理模組',
    category: '財務管理',
    description: '提供完整的薪資核算與勞健保管理工具',
    icon: 'UserFilled',
    status: '開發中',
    progress: 60,
    estimatedTime: '2個月',
    estimatedCost: 'NT$ 40-60 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>員工基本資料管理（姓名、身分證字號、職位、薪資組成等）</li>
        <li>勞健保資訊管理（勞保級距、健保投保金額、勞退提撥等）</li>
        <li>每月薪資自動結算，根據員工的底薪、出勤與加班、獎金計算應發薪資</li>
        <li>各項扣款處理（扣繳稅額、勞保健保費、二代健保補充保費等）</li>
        <li>內建最新的勞動法令參數，自動套用最新費率避免人工計算錯誤</li>
        <li>產生各種薪資相關報表供管理階層查閱</li>
      </ul>
    `,
    permissions: [
      { role: '會計人員', description: '完整權限，可新增/編輯員工資料、執行薪資計算並查看所有員工薪資明細' },
      { role: '管理員', description: '完整控制權，包含設定薪資計算參數、調整保險級距等' },
      { role: '製片', description: '僅能看到專案總人事成本的彙總資訊，不能存取個別員工薪資細節' }
    ],
    screens: [
      {
        name: '員工資料維護畫面',
        description: '管理員工基本資訊、薪資結構、勞健保相關資料',
        fields: ['姓名', '部門/專案歸屬', '職稱', '底薪', '薪資等級', '勞保級別', '健保投保金額']
      },
      {
        name: '薪資計算與發放畫面',
        description: '選擇計薪月份，自動列出全體在職員工清單及薪資明細',
        fields: ['基本薪資', '職務津貼', '加班費', '獎金', '所得稅預扣', '勞保費', '健保費']
      },
      {
        name: '勞健保與扣繳申報畫面',
        description: '提供勞保、健保費用清單檢視，匯出扣繳憑單相關資料',
        fields: ['公司負擔額', '員工分擔額', '二代健保應繳額', '扣繳憑單資料']
      }
    ],
    importFormats: ['Excel員工基本資料', 'Excel月度變動項目', '外部人事系統出勤記錄'],
    exportFormats: ['Excel薪資明細表', 'PDF薪資條', 'QuickBooks CSV', 'Xero CSV', 'PDF勞健保報表']
  },
  'equipment': {
    name: '影視器材管理模組',
    category: '財務管理',
    description: '管理影視製作所需各類設備與器材的全生命週期',
    icon: 'Camera',
    status: '規劃中',
    progress: 20,
    estimatedTime: '2.5個月',
    estimatedCost: 'NT$ 35-55 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>購置管理：記錄公司自有器材的採購資訊（購買日期、供應商、購置成本等）</li>
        <li>租賃管理：支援登錄外部租借設備的使用資料，包含租賃來源廠商、租期、租金成本</li>
        <li>維護保養：建立設備維修與保養日誌，記錄維護日期、內容、花費與下次保養週期</li>
        <li>折舊計算：對自有設備依據折舊方法自動計算每月折舊費用</li>
        <li>設備狀態追蹤：標記器材目前狀態（使用中、維修中、可用庫存、已報廢）</li>
        <li>條碼/QRCODE掃描：快速查詢器材資訊，提升管理效率</li>
      </ul>
    `,
    permissions: [
      { role: '管理員', description: '新增/編輯器材檔案、設定折舊參數以及刪除報廢資產' },
      { role: '會計人員', description: '查看設備成本、折舊報表並將折舊費用提列入帳' },
      { role: '製片', description: '查看專案關聯器材、預約公司內部器材、提出新設備購置或租賃申請' }
    ],
    screens: [
      {
        name: '設備/器材清單畫面',
        description: '顯示所有器材資產列表，可篩選自有或租賃器材',
        fields: ['設備編號', '名稱', '類型', '狀態', '所在位置', '購置日期', '原始成本', '目前淨值']
      },
      {
        name: '設備詳情畫面',
        description: '查看完整設備資訊與歷史記錄',
        fields: ['設備照片', '規格描述', '序號/資產編碼', '購置價格', '折舊方法', '維護紀錄', '使用紀錄']
      },
      {
        name: '購置/租賃申請畫面',
        description: '讓製片或授權人員提交新設備需求',
        fields: ['設備名稱', '預算金額', '申請理由', '租借期間', '估計租金']
      }
    ],
    importFormats: ['Excel設備資料', 'CSV租賃記錄', '會計系統固定資產'],
    exportFormats: ['Excel設備清單', 'PDF折舊報表', 'QuickBooks固定資產CSV', 'PDF設備台帳']
  },
  'venue': {
    name: '場地租金與營運費用管理模組',
    category: '財務管理',
    description: '管理影視製作相關的場地租賃成本以及日常營運開支',
    icon: 'OfficeBuilding',
    status: '規劃中',
    progress: 15,
    estimatedTime: '2個月',
    estimatedCost: 'NT$ 30-45 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>場地租金管理：記錄各拍攝場地或製作場所的租用情況</li>
        <li>營運費用管理：涵蓋水電瓦斯、辦公室租金、器材運輸、保全清潔費等</li>
        <li>費用科目定義：允許定義各類營運費用科目</li>
        <li>費用申請審核：製片或會計可隨時登錄費用支出，填寫類別、金額、關聯專案</li>
        <li>自有場地管理：對自有場地設定日常維護成本、折舊或攤提費用</li>
      </ul>
    `,
    permissions: [
      { role: '會計人員', description: '主要編輯權，可登錄各項費用支出、維護場地資料' },
      { role: '管理員', description: '定義費用分類科目、設定場地基本檔案、查看所有費用數據' },
      { role: '製片', description: '提交專案相關場地與營運費用、查閱專案費用總覽' }
    ],
    screens: [
      {
        name: '場地資料庫畫面',
        description: '提供場地基本資料的維護清單',
        fields: ['場地名稱', '所在地點', '可容納人數', '租金標價', '場地提供者', '聯絡方式']
      },
      {
        name: '場地租用管理畫面',
        description: '列出當前進行中和已預訂的場地租用',
        fields: ['專案名稱', '場地', '起迄日期時間', '租金總額', '狀態']
      },
      {
        name: '營運費用登錄畫面',
        description: '提供費用報銷單樣式的介面',
        fields: ['費用類別', '金額', '日期', '關聯專案', '說明', '發票號碼']
      }
    ],
    importFormats: ['Excel歷史費用資料', 'CSV會計軟體費用清單'],
    exportFormats: ['Excel場地租用清單', 'PDF營運費用報告', 'QuickBooks費用CSV']
  },
  'marketing': {
    name: '市場行銷與品牌推廣支出管理模組',
    category: '財務管理', 
    description: '追蹤與管理影視作品市場行銷和品牌宣傳相關的各項支出',
    icon: 'Promotion',
    status: '規劃中',
    progress: 10,
    estimatedTime: '2個月',
    estimatedCost: 'NT$ 25-40 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>行銷活動規劃：建立市場行銷活動條目，輸入計畫資訊、執行期間、預算金額</li>
        <li>廣告與宣傳費用記錄：登錄實際發生的廣告投放費用和宣傳開支</li>
        <li>品牌推廣費：涵蓋形象廣告、品牌合作費等非直接項目</li>
        <li>KPI設定：支援設定不同行銷活動的關鍵指標供延伸分析</li>
        <li>ROI分析：可匯總全部行銷支出以了解整體行銷投入效果</li>
      </ul>
    `,
    permissions: [
      { role: '行銷負責人', description: '新增行銷活動條目、編輯活動預算，提交支出申請' },
      { role: '管理員', description: '增修支出分類、審核大型活動預算等全面權限' },
      { role: '會計人員', description: '審核並記帳行銷費用支出，確保所有宣傳費用都有適當單據' }
    ],
    screens: [
      {
        name: '行銷活動總覽畫面',
        description: '列出所有規劃中的行銷活動',
        fields: ['活動名稱', '對應影視作品', '時間範圍', '預算額', '當前執行進度']
      },
      {
        name: '活動詳情與費用項目畫面', 
        description: '展示該活動概況及所有已登錄的費用明細',
        fields: ['活動概況', '目標受眾', 'KPI指標', '費用明細', '供應商/平台']
      },
      {
        name: '費用登錄畫面（行銷支出憑單）',
        description: '登錄與行銷推廣相關的支出',
        fields: ['關聯活動', '支出項目名稱', '費用類別', '金額', '供應商', '發票號碼']
      }
    ],
    importFormats: ['Excel行銷預算規劃', 'CSV行銷支出記錄', '第三方平台報告'],
    exportFormats: ['Excel行銷費用明細表', 'QuickBooks行銷費用CSV', 'PDF行銷報告']
  },
  'production': {
    name: '影視製作成本控制模組',
    category: '財務管理',
    description: '以專案為單位，全面管控影視製作階段的各項成本支出與酬勞記錄',
    icon: 'Film',
    status: '開發中',
    progress: 45,
    estimatedTime: '3個月',
    estimatedCost: 'NT$ 50-80 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>專案預算編列：建立詳細的預算表，涵蓋各成本科目如劇本開發費、導演及主創人員酬勞等</li>
        <li>支出紀錄管理：在製作過程中持續登錄實際支出條目，關聯到特定專案和成本科目</li>
        <li>酬勞記錄：針對演職人員與外部合約人員的酬勞，提供合同與付款管理功能</li>
        <li>成本警示：模組內建成本監控機制，如發現某科目支出逼近或超出預算會自動發出提示</li>
        <li>合約管理：為主要演員、導演、編劇等建立合約檔，記載協定片酬金額、支付進度</li>
      </ul>
    `,
    permissions: [
      { role: '製片', description: '查看預算與支出的權限，可提交支出申請或調整建議' },
      { role: '會計', description: '跨專案財務統籌，編輯所有專案支出與合約酬勞的權限' },
      { role: '管理員', description: '存取所有專案的預算與成本資料，設置科目類別、調整超權限操作' }
    ],
    screens: [
      {
        name: '專案清單與總覽畫面',
        description: '顯示所有專案條目及其製作狀態',
        fields: ['專案名稱', '製作狀態', '總預算金額', '目前實際支出', '預算執行百分比']
      },
      {
        name: '專案預算與支出總表畫面',
        description: '呈現預算分配表與實際支出匯總',
        fields: ['成本科目', '預算金額', '已發生成本', '剩餘預算', '執行百分比']
      },
      {
        name: '支出明細登錄與查詢畫面',
        description: '分科目瀏覽支出的界面',
        fields: ['日期', '摘要', '供應商', '金額', '經辦人', '憑證號']
      },
      {
        name: '合約與酬勞管理畫面',
        description: '管理重要人員酬勞的子模組介面',
        fields: ['簽約人員', '合約金額', '分期付款計畫', '實際支付情況', '付款狀態']
      }
    ],
    importFormats: ['Excel專案預算大綱', 'CSV支出記錄', 'Excel合約酬勞'],
    exportFormats: ['PDF專案總成本報表', 'Excel合約酬勞清單', 'QuickBooks專案分錄CSV']
  },
  'admin-expense': {
    name: '行政管理費用控管模組',
    category: '財務管理',
    description: '統一管理影視公司日常行政與管理相關的費用支出',
    icon: 'Document',
    status: '規劃中',
    progress: 25,
    estimatedTime: '2個月',
    estimatedCost: 'NT$ 25-40 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>行政費用分類：涵蓋辦公室租金、水電費、辦公用品、差旅交通費、接待應酬費等</li>
        <li>費用申請審批：提供費用申請審批工作流，部門經理可在系統提出行政支出申請</li>
        <li>週期性帳單：對重複性支出（如每月固定辦公室租金）可使用週期性帳單設定</li>
        <li>費用異常檢測：系統會協助辨識費用異常，如本月行政費用較往常大幅增加</li>
        <li>預算控制：實施總額控制，為各部門或費用科目制定年度或季度行政預算額度</li>
      </ul>
    `,
    permissions: [
      { role: '管理員', description: '設定費用科目範圍、審核大額支出申請並檢視全部數據' },
      { role: '會計人員', description: '負責行政費用的記帳與監控，新增/編輯費用的權限' },
      { role: '部門主管', description: '提交費用申請、管理本部門預算，僅能檢視自己部門費用明細' }
    ],
    screens: [
      {
        name: '費用科目設定畫面',
        description: '管理員定義和維護行政費用科目清單',
        fields: ['科目名稱', '預算週期', '預算額度', '負責部門']
      },
      {
        name: '費用申請/報銷畫面',
        description: '讓使用者提交行政支出請款或報銷的介面',
        fields: ['費用類別', '金額', '用途說明', '預估發生日期', '報價單']
      },
      {
        name: '行政費用總覽畫面',
        description: '財務人員使用的界面，類似帳簿瀏覽',
        fields: ['日期', '科目', '摘要', '金額', '經辦人', '預算剩餘']
      }
    ],
    importFormats: ['Excel年度行政預算', 'CSV過往費用記錄', '會計軟體管理費用明細'],
    exportFormats: ['Excel行政費用明細表', 'PDF預算執行報告', 'QuickBooks管銷費用CSV']
  },
  'tax': {
    name: '稅務與財務支出管理模組',
    category: '財務管理',
    description: '涵蓋公司財務運作中涉及的稅務支出及各類財務費用管理',
    icon: 'DocumentCopy',
    status: '規劃中',
    progress: 30,
    estimatedTime: '2.5個月',
    estimatedCost: 'NT$ 35-50 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>發票與稅務管理：集中管理進項發票與銷項發票資料，輔助進行營業稅申報</li>
        <li>貸款管理：提供貸款檔案維護，包括貸款額度、起迄日期、利率、還款計畫表</li>
        <li>銀行費用與手續費：記錄各種銀行相關費用，如匯款手續費、信用狀手續費等</li>
        <li>理財與利息：若公司有短期理財或存款利息收入，也可在此模組記錄</li>
        <li>稅務申報：對營所稅等期末稅款，登錄預繳稅款與結算稅額支付記錄</li>
      </ul>
    `,
    permissions: [
      { role: '會計人員', description: '主要使用者，處理稅務申報及財務費用，新增/編輯所有稅務和財務支出資料' },
      { role: '管理員', description: '監督關鍵財務活動，如確認大額稅款支付、貸款合約內容等' },
      { role: '其他角色', description: '無權限（專業性強且敏感）' }
    ],
    screens: [
      {
        name: '發票管理畫面',
        description: '顯示發票清單，支援進項/銷項篩選',
        fields: ['發票號碼', '類型', '開立日期', '對方名稱', '未稅金額', '營業稅額', '含稅總額']
      },
      {
        name: '貸款合約畫面',
        description: '列出公司所有未清償貸款專案',
        fields: ['貸款名稱', '起始日期', '到期日期', '貸款本金', '年利率', '目前餘額']
      },
      {
        name: '銀行與財務費用畫面',
        description: '以列表呈現零星的財務相關費用記錄',
        fields: ['日期', '費用類別', '金額', '關聯帳戶', '交易描述']
      },
      {
        name: '稅務申報與繳納畫面',
        description: '專門記錄各稅種申報結果與繳款狀態',
        fields: ['申報期別', '稅種', '應繳金額', '實際繳納金額', '繳納日期', '繳款書編號']
      }
    ],
    importFormats: ['CSV電子發票清單', 'Excel既有貸款資料', 'CSV銀行月結單'],
    exportFormats: ['PDF營業稅申報明細表', 'Excel所得稅預估表', 'PDF發票清單', 'CSV銀行費用明細']
  },
  'schedule': {
    name: '排班行事曆模組',
    category: '營運管理',
    description: '維護公司整體上下班行事曆，提供每日/每週值班表查詢與編輯',
    icon: 'Calendar',
    status: '新增功能',
    progress: 0,
    estimatedTime: '2.5-3個月',
    estimatedCost: 'NT$ 30-50 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>排班管理：設定各部門/職位的班別規則，支援固定班、輪班等多種排班方式</li>
        <li>任務導向排班：根據任務指派模組提供的人力需求，自動調整班表安排</li>
        <li>班表通知：排班訊息變更及上下班提醒的Email/LINE自動通知整合</li>
        <li>法規檢核：內建勞基法工時規則，安排班表時自動檢查工時合規性</li>
        <li>公司行事曆：提供整體公司值班安排的日曆視圖，方便管理各部門排班</li>
      </ul>
    `,
    permissions: [
      { role: '管理員', description: '完整排班權限，可設定班別規則、調整全公司排班' },
      { role: '部門主管', description: '管理本部門員工排班，提出人力需求調整申請' },
      { role: '員工', description: '查看個人班表，申請換班或調班' }
    ],
    screens: [
      {
        name: '行事曆總覽畫面',
        description: '以日曆形式顯示全公司排班狀況',
        fields: ['日期', '值班人員', '班別類型', '工作時段', '部門分配']
      },
      {
        name: '排班規則設定畫面',
        description: '設定各種班別規則和工時規範',
        fields: ['班別名稱', '工作時間', '休息時間', '適用部門', '輪班週期']
      },
      {
        name: '班表編輯畫面',
        description: '編輯特定期間的排班安排',
        fields: ['員工姓名', '班別', '工作日期', '工作時段', '備註']
      },
      {
        name: '通知設定畫面',
        description: '設定排班通知的方式和時間',
        fields: ['通知類型', '提醒時間', '收件人', '通知內容模板']
      }
    ],
    importFormats: ['Excel排班模板', 'CSV員工班別資料'],
    exportFormats: ['Excel月度排班表', 'PDF班表報告', 'CSV出勤計畫']
  },
  'attendance': {
    name: '考勤管理模組',
    category: '營運管理',
    description: '處理員工上下班打卡、加班申請及審核、出勤紀錄統計',
    icon: 'Clock',
    status: '新增功能',
    progress: 0,
    estimatedTime: '3個月',
    estimatedCost: 'NT$ 30-60 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>打卡記錄：支援多種打卡方式（感應卡、指紋、人臉識別、手機GPS等）</li>
        <li>出勤紀錄：自動記錄每日出勤、缺勤、遲到早退與加班時數</li>
        <li>加班管理：員工可提出加班申請，主管線上審核，加班核准後計入工時</li>
        <li>出缺勤報表：統計各員工出勤率、工時匯總，可匯出報表供管理層檢視</li>
        <li>薪資連動：每月將出勤與加班統計結果匯入薪資模組，自動計算應發薪資</li>
        <li>異常警示：系統根據班表檢測異常（如遲到、未打卡）並透過Email或LINE即時通知</li>
      </ul>
    `,
    permissions: [
      { role: '人資/會計', description: '管理所有員工出勤記錄，處理考勤異常，匯出統計報表' },
      { role: '部門主管', description: '審核本部門員工加班申請，查看部門出勤統計' },
      { role: '員工', description: '進行日常打卡，申請加班，查看個人出勤記錄' }
    ],
    screens: [
      {
        name: '打卡介面',
        description: '員工日常打卡的主要介面',
        fields: ['打卡時間', '打卡類型', '位置資訊', '打卡狀態']
      },
      {
        name: '出勤記錄查詢畫面',
        description: '查詢和管理員工出勤記錄',
        fields: ['員工姓名', '日期', '上班時間', '下班時間', '工時', '加班時數', '出勤狀態']
      },
      {
        name: '加班申請畫面',
        description: '員工提出加班申請的介面',
        fields: ['申請日期', '加班時段', '加班事由', '預估時數', '審核狀態']
      },
      {
        name: '考勤統計報表畫面',
        description: '生成各種考勤統計報表',
        fields: ['統計期間', '員工', '出勤天數', '遲到次數', '總工時', '加班時數']
      }
    ],
    importFormats: ['Excel員工班表', 'CSV外部打卡記錄'],
    exportFormats: ['Excel出勤統計表', 'PDF月度考勤報告', 'CSV薪資工時資料']
  },
  'permission': {
    name: '權限與帳號管理模組',
    category: '系統管理',
    description: '提供管理系統使用者帳號、角色及權限的功能模組',
    icon: 'Lock',
    status: '開發中',
    progress: 70,
    estimatedTime: '1.5個月',
    estimatedCost: 'NT$ 20-35 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>帳號管理：新增、編輯或停用使用者帳號，設定帳號有效期限和登入限制</li>
        <li>角色與權限設定：採用RBAC模型，預設角色如管理員、會計、製片</li>
        <li>分層權限：支援更精細控制，使某些角色僅能存取自己部門或專案的資料</li>
        <li>日誌審計：記錄使用者登入時間、重要資料變更等，供管理員審核</li>
        <li>權限矩陣：以表格方式呈現各角色對各功能模組的權限設定</li>
      </ul>
    `,
    permissions: [
      { role: '系統管理員', description: '完全訪問權限，創建/調整角色和權限配置，維護使用者名單' },
      { role: '其他角色', description: '無訪問權限，無法進入此模組' }
    ],
    screens: [
      {
        name: '使用者帳號列表畫面',
        description: '列出系統所有使用者帳號',
        fields: ['帳號名稱', '所屬角色', '狀態', '最近登入時間', '帳號有效期']
      },
      {
        name: '帳號編輯畫面',
        description: '用於新增或修改單一使用者',
        fields: ['登入名稱', '姓名', 'Email', '密碼設定', '角色指派', '部門歸屬']
      },
      {
        name: '角色權限設定畫面',
        description: '分為角色列表和權限細節兩部分',
        fields: ['角色名稱', '權限項目', '模組訪問權', '操作權限', '數據範圍']
      },
      {
        name: '操作日誌查詢畫面',
        description: '管理員檢視近期系統關鍵操作紀錄',
        fields: ['日期時間', '使用者', '操作描述', '涉及模組', '操作結果']
      }
    ],
    importFormats: ['Excel使用者帳號清單', 'JSON角色權限設定'],
    exportFormats: ['Excel角色權限對照表', 'PDF權限分配報告', 'CSV操作日誌']
  },
  'dashboard': {
    name: '儀表板與統計分析模組',
    category: '報表分析',
    description: '提供全局性的Dashboard儀表板和各類統計分析報表',
    icon: 'DataAnalysis',
    status: '開發中',
    progress: 50,
    estimatedTime: '2個月',
    estimatedCost: 'NT$ 30-45 萬元',
    functionDescription: `
      <p><strong>功能概述：</strong></p>
      <ul>
        <li>關鍵指標KPI卡片：顯示「本月累計支出 vs 本月預算」、「全年預算執行率」等核心數字</li>
        <li>互動式圖表：包括折線圖、圓餅圖、條形圖、差異分析瀑布圖等</li>
        <li>預警提示：顯示系統自動偵測的異常狀況摘要，如專案超支、合約未付款等</li>
        <li>自定義報表產生器：允許具有權限的使用者自行拖拉欄位生成交叉分析表</li>
        <li>管理層決策輔助：將複雜數據轉化為有意義的資訊，提高決策效率</li>
      </ul>
    `,
    permissions: [
      { role: '管理員', description: '完全訪問權，查看全盤模組資訊和高階彙總數據' },
      { role: '會計人員', description: '監控財務指標，可能限制其看到某些高度彙總的資料' },
      { role: '製片', description: '客製化儀表板視圖，僅包含與其專案相關的統計' }
    ],
    screens: [
      {
        name: '管理儀表板主畫面',
        description: '系統首頁Dashboard，包含多個小型版塊',
        fields: ['目前進行專案數', '本月預算執行率', '年度累計支出', '預算執行彙總圖', '費用趨勢圖']
      },
      {
        name: '專案統計子畫面',
        description: '以圖表呈現各個專案的重要統計比較',
        fields: ['專案成本比較', '專案盈虧分析', '總成本', '超支額', '拍攝天數', '單日成本']
      },
      {
        name: '人力與資源統計子畫面',
        description: '用於HR或資源調度參考的統計',
        fields: ['員工薪資結構', '各專案人力配置', '工時分佈', '設備利用率']
      },
      {
        name: '自定義報表產生器',
        description: '簡易BI報表界面，自行拖拉欄位生成交叉分析表',
        fields: ['數據源選擇', '欄位拖拉區', '篩選條件', '圖表類型', '報表預覽']
      }
    ],
    importFormats: ['Excel外部指標數據', 'CSV全行業票房統計'],
    exportFormats: ['PDF Dashboard快照', 'Excel統計數據', 'PNG圖表圖片', 'CSV明細數據']
  }
}

const moduleInfo = computed(() => {
  const moduleKey = route.params.module as string
  return moduleData[moduleKey as keyof typeof moduleData]
})

const getStatusType = (status: string) => {
  switch (status) {
    case '開發中':
      return 'warning'
    case '規劃中':
      return 'info'
    case '新增功能':
      return 'success'
    default:
      return 'info'
  }
}

const getRoleType = (role: string) => {
  switch (role) {
    case '系統管理員':
    case '管理員':
      return 'danger'
    case '會計人員':
      return 'warning'
    case '製片':
      return 'info'
    default:
      return 'info'
  }
}

const getProgressStatus = (progress?: number) => {
  if (!progress) return undefined
  if (progress < 30) return 'exception'
  if (progress < 70) return undefined
  return 'success'
}

onMounted(() => {
  // 檢查是否有效的模組
  if (!moduleInfo.value) {
    // 如果模組不存在，重定向到儀表板
    // router.push('/dashboard')
  }
})
</script>

<style scoped>
.module-detail-container {
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.breadcrumb {
  margin-bottom: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.module-icon {
  font-size: 32px;
  color: #409eff;
}

.module-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.module-subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-content {
  margin-top: 20px;
  max-width: 1200px;
  margin: 20px auto 0 auto;
  width: 100%;
}

.content-card, .info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.function-description {
  line-height: 1.6;
}

.function-description :deep(ul) {
  padding-left: 20px;
}

.function-description :deep(li) {
  margin-bottom: 8px;
}

.screens-list {
  margin-top: 16px;
}

.screen-detail {
  padding: 12px 0;
}

.screen-description {
  margin-bottom: 12px;
  color: #606266;
}

.screen-fields h4 {
  margin: 12px 0 8px 0;
  font-size: 14px;
  color: #303133;
}

.field-tag {
  margin: 4px 8px 4px 0;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-item {
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fafafa;
}

.permission-role {
  margin-bottom: 8px;
}

.permission-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.import-export-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.import-section, .export-section {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
}

.import-section h4, .export-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.format-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.format-list li {
  display: flex;
  align-items: center;
}

.development-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-weight: 600;
  font-size: 13px;
  color: #606266;
}

.info-item .value {
  font-size: 14px;
  color: #303133;
}
</style>