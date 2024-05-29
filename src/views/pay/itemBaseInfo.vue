<script setup lang="ts">
import { NButton, NCheckbox } from 'naive-ui'
import { computed,ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { draftOrderStore, Version, Duration } from '@/store/modules/pay'
import { useRouter } from 'vue-router'
import OpenInOtherBrowser from './openInOtherBrowser.vue'

const router = useRouter()

const store = draftOrderStore()

const { isMobile } = useBasicLayout()

const openInWechat = ref<boolean>(false)
openInWechat.value = isOpenInWechat()

function isOpenInWechat() {
    if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
        return true
    } else {
        return false
    }
}

function onKefuButtonClick() {
    window.location.href = 'https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

const isClassic = computed(() => {
    return store.version === Version.CLASSIC
})

const chooseClassic = () => {
    store.version = Version.CLASSIC
}

const isPro = computed(() => {
    return store.version === Version.PROFESSIONAL
})

const choosePro = () => {
    store.version = Version.PROFESSIONAL
}

const isMonthly = computed(() => {
    return store.duration === Duration.MONTHLY
})

const chooseMonthly = () => {
    store.duration = Duration.MONTHLY
}

const isQuarter = computed(() => {
    return store.duration === Duration.QUARTER
})

const chooseQuarter = () => {
    store.duration = Duration.QUARTER
}

const isYear = computed(() => {
    return store.duration === Duration.YEAR
})

const chooseYear = () => {
    store.duration = Duration.YEAR
}

const showOriginalPrice = computed(() => {
    return store.calculateOriginalPrice !== store.calculateRealPrice
})

const isValid = () => {
    return store.version !== Version.EMPTY && store.duration !== Duration.EMPTY
}

const isNextButtonDisabled = computed(() => {
    return !isValid()
})

const onNextButtonClick = () => {
    router.push('/pay/address')
}

const onBackButtonClick = () => {
    window.location.href = 'https://www.talkwithai.xyz/#/chat'
}
</script>

<template>
    <div v-if="!openInWechat" class="w-full h-full flex justify-center" :class="{ 'items-center': !isMobile }">

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
                    购买通行证
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
                <p class="text-family text-base font-normal">购买版本</p>
            </div>

            <div class="w-full h-10">
                <n-checkbox :checked="isClassic" size="large" style="margin-right: 12px" @click="chooseClassic">
                    经典版
                </n-checkbox>

                <n-checkbox :checked="isPro" size="large" style="margin-right: 12px" @click="choosePro">
                    专业版
                </n-checkbox>
            </div>

            <div class="w-full h-10 mt-6">
                <p class="text-family text-base font-normal">购买时长</p>
            </div>

            <div class="w-full h-10">
                <n-checkbox :checked="isMonthly" size="large" style="margin-right: 12px" @click="chooseMonthly">
                    1个月
                </n-checkbox>

                <n-checkbox :checked="isQuarter" size="large" style="margin-right: 12px" @click="chooseQuarter">
                    3个月
                </n-checkbox>

                <n-checkbox :checked="isYear" size="large" style="margin-right: 12px" @click="chooseYear">
                    12个月
                </n-checkbox>
            </div>

            <div class="w-full mt-6 h-10">
                <p class="text-family text-base font-normal">应付金额</p>
            </div>

            <div class="w-full h-10">
                <span class="text-family text-base font-normal">￥</span>
                <span class="text-family text-2xl font-normal"> {{ store.calculateRealPrice }} </span>
                <span class="text-family text-sm font-normal line-through ml-2" v-if="showOriginalPrice"
                    style="color: #9aa5b8;">￥{{ store.calculateOriginalPrice }}</span>
            </div>

            <div class="w-full mt-6 flex items-center justify-between">
                <n-button class="w-full" size="large" type="primary" :disabled="isNextButtonDisabled"
                    @click="onNextButtonClick">下一步</n-button>
            </div>
        </div>
    </div>

    <OpenInOtherBrowser v-if="openInWechat"/>
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
