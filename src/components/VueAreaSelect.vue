<template>
  <div
    v-show="visible"
    :class="rectClassName"
    :style="{
      width: sw,
      height: sh,
      top: st,
      left: sl,
      position: 'absolute',
      transform: 'translateZ(0)',
      boxSizing: 'borderBox'
    }"
  ></div>
</template>
<script>
import { addEvent, removeEvent } from '../utils/utils'
export default {
  name: 'VueAreaSelect',
  filters: {},
  components: {},
  props: {
    selectAreaClassName: {
      type: String,
      default: ''
    },
    selectItemClassName: {
      validator: value => Array.isArray(value) || typeof value === 'string'
    },
    ancestorClassName: {
      type: String,
      default: 'html'
    },
    selectedClassName: {
      type: String,
      default: 'selected-item'
    },
    rectClassName: {
      type: String,
      default: 'area-select-mask'
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    chooseDirectly: {
      type: Boolean,
      default: true
    },
    preventParent: {
      type: Boolean,
      defautl: false
    }
  },
  model: {
    prop: 'selectedList',
    event: 'call'
  },
  data() {
    return {
      selectAreaDom: null,
      rootEl: null,
      rootElType: '',
      selectDoms: null,
      mouseClick: false,
      visible: false,
      startX: 0,
      startY: 0,
      endY: 0,
      endX: 0,
      selectingList: [],
      scrollTimer: null,
      parentRect: null
    }
  },
  created() {
    this.selectingList = [...this.selectedList]
  },
  mounted() {
    this.selectDoms = this.getClassNameList()

    this.getAreaClassName()

    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = this.selectAreaDom
    this.parentRect = [offsetLeft, offsetTop, offsetWidth, offsetHeight]
    ;[this.rootEl, this.rootElType] = this.getAncestorDom()

    addEvent(this.selectAreaDom, 'mousedown', this.handleMouseDown)
    addEvent(document.documentElement, 'resize', this.handleResize)
  },
  methods: {
    handleResize() {
      this.$nextTick(() => {
        this.selectDoms = this.getClassNameList()
        let selectAreaDom = this.getAreaClassName()
        !selectAreaDom && (selectAreaDom = this.$el.parentNode)
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = selectAreaDom
        this.parentRect = [offsetLeft, offsetTop, offsetWidth, offsetHeight]
        ;[this.rootEl, this.rootElType] = this.getAncestorDom()
      })
    },
    initGlobal() {
      this.startX = 0
      this.startY = 0
      this.endY = 0
      this.endX = 0
      this.selectingList = []
      clearInterval(this.scrollTimer)
      this.scrollTimer = null
    },
    handleMouseDown(e) {
      e.stopPropagation()
      e.preventDefault()

      if (e instanceof MouseEvent && e.which !== 1) return
      const target = e.target || e.srcElement
      if (!this.selectAreaDom.contains(target)) return false

      this.visible = true
      this.mouseClick = true

      const { clientX, clientY } = e
      const { scrollTop, scrollLeft } = this.rootEl

      const pageX = clientX + scrollLeft + (!this.rootElType ? document.documentElement.scrollLeft : 0)
      const pageY = clientY + scrollTop + (!this.rootElType ? document.documentElement.scrollTop : 0)

      ;[this.startX, this.startY] = [pageX, pageY]
      ;[this.endX, this.endY] = [pageX, pageY]

      addEvent(this.selectAreaDom, 'mousewheel', this.handleMouseWheelScroll)
      addEvent(document.documentElement, 'mousemove', this.handleMouseMove)
      addEvent(document.documentElement, 'mouseup', this.handleMouseUp)

      if (this.chooseDirectly) {
        this.$nextTick(() => {
          this.handleAreaSelect()
        })
      }
    },
    handleMouseMove(e) {
      if (this.mouseClick) {
        const { clientX, clientY } = e
        const { scrollTop, scrollLeft } = this.rootEl

        const pageX = clientX + scrollLeft + (!this.rootElType ? document.documentElement.scrollLeft : 0)
        const pageY = clientY + scrollTop + (!this.rootElType ? document.documentElement.scrollTop : 0)
        this.checkParent(pageX, pageY)
        this.autoScroll(pageX, pageY, clientX, clientY, 50)
        this.handleAreaSelect()
      }
    },
    handleMouseUp() {
      clearInterval(this.scrollTimer)
      this.timer = null
      this.mouseClick = false
      this.visible = false
      removeEvent(this.rootEl, 'mousewheel', this.handleMouseWheelScroll)
      removeEvent(document.documentElement, 'mousemove', this.handleMouseMove)
      removeEvent(document.documentElement, 'mouseup', this.handleMouseUp)

      this.initGlobal()
    },
    handleAreaSelect() {
      const rectSelect = this.$el.getClientRects()[0]
      let selectingList = this.preventParent ? [...this.selectedList] : []

      for (let i = 0; i < this.selectDoms.length; i++) {
        const node = this.selectDoms[i]
        const rect = node.getClientRects()[0]
        const index = node.getAttribute('data-selected-index')

        const selectedIndex = selectingList.indexOf(index)
        const flag = this.collide(rect, rectSelect)

        if (flag && selectedIndex === -1) selectingList.push(index)

        if (!flag && !this.preventParent && selectedIndex > -1) selectingList.splice(index, 1)
      }
      this.selectingList = Array.from(new Set(selectingList))

      this.$emit('call', this.selectingList)
    },
    reRenderSelectList(list) {
      const selectedClassName = this.selectedClassName

      for (let i = 0; i < this.selectDoms.length; i++) {
        const node = this.selectDoms[i]
        const index = node.getAttribute('data-selected-index')

        const flag = list.indexOf(index)
        if (flag > -1) {
          node.classList.add(selectedClassName)
        }
        if (flag === -1) {
          node.classList.remove(selectedClassName)
        }
      }
      // requestAnimationFrame(this.reRenderSelectList(list))
    },
    handleMouseWheelScroll(e) {
      clearInterval(this.scrollTimer)
      const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = this.rootEl
      const { shiftKey, clientX, clientY, deltaY, deltaX } = e
      let pageX = clientX + scrollLeft + (!this.rootElType ? document.documentElement.scrollLeft : 0)
      let pageY = clientY + scrollTop + (!this.rootElType ? document.documentElement.scrollTop : 0)
      if (!shiftKey) {
        pageY += deltaY > 0 ? +100 : -100
        if (scrollHeight === scrollTop + clientHeight || scrollTop <= 0) {
          pageY = clientY + scrollTop
        }
      } else {
        pageX += deltaX > 0 ? -100 : +100
        if (scrollWidth === scrollLeft + clientWidth || scrollLeft <= 0) {
          pageX = clientX + scrollLeft
        }
      }
      this.checkParent(pageX, pageY)
    },
    collide(rect, rectSelect) {
      const maxX = Math.max(rect.x + rect.width, rectSelect.x + rectSelect.width)
      const maxY = Math.max(rect.y + rect.height, rectSelect.y + rectSelect.height)
      const minX = Math.min(rect.x, rectSelect.x)
      const minY = Math.min(rect.y, rectSelect.y)
      return Boolean(maxX - minX <= rect.width + rectSelect.width && maxY - minY <= rect.height + rectSelect.height)
    },
    checkParent(pageX, pageY) {
      pageX = Math.ceil(pageX)
      pageY = Math.ceil(pageY)

      const [left, top, width, height] = this.parentRect

      if (pageX > width + left) pageX = width + left

      if (pageX < left) pageX = left

      if (pageY > height + top) pageY = height + top

      if (pageY < top) pageY = top
      ;[this.endX, this.endY] = [pageX, pageY]
    },
    autoScroll(pageX, pageY, clientX, clientY, interval) {
      clearInterval(this.scrollTimer)
      this.scrollTimer = setInterval(() => {
        let { scrollTop, clientHeight, scrollHeight, scrollLeft, scrollWidth, clientWidth } = this.rootEl
        let directX = ''
        let directY = ''

        if (clientX <= 0) directX = 'left'

        if (clientX > clientWidth) directX = 'right'

        if (clientY <= 0) directY = 'up'

        if (clientY > clientHeight) directY = 'down'

        if (directX === 'left') {
          pageX = 0
          if (scrollLeft <= 0) clearInterval(this.scrollTimer)
          this.rootEl.scrollLeft = scrollLeft <= 0 ? 0 : this.rootEl.scrollLeft - 50
        }
        if (directX === 'right') {
          pageX = scrollWidth

          const flag = clientWidth + scrollLeft >= scrollWidth
          if (flag) clearInterval(this.scrollTimer)
          this.rootEl.scrollLeft = flag ? scrollWidth - clientWidth : this.rootEl.scrollLeft + 50
        }
        if (directY === 'up') {
          pageY = 0

          if (scrollTop <= 0) clearInterval(this.scrollTimer)
          this.rootEl.scrollTop = scrollTop <= 0 ? 0 : this.rootEl.scrollTop - 50
        }
        if (directY === 'down') {
          pageY = scrollHeight

          const flag = clientHeight + scrollTop > scrollHeight
          if (flag) clearInterval(this.scrollTimer)
          this.rootEl.scrollTop = flag ? scrollHeight - clientHeight : this.rootEl.scrollTop + 50
        }
        this.checkParent(pageX, pageY)
      }, interval)
    },
    getClassNameList() {
      let list =
        typeof this.selectItemClassName === 'string' ? this.selectItemClassName.split(',') : this.selectItemClassName
      list = Array.from(new Set(list))
      const selectDoms = []
      for (let i = 0; i < list.length; i++) {
        const item = '.' + list[i]
        const dom = document.querySelectorAll(item)
        if (dom) selectDoms.push(dom)
      }
      return selectDoms[0]
    },
    getAncestorDom() {
      const acestorDom = document.querySelector(this.ancestorClassName)
      const flag = acestorDom === document.documentElement || acestorDom === document
      const type = flag ? 1 : 0
      const targetDom = flag ? document.documentElement : acestorDom

      return [targetDom, type]
    },
    getAreaClassName() {
      this.selectAreaDom =
        this.selectAreaClassName === '' ? this.$el.parentNode : document.querySelector(`.${this.selectAreaClassName}`)
    }
  },
  watch: {
    selectedList: {
      handler(newVal) {
        this.$nextTick(() => {
          this.reRenderSelectList(newVal)
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    sw() {
      return `${Math.abs(this.endX - this.startX)}px`
    },
    sh() {
      return `${Math.abs(this.endY - this.startY)}px`
    },
    sl() {
      return `${Math.min(this.startX, this.endX)}px`
    },
    st() {
      return `${Math.min(this.startY, this.endY)}px`
    }
  },
  beforeDestroy() {
    removeEvent(this.$el.parentNode, 'mousedown', this.handleMouseDown)
  }
}
</script>
<style scoped lang="less">
.area-select-mask {
  background-color: rgba(196, 222, 247, 0.2);
  border: 1px dashed rgb(255, 0, 0);
  z-index: 10000;
}
</style>
<style>
.selected-item {
  background-color: rgba(16, 239, 255, 0.1);
}
</style>
