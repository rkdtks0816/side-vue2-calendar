import { createApp } from 'vue'
import App from './App.vue'
import plugins from './plugins'

createApp(App).mount('#app')
Vue.use(plugins);
