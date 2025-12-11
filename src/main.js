import { createApp } from 'vue'
import App from './App.vue'

//vue router
import router from './router'
import './router/permission'

// glob 遍历导入组件
import { globComponents } from './utils/glob'

//nprogress
import 'nprogress/nprogress.css'

//pinia
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(createPinia())
globComponents(app)
app.mount('#app')
