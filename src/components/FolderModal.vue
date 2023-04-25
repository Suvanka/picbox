<!-- 文件夹模块 -->
<script setup lang="ts">
import { ref } from 'vue'
import axios from '../axios/http'
import { Alert } from '../util/alert'
import { GithubConfig } from '../model/github_config.model'
import { LButton, LInput, LFormItem } from '../components/base'

// 获取本地存储的github配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'updateFolderList'])

let forderName = ref('')
let loading = ref(false)

// 添加文件夹
const AddForder = () => {
  // 无仓库信息，告警
  if (!github_config?.repoId) {
    Alert({
      type: 'danger',
      text: '请先设置token信息',
    })
    return
  }
  loading.value = true
  // 发送axios put请求，创建文件夹
  axios.put({
    url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${forderName.value}/init`,
    data: {
      message: 'create a forder',
      content: 'Y3JlYXRlIGEgZm9yZGVy',
    },
  }).then((res: any) => {
    loading.value = false
    Alert({
      type: 'success',
      text: '创建成功',
    })
    forderName.value = ''
    emit('close')
    emit('updateFolderList')
  }).catch(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="folder-modal" :class="{ isOpen: props.isOpen }">
    <l-form-item title="新建文件夹">
      <l-input v-model="forderName" placeholder="输入文件夹名称"></l-input>
    </l-form-item>
    <div class="form-item btn-box">
      <l-button @click="AddForder()" type="primary" :loading="loading">
        确认
      </l-button>
      <l-button @click="emit('close')" type="danger">取消</l-button>
    </div>
  </div>
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
.folder-modal {
  position: absolute;
  left: -var(--border-width);
  bottom: 40px;
  z-index: 9;
  width: 200px;
  height: 170px;
  background: var(--background-2);
  opacity: 1;
  padding: 7px;
  box-sizing: border-box;
  border-top: var(--border-width) var(--border-color) solid;
  transition: all 0.25s;
}
.isOpen {
  bottom: 200px;
  opacity: 1;
}
.form-item {
  margin-bottom: 6px;
}
.form-item:first-child {
  margin-top: 10px;
}
.btn-box {
  display: flex;
  .button:first-child {
    margin-right: 6px;
  }
}
</style>