<script setup lang='ts'>
import { NModal, NSkeleton, NButton } from 'naive-ui'
import { computed, ref, watch, watchEffect } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface Props {
    large?: boolean
    title?: string
    documentUrl?: string
    visible?: boolean
}

interface Emit {
    (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const showModal = computed({
    get: () => props.visible,
    set: (visible: boolean) => emit('update:visible', visible),
})

const { isMobile } = useBasicLayout()

const loaded = ref(false)
const frame = ref<HTMLIFrameElement>()

watchEffect(() => {
    if (frame.value) {
        frame.value.onload = () => {
            loaded.value = true
        }
    }
})

watch(showModal, (newValue, oldValue) => {
    if (newValue === false) {
        loaded.value = false
    }
})
</script>

<template>
    <!-- PC small -->
    <n-modal v-if="!isMobile && !large" v-model:show="showModal" preset="card" style="width:685px; height: 590px;" :title="title" size="huge"
        transform-origin="center">
        <template #header-extra></template>

        <iframe ref="frame" :class="{ 'hidden': !loaded }" width="600px" height="400px" :src="documentUrl"></iframe>

        <n-skeleton v-if="!loaded" text size="medium" :repeat="10" />

        <template #footer>
            <div class="flex justify-between">
                <div class="text-sm text-grey-1 flex items-center ml-2"> 向下滑动浏览更多 </div>
                <n-button class="" size="large" quaternary type="primary" @click="showModal = false">
                    已查看
                </n-button>
            </div>
        </template>
    </n-modal>

    <!-- PC large -->
    <n-modal v-else-if="!isMobile && large" v-model:show="showModal" preset="card" style="width:685px; height: 760px;" :title="title" size="huge"
        transform-origin="center">
        <template #header-extra></template>

        <iframe ref="frame" :class="{ 'hidden': !loaded }" width="600px" height="580px" :src="documentUrl"></iframe>

        <div v-if="!loaded" class="custom-h-2 overflow-hidden"> 
            <n-skeleton text size="medium" :repeat="100" /> 
        </div>

        <template #footer>
            <div class="flex justify-between">
                <div class="text-sm text-grey-1 flex items-center ml-2"> 向下滑动浏览更多 </div>
                <n-button class="" size="large" quaternary type="primary" @click="showModal = false">
                    已查看
                </n-button>
            </div>
        </template>
    </n-modal>

   <!-- Mobile -->
    <n-modal v-else v-model:show="showModal" preset="card" style="width:95%; height:80vh" :title="title" size="huge"
        transform-origin="center">
        <template #header-extra>
        </template>

        <iframe ref="frame" :class="{ 'hidden': !loaded }" width="100%" height="100%" :src="documentUrl"></iframe>

        <div v-if="!loaded" class="custom-h-1 overflow-hidden"> 
            <n-skeleton text size="medium" :repeat="100" /> 
        </div>

        <template #footer>
            <div class="flex justify-between">
                <div class="text-sm text-grey-1 flex items-center ml-2"> 向下滑动浏览更多 </div>
                <n-button class="" size="large" quaternary type="primary" @click="showModal = false">
                    已查看
                </n-button>
            </div>
        </template>
    </n-modal>

</template>

<style scoped>
    .text-grey-1 {
       color: #8c8c8c;
    }
    
    .custom-h-1 {
        max-height: 50vh;
    }

    .custom-h-2 {
        width: 600px;
        height: 580px;
    }
</style>