<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NPopconfirm, NSelect, useMessage, NTag } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore, useAuthStore } from '@/store'
import { getCurrentDate } from '@/utils/functions'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { fetchVersionInfo } from '@/api'
import { Type } from 'naive-ui/es/button/src/interface'
import { Document } from '@/components/common'

const appStore = useAppStore()

const authStore = useAuthStore()

const { isMobile } = useBasicLayout()

const ms = useMessage()

const theme = computed(() => appStore.theme)

const versionDesc = ref("免费体验版")
const versionStyle = ref<Type>("primary")

const tokenStr = ref<string>(authStore.token ?? '') 

const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: 'Español', key: 'es-ES', value: 'es-ES' },
  { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
  { label: 'Tiếng Việt', key: 'vi-VN', value: 'vi-VN' },
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
]

function setToken() {
  tokenStr.value = tokenStr.value.trim()
  if (tokenStr.value.length > 0 && tokenStr.value.trim().length === 0) {
    ms.error('请输入格式正确的通行证码')
  } else {
    authStore.setToken(tokenStr.value)
    refreshVersion()
    ms.success(t('common.success'))
  }
}

function exportData(): void {
  const date = getCurrentDate()
  const data: string = localStorage.getItem('chatStorage') || '{}'
  const jsonString: string = JSON.stringify(JSON.parse(data), null, 2)
  const blob: Blob = new Blob([jsonString], { type: 'application/json' })
  const url: string = URL.createObjectURL(blob)
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = url
  link.download = `chat-store_${date}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function importData(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target || !target.files)
    return

  const file: File = target.files[0]
  if (!file)
    return

  const reader: FileReader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('chatStorage', JSON.stringify(data))
      ms.success(t('common.success'))
      location.reload()
    }
    catch (error) {
      ms.error(t('common.invalidFileFormat'))
    }
  }
  reader.readAsText(file)
}

function clearData(): void {
  localStorage.removeItem('chatStorage')
  location.reload()
}

function handleImportButtonClick(): void {
  const fileInput = document.getElementById('fileInput') as HTMLElement
  if (fileInput)
    fileInput.click()
}

refreshVersion()
function refreshVersion(): void {
  // 专业版 2024.01.08 到期
  if (tokenStr.value.length > 0 && tokenStr.value.trim().length === 0) {
    // 输入的是空格
  } else if (tokenStr.value.length === 0) {
    // 清空了token
    versionDesc.value = "免费体验版"
    versionStyle.value = "primary"
  } else {
    // 输入了正确格式的通行码
    fetchVersionInfo<string>(tokenStr.value)
    .then(response => { 
      versionDesc.value = response.data
      if (response.data.includes("过期") || response.data.includes("无效")) {
        versionStyle.value = "error"
      } else if (response.data.includes("经典")) {
        versionStyle.value = "info"
      } else if (response.data.includes("专业")) {
        versionStyle.value = "warning"
      }
    })
    .catch(error => {
      versionDesc.value = "网络无法连接"
      versionStyle.value = "error"
    });
    versionDesc.value = "加载中..."
    versionStyle.value = "primary"
  }
}

const showDocument = ref(false)
const documentUrl = ref("https://www.yuque.com/u34348689/gd5ohu/vi4sgrlpoqhgonm6?view=doc_embed&from=asite")
const documentTitle = ref("通行证订阅方案")

function goPay() {
  showDocument.value = true
}

</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">通行证码</span>  
        <div class="flex-1">
          <NInput v-model:value="tokenStr" placeholder="联系微信公众号 AI搜索小助手 获取" />
        </div>
        <NButton size="tiny" text type="primary" @click="setToken()">
          {{ $t('common.save') }}
        </NButton>
      </div>
  
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">版本</span>
        <div class="flex-1">
          <n-button strong ghost v-bind:type="versionStyle" @click="goPay">
            {{ versionDesc }}
          </n-button>
        </div>
      </div>

      <div class="flex items-center space-x-4" :class="isMobile && 'items-start'">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatHistory') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <NButton size="small" @click="exportData">
            <template #icon>
              <SvgIcon icon="ri:download-2-fill" />
            </template>
            {{ $t('common.export') }}
          </NButton>

          <input id="fileInput" type="file" style="display:none" @change="importData">
          <NButton size="small" @click="handleImportButtonClick">
            <template #icon>
              <SvgIcon icon="ri:upload-2-fill" />
            </template>
            {{ $t('common.import') }}
          </NButton>

          <NPopconfirm placement="bottom" @positive-click="clearData">
            <template #trigger>
              <NButton size="small">
                <template #icon>
                  <SvgIcon icon="ri:close-circle-line" />
                </template>
                {{ $t('common.clear') }}
              </NButton>
            </template>
            {{ $t('chat.clearHistoryConfirm') }}
          </NPopconfirm>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <template v-for="item of themeOptions" :key="item.key">
            <NButton
              size="small"
              :type="item.key === theme ? 'primary' : undefined"
              @click="appStore.setTheme(item.key)"
            >
              <template #icon>
                <SvgIcon :icon="item.icon" />
              </template>
            </NButton>
          </template>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <NSelect
            style="width: 140px"
            :value="language"
            :options="languageOptions"
            @update-value="(value: Language) => appStore.setLanguage(value)"
          />
        </div>
      </div>
      <div class="flex items-center flex-col space-x-4"> 
        <img class="w-72" src="/gongzhonghao1.jpeg"/>
        <n-tag class="mt-5" type="success"> 遇到任何问题请联系上面的官方微信公众号 </n-tag>
      </div>
    </div>
    <Document v-model:visible="showDocument" :documentUrl="documentUrl" :title="documentTitle" :large=true />
  </div>
</template>
