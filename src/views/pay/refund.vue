<script setup lang="ts">
// 引入 Naive UI 组件
import { NButton, NCard, NEmpty, NInput, NModal, NResult, NSpace, NSpin, NTag } from 'naive-ui'
// 引入 Vue 核心功能
import { computed, onMounted, ref } from 'vue'
// 引入消息提示
import { useMessage } from 'naive-ui'
// 引入路由
import { useRouter } from 'vue-router'
// 引入布局相关hooks
import { useBasicLayout } from '@/hooks/useBasicLayout'
// 引入认证相关状态
import { useAuthStore } from '@/store'
// 引入API
import { getPreRefundDetail, queryPassport, requestRefund } from '@/api'

// 定义退款信息接口
interface RefundState {
  refundStatus: string
  totalAmount: number
  refundAmount: number
  version: string
  payTime: number
  usedDays: number
  totalDays: number
}

// 获取布局信息和路由
const { isMobile } = useBasicLayout()  // 判断是否为移动设备
const router = useRouter()             // 路由实例
const message = useMessage()           // 消息提示实例
const authStore = useAuthStore()       // 认证状态

// 页面状态变量
const isLoading = ref(false)           // 加载状态
const passportId = ref('')             // 通行证ID
const keyword = ref('')                // 关键字
const email = ref('')                  // 邮箱
const phone = ref('')                  // 手机号
const refundInfo = ref<RefundState | null>(null)  // 退款信息
const showConfirmModal = ref(false)    // 是否显示确认退款弹窗
const refundRequested = ref(false)     // 是否已申请退款
const refundSuccess = ref(false)       // 退款是否成功

// 计算属性
// 判断是否可以申请退款
const canRequestRefund = computed(() => {
  return refundInfo.value && refundInfo.value.refundStatus === '可申请退款'
})

// 状态标签颜色映射
const statusColorMap: Record<string, 'error' | 'success' | 'warning' | 'info'> = {
  '不支持退款': 'error',
  '可申请退款': 'success',
  '退款中': 'warning',
  '退款成功': 'info'
}

// 将时间戳格式化为日期字符串
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 返回上一页
function goBack() {
  router.back()
}

// 联系客服
function contactCustomerService() {
  window.location.href = 'https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

// 组件挂载时检查token
onMounted(async () => {
  try {
    const token = authStore.token
    if (token) {
      // 如果用户已登录，自动填入token并查询退款信息
      keyword.value = token
      await checkPassportDetails()
    }
  } catch (error) {
    console.error('Failed to check token:', error)
  }
})

// 通过通行证码查询订阅详情
async function checkPassportDetails() {
  if (!keyword.value.trim()) {
    message.warning('查询的内容不能为空')
    return
  }

  isLoading.value = true
  try {
    const input = keyword.value.trim()
    
    // 判断输入类型
    const isPassportId = input.includes('-') // 通行证码包含'-'
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) // 邮箱格式验证
    const isPhone = /^1[3-9]\d{9}$/.test(input) // 手机号格式验证

    if (!isPassportId && !isEmail && !isPhone) {
      message.warning('请输入正确的通行证码、邮箱或手机号')
      return
    }

    if (isPassportId) {
      // 如果是通行证码，直接查询退款信息
      passportId.value = input
      await fetchRefundInfo()
    } else {
      // 如果是邮箱或手机号，先查询通行证信息
      const response = await queryPassport(input)
      const passports = response.data
      
      if (!passports || passports.length === 0) {
        message.warning('未找到相关通行证')
        refundInfo.value = null
        return
      }
      
      // 使用第一个找到的通行证
      passportId.value = passports[0].passportId
      
      // 获取退款信息
      await fetchRefundInfo()
    }
  } catch (error: any) {
    message.error('查询失败: ' + (error.message || '请稍后再试'))
    refundInfo.value = null
  } finally {
    isLoading.value = false
  }
}

// 获取退款信息
async function fetchRefundInfo() {
  if (!passportId.value) {
    return
  }

  try {
    // 调用预退款详情接口
    const response = await getPreRefundDetail(passportId.value)
    const refundDetail = response.data
    
    // 更新退款信息
    refundInfo.value = {
      refundStatus: refundDetail.refundStatus,
      totalAmount: refundDetail.totalAmount,
      refundAmount: refundDetail.refundAmount,
      version: refundDetail.version,
      payTime: refundDetail.payTime,
      usedDays: refundDetail.usedDays,
      totalDays: refundDetail.totalDays
    }

    // 根据退款状态更新页面状态
    if (refundDetail.refundStatus === '退款中' || refundDetail.refundStatus === '退款成功') {
      refundRequested.value = true
      refundSuccess.value = refundDetail.refundStatus === '退款成功'
    }
    
  } catch (error: any) {
    refundInfo.value = null
    throw error // 向上传播错误
  }
}

// 申请退款
async function requestRefundAction() {
  if (!passportId.value || !refundInfo.value) {
    message.error('退款信息无效')
    return
  }

  showConfirmModal.value = false  // 关闭确认弹窗
  isLoading.value = true
  
  try {
    // 调用退款接口
    await requestRefund(passportId.value)
    
    message.success('退款申请已提交')
    refundRequested.value = true
    
    // 刷新退款信息
    await fetchRefundInfo()
    message.success('正在查询退款进度')
    const timer = setInterval(async () => {
      await fetchRefundInfo()
      if (refundInfo.value?.refundStatus === '退款成功' || refundInfo.value?.refundStatus === '不支持退款' || refundInfo.value?.refundStatus === '可申请退款') {
        clearInterval(timer)
        if (refundInfo.value.refundStatus === '退款成功') {
          message.success('退款已成功')
        } else if (refundInfo.value.refundStatus === '可申请退款') {
          message.error('退款失败，请重新申请')
        } else {
          message.error('退款失败')
        }
      } else if (refundInfo.value?.refundStatus === '退款中') {
        message.success('正在查询退款进度')
      }
    }, 10000)
    
  } catch (error: any) {
    message.error('申请退款失败: ' + (error.message || '请稍后再试'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
    <!-- 主容器，在非移动端时垂直居中 -->
    <div class="w-full h-full flex justify-center" :class="{ 'items-center': !isMobile }">
        <!-- 退款卡片 -->
        <NCard class="refund-card" :class="{ 'boxshadow-1': !isMobile, 'rounded': !isMobile }">
            <!-- 页面头部 -->
            <div class="w-full h-10 flex items-center">
                <!-- 返回按钮 -->
                <span @click="goBack" class="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" fill="currentColor">
                        </path>
                    </svg>
                </span>

                <!-- 页面标题 -->
                <span class="text-family text-2xl ml-5">退款申请</span>

                <!-- 移动端客服按钮 -->
                <div v-if="isMobile"
                    class="primary-color ml-4 flex w-14 h-6 text-xs p-1 items-center text-center rounded-3xl"
                    @click="contactCustomerService">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16">
                        <path
                            d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z"
                            fill="#ffffff" p-id="2605"></path>
                    </svg>
                    <span class="ml-0.5">客服</span>
                </div>

                <!-- 桌面端客服按钮 -->
                <div v-if="!isMobile"
                    class="primary-color ml-4 flex w-20 h-6 text-xs p-1 items-center text-center rounded-3xl"
                    @click="contactCustomerService">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16">
                        <path
                            d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z"
                            fill="#ffffff" p-id="2605"></path>
                    </svg>
                    <span class="ml-0.5">联系客服</span>
                </div>
            </div>

            <!-- 加载动画容器 -->
            <NSpin :show="isLoading">
                <!-- 通行证查询部分 - 当未获取到退款信息时显示 -->
                <div class="passport-lookup mt-10">
                    <div class="mb-10">
                        <h3 class="text-family text-lg font-medium mb-8">查询通行证信息</h3>

                        <!-- 通行证输入部分 -->
                        <div class="token-section mb-8">
                            <!-- 通行证输入框和查询按钮 -->
                            <div class="flex">
                                <NInput v-model:value="keyword" placeholder="请输入通行证码 或者 手机号 或者 邮箱"
                                    class="flex-1 mr-2" />
                                <NButton type="primary" @click="checkPassportDetails">查询</NButton>
                            </div>
                        </div>

                        <!-- 提示信息 -->
                        <p class="text-gray-500 text-sm mt-2">注意：请使用购买时填写的手机号或者邮箱</p>
                        <p class="text-gray-500 text-sm mt-1 leading-6">退款规则：按照2025年5月12日0时截止计算已使用天数，退款金额 = 支付总金额 - 已使用天数 * 每天单价</p>
                    </div>
                </div>

                <!-- 退款信息显示部分 - 当获取到退款信息时显示 -->
                <div v-if="refundInfo" class="refund-info mt-6">
                    <!-- 标题和状态标签 -->
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-family text-lg font-medium">退款信息</h3>
                        <NTag :type="statusColorMap[refundInfo.refundStatus]">{{ refundInfo.refundStatus }}</NTag>
                    </div>

                    <!-- 退款信息表格 -->
                    <div class="info-grid">
                        <!-- 通行证码 -->
                        <div class="info-row">
                            <span class="info-label">通行证码：</span>
                            <span class="info-value">{{ passportId }}</span>
                        </div>

                        <!-- 订阅版本 -->
                        <div class="info-row">
                            <span class="info-label">订阅版本：</span>
                            <span class="info-value">{{ refundInfo.version }}</span>
                        </div>

                        <!-- 购买时间 -->
                        <div class="info-row">
                            <span class="info-label">购买时间：</span>
                            <span class="info-value">{{ formatDate(refundInfo.payTime) }}</span>
                        </div>

                        <!-- 总时长 -->
                        <div class="info-row">
                            <span class="info-label">总时长：</span>
                            <span class="info-value">{{ refundInfo.totalDays }}天</span>
                        </div>

                        <!-- 已使用时长 -->
                        <div class="info-row">
                            <span class="info-label">已使用时长：</span>
                            <span class="info-value">{{ refundInfo.usedDays }}天</span>
                        </div>

                        <!-- 总金额 -->
                        <div class="info-row">
                            <span class="info-label">总金额：</span>
                            <span class="info-value">¥{{ refundInfo.totalAmount.toFixed(2) }}</span>
                        </div>

                        <!-- 可退金额 - 仅在可申请退款状态下显示 -->
                        <div class="info-row" v-if="refundInfo.refundStatus === '可申请退款'">
                            <span class="info-label">可退金额：</span>
                            <span class="info-value font-bold text-green-600">¥{{ refundInfo.refundAmount.toFixed(2)
                                }}</span>
                        </div>
                    </div>

                    <!-- 操作按钮区域 -->
                    <div class="mt-8 flex justify-center">
                        <NSpace>
                            <!-- 申请退款按钮 - 仅在可申请退款状态下显示 -->
                            <NButton v-if="canRequestRefund" type="primary" @click="showConfirmModal = true">
                                申请退款
                            </NButton>
                        </NSpace>
                    </div>

                    <!-- 退款状态消息 - 退款中状态 -->
                    <div class="mt-6 text-center" v-if="refundInfo.refundStatus === '退款中'">
                        <p class="text-yellow-600">您的退款申请正在处理中，预计花费5分钟，请耐心等待。</p>
                        <p class="text-gray-500 text-sm mt-2">如有疑问，请联系客服。</p>
                    </div>

                    <!-- 退款状态消息 - 退款成功状态 -->
                    <div class="mt-6 text-center" v-if="refundInfo.refundStatus === '退款成功'">
                        <NResult status="success" title="退款成功" description="退款金额将原路返回，请注意查收">
                            <template #footer>
                                <NButton @click="router.push('/')">返回首页</NButton>
                            </template>
                        </NResult>
                    </div>

                    <!-- 退款状态消息 - 不支持退款状态 -->
                    <div class="mt-6 text-center" v-if="refundInfo.refundStatus === '不支持退款'">
                        <NResult status="error" title="不支持退款" description="您的订阅不符合退款条件">
                            <template #footer>
                                <NButton @click="contactCustomerService">联系客服</NButton>
                            </template>
                        </NResult>
                    </div>
                </div>
            </NSpin>

            <!-- 空状态 - 当查询后未找到订阅信息时显示 -->
            <NEmpty v-if="!isLoading && !refundInfo && (passportId || email || phone)" description="未找到相关订阅信息" />
        </NCard>
    </div>

    <!-- 确认退款弹窗 -->
    <NModal v-model:show="showConfirmModal" preset="dialog" title="确认申请退款" positive-text="确认" negative-text="取消"
        @positive-click="requestRefundAction">
        <template #default>
            <p>您确定要申请退款吗？退款金额为 <span class="font-bold">¥{{ refundInfo?.refundAmount.toFixed(2) }}</span></p>
            <p class="mt-2 text-gray-500 text-sm">申请提交后，退款将在5分钟内原路退回购买时支付账户</p>
        </template>
    </NModal>
</template>

<style scoped>
/* 退款卡片样式 */
.refund-card {
  width: 96%;
  max-width: 600px;
  padding: 20px;
  color: #41454c;
}

/* 文本字体样式 */
.text-family {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "Microsoft JhengHei", sans-serif;
}

/* 卡片阴影效果 */
.boxshadow-1 {
  box-shadow: 0 0 0 1px #e0e0e0, 0 2px 4px 0 rgba(0, 0, 0, 0.07), 0 1px 1.5px 0 rgba(0, 0, 0, 0.05);
}

/* 主题色样式 */
.primary-color {
  color: white;
  background-color: #18a058;
}

/* 信息网格布局 */
.info-grid {
  display: grid;
  gap: 16px;
}

/* 信息行样式 */
.info-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
}

/* 信息标签样式 */
.info-label {
  flex: 0 0 100px;
  color: #6b6f75;
}

/* 信息值样式 */
.info-value {
  flex: 1;
  color: #41454c;
}

/* 响应式调整 */
@media (max-width: 768px) {
  /* 移动端退款卡片样式 */
  .refund-card {
    width: 100%;
    padding: 16px;
  }
  
  /* 移动端信息行垂直排列 */
  .info-row {
    flex-direction: column;
  }
  
  /* 移动端标签样式调整 */
  .info-label {
    flex: 0 0 auto;
    margin-bottom: 4px;
  }
}
</style> 