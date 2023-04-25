<!-- 输入框组件 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  // 输入框的值
  modelValue: {
    type: String,
    default: '',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
})
const v = ref(props.modelValue)
// 监听输入框值的变化
watch(() => props.modelValue, () => {
    v.value = props.modelValue
  })
const emit = defineEmits(['update:modelValue'])
const input = (e) => {
  let { value } = e.target
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    v-model="v"
    @input="input"
    :disabled="props.disabled" />
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
input {
  width: 100%;
  height: 45px;
  border-radius: 12px;
  padding: 5px 10px;
  border: var(--border-width) solid var(--border-color);
  font-size: 14px;
  line-height: 24px;
  background: var(--background-3);
  color: var(--text-color);
  box-sizing: border-box;
  color: var(--text-color);
}
input:focus {
  background: var(--background-2);
}
</style>