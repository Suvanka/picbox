// 路由配置文件
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import About from '../views/About.vue'
import Index from '../views/Index.vue'
import Setting from '../views/Setting.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',          // 主界面路径
    name: 'Index',
    component: Index,
    meta: {},
  },{
    path: '/setting',   // 设置界面路径
    name: 'Setting',
    component: Setting,
    meta: {},
  },{
    path: '/About',     // 关于界面路径
    name: 'About', 
    component: About,
    meta: {},
  },
]

// 创建路由
const router = createRouter({
  history: createWebHashHistory(''),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
