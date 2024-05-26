<script setup lang="ts">
import { NInput, NButton, NFormItem, NForm, NPopconfirm } from 'naive-ui'
import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { trial } from '@/api'
import { useBasicLayout } from '@/hooks/useBasicLayout'

function onKefuButtonClick() {
    window.location.href = 'https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

const { isMobile } = useBasicLayout()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const message = useMessage()
const email = ref<string>("")

const onBackButtonClick = () => {
    window.location.href = 'https://www.talkwithai.xyz/#/chat'
}

const onNextButtonClick = () => {
    email.value = email.value.trim()
    trial(email.value)
    .then(response => {
        message.success("体验卡发送成功，请在您填写的邮箱中查收!")
    })
    .catch(error => {
        message.error(error.message)
    });
}

const emailValidFeedback = ref<string>()
const emailValidStatus = computed(() => {
    if (email.value === "") {
        emailValidFeedback.value = ""
        return undefined
    } else {
        if (emailRegex.test(email.value)) {
            emailValidFeedback.value = ""
            return 'success'
        } else {
            emailValidFeedback.value = "邮箱地址的格式不正确"
            return 'error'
        }
    }
})

const isNextButtonDisable = computed(() => {
    return !(emailValidStatus.value !== "error" && email.value !== "")
})

</script>

<template>
    <div class="w-full h-full flex justify-center" :class="{ 'items-center': !isMobile }">
        <div class="w-96 text-gray-600 p-10" :class="{ 'boxshadow-1': !isMobile, 'rounded': !isMobile }">
            <div class="w-full h-10 flex items-center">
                <span @click="onBackButtonClick">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px"
                        height="32px" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" fill="currentColor">
                        </path>
                    </svg>
                </span>

                <span class="text-family text-2xl ml-5">
                    获取体验卡
                </span>

                <div v-if="isMobile"
                    class="primary-color ml-4 flex w-14 h-6 text-xs p-1 items-center text-center rounded-3xl"
                    @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16">
                        <path
                            d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z"
                            fill="#ffffff" p-id="2605"></path>
                    </svg>
                    <span class="ml-0.5">客服</span>
                </div>

                <div v-if="!isMobile"
                    class="primary-color ml-4 flex w-20 h-6 text-xs p-1 items-center text-center rounded-3xl"
                    @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16">
                        <path
                            d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z"
                            fill="#ffffff" p-id="2605"></path>
                    </svg>
                    <span class="ml-0.5">联系客服</span>
                </div>
            </div>

            <div class="w-full h-10 mt-10">
                <span class="text-family text-base font-normal">通行证码接收地址</span>
                <span class="text-family text-xs font-normal text-gray-400 ml-2">经典版体验卡3天 * 1张</span>
            </div>

            <div class="w-full mt-4">
                <n-form>
                    <n-form-item :show-label="false" :validation-status="emailValidStatus"
                        :feedback="emailValidFeedback">
                        <n-input v-model:value="email" class="h-10 flex items-center" type="text" placeholder="邮箱" />
                    </n-form-item>
                </n-form>
            </div>

            <div class="w-full mt-2">
                <n-popconfirm @positive-click="onNextButtonClick" :show-icon="false">
                    <template #trigger>
                        <n-button class="w-full" size="large" :disabled="isNextButtonDisable"
                            type="primary">发送</n-button>
                    </template>
                    确认信息？
                </n-popconfirm>
            </div>

            <p class="mt-6 text-xs text-gray-400">说明：体验卡每人仅能领取1次。</p>

        </div>
    </div>
</template>

<style scoped>
.text-family {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "Microsoft JhengHei", sans-serif;
}

.boxshadow-1 {
    box-shadow: 0 0 0 1px #e0e0e0, 0 2px 4px 0 rgba(0, 0, 0, 0.07), 0 1px 1.5px 0 rgba(0, 0, 0, 0.05);
}

.primary-color {
    color: white;
    background-color: #18a058;
}
</style>
