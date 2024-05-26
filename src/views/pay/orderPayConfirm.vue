<script setup lang="ts">
import { NButton, NModal, NQrCode, NImage, NTag, NEmpty } from 'naive-ui'
import { computed, ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useRoute, useRouter } from 'vue-router'
import { Order, getOrderDetail, payOrder } from '@/api'
import { useMessage } from 'naive-ui'

function onKefuButtonClick() {
    window.location.href = 'https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
}

const { isMobile } = useBasicLayout()

const message = useMessage()

const vueRoute = useRoute()
const vueRouter = useRouter()

const { orderId } = vueRoute.params as { orderId: string }
const { identify } = vueRoute.params as { identify: string }

let order = ref<Order>()

function goToNextPage(urlPrefix: string, orderId: string, identify: string) {
    vueRouter.push(urlPrefix + "/" + orderId + "/" + identify)
}

function refreshOrder() {
    if (orderId === null || identify === null || orderId.length === 0 || identify.length === 0) {
        clearInterval(intervalRefreshOrder)
        vueRouter.push('/pay/item');
    }
    getOrderDetail(orderId, identify)
        .then(response => {
            console.log(response.data)
            order.value = response.data as Order
            if (order.value.orderStatus === '待发货' || order.value.orderStatus === '已发货') {
                clearInterval(intervalRefreshOrder)
                message.success("支付成功")
                goToNextPage('/pay/result', orderId, identify)
            }
        })
        .catch(error => {
            message.error(error.message)
            if (error.message === '服务器异常，请联系客服') {
                clearInterval(intervalRefreshOrder)
                vueRouter.push('/pay/item')
            }
        });
}

const intervalRefreshOrder = setInterval(() => {
    refreshOrder()
}, 2000);

refreshOrder()

const onBackButtonClick = () => {
    clearInterval(intervalRefreshOrder)
    vueRouter.push('/pay/address')
}

const payment = ref<string>()
const isWechat = computed(() => {
    return payment.value === '微信'
})

const isAlipay = computed(() => {
    return payment.value === '支付宝'
})

function wechat() {
    return payment.value = '微信'
}

function alipay() {
    return payment.value = '支付宝'
}

const showQrCode = ref<boolean>(false)
const qrCode = ref<string>()

let initQrCodeIntervalId: NodeJS.Timer;
const qrcodePngUrl = ref<string>()
function initQrCode() {
    const canvas = document
        .querySelector('#qr-code')
        ?.querySelector<HTMLCanvasElement>('canvas')
    if (canvas) {
        const url = canvas.toDataURL()
        qrcodePngUrl.value = url
        clearInterval(initQrCodeIntervalId)
    }
}

function onSubmitButtonClick() {
    pay(payment.value === undefined ? "支付宝" : payment.value)
}

function useAlipay() {
    pay("支付宝")
}

function pay(paymentStr: string) {
    const device = isMobile.value ? "Mobile Phone" : "PC";
    console.log(device)
    payOrder(orderId, paymentStr === undefined ? "支付宝" : paymentStr, device)
        .then(response => {
            console.log(response.data)
            order.value = response.data as Order
            qrCode.value = order.value.wechatQrcode
            console.log(isWechat.value)
            if (paymentStr === "微信") {
                qrCode.value = order.value?.wechatQrcode
                showQrCode.value = true
                // 初始化qrcode图片的内容
                initQrCodeIntervalId = setInterval(initQrCode, 10)
            } else if (paymentStr === "支付宝") {
                const alipayJumpUrl = order.value?.alipayJumpUrl;
                if (alipayJumpUrl !== undefined) {
                    window.location.href = alipayJumpUrl
                } else {
                    message.error("支付宝付款不可用，请联系客服")
                }
            } else {
                message.error("错误的支付方式，请联系客服")
            }
        })
        .catch(error => {
            message.error(error.message)
            if (error.message === '订单已过期 请重新下单') {
                clearInterval(intervalRefreshOrder)
                vueRouter.push('/pay/item')
            } else if (error.message === '订单已支付') {
                goToNextPage('/pay/result', orderId, identify)
            }
        });
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
                    确认订单信息
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

            <div class="flex items-center justify-between mt-12">
                <span class="text-family text-base ml-2">订单编号：</span> <span class="text-family text-base mr-8"> {{
                    order?.id }} </span>
            </div>

            <div class="flex items-center justify-between mt-3">
                <span class="text-family text-base ml-2">购买版本：</span> <span class="text-family text-base mr-8"> {{
                    order?.versionDesc }}</span>
            </div>

            <div class="flex items-center justify-between mt-3">
                <span class="text-family text-base ml-2">购买时长：</span> <span class="text-family text-base mr-8">{{
                    order?.durationDesc }}</span>
            </div>

            <div class="flex items-center justify-between mt-3">
                <span class="text-family text-base ml-2">邮箱地址：</span> <span class="text-family text-base mr-8">{{
                    order?.email === '' ? '无' : order?.email }}</span>
            </div>

            <div class="flex items-center justify-between mt-3">
                <span class="text-family text-base ml-2">手机号码：</span> <span class="text-family text-base mr-8">{{
                    order?.phone === '' ? '无' : order?.phone }}</span>
            </div>

            <div class="flex items-center justify-between mt-3">
                <span class="text-family text-base ml-2">应付金额：</span> <span class="text-family text-base mr-8">￥{{
                    order?.realPrice }}</span>
            </div>

            <div class="w-full h-10 mt-12 ml-2">
                <p class="w-40 text-family text-base font-normal">选择支付方式</p>
            </div>

            <div class="w-full h-20 mt-2 ml-2 flex">
                <div>
                    <button class="b-size button-selected text-family rounded-md"
                        :class="{ 'button-selected': isAlipay, 'button-unselected': !isAlipay }" @click="alipay()">
                        <div>
                            <div>
                                <div class="w-4 h-4">
                                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16">
                                        <path
                                            d="M10.476 9.115a78.809 78.809 0 006.061 2.084c1.121.46 0 3.07-1.184 2.531-1.34-.577-4.035-1.757-6.085-2.766C8.128 12.289 6.338 14 3.788 14 1.522 14 0 12.682 0 10.719c0-1.654 1.157-3.324 3.74-3.324 1.48 0 3 .415 4.818 1.04.336-.666.616-1.361.838-2.078l-6.57-.003V5.353l3.379.008V4.05H2.088v-.986l4.117.003V1.604c0-.383.208-.604.571-.604H8.5v2.073l4.08.003v.977H8.5V5.37l3.339.009s-.413 2.115-1.361 3.736zm-9.549 1.52v-.001c0 .94.741 1.89 2.545 1.89 1.393 0 2.757-.824 4.062-2.45-1.744-.862-2.679-1.277-4.03-1.277-1.312 0-2.577.631-2.577 1.839z"
                                            fill="#1C9FE5" />
                                    </svg>
                                </div>
                                <div class="flex">支付宝</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div>
                    <button class="b-size text-family rounded-md ml-6"
                        :class="{ 'button-selected': isWechat, 'button-unselected': !isWechat }" @click="wechat()">
                        <div>
                            <div>
                                <div class="w-4 h-4">
                                    <svg focusable="false" fill="#65bf46" color="#65bf46" fill-opacity="1"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="m5.82158951 10.2392289c-.07458706.0370453-.15730458.0556955-.24094809.054326-.19411036.0004044-.37251043-.1042744-.4634916-.2719605l-.03714687-.07248977-1.46459966-3.11854655c-.01512596-.03426189-.02150045-.07160842-.01857344-.10881723-.00173271-.06781637.02505287-.13335979.07410324-.18132817.04905038-.04796839.11607222-.07416311.18541829-.07246861.05991821.00135034.11803899.0202774.1668232.05432605l1.72429004 1.19665926c.13428814.07989516.287767.12369848.44491816.12698096.09540276-.00050307.18981611-.01894679.27809496-.05432605l8.08434026-3.51748802c-1.4654439-1.68625423-3.8570268-2.77409627-6.54544686-2.77409627-4.43111472 0-8.00937114 2.91907582-8.00937114 6.52721734 0 1.95821474 1.07540181 3.73512246 2.76254498 4.93244226.19798422.1234931.27637709.3683985.18573434.5802485-.12984519.4895949-.35221984 1.2879732-.35221984 1.3236402-.02294672.0641881-.03548063.1314925-.03714687.1994707-.00149457.0676161.0253489.1328891.07429838.1806653s.11574724.0738997.18488544.0723059c.05476156.0014409.10794137-.0180468.14824977-.0543261l1.74286348-.9975188c.12865107-.0773324.27545557-.1210562.42634473-.1269809.0814565.0032186.1622826.0154046.24094809.0363274.84921252.2423376 1.7294984.3646673 2.61412636.3632745 4.41254124 0 8.00937114-2.9190758 8.00937114-6.52721731-.0072077-1.07252838-.3219348-2.12157031-.9084098-3.02789305l-9.21428039 5.22141056z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="flex">微信</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div class="w-full flex" v-if="payment === '支付宝'">
                <div class="rounded-md boxshadow-1 p-4 ml-2 mr-8 flex">
                    <div class="flex -m-1.5 flex-row">
                        <div class="flex p-1.5 items-center">
                            <svg class="h-12 color-grep500" focusable="false" fill="#6b7785" color="#6b7785"
                                viewBox="0 0 48 40" width="48" height="40" role="presentation">
                                <path opacity=".6" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M9 1a4 4 0 00-4 4v30a4 4 0 004 4h18a4 4 0 004-4v-9a1 1 0 10-2 0v9a2 2 0 01-2 2H9a2 2 0 01-2-2V14a2 2 0 012-2h18a2 2 0 012 2v2a1 1 0 102 0V5a4 4 0 00-4-4H9zm26.992 15.409L39.583 20H24a1 1 0 100 2h15.583l-3.591 3.591a1 1 0 101.415 1.416l5.3-5.3a1 1 0 000-1.414l-5.3-5.3a1 1 0 10-1.415 1.416zM7 8.5A1.5 1.5 0 018.5 7h19a1.5 1.5 0 010 3h-19A1.5 1.5 0 017 8.5zM23 3a1 1 0 100 2 1 1 0 000-2zm-8 1a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 30a1 1 0 100 2h6a1 1 0 100-2h-6z">
                                </path>
                            </svg>
                        </div>
                        <div class="flex items-center">
                            <span class="text-xs font-normal color-grep500">提交后，您将跳转到支付宝官网进行支付。</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full flex" v-if="payment === '微信'">
                <div class="rounded-md boxshadow-1 p-4 ml-2 mr-8 flex">
                    <div class="flex -m-1.5 flex-row">
                        <div class="flex p-1.5 items-center">
                            <svg class="h-12 color-grep500" focusable="false" fill="#6b7785" color="#6b7785"
                                viewBox="0 0 48 40" width="48" height="40" role="presentation">
                                <path opacity=".6" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M9 1a4 4 0 00-4 4v30a4 4 0 004 4h18a4 4 0 004-4v-9a1 1 0 10-2 0v9a2 2 0 01-2 2H9a2 2 0 01-2-2V14a2 2 0 012-2h18a2 2 0 012 2v2a1 1 0 102 0V5a4 4 0 00-4-4H9zm26.992 15.409L39.583 20H24a1 1 0 100 2h15.583l-3.591 3.591a1 1 0 101.415 1.416l5.3-5.3a1 1 0 000-1.414l-5.3-5.3a1 1 0 10-1.415 1.416zM7 8.5A1.5 1.5 0 018.5 7h19a1.5 1.5 0 010 3h-19A1.5 1.5 0 017 8.5zM23 3a1 1 0 100 2 1 1 0 000-2zm-8 1a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 30a1 1 0 100 2h6a1 1 0 100-2h-6z">
                                </path>
                            </svg>
                        </div>
                        <div class="flex items-center">
                            <span class="text-xs font-normal color-grep500">提交后，用微信扫描弹出的二维码完成支付。</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full mt-5 ml-2">
                <n-button class="w-full" size="large" type="primary" @click="onSubmitButtonClick"
                    :disabled="payment !== '微信' && payment !== '支付宝'">确认支付</n-button>
            </div>
        </div>
    </div>

    <n-modal style="width: 320px" v-model:show="showQrCode" preset="card">
        <div class="flex justify-center items-center flex-col">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="144"
                    height="50" viewBox="0 0 149.87716674804688 33.64680099487305" fill="none">
                    <path
                        d="M13.7687 21.239C13.5933 21.3273 13.4179 21.3715 13.1987 21.3715C12.7163 21.3715 12.3217 21.1065 12.1025 20.7091L12.0148 20.5325L8.55061 12.9377C8.50676 12.8494 8.50676 12.7611 8.50676 12.6728C8.50676 12.3195 8.76986 12.0546 9.12065 12.0546C9.2522 12.0546 9.38375 12.0987 9.5153 12.187L13.5933 15.1013C13.9003 15.2779 14.2511 15.4104 14.6457 15.4104C14.865 15.4104 15.0842 15.3663 15.3035 15.2779L34.4218 6.71169C31.0015 2.64935 25.345 0 18.943 0C8.50676 0 0 7.10909 0 15.8961C0 20.665 2.54326 24.9922 6.53355 27.9065C6.84049 28.1273 7.05974 28.5247 7.05974 28.9221C7.05974 29.0546 7.01589 29.187 6.97204 29.3195C6.66509 30.5117 6.1389 32.4546 6.1389 32.5429C6.09505 32.6753 6.0512 32.852 6.0512 33.0286C6.0512 33.3818 6.3143 33.6468 6.66509 33.6468C6.79664 33.6468 6.92819 33.6026 7.01589 33.5143L11.1378 31.0857C11.4447 30.9091 11.7955 30.7766 12.1463 30.7766C12.3217 30.7766 12.541 30.8208 12.7163 30.865C14.6457 31.439 16.7505 31.7481 18.8991 31.7481C29.3352 31.7481 37.842 24.639 37.842 15.852C37.842 13.2026 37.0527 10.6857 35.6934 8.47793L13.9003 21.1507L13.7687 21.239Z"
                        fill="#22AC38"></path>
                    <rect x="83.40139770507812" y="11.25973892211914" width="14.2071792" height="1.28051948"
                        fill="#494949"></rect>
                    <rect x="83.40139770507812" y="15.2337646484375" width="14.2071792" height="1.36883117"
                        fill="#494949"></rect>
                    <path
                        d="M97.214 27.1117L97.214 19.3403L83.7522 19.3403L83.7522 27.0676L97.214 27.0676L97.214 27.1117ZM85.1116 20.6208L95.8547 20.6208L95.8547 25.787L85.1116 25.787L85.1116 20.6208Z"
                        fill="#494949"></path>
                    <path
                        d="M79.4989 27.9065L79.4989 10.1117C80.2881 8.34546 81.0336 6.49091 81.6036 4.59221L80.332 3.84156C79.0604 8.3013 77.2625 12.3195 74.9385 15.7195L75.684 17.0442C76.4733 15.852 77.3064 14.439 78.1395 12.9818L78.1395 27.9507L79.4989 27.9507L79.4989 27.9065Z"
                        fill="#494949"></path>
                    <path
                        d="M131.065 27.9065L131.065 10.1117C131.854 8.34546 132.6 6.49091 133.17 4.59221L131.898 3.84156C130.626 8.3013 128.829 12.3195 126.505 15.7195L127.25 17.0442C128.039 15.852 128.872 14.439 129.706 12.9818L129.706 27.9507L131.065 27.9507L131.065 27.9065Z"
                        fill="#494949"></path>
                    <path
                        d="M99.0995 7.15325L90.7681 7.15325L91.6451 6.62338L91.689 6.62338L91.689 6.57922C91.6013 6.35845 91.3382 5.78442 91.0312 5.16624C90.7681 4.59221 90.505 4.06234 90.3735 3.75325L90.3735 3.70909L89.1019 4.45974L89.1019 4.5039C89.5404 5.34286 89.935 6.13767 90.2858 6.88832C90.3296 6.97663 90.3735 7.06494 90.3735 7.10909L82.0421 7.10909L82.0421 8.47793L99.0995 8.47793L99.0995 7.15325Z"
                        fill="#494949"></path>
                    <path
                        d="M62.4414 6.0935L61.1698 6.0935L61.1698 10.5974L58.7581 10.5974L58.7581 4.19481L57.4865 4.19481L57.4865 10.5974L54.987 10.5974L54.987 6.0935L53.7154 6.0935L53.7154 11.8779L62.4414 11.8779L62.4414 6.0935Z"
                        fill="#494949">
                    </path>
                    <rect x="54.11006164550781" y="14.394805908203125" width="7.71748004" height="1.28051948"
                        fill="#494949">
                    </rect>
                    <path
                        d="M55.7763 20.665L55.7763 19.5169L59.6789 19.5169L59.6789 22.3429C59.635 23.3585 59.5912 23.6676 59.2404 24.1091L60.0297 25.4779L60.0735 25.4338C60.7751 24.8598 61.9152 23.8883 63.5376 22.4312L63.5815 22.4312L62.9676 21.3715L62.9237 21.3273L60.9505 23.0052L60.9505 18.1922L54.4169 18.1922L54.4169 20.1351C54.5923 22.7844 53.9346 24.6831 52.4437 25.787L52.3999 25.787L53.1015 27.0234L53.1453 27.0676L53.1892 27.0234C55.0308 25.5663 55.9078 23.4026 55.7763 20.665Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M47.445 10.2442L48.2343 11.5689C50.2075 9.58182 51.9176 7.19741 53.1454 4.59221L51.9615 3.88572C50.6899 6.44676 49.1551 8.61039 47.445 10.2442Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M47.0942 18.3246L47.7958 19.561L47.8397 19.6051L47.8835 19.561C48.6289 18.6778 49.3744 17.7506 50.076 16.7791L50.076 27.9064L51.3476 27.9064L51.3476 14.6597C51.9176 13.6441 52.4877 12.496 53.0139 11.2155L53.0139 11.1714L51.7861 10.4649L51.7861 10.509C50.5583 13.4675 49.0236 16.1168 47.0942 18.3246Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M71.7813 9.89088L71.7813 8.61039L66.1247 8.61039C66.6071 7.10909 67.1771 5.38702 67.3525 3.92987L66.037 3.92987C65.2039 7.81559 63.9323 11.2156 62.3098 13.865L63.0991 15.2779L63.6692 14.0857C63.8884 13.6883 64.0638 13.3792 64.1953 13.1143C64.59 16.5585 65.2916 19.3403 66.2563 21.3715C65.3354 23.0052 63.8884 24.6831 61.959 26.4052L61.9152 26.4052L62.6606 27.6857L62.7045 27.7299L62.7483 27.6857C64.7654 25.787 66.1686 24.1091 66.914 22.7403C67.7471 24.2416 69.1942 26.052 70.8166 27.774L70.8604 27.8182L71.6059 26.4935L71.6059 26.4494L71.562 26.4494C69.8081 24.7273 68.4049 22.9611 67.6156 21.4598C69.0626 18.8104 69.9396 14.9247 70.2904 9.89088L71.7813 9.89088ZM67.0894 19.826C66.2563 17.6624 65.6424 14.7039 65.2477 11.039C65.3793 10.6416 65.5547 10.2442 65.7301 9.89088L69.1503 9.89088C68.8434 14.0416 68.1856 17.3974 67.0894 19.826Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M124.883 8.52208L124.883 7.15325L114.052 7.15325L114.052 3.66494L112.649 3.66494L112.649 7.15325L101.906 7.15325L101.906 8.52208L112.649 8.52208L112.649 13.0702L112.43 13.0702L105.677 13.0702L105.677 14.3064C105.677 14.3064 106.729 16.735 108.922 19.3843C109.799 20.4441 110.807 21.548 112.123 22.6519C109.667 24.1532 106.642 25.6103 102.388 26.4493L103.178 27.8623C103.178 27.8623 108.22 26.8025 113.219 23.535C113.877 23.9765 116.99 26.4493 122.778 27.8623L122.778 27.8623L122.822 27.8623L123.392 26.8025C123.392 26.8025 121.901 26.4051 119.621 25.522C118.043 24.9038 116.069 23.9765 114.184 22.696C116.99 20.6207 119.49 17.6181 120.981 13.7765L119.84 13.1143L114.008 13.1143L114.008 8.52208L124.883 8.52208ZM119.402 14.2623C119.402 14.2623 117.999 18.2804 113.219 21.7246C110.939 19.9584 108.571 17.3973 107.08 14.2623L119.402 14.2623Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M142.335 26.1403C142.072 26.1403 141.809 26.1403 141.546 26.1403L141.546 27.5091C142.072 27.5091 142.467 27.5091 142.73 27.5091C144.089 27.5091 144.791 27.2 145.405 26.626C145.975 26.052 146.238 25.213 146.194 24.065L146.194 11.2156L149.877 11.2156L149.877 9.84678L146.194 9.84678L146.194 3.92987L144.835 3.92987L144.835 9.84678L133.521 9.84678L133.521 11.2156L144.835 11.2156L144.835 24.065C144.791 25.4779 143.914 26.1403 142.335 26.1403Z"
                        fill="#494949">
                    </path>
                    <path
                        d="M139.266 21.5481L140.625 20.7533C139.88 19.252 138.915 17.265 137.731 14.8364L136.503 15.587C137.292 17.2208 138.213 19.2078 139.266 21.5481Z"
                        fill="#494949">
                    </path>
                </svg>
            </div>

            <div v-if="!isMobile" class="flex flex-col items-center">
                <div class="hidden">
                    <n-qr-code class="-ml-3 mt-2" id="qr-code" :value="qrCode" :size=176 />
                </div>
                <div class="mt-4">
                    <n-image width="176" :src="qrcodePngUrl" />
                </div>
            </div>
            <p v-if="!isMobile" class="mt-3 font-medium text-sm"> 应付金额: <span style="color: #f5222d"> ￥{{ order?.realPrice }} </span>
            </p>

            <p v-if="!isMobile" class="mt-3 text-xs text-gray-500">打开手机微信扫一扫</p>
            <p v-if="!isMobile" class="mt-1 text-xs text-gray-500">扫描二维码完成支付</p>

            <!-- 手机用户不支持微信提示 -->
            <n-empty v-if="isMobile" class="mt-12" size="large" description="暂不支持在手机端使用微信支付">
                <template #extra>
                    <p class="mt-5 text-xs text-gray-400"></p>
                </template>
            </n-empty>

            <div v-if="isMobile" class="mt-2 mb-8">
                <n-button size="medium" @click="useAlipay()">
                    点此切换支付宝支付
                </n-button>
            </div>

            <n-tag v-if="isMobile" class="mb-4" type="success"> <p>微信支付仅支持iPad和电脑端购买</p></n-tag>
        </div>

    </n-modal>
</template>

<style scoped>
.text-family {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "Microsoft JhengHei", sans-serif;
}

.boxshadow-1 {
    box-shadow: 0 0 0 1px #e0e0e0, 0 2px 4px 0 rgba(0, 0, 0, 0.07), 0 1px 1.5px 0 rgba(0, 0, 0, 0.05);
}

.b-size {
    width: 121.34px;
    height: 50.59px;
}

.button-selected {
    box-shadow: 0 0 0 1px hsla(0, 0%, 10%, 0.9), 0 2px 4px 0 rgba(0, 0, 0, 0.07), 0 1px 1.5px 0 rgba(0, 0, 0, 0.05);
    color: #1d2129;
    font-size: 12px;
    padding: 10px 12px 8px 12px;
}

.button-unselected {
    box-shadow: 0 0 0 1px #e0e0e0;
    color: #6b7785;
    font-size: 12px;
    padding: 10px 12px 8px 12px;
}

.color-grep500 {
    color: #6b7785;
}

.primary-color {
    color: white;
    background-color: #18a058;
}
</style>
