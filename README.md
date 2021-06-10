# v-area-select

这是一个PC端的区域框选插件

[Demo](https://lixiaoming-bit.github.io/vue-area-select/)

## 使用方式

安装

> npm install v-area-select or yarn add v-area-select

注册使用

1. 全局安装，在`main.js`中
```js
import VueAreaSelect from 'v-area-select'
Vue.use(VueAreaSelect)
```
2. 在组件中使用
```js
import { VueAreaSelect } from 'v-area-select'
components: {VueAreaSelect}
```

## 代码
```js
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
          v-model="selectList"
          :selectItemClassName="['list-one']"
          :preventParent="preventParent"
          selectedClassName="select-i"
          selectAreaClassName="main"
        />
      </div>
    </div>
  </div>
</template>
```

## 简单的属性API

|        属性         |                                                                                          说明                                                                                           |           类型           |      默认值      |
| :-----------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------: | :--------------: |
|   value(v-model)    |                                                                                        框选列表                                                                                         |         `Array`          |
| selectAreaClassName |                                                                                  指定选择的区域的类名                                                                                   |         `string`         | 当前组件的父元素 |
| selectItemClassName |                                                     框选范围内被框选的元素`class`, 只有当设置了可以被框选的元素， 元素才可以被框选                                                      | `Array<string> / string` |                  |
|  ancestorClassName  | 这个用于控制当前的组件所在的范围，如果当前的组件父节点 没有滚动条 那么就无需设置，当父组件设置了`overflow:auto` 或者其他情况出现了滚动条 需要设置 当前组件 -> 父组件 -> 父组件的`class` |         `string`         |       html       |
|  selectedClassName  |                                                                      用于控制被框选元素的样式, 元素被选中后的样式                                                                       |         `string`         |  selected-item   |
|    rectClassName    |                                                                                       选框的样式                                                                                        |         `string`         | area-select-mask |
|   chooseDirectly    |                                                                  是否在鼠标点击下的时候就选择，还是在移动得时候再选择                                                                   |        `boolean`         |       true       |
|    preventParent    |                       用于控制是否进行 无规则 跨范围多选，当设置为`true` 的时候 会保留前面的选择元素，这个可以结合 键盘事件 控制 `true\false` 来进行跨范围的多选                        |        `boolean`         |      false       |
| data-selected-index |                                                                                 元素标签上绑定的唯一值                                                                                  |     `string/number`      |
