<!-- 下拉选择框组件 -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  // 选择框的值
  modelValue: {
    type: String || Number,
    default: '',
  },
  // 选择框的选项
  option: {
    type: <any>Array,
    default: [],
  },
  // 选项显示的属性名
  label: {
    type: String || Number,
    default: ''
  },
  // 选项提交的属性名
  value: {
    type: String || Number,
    default: ''
  },
})
// 监听选择框值的变化
const v = ref(props.modelValue)
watch(() => props.modelValue, () => {
    v.value = props.modelValue
})
const emit = defineEmits(['update:modelValue'])
const change = (e) => {
  let { value } = e.target
  emit('update:modelValue', value)
}
</script>

<template>
  <select v-model="v" @change="change">
    <option value="" hidden>无选择</option>
    <option
      v-for="item in props.option"
      :value="item[value]"
      :key="item[label]"
    >
      {{ item[label] }}
    </option>
  </select>
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
select {
  width: 100%;
  height: 45px;
  border-radius: 12px;
  padding: 5px 10px;
  border: var(--border-width) solid var(--border-color);
  background: var(--background-3);
  color: var(--text-color);
  font-size: 14px;
  line-height: 24px;
  box-sizing: border-box;
}
</style>