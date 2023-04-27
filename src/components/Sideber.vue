<!-- 侧边栏模块 -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../axios/http'
import { Alert } from '../util/alert'
import FolderModal from './FolderModal.vue'
import ImageModal from './ImageModal.vue'
import LButton from './base/LButton.vue'
import { GithubConfig } from '../model/github_config.model'

// 获取本地存储的github配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const emit = defineEmits(['SetImageModal'])
const route = useRoute()
const router = useRouter()

let folders = ref([] as any)
let loading = ref(false)
let isOpenImageModal = ref(false)
let isOpenFolderModal = ref(false)

onMounted(() => {
  if (github_config?.repoId) {
    GetFolders()
  }
})

// 监听路由变化
watch(() => route.query, (n: any) => {
    isOpenFolderModal.value = false
    if (!github_config?.owner && route.path != '/setting' && route.path != '/about') {
      router.push('/setting')
    } else if (route.query.reload) {
      GetFolders()
    }
  }
)

// 控制图片模块的显示
watch(() => isOpenImageModal.value, (n: any) => {
    if (isOpenImageModal.value) {
      emit('SetImageModal', true)
    } else {
      emit('SetImageModal', false)
    }
  }
)

// 通过axios的get方法和github api获取文件夹列表，更改路由
const GetFolders = () => {
  loading.value = true
  axios.get({
    url: `/repositories/${github_config.repoId}/contents?t=${new Date().getTime()}`,
  })
  .then((res: any) => {
    loading.value = false
    folders.value = res.data.filter((e) => e.type == 'dir')
    if (route.path == '/' && !route.query.folder) {
      router.push(`/?folder=${folders.value[0].name}`)
    }
  })
  .catch(() => {
    loading.value = false
  })
}

const changeImageModel = () => {
  // 无token信息，告警
  if (!github_config?.repoId) {
    Alert({
      type: 'danger',
      text: '请先设置token信息',
    })
    return
  }
  isOpenImageModal.value = !isOpenImageModal.value
}

defineExpose({
  changeImageModel,
})
</script>

<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="header">
        <!-- 顶部LOGO -->
        <div class="mask"></div>
        <div class="logo">PicBox</div>
      </div>
      <!-- 文件夹列表 -->
      <div class="folder" :class="{ loading: loading }">
        <a
          v-for="(item, index) in folders"
          :key="index"
          class="item"
          :class="{ active: route.query.folder == item.name }"
          :href="`/picbox/#/?folder=${item.name}`"
        >
          {{ item.name }}
          <span class="status-point"></span>
        </a>
        <!-- 文件夹数量和无token提示 -->
        <div v-show="!loading" class="tips">
          <span v-if="folders.length != 0">{{ folders.length }} 个文件夹</span>
          <span v-if="github_config?.owner && folders.length == 0"
            >暂无文件夹
          </span>
          <span v-if="!github_config?.owner">未设置token<br>请点击下方设置</span>
        </div>
        <!-- 如果无文件夹，显示新建文件夹按钮 -->
        <l-button
          v-show="!loading"
          v-if="github_config?.owner && folders.length == 0"
          style="margin-top: 10px"
          type="primary"
          @click="isOpenFolderModal = !isOpenFolderModal"
        >
          新建文件夹
        </l-button>
      </div>
      <folder-modal
        @close="isOpenFolderModal = false"
        @updateFolderList="GetFolders()"
        :isOpen="isOpenFolderModal"
      ></folder-modal>
      <!-- 底部操作区按钮 -->
      <div class="handle-box">
        <l-button @click="changeImageModel"> 上传图片 </l-button>
        <l-button @click="isOpenFolderModal = !isOpenFolderModal"> 新建文件夹 </l-button>
        <a href="/picbox/#/setting"> <l-button> 设置 </l-button></a>
        <a href="/picbox/#/about"> <l-button> 关于 </l-button></a>
      </div>
    </div>
    <image-modal
      :isOpen="isOpenImageModal"
      :folders="folders"
      @Close="changeImageModel"
    ></image-modal>
  </div>
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
.sidebar {
  width: 200px;
  border-right: var(--border-width) var(--border-color) solid;
  box-sizing: border-box;
  height: 100vh;
  overflow-y: scroll;
  z-index: 99;
  background-color: var(--background);
  .header {
    position: fixed;
    height: 70px;
    width: 200px;
    display: flex;
    z-index: 99;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    border-right: var(--border-width) var(--border-color) solid;
    border-bottom: var(--border-width) var(--border-color) solid;
    .mask {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      background-color: var(--background);
      z-index: -1;
    }
    .logo {
      position: relative;
      font-size: 26px;
      font-weight: bolder;
      color: var(--text-color);
      left: 20%;
    }
  }
  .folder {
    position: relative;
    margin-top: 70px;
    padding-bottom: calc(45px * 4 + 38px);
    background: var(--background);
    min-height: calc(100vh - 400px);
    padding: 14px 7px;
    box-sizing: border-box;
    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex-direction: column;
      padding: 20px;
      color: var(--text-color-2);
      opacity: 0.7;
    }
    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 45px;
      line-height: 50px;
      box-sizing: border-box;
      padding: 0px 20px;
      width: 100%;
      white-space: nowrap;
      border-radius: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      color: var(--text-color-2);
      cursor: pointer;
      .status-point {
        width: 10px;
        height: 10px;
        margin-left: 12px;
        border-radius: 10px;
        display: inline-block;
        background: #27c24c;
        transition: opacity 0.25s;
        opacity: 0;
      }
    }
    .active {
      .status-point {
        opacity: 1;
      }
    }
    .item:hover {
      color: var(--text-color);
      background: var(--hover-bg-color);
    }
    .item:last-child {
      justify-content: center;
      font-size: 14px;
    }
    .item:last-child:hover {
      color: var(--text-color-2);
      background: none;
    }
  }
  .folder::after {
    position: absolute;
    top: 10%;
    left: 50%;
    content: '';
    border: 4px solid rgba(194, 194, 194, 0.4);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    width: 14px;
    height: 14px;
    opacity: 0;
    animation: donut-spin 0.8s linear infinite;
    transition: all 0.15s;
    transform: translate(-50%, -50%);
  }
  .loading::after {
    opacity: 1;
  }
  @keyframes donut-spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  .handle-box {
    width: 200px;
    height: calc(45px * 4 + 38px);
    position: fixed;
    bottom: 0px;
    background: var(--background-2);
    border-top: var(--border-width) var(--border-color) solid;
    border-right: var(--border-width) var(--border-color) solid;
    padding: 7px;
    box-sizing: border-box;
    z-index: 99;
  }
}
</style>
