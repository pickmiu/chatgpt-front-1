<script setup lang="ts">
import { NButton, NCard, NTabPane, NTabs } from 'naive-ui'
</script>

<template>
  <div>
    <div>
      <NCard class="homepage" title="首页" style="margin-bottom: 16px" size="large">
        <NTabs default-value="introduce" justify-content="space-evenly" type="line">
          <NTabPane name="introduce" tab="介绍">
            <p class="text">这是一个解答你的问题的网站</p>
          </NTabPane>

          <NTabPane name="use" tab="开始使用">
            <router-link :to="{ path: '/chatbox' }">
              <NButton class="text" type="primary">
                点击开始使用
              </NButton>
            </router-link>
          </NTabPane>

          <NTabPane name="contact" tab="联系我们">
            <p class="text">合作洽谈联系邮箱 johntangly@163.com</p>
          </NTabPane>
        </NTabs>
      </NCard>
    </div>
    <div class="foot">
      <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2023044302号-1</a>
      <span>|</span>
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=51010802031897" target="_blank">
        <img class="gov-img" src="@/assets/gov.png"> 川公网安备51010802031897号
      </a>
    </div>        
  </div>
</template>

<style scoped>
    .homepage {
        text-align: center;
        height: 92vh;
    }
    .text{
      margin-top: 20vh;
      margin-bottom: 10vh;
      font-size: 15px;
    }
    .foot{
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 5vh;
        color: #666;
        font-size: 12px;
    }
    .gov-img{
        display: inline;
        margin: 0 5px;
        width: 16px;
    }
</style>
