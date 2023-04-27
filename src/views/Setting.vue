<!-- 设置视图 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from '../axios/http'
import { GithubConfig } from '../model/github_config.model'
import { Alert } from '../util/alert'
import { LButton, LFormItem, LInput, LSelect } from '../components/base'

const repos = ref([] as any)
const token_pre = atob('Z2l0aHViX3BhdF8xMUFVV1I3TVkwdmlSYXdMZ1NVZjVNX0dZaVRsS3JVYXIwOVBLVk8zYWx6b1dLUTNMSFRRZ094a3hHTVlRMUhKVDZDS0VHVE1HSHRWMld3OVo1')

let user: any = ref({} as GithubConfig)
let token = ref('' as any)
let loading_1 = ref(false)
let loading_2 = ref(false)
let loading_3 = ref(false)
let loading_4 = ref(false)

// 解析github配置
onMounted(() => {
  if (!!localStorage.getItem('github_config')) {
    let github_config = JSON.parse(localStorage.getItem('github_config') as any)
    user.value = github_config
  } else {
    user.value.repoId = ''
  }
  if (!!localStorage.getItem('token')) {
    token.value = localStorage.getItem('token')
    GetUser()
  }
})

// 通过axios的get方法，获取用户信息
const GetUser = () => {
  axios.get({ url: `/user` })
  .then((res: any) => {
    user.value.owner = res.data.login
    localStorage.setItem('github_config', JSON.stringify(user.value))
    GetRepos()
  })
  .catch(() => {
    loading_1.value = false
    loading_4.value = false
  })
}

// 设置token
const SetToken = () => {
  localStorage.setItem('token', token.value)
  GetUser()
}

// 通过axios的get方法，获取仓库列表
const GetRepos = () => {
  axios.get({
    url: `/users/${user.value.owner}/repos?type=public&sort=created&per_page=100`,
  })
  .then((res: any) => {
    repos.value = res.data
    loading_1.value = false
    if (!user.value.repoId && token.value == ' ') {
      user.value.repoId = 1
      Save()
    }
  })
}

// 保存配置到本地
const Save = () => {
  // 如果未选择仓库，告警
  if (!user.value.repoId) {
    Alert({
      type: 'warning',
      text: '请选择仓库',
    })
    return
  }
  loading_2.value = true
  user.value.repoPath = repos.value.find((e) => user.value.repoId == e.id).name
  localStorage.setItem('github_config', JSON.stringify(user.value))
  setTimeout(() => {
    Alert({
      type: 'success',
      text: '保存成功！',
    })
    loading_2.value = false
    location.reload()
  }, 500)
}

// 删除配置
const Exit = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('github_config')
  localStorage.removeItem('history_list')
  loading_3.value = true
  Alert({
    type: 'success',
    text: '删除成功',
  })
  setTimeout(() => {
    loading_3.value = false
    location.reload()
  }, 500)
}
</script>

<template>
  <div class="form">
    <div class="title-1">设置</div>
    <div class="form">
      <!-- token输入框 -->
      <l-form-item title="Github access token">
        <l-input
          :disabled="repos.length > 0"
          v-model="token"
          placeholder="请输入token"
        ></l-input>
      </l-form-item>
      <!-- 仓库选择框 -->
      <l-form-item v-show="repos.length > 0" title="选择授权的仓库">
        <l-select
          v-model="user.repoId"
          :option="repos"
          label="name"
          value="id"
        ></l-select>
      </l-form-item>
    </div>

    <!-- 确定、保存、删除按钮 -->
    <l-button
      type="primary"
      v-show="repos.length == 0"
      @click=";(loading_1 = true), SetToken()"
      :loading="loading_1"
    >
      确定
    </l-button>
    <l-button
      type="primary"
      v-show="repos.length > 0"
      @click="Save()"
      :loading="loading_2"
    >
      保存配置
    </l-button>
    <l-button
      type="danger"
      v-show="repos.length > 0"
      @click="Exit()"
      :loading="loading_3"
    >
      删除配置
    </l-button>

    <!-- 其他提示 -->
    <div class="content">
      获取步骤：<br />
      ① 登录Github，点击右上角头像，选择Settings<br />
      ② 依次点击Developer settings → Personal access tokens → Fine-grained tokens → Generate new token<br />
      ③ 填入信息，选择存放图片的仓库，在Repository permissions中将Contents权限改为Read and write，然后Generate token<br />
      ④ 复制token，粘贴到上方输入框，选择相应仓库<br /><br />
      token信息将保存在本地，不会上传到服务器<br /><br />
      课程展示用token：<br />
      {{ token_pre }}
    </div>
  </div>
</template>
<style></style>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 0px auto;
}
.title-1 {
  margin-top: 120px;
  margin-bottom: 20px;
  color: var(--text-color-1);
  font-weight: bold;
}
.content {
  margin-top: 20px;
  color: var(--text-color-2);
  line-height: 20px;
}
</style>
