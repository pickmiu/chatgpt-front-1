<script setup lang="ts">

    function onKefuButtonClick() {
        window.location.href = 'https://work.weixin.qq.com/kfid/kfc25b8866217d145b5'
    }

</script>

<template>
    <div class="w-full h-full flex flex-col items-center">
        <div>
            <img class="w-20 h-36 arrow" src="@/assets/arrow.png">
        </div>

        <div>
            <p class="text-lg mt-28 text-grey"> 点击右上角 <span class="ml-1 font-bold text-2xl">•••</span> </p>
            <p class="text-lg mt-2 text-grey"> 选择在 <span class="font-bold">默认浏览器</span> 中打开 </p>
            <p class="text-lg mt-2 text-grey"> 在打开的网页中继续 </p>
        </div>

        <div>
            <img class="mt-20 w-80 h-48 rounded" src="@/assets/defaultBrowser.jpg">
        </div>

        <div class="fixed bottom-12 primary-color flex w-24 h-8 text-sm p-1 items-center text-center rounded-3xl"
            @click="onKefuButtonClick()">
            <svg t="1716466651267" class="icon ml-1" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2604" width="20" height="20">
                <path
                    d="M848 384h-33.6C806.4 224 675.2 96 512 96s-294.4 128-302.4 288H176c-52.8 0-96 43.2-96 96v64c0 52.8 43.2 96 96 96h32c35.2 0 64-28.8 64-64V400c0-132.8 107.2-240 240-240s240 107.2 240 240v224c0 97.6-67.2 179.2-156.8 201.6-11.2-16-30.4-25.6-51.2-25.6h-64c-35.2 0-64 28.8-64 64s28.8 64 64 64h64c25.6 0 49.6-16 59.2-38.4C720 864 808 763.2 816 640h32c52.8 0 96-43.2 96-96v-64c0-52.8-43.2-96-96-96zM176 576c-17.6 0-32-14.4-32-32v-64c0-17.6 14.4-32 32-32h32v128h-32z m704-32c0 17.6-14.4 32-32 32h-32v-128h32c17.6 0 32 14.4 32 32v64z"
                    fill="#ffffff" p-id="2605"></path>
            </svg>
            <span class="ml-0.5">联系客服</span>
        </div>

    </div>

</template>

<style scoped>
.text-grey {
    color: #434343;
}

.arrow {
    position: fixed;
    top: 1px;
    right: 18px;
}

.primary-color {
    color: white;
    background-color: #18a058;
}
</style>
