<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { NButton, NLayoutSider, useDialog } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore, SvgIcon } from '@/components/common'
import { t } from '@/locales'
import { useRoute } from 'vue-router'

const userStore = useUserStore()

const Document = defineAsyncComponent(() => import('@/components/common/Document/index.vue'))

const appStore = useAppStore()
const chatStore = useChatStore()

const dialog = useDialog()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function handleClearAll() {
  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.clearHistoryConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearHistory()
      if (isMobile.value)
        appStore.setSiderCollapsed(true)
      // fix：清空后，添加一个新的聊天，无聊天记录的bug
      handleAdd()
    },
  })
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

onMounted(() => {
  handleAdd()
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)


// 教程文档
const showTutorialDocument = ref(false)
const tutorialDocumentUrl = ref("https://www.yuque.com/u34348689/gd5ohu/gwngglm7u0r6ud6e?view=doc_embed&from=asite")
const tutorialDocumentTitle = ref("使用教程")
function goToTutorial() {
  showTutorialDocument.value = true
}

// 订阅方案文档 有两个地方有
const showSubscribeDocument = ref(false)
const subscribeDocumentUrl = ref("https://www.yuque.com/u34348689/gd5ohu/vi4sgrlpoqhgonm6?view=doc_embed&from=asite")
const subscribeDocumentTitle = ref("通行证订阅方案")
const route = useRoute()
// 是否展示某一个组件
const { component } = route.params as { component: string }
if (component === 'subscribe') {
  showSubscribeDocument.value = true
}

// 首页通知文档 
const showNewsDocument = ref(false)
const newsDocumentUrl = ref("https://www.yuque.com/u34348689/gd5ohu/garszwiv5mwgddq8?view=doc_embed&from=asite")
const newsDocumentTitle = ref("新闻")

showNewsToday()
function showNewsToday() {
  const now = new Date()
  // 间隔16h以上打开一次
  const hoursBetweenNum = getHoursBetween(userStore.userInfo.lastTimeShowNews, now.getTime())
  if (hoursBetweenNum >= 16 && showSubscribeDocument.value === false) {
    showNewsDocument.value = true
    userStore.updateLastTimeShowNews(now.getTime())
  }
}
function getHoursBetween(time1: number, time2: number): number {
  if (time1 === null || time1 === undefined || time2 === null || time2 === undefined) {
    return 1000
  }
  const difference = Math.abs(time1 - time2)
  return Math.floor(difference / (1000 * 60 * 60));
}

</script>

<template>
  <NLayoutSider :collapsed="collapsed" :collapsed-width="0" :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'" collapse-mode="transform" position="absolute" bordered
    :style="getMobileClass" @update-collapsed="handleUpdateCollapsed">
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>

        <div class="flex items-center px-4 space-x-4">
          <div class="flex-1">
            <NButton block type="primary" @click="goToTutorial">
              使用教程
            </NButton>
          </div>
        </div>

        <div class="flex items-center p-4 space-x-4">
          <div class="flex-1">
            <NButton block @click="show = true">
              {{ $t('store.siderButton') }}
            </NButton>
          </div>
          <NButton @click="handleClearAll">
            <SvgIcon icon="ri:close-circle-line" />
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />

  <Document v-model:visible="showTutorialDocument" :documentUrl="tutorialDocumentUrl" :title="tutorialDocumentTitle" :large=true />
  <Document v-model:visible="showSubscribeDocument" :documentUrl="subscribeDocumentUrl" :title="subscribeDocumentTitle" :large=true />
  <Document v-model:visible="showNewsDocument" :documentUrl="newsDocumentUrl" :title="newsDocumentTitle" :large=false />
</template>
