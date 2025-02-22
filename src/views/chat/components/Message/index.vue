<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NDropdown, useMessage } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { SvgIcon } from '@/components/common'
import { useIconRender } from '@/hooks/useIconRender'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { copyToClip } from '@/utils/copy'
import { extractFileName, extractFileUrl } from '@/utils/functions'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const { iconRender } = useIconRender()

const message = useMessage()

const textRef = ref<HTMLElement>()

const asRawText = ref(props.inversion)

// 是否是文件（除图片）
const isFileExceptImg = ref(false)
// 是否是excel表格
const isExcel = ref(false)
const fileName = ref()
const fileUrl = ref()

// 用户发送文件
if (props.text?.startsWith('<div id="file_talkwithai')) {
  asRawText.value = false
  const fileType = props.text?.substring(props.text?.indexOf('<div id="file_talkwithai') + 25, props.text?.indexOf('>') - 1)
  console.log(fileType)
  if (!fileType.match('jpg') && !fileType.match('jpeg') && !fileType.match('webp') && !fileType.match('png')) {
    // 文件是除图片以外的文件, 需要展示进一步信息
    isFileExceptImg.value = true;
    // 解析文件类型
    if (fileType.match('xls') || fileType.match('xlsx')) {
        isExcel.value = true
    } 
    // 解析文件名称
    fileName.value = extractFileName(props.text)
    // 解析文件链接
    fileUrl.value = extractFileUrl(props.text)
  }
}

function downloadFile() {
  const link = document.createElement('a')
  link.href = fileUrl.value
  link.style.display = 'none'
  link.setAttribute('download', fileName.value)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const messageRef = ref<HTMLElement>()

const options = computed(() => {
  const common = [
    {
      label: t('chat.copy'),
      key: 'copyText',
      icon: iconRender({ icon: 'ri:file-copy-2-line' }),
    },
    {
      label: t('common.delete'),
      key: 'delete',
      icon: iconRender({ icon: 'ri:delete-bin-line' }),
    },
  ]

  if (!props.inversion) {
    common.unshift({
      label: asRawText.value ? t('chat.preview') : t('chat.showRawText'),
      key: 'toggleRenderType',
      icon: iconRender({ icon: asRawText.value ? 'ic:outline-code-off' : 'ic:outline-code' }),
    })
  }

  return common
})

function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType') {
  switch (key) {
    case 'copyText':
      handleCopy()
      return
    case 'toggleRenderType':
      asRawText.value = !asRawText.value
      return
    case 'delete':
      emit('delete')
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView()
  emit('regenerate')
}

async function handleCopy() {
  try {
    await copyToClip(props.text || '')
    message.success(t('chat.copied'))
  }
  catch {
    message.error(t('chat.copyFailed'))
  }
}
</script>

<template>
  <div ref="messageRef" class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
    <div class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']">
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        v-if="!isFileExceptImg"
        class="flex items-end gap-1 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-col">
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button>
          <NDropdown
            :trigger="isMobile ? 'click' : 'hover'"
            :placement="!inversion ? 'right' : 'left'"
            :options="options"
            @select="handleSelect"
          >
            <button class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200">
              <SvgIcon icon="ri:more-2-fill" />
            </button>
          </NDropdown>
        </div>
      </div>

      <div v-if="isFileExceptImg" class="p-2 max-w-80 rounded-xl border mt-2">
        <div class="flex" @click="downloadFile()">
          <div v-if="isExcel"> 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0"
              width="36" height="36">
              <rect width="36" height="36" rx="6" fill="#10A37F"></rect>
              <path
                d="M15.5 10.5H12.1667C11.2462 10.5 10.5 11.2462 10.5 12.1667V13.5V18M15.5 10.5H23.8333C24.7538 10.5 25.5 11.2462 25.5 12.1667V13.5V18M15.5 10.5V25.5M15.5 25.5H18H23.8333C24.7538 25.5 25.5 24.7538 25.5 23.8333V18M15.5 25.5H12.1667C11.2462 25.5 10.5 24.7538 10.5 23.8333V18M10.5 18H25.5"
                stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div v-if="!isExcel">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none" class="h-10 w-10 flex-shrink-0"
              width="36" height="36">
              <rect width="36" height="36" rx="6" fill="#1890ff"></rect>
              <path
                d="M19.6663 9.66663H12.9997C12.5576 9.66663 12.1337 9.84222 11.8212 10.1548C11.5086 10.4673 11.333 10.8913 11.333 11.3333V24.6666C11.333 25.1087 11.5086 25.5326 11.8212 25.8451C12.1337 26.1577 12.5576 26.3333 12.9997 26.3333H22.9997C23.4417 26.3333 23.8656 26.1577 24.1782 25.8451C24.4907 25.5326 24.6663 25.1087 24.6663 24.6666V14.6666L19.6663 9.66663Z"
                stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M19.667 9.66663V14.6666H24.667" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path d="M21.3337 18.8334H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path d="M21.3337 22.1666H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path d="M16.3337 15.5H15.5003H14.667" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="ml-2 mr-1">
            <div class="truncate font-semibold"> {{fileName}} </div>
            <div class="truncate text-grey-1"> {{isExcel ? "电子表格" : "文档"}} </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-grey-1 {
  color: #8c8c8c;
}
</style>
