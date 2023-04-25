<script setup lang="ts">
import { Alert } from '../util/alert'
import {
  LButton,
  LFormItem,
  LInput,
  LSelect,
} from '../components/base'
import { GithubConfig } from '../model/github_config.model'
import axios from '../axios/http'
import { onMounted, reactive, ref } from 'vue'
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

const repos = ref([] as any)
let user: any = ref({} as GithubConfig)
let token = ref('' as any)
let loading_1 = ref(false)
let loading_2 = ref(false)
let loading_3 = ref(false)
let loading_4 = ref(false)

const GetUser = () => {
  axios
    .get({
      url: `/user`,
    })
    .then((res: any) => {
      user.value.owner = res.data.login
      user.value.name = res.data.name
      user.value.avatarUrl = res.data.avatar_url
      localStorage.setItem('github_config', JSON.stringify(user.value))
      GetRepos()
    })
    .catch(() => {
      loading_1.value = false
      loading_4.value = false
    })
}

const SetToken = () => {
  localStorage.setItem('token', token.value)
  GetUser()
}

const GetRepos = () => {
  axios
    .get({
      url: `/users/${user.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data
      loading_1.value = false
      if (
        !user.value.repoId &&
        token.value == ' '
      ) {
        user.value.repoId = 1
        Save()
      }
    })
}

const Save = () => {
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
    <div v-if="!user.name" class="title-1">设置</div>
    <div v-show="user.name" class="user-info">
      <img class="avatar" :src="user.avatarUrl" alt="" srcset="" />
      <div class="name">{{ user.name }}</div>
    </div>
    <div class="form">
      <l-form-item title="Github access token">
        <l-input
          :disabled="repos.length > 0"
          v-model="token"
          placeholder="请输入token"
        ></l-input>
      </l-form-item>

      <l-form-item v-show="repos.length > 0" title="选择授权的仓库">
        <l-select
          v-model="user.repoId"
          :option="repos"
          label="name"
          value="id"
        ></l-select>
      </l-form-item>
    </div>

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
    <l-form-item
      title=""
      :tips="repos.length == 0 ? 
      `获取步骤： <br />
      登录Github → 点击右上角头像 → Settings → Developer settings → Personal access tokens → 
      Fine-grained tokens → Generate new token → 填入信息，选择存放图片的仓库 → Repository permissions → 
      Contents权限改为Read and write → Generate token → 复制token → 粘贴到上方输入框<br /><br />
      课程展示用token： <br />
      github_pat_11AUWR7MY0KGaORihLxYiH_<br />
      NV7DWZmehGKBhf9P1qUkuxYgIsJKjDbccxsQK4GeQAo4NILP3QIVXQF6N7z` : ''">
    </l-form-item>
  </div>
</template>
<style></style>

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

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 20px;
  padding: 20px 0px;
  .avatar {
    width: 150px;
    border-radius: 50%;
    border: var(--border-width) var(--border-color) solid;
  }
  .name {
    margin-top: 5px;
    font-size: 18px;
    line-height: 32px;
    margin-left: 10px;
    color: var(--text-color);
  }
}

.token-demo {
  width: 100%;
  background-color: rgb(243, 255, 245);
  border-radius: 14px;
  margin-bottom: 20px;
  padding: 15px;
  line-height: 30px;
}
</style>
