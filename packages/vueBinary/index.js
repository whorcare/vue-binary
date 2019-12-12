// 为组件提供 install 方法，供组件对外按需引入
import VueBinary from './src/vueBinary'
VueBinary.install = Vue => {
  Vue.component(VueBinary.name, VueBinary)
}
export default VueBinary