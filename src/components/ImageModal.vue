<!-- 图片上传模块 -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../axios/http'
import { Alert } from '../util/alert'
import { imageProcess } from '../util/process'
import { GetFileSize } from '../util/util'
import { LButton } from '../components/base'
import { GithubConfig } from '../model/github_config.model'
import { UploadImage } from '../model/upload_image.model'

// 获取本地存储的github配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const props = defineProps({ isOpen: Boolean, folders: Array as any })
const emit = defineEmits(['Close', 'SetLoading'])
const route = useRoute()
const router = useRouter()

let folder: any = ref(route.query.folder)
let upload_list = ref<UploadImage[]>([])
let loading_btn: any = ref(null)
let loading_addupload = ref(false)
let drop_active = ref(false)

// 监听文件夹变化
watch(() => route.query, (n: any) => {
  folder.value = n.folder || ''
})

// 选择文件夹，更新路由
watch(() => folder.value, (n: any) => {
  if (route.path != '/setting') {
    router.push(`/?folder=${n}`)
  }
})

// 添加drop事件监听器，监听拖拽上传
onMounted(() => {
  let drop_area: any = document.getElementById('drop-area')
  drop_area.addEventListener('drop', DropUpload, false)
  let timer: any = ''
  drop_area.addEventListener('dragleave', (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      e.stopPropagation()
      e.preventDefault()
      drop_active.value = false
    }, 100)
  })
  drop_area.addEventListener('dragover', (e) => {
    e.stopPropagation()
    e.preventDefault()
    drop_active.value = true
  })
})

// 点击上传方法
const ClickUpload = (e) => {
  // 未选择文件夹，告警
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }
  let files = e.target.files
  AddImageToList(files)
}

// 拖拽上传方法
const DropUpload = (e) => {
  // 未选择文件夹，告警
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }
  let files = e.dataTransfer.files
  drop_active.value = false
  e.stopPropagation()
  e.preventDefault()
  let image_files = [] as any
  // 添加图片到列表并检查类型，不是则告警
  for (let i = 0; i <= files.length - 1; i++) {
    if (files[i].type.indexOf('image') !== -1) {
      image_files.push(files[i])
    } else {
      Alert({
        type: 'danger',
        text: `${files[i].name}不是图片文件`,
      })
    }
  }
  AddImageToList(image_files)
}

// 添加图片到上传列表的实现
const AddImageToList = async (image_files) => {
  loading_addupload.value = true
  Alert({
    type: 'warning',
    text: '正在读取',
  })
  let upload_files: any = []
  upload_files = await Promise.all([...image_files].map((e) => {
      return imageProcess(e, folder.value)
  }))
  Alert({
    type: 'success',
    text: '读取完成',
  })
  loading_addupload.value = false
  upload_list.value = upload_list.value.concat(upload_files)
}

// 图片上传到github仓库的实现
const Upload = async (type) => {
  loading_btn.value = type
  let timer = 0
  await Promise.all(
    upload_list.value.map((e, i) => {
      upload_list.value[i].status = 'uploading'
      return new Promise((resolve) => {
        let filename = `${e.name}${e.ext}`
        setTimeout(() => {
          // 通过axios的put方法和github api上传到仓库
          axios.put({
            url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${folder.value}/${filename}`,
            data: {
              message: 'upload images',
              content: e.orginal_base64data,
            }
          })
          // 更新上传列表，保存图片链接，添加历史记录
          .then((res: any) => {
            let image = res.data.content
            e.status = 'success'
            upload_list.value[i].status = 'success'
            e.url = image.url
            e.download_url = image.download_url
            e.cdn_url = `https://git.pink/${github_config.owner}/${github_config.repoPath}/blob/main/${folder.value}/${filename}?raw=true`
            e.html_url = image.html_url
            e.git_url = image.git_url
            e.sha = image.sha
            e.upload_type = type
            addHistory(e)
            resolve(200)
          })
          // 上传失败处理
          .catch(() => {
            e.status = 'fail'
            upload_list.value[i].status = 'fail'
            resolve(400)
          })
        }, (timer += 1000))
      })
    })
  )
  // 上传完成提示，更新路由，清空上传列表
  Alert({
    type: 'success',
    text: '上传完成',
  })
  loading_btn.value = 0
  upload_list.value = upload_list.value.filter((e) => e.status != 'success')
  router.push((route.fullPath += '&t=' + new Date().getTime()) as any)
}

// 添加历史记录
const addHistory = (e: any) => {
  let item = {
    name: e.name,
    orginal_size: e.orginal_size,
    folder: e.folder,
    status: e.status,
    ext: e.ext,
    cdn_url: e.cdn_url,
  }
}
</script>

<template>
  <div class="image-modal" id="drop-area" :class="{ isOpen: props.isOpen }">
    <!-- 关闭上传栏的叉叉（开源图标） -->
    <svg
      @click="emit('Close')"
      class="icon-close"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
    >
      <path
        d="M400 145.49L366.51 112L256 222.51L145.49 112L112 145.49L222.51 256L112 366.51L145.49 400L256 289.49L366.51 400L400 366.51L289.49 256L400 145.49z"
        fill="currentColor"
      ></path>
    </svg>

    <div class="upload-list">
      <!-- 上传框 -->
      <label class="upload-box" :class="{
          dropActive: drop_active,
          uploadBoxLoading: loading_addupload,
      }">
        <!-- 上传到云的图标（开源图标） -->
        <svg
          class="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
        >
          <path
            d="M320 367.79h76c55 0 100-29.21 100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8c-69 0-113.44 45.79-128 91.2c-60 5.7-112 43.88-112 106.4s54 106.4 120 106.4h56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
            d="M320 255.79l-64-64l-64 64"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
            d="M256 448.21V207.79"
          ></path>
        </svg>{{
          drop_active ? `松开鼠标上传文件` : `点击或拖拽到此处上传文件`
        }}
        <input @change="ClickUpload" v-show="false" type="file" name="file" accept="image/*" multiple/>
      </label>

      <!-- 待上传列表 -->
      <div v-show="upload_list.length > 0" class="title-label">待上传图片</div>
      <div v-for="item in upload_list" :key="item.name" class="item">
        <!-- 上传状态图标（开源图标） -->
        <div class="status-box">
          <svg
            v-show="item.status == 'success'"
            class="icon icon-success"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="square"
              stroke-miterlimit="10"
              stroke-width="44"
              d="M416 128L192 384l-96-96"
            ></path>
          </svg>
          <svg
            v-show="item.status == 'uploading'"
            class="icon icon-uploading"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
          >
            <path
              d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48zm83.69 282.65a112.24 112.24 0 0 1-195-61.29a16 16 0 0 1-20.13-24.67l23.6-23.6a16 16 0 0 1 22.37-.25l24.67 23.6a16 16 0 0 1-18 26a80.25 80.25 0 0 0 138.72 38.83a16 16 0 0 1 23.77 21.41zm47.76-63.34l-23.6 23.6a16 16 0 0 1-22.37.25l-24.67-23.6a16 16 0 0 1 17.68-26.11A80.17 80.17 0 0 0 196 202.64a16 16 0 1 1-23.82-21.37a112.17 112.17 0 0 1 194.88 61.57a16 16 0 0 1 20.39 24.47z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <!-- 图片信息 -->
        <div class="info">
          <div class="name">
            {{ `${item.name}${item.ext}` }}
          </div>
          <div class="tag-box">
            <span class="tag folder">{{ item.folder }}</span>
            <span class="tag orginal-size">{{ GetFileSize(item.orginal_size) }}</span>
          </div>
        </div>
        <img :src="item.orginal_base64" class="image" />
      </div>
    </div>

    <!-- 清空和上传按钮 -->
    <div class="btn-box">
      <LButton
        style="width: 220px"
        @click="upload_list = []"
        v-show="upload_list.length > 0"
        type="danger"
      >清空</LButton>
      <LButton
        @click="Upload(1)"
        type="primary"
        style="width: 220px"
        v-show="upload_list.length > 0"
        :loading="loading_btn == 1"
      >上传</LButton>
    </div>
  </div>
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
.image-modal {
  position: fixed;
  left: 0px;
  z-index: 9;
  transform: translateX(-300px);
  width: 300px;
  height: 100vh;
  background: var(--background-2);
  border-right: var(--border-width) var(--border-color) solid;
  box-sizing: border-box;
  padding: 28px 14px;
  box-sizing: border-box;
  overflow-y: scroll;
  transition: all 0.25s;
  .btn-box {
    display: flex;
    button {
      margin-right: 7px;
    }
    button:last-child {
      margin-right: 0px;
    }
  }
  .icon-close {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    padding: 12px;
    opacity: 0.4;
    transform: scale(1);
    cursor: pointer;
    transition: all 0.15s;
  }
  .icon-close:hover {
    opacity: 0.8;
    transform: scale(1.2);
  }
  .icon-close:active {
    opacity: 1;
    transform: scale(1);
  }
  .upload-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    color: #999;
    background: var(--background);
    margin: 10px 0px;
    border-radius: 12px;
    height: 300px;
    border: 3px dashed rgba($color: #000000, $alpha: 0.2);
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.15s;
    .upload-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
  }
  .upload-box::after {
    position: absolute;
    top: 50%;
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
    outline: var(--background) solid 10000px;
    background: var(--background);
  }
  @keyframes donut-spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  .uploadBoxLoading::after {
    opacity: 1;
  }
  .dropActive {
    border: 3px dashed var(--primary-color);
    color: var(--primary-color);
    .upload-icon {
      color: var(--primary-color);
    }
  }
  .upload-box:hover {
    border: 3px dashed var(--primary-color);
    color: var(--primary-color);
    .upload-icon {
      color: var(--primary-color);
    }
  }
  .title-label {
    margin-bottom: 10px;
    margin-top: 30px;
  }
  .upload-list {
    .item {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 12px;
      background: var(--background);
      margin-bottom: 7px;
      width: 100%;
      height: 70px;
      box-sizing: border-box;
      border: var(--border-width) solid var(--border-color);
      padding: 10px;
      overflow: hidden;
      .status-box {
        position: absolute;
        top: 5px;
        right: 10px;
        .icon {
          width: 14px;
          height: 14px;
          border-radius: 30px;
          padding: 2px;
        }
        .icon-success {
          background: rgb(88, 212, 160);
          color: #fff;
        }
        .icon-uploading {
          background: rgb(45, 165, 212);
          color: #fff;
          animation: uploading 0.8s linear infinite;
        }
        @keyframes uploading {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
      .image {
        width: 50px;
        height: 100%;
        object-fit: cover;
        border-radius: 7px;
        border: var(--border-width) solid var(--border-color);
      }
      .info {
        margin-right: 10px;
        margin-left: 3px;
        width: calc(100% - 70px);
        .name {
          position: relative;
          width: calc(100% - 20px);
          color: var(--text-color);
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tag-box {
          margin-top: 10px;
          .tag {
            padding: 2px 4px;
            margin-right: 10px;
            background: var(--background-2);
            border-radius: 2px;
            font-size: 12px;
            color: var(--text-color-2);
          }
          .copy-btn:hover {
            background: var(--invert-background);
            color: var(--invert-text-color);
            cursor: pointer;
          }
        }
      }
    }
  }
}
.isOpen {
  transform: translateX(200px);
}
</style>
