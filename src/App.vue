<script setup lang="ts">
import Sideber from './components/Sideber.vue'
import { ref, onMounted } from 'vue'

let isOpenImageModal = ref(false)
let isLoading = ref(false)

const SetImageModal = (value) => {
  isOpenImageModal.value = value
}
const SetLoading = (value) => {
  isLoading.value = value
}
const sideberRef: any = ref(null)
const OpenUploadModel = () => {
  sideberRef.value.changeImageModel()
}

// Vue生命周期挂钩，挂载到DOM后运行传递给它的函数
onMounted(() => {
  if (!!localStorage.getItem('github_config')) {
    let github_config = JSON.parse(localStorage.getItem('github_config') as any)
  }
})
</script>

<!-- 定义HTML结构，渲染侧边栏和主区域 -->
<template>
  <div class="wrapper">
    <div id="alert-box"></div>
    <Sideber @SetImageModal="SetImageModal" ref="sideberRef"></Sideber>
    <!-- 根据图片上传框是否打开，设置主区域的宽度 -->
    <div class="main"
      :class="{ loading: isLoading }" id="main"
      :style="isOpenImageModal ? `width:calc(100% - 500px);margin-left:300px` : `width:calc(100% - 200px)`"
    >
      <router-view
        @SetLoading="SetLoading"
        @OpenUploadModel="OpenUploadModel()"
      />
    </div>
  </div>
</template>

<!-- 定义样式（部分开源代码） -->
<style lang="scss" scoped>
.wrapper {
  display: flex;
  background: var(--background);
  .main {
    position: relative;
    transition: all 0.25s;
  }
  .main::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    border: 4px solid rgba(180, 180, 180, 0.4);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    outline: var(--background) solid 10000px;
    background: var(--background);
    width: 16px;
    height: 16px;
    opacity: 0;
    animation: donut-spin 0.8s linear infinite;
    transition: all 0.25s;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
  .loading::after {
    opacity: 1;
    z-index: 1;
  }
  @keyframes donut-spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}
</style>
