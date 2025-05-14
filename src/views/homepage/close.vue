<script setup lang="ts">
import { NCard, NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/store'
import { fetchVersionInfo } from '@/api'
import { useRouter } from 'vue-router'

// State variables
const showRefundNotice = ref(false)
const accessTokenInfo = ref('')
const authStore = useAuthStore()
const router = useRouter()

// Check for access token on mount
onMounted(() => {
  document.title = '网站已关停'
  checkAccessToken()
})

// Function to check if user has a valid access token
async function checkAccessToken() {
  const token = authStore.token
  
  if (token) {
    try {
      const response = await fetchVersionInfo<string>(token)
      const versionInfo = response.data
      
      // If token is valid and not expired
      if (!(versionInfo.includes("过期") || versionInfo.includes("无效"))) {
        accessTokenInfo.value = versionInfo
        showRefundNotice.value = true
      }
    } catch (error) {
      console.error('Failed to fetch token info:', error)
    }
  }
}

const onRefundClick = () => {
  router.push('/refund')
}
</script>

<template>
    <div class="close-container">
        <NCard class="close-card" size="large">
            <div class="close-content">
                <h2 class="close-title">按照国家有关网络安全规定，网站即日起（2025年5月12日）停止服务。</h2>

                <div v-if="showRefundNotice" class="refund-notice">
                    <p class="refund-title">您的通行证码：{{ authStore.token }}</p>
                    <p class="refund-message">{{ accessTokenInfo }}</p>
                    <NButton type="primary" class="refund-button" @click="onRefundClick">点击申请退款</NButton>
                </div>

                <p class="close-message">如遇问题请联系下方微信公众号客服处理</p>
                <img class="gongzhanghao" src="/gongzhonghao1.jpeg" />


                <div class="recommendation">
                    <p class="recommend-text">推荐相关替代网站</p>
                    <a href="https://www.deepseek.com" target="_blank">
                        <img alt="DeepSeek Logo" loading="lazy" width="112" height="24" class="deepseek-logo"
                            src="https://cdn.deepseek.com/logo.png">
                    </a>
                </div>
            </div>

        </NCard>

    </div>
</template>

<style scoped>
.close-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.close-card {
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.close-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.close-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #41454c;
}

.close-message {
  margin-top: 6vh;
  font-size: 16px;
  color: #6b6f75;
}

.gongzhanghao {
  margin-top: 2vh;
  height: 103px;
  width: 300px;
}

.refund-notice {
  margin-top: 4vh;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  width: 100%;
  border-left: 4px solid #18a058;
}

.refund-title {
  font-size: 16px;
  font-weight: 500;
  color: #41454c;
  margin-bottom: 1vh;
}

.refund-message {
  font-size: 14px;
  color: #6b6f75;
  margin-bottom: 1vh;
}

.refund-button {
  margin-top: 1vh; 
}

.recommendation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4vh;
  padding-top: 2vh;
  border-top: 1px solid #eee;
  width: 100%;
}

.recommend-text {
  font-weight: 400;
  font-size: 16px;
  color: #6b6f75;
  margin-bottom: 2vh;
  margin-top: 2vh;
}

.deepseek-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #1890ff;
  transition: opacity 0.3s;
}

.deepseek-link:hover {
  opacity: 0.8;
}

.deepseek-logo {
  height: 24px;
  margin-right: 8px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .close-card {
    width: 100%;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
}
</style>
