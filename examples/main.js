import Vue from 'vue'
import App from './App.vue'

// 导入组件
import VueBinary from '../packages/index';

Vue.use(VueBinary);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
