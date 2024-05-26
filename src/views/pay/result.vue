<script setup lang="ts">
import { NButton, NSpace, NResult, CountdownProps, NStatistic, NCountdown } from 'naive-ui'
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useRoute, useRouter } from 'vue-router'
import useClipboard from 'vue-clipboard3'
import { Order, Passport, getOrderDetail } from '@/api'

function onKefuButtonClick() {
    window.location.href='https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

const { toClipboard } = useClipboard()
const { isMobile } = useBasicLayout()

const vueRoute = useRoute()
const vueRouter = useRouter()

const { orderId } = vueRoute.params as { orderId: string }
const { identify } = vueRoute.params as { identify: string }

function goToNextPage(urlPrefix: string, orderId: string, identify: string) {
    vueRouter.push(urlPrefix + "/" + orderId + "/" + identify)
}

const onBackButtonClick = () => {
    if (orderStatus.value === '待发货') {
        goToNextPage('/pay/confirm', orderId, identify)
    } else {
        vueRouter.push('/pay/item')
    }
    
}

let passport = ref<Passport>()

let orderStatus = ref<string>("待发货")

function refreshOrder() {
    if (orderId === null || identify === null || orderId.length === 0 || identify.length === 0) {
        clearInterval(intervalRefreshOrder)
        vueRouter.push('/pay/item');
    }
    getOrderDetail(orderId, identify)
        .then(response => {
            console.log(response.data)
            const order = response.data as Order
            passport.value = order.passport
            if (order.orderStatus === '待发货') {
                orderStatus.value = '待发货'
            } else if (order.orderStatus === '已发货') {
                orderStatus.value = '已发货'
                clearInterval(intervalRefreshOrder)
            } else if (order.orderStatus === '待支付') {
                message.warning("订单未支付")
                clearInterval(intervalRefreshOrder)
                goToNextPage('/pay/confirm', orderId, identify)
            } else if (order.orderStatus === '已退款') {
                clearInterval(intervalRefreshOrder)
                message.warning("订单已退款")
                vueRouter.push('/pay/item')
            } else {
                clearInterval(intervalRefreshOrder)
                message.error("订单状态错误")
            }
        })
        .catch(error => {
            message.error(error.message)
            console.log(error)
        });
}

const intervalRefreshOrder = setInterval(() => {
    refreshOrder()
}, 2000);

refreshOrder()

const message = useMessage()

const copyToClipboard = async () => {
    try {
        if (passport.value !== undefined) {
            await toClipboard(passport.value.passportId);
            message.success("复制到粘贴板成功")
        } else {
            message.error("复制到粘贴板失败")
        }
    } catch (e) {
        message.error("复制到粘贴板失败")
    }
}

const jumpToUse = () => {
    vueRouter.push('/setting')
}

const renderCountdown: CountdownProps['render'] = ({ minutes, seconds}) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

</script>

<template>
    <div class="w-full h-full flex justify-center" :class="{ 'items-center': !isMobile }">
        <!-- 支付容器 -->
        <div class="w-96 text-gray-600 p-8" :class="{ 'boxshadow-1': !isMobile, 'rounded': !isMobile }">
            <div class="w-full h-10 flex items-center">
                <span @click="onBackButtonClick">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px"
                        height="32px" viewBox="0 0 24 24">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z" fill="currentColor">
                        </path>
                    </svg>
                </span>

                <span class="text-family text-2xl ml-5">
                    发货信息
                </span>

                <div v-if="isMobile" class="primary-color ml-4 flex w-14 h-6 text-xs p-1 items-center text-center rounded-3xl" @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16"><path d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z" fill="#ffffff" p-id="2605"></path></svg>
                    <span class="ml-0.5">客服</span>
                </div>

                <div v-if="!isMobile" class="primary-color ml-4 flex w-20 h-6 text-xs p-1 items-center text-center rounded-3xl" @click="onKefuButtonClick()">
                    <svg t="1716466651267" class="icon ml-0.5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2604" width="16" height="16"><path d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z" fill="#ffffff" p-id="2605"></path></svg>
                    <span class="ml-0.5">联系客服</span>
                </div>
            </div>

            <n-result v-if="orderStatus === '待发货'" status="418" title="正在发货中...">
                <div class="flex w-full items-center justify-center">
                    <n-statistic class="flex flex-col items-center" label="剩余等待时间 超时请联系客服处理" tabular-nums>
                        <n-countdown :duration="2 * 60 * 1000" :active="true" :render="renderCountdown"/>
                    </n-statistic>
                </div>
            </n-result>

            <n-result v-if="orderStatus === '已发货'" class="mt-12 w-full" status="success" title="购买成功">
                <div class="mt-10 w-full flex flex-col items-center">
                    <div class="flex justify-between items-center mt-2"> 
                        <span class="h-10 p-2 text-sm font-bold flex items-center text-center">通行证码：</span>
                        <span class="h-10 p-2 text-sm font-bold flex items-center text-center border-solid border border-gray-300 rounded-sm"> {{ passport?.passportId }} </span>
                    </div>

                    <n-space class="mt-12">
                        <n-button tertiary type="primary"  @click="copyToClipboard">
                            复制通行证码
                        </n-button>
                        <n-button tertiary type="primary"  @click="jumpToUse">
                            跳转到使用地址
                        </n-button>
                    </n-space>

                    <p class="mt-12 text-xs text-gray-500">通行证码同时已发送到您填写的邮箱和手机号中</p>
                    <p class="mt-2 text-xs text-gray-500">请注意查收！</p>
                </div>
            </n-result>

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
