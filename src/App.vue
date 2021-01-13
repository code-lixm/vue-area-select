<template>
  <div id="app" class="app">
    <!-- <div class="control"></div> -->
    <div class="area-select-container">
      <div class="list-one" v-for="(node, index) in list" :key="index" :data-selected-index="index">
        {{ node }}
      </div>
      <VueAreaSelect :selectItemClassName="['list-one']" v-model="selectList" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    const target = Array.from(new Array(1000), (item, i) => i)
    return {
      selectList: [],
      list: target
    }
  },
  created() {},
  watch: {},
  methods: {},
  components: {}
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.control {
  height: 200px;
  width: 100%;
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
</style>
