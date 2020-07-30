import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 编辑器
import VueQuillEditor from 'vue-quill-editor'
// 编辑器导入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'

import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
// 隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
// 时间
Vue.filter('dataFormat', function (orginVal) {
  const date = new Date(orginVal)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, 0)
  const d = (date.getDate() + '').padStart(2, 0)
  const hh = (date.getHours() + '').padStart(2, 0)
  const mm = (date.getMinutes() + '').padStart(2, 0)
  const ss = (date.getSeconds() + '').padStart(2, 0)
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 注册富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
