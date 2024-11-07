<script setup lang="ts">
import { NButton, NCard, NTabPane, NTabs, NTag } from 'naive-ui'
import { onBeforeRouteLeave } from 'vue-router';
// 设置进入页面时的标题
document.title = '问题解答';

// 设置离开页面时的标题
onBeforeRouteLeave((to, from, next) => {
  document.title = 'AI搜索小助手';
  next();
});
</script>

<template>
  <div>
    <div>
      <NCard class="homepage" title="首页" style="margin-bottom: 16px" size="large">
        <NTabs default-value="introduce" justify-content="space-evenly" type="line">
          <NTabPane name="introduce" tab="介绍">
            <p class="text">这是一个解答你的问题的网站</p>
          </NTabPane>

          <NTabPane class="use" name="use" tab="开始使用">
            <n-tag type="success" style="margin-top: 12vh;">下面是官方微信公众号，关注公众号不迷路！</n-tag>
            <img class="gongzhanghao" src="/gongzhonghao1.jpeg"/>
            <router-link :to="{ path: '/chatbox' }">
              <NButton class="text" type="primary">
                点击开始使用
              </NButton>
            </router-link>
          </NTabPane>

          <NTabPane name="contact" tab="联系我们">
            <div>
              <n-tag type="success" style="margin-top: 12vh;">合作洽谈联系邮箱 johntangly@163.com</n-tag>
             </div>
            
            <div> 
              <p style="margin-top: 12vh;">我们具有丰富、可靠的技术能力，给有需求的个人、企业、组织提供优质、快速、稳定的Al服务，帮助企业员工用上Al，创造更多收益，提升工作效率。</p>
            </div>
            
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
      margin-top: 15vh;
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

    .gongzhanghao{
      margin-top: 12vh;
      height: 103px;
      width: 300px;
    }

    .use{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
</style>
