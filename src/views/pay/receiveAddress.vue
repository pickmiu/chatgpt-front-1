<script setup lang="ts">
import { NInput, NButton, NFormItem, NForm } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { createOrder, Order } from '@/api'
import { draftOrderStore, Version, Duration } from '@/store/modules/pay'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useRouter } from 'vue-router';

function onKefuButtonClick() {
    window.location.href='https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

const { isMobile } = useBasicLayout()
const store = draftOrderStore()
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d+$/;
const message = useMessage()

const router = useRouter()

const onBackButtonClick = () => {
    router.push('/pay/item')
}

const onNextButtonClick = () => {
    store.email = store.email.trim()
    store.phone = store.phone.trim()
    // 请求下单接口
    createOrder(store.version, store.duration, store.email, store.phone)
    .then(response => { 
        console.log(response.data)
        const order = response.data as Order
        if (order.id === null) {
            message.error("下单失败 服务器异常")
            return
        }
        let identify;
        if (order.email !== null && order.email.length !== 0) {
            identify = order.email
            router.push('/pay/confirm/' + order.id + "/" + identify)
        } else if (order.phone !== null && order.phone.length !== 0) {
            identify = order.phone
            router.push('/pay/confirm/' + order.id + "/" + identify)
        } else  {
            message.error("下单失败 服务器异常")
        }
    })
    .catch(error => {
        message.error(error.message)
        console.log(error)
    });
}

onMounted(() => {
    if (store.version === Version.EMPTY || store.duration === Duration.EMPTY) {
        router.push('/pay/item')
    }
})

const emailValidFeedback = ref<string>()
const emailValidStatus = computed(() => {
    if (store.email === "") {
        emailValidFeedback.value = ""
        return undefined
    } else {
        if (emailRegex.test(store.email)) {
            emailValidFeedback.value = ""
            return 'success'
        } else {
            emailValidFeedback.value = "邮箱地址的格式不正确"
            return 'error'
        }
    }
})
const phoneValidFeedback = ref<string>()
const phoneValidStatus = computed(() => {
    if (store.phone === "") {
        phoneValidFeedback.value = ""
        return undefined
    } else {
        if (phoneRegex.test(store.phone)) {
            phoneValidFeedback.value = ""
            return 'success'
        } else {
            phoneValidFeedback.value = "手机号码必须是纯数字"
            return 'error'
        }
    }
})

const isNextButtonDisable = computed(() => {
    return !(emailValidStatus.value !== "error" && phoneValidStatus.value !== "error" && (store.email !== "" || store.phone !== ""))
})

</script>

<template>
    <div class="w-full h-full flex justify-center" :class="{'items-center' : !isMobile}">
        <div class="w-96 text-gray-600 p-10" :class="{'boxshadow-1': !isMobile, 'rounded' : !isMobile}">
            <div class="w-full h-10 flex items-center">
                <span @click="onBackButtonClick"> 
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" fill="currentColor"></path></svg>
                </span>

                <span class="text-family text-2xl ml-5"> 
                    填写收货信息
                </span>

                <!-- 'p-10': !isMobile, 'p-10': isMobile -->
                <div v-if="isMobile" class="primary-color ml-4 flex w-14 h-6 text-xs p-1 items-center text-center rounded-3xl" @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16"><path d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z" fill="#ffffff" p-id="2605"></path></svg>
                    <span class="ml-0.5">客服</span>
                </div>

                <div v-if="!isMobile" class="primary-color ml-4 flex w-20 h-6 text-xs p-1 items-center text-center rounded-3xl" @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16"><path d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z" fill="#ffffff" p-id="2605"></path></svg>
                    <span class="ml-0.5">联系客服</span>
                </div>
            </div>

            <div class="w-full h-10 mt-10"> 
                <span class="text-family text-base font-normal">通行证码接收方式</span>
                <span class="text-family text-xs font-normal text-gray-400 ml-2">至少填写一种</span>
            </div>

            <div class="w-full mt-4">
                <n-form>
                    <n-form-item :show-label="false" :validation-status="emailValidStatus" :feedback="emailValidFeedback">
                        <n-input v-model:value="store.email" class="h-10 flex items-center" type="text" placeholder="邮箱" />
                    </n-form-item>
                </n-form>
            </div>

            <div class="w-full"> 
                <n-form>
                    <n-form-item :show-label="false" :validation-status="phoneValidStatus" :feedback="phoneValidFeedback">
                        <n-input v-model:value="store.phone" class="h-10 flex items-center" type="text" placeholder="手机号" />
                    </n-form-item>
                </n-form>
            </div>

            <div class="w-full mt-5"> 
                <n-button class="w-full" size="large" :disabled="isNextButtonDisable" type="primary" @click="onNextButtonClick">下单</n-button>
            </div>

        </div>
    </div>
</template>

<style scoped>
.text-family {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue","Ubuntu","PingFang SC","Hiragino Sans GB","Heiti SC","Microsoft YaHei","Microsoft JhengHei",sans-serif;
}

.boxshadow-1 {
    box-shadow: 0 0 0 1px #e0e0e0,0 2px 4px 0 rgba(0,0,0,0.07),0 1px 1.5px 0 rgba(0,0,0,0.05);
}

.primary-color {
    color: white;
    background-color: #18a058;
}
</style>
