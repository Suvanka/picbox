// 创建一个Vue应用实例并挂载到DOM上
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/alert.scss'
import './assets/css/color.scss'
import './assets/css/common.scss'
import './assets/css/title.scss'

const app = createApp(App)

app.use(router)
app.mount('#app')