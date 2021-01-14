import Select from '../components/VueAreaSelect'
const VueAreaSelect = {
  install(Vue) {
    Vue.component(Select.name, Select)
  }
}
if (typeof window !== 'undefined' && window.Vue) {
  window.VueAreaSelect = VueAreaSelect
  Vue.use(VueAreaSelect)
}
export default VueAreaSelect
