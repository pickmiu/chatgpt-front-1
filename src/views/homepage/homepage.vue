<script setup lang="ts">
import { NButton, NCard, NTabPane, NTabs } from 'naive-ui'
</script>

<template>
  <div>
    <div>
      <NCard class="homepage" title="首页" style="margin-bottom: 16px" size="large">
        <NTabs default-value="introduce" justify-content="space-evenly" type="line">
          <NTabPane name="introduce" tab="介绍">
            这是一个解答你的问题的网站
          </NTabPane>
          <NTabPane name="use" tab="如何使用">
            <router-link :to="{ path: '/chatbox' }">
              <NButton type="primary">
                点击开始使用
              </NButton>
            </router-link>
          </NTabPane>
          <NTabPane name="contact" tab="联系我们">
            合作洽谈联系邮箱 johntangly@163.com
          </NTabPane>
        </NTabs>
      </NCard>
    </div>
    <!-- <div class="foot">
            <a href="https://beian.miit.gov.cn/" target="_blank">您的备案号</a>
            <a href="https://beian.miit.gov.cn/" target="_blank">粤B2-20****59-1</a>
        </div>         -->
  </div>
</template>

<style scoped>
    .homepage {
        text-align: center;
        height: 100vh;
    }
</style>
