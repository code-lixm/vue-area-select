<template>
  <div id="app">
    <div class="control">
      <div class="model-list">
        {{ selectList }}
      </div>
      <button @click="handleOpr(1)" class="custom-btn">设置preventParent: {{ preventParent }}</button>
    </div>
    <div class="app">
      <div class="left"></div>
      <div class="main">
        <div class="area-select-container">
          <div class="list-one" v-for="(node, index) in list" :key="index" :data-selected-index="index">
            {{ node }}
          </div>
        </div>
        <VueAreaSelect
          :selectItemClassName="['list-one']"
          v-model="selectList"
          :preventParent="preventParent"
          selectedClassName="select-i"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { VueAreaSelect } from 'v-area-select'
export default {
  name: 'App',
  data() {
    const target = Array.from(new Array(1000), (item, i) => i)
    return {
      preventParent: false,
      selectAreaClassName: 'main',
      selectList: [],
      list: target
    }
  },
  created() {},
  watch: {},
  methods: {
    handleOpr(type) {
      switch (type) {
        case 1:
          this.preventParent = !this.preventParent
          break
      }
    }
  },
  components: {
    VueAreaSelect
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.app {
  display: flex;
  .left {
    width: 200px;
    background-color: yellow;
  }
  .main {
    flex: 1;
  }
}

.control {
  background-color: wheat;
}
.model-list {
  background: #fff;
  height: 100px;
  overflow: auto;
}
.list-one {
  width: 50px;
  height: 50px;
  display: inline-block;
  text-align: center;
  line-height: 50px;

  vertical-align: middle;
}
.area-select-container {
  display: inline-block;
  position: relative;
  height: 2500px;
  background-color: #ffffff;
}
.select-i {
  color: red;
}
</style>
