<!-- 表单组件 -->
<script setup lang="ts">
const props = defineProps({
  // 表单标题
  title: {
    type: String,
    default: '标题',
  },
  // 表单方向
  direction: {
    type: String,
    default: '',
  },
  // 小标题
  small_title: {
    type: String,
    default: '',
  },
  // 小标题链接
  small_title_link: {
    type: String,
    default: '',
  },
  // 相关提示
  tips: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="form-item" :class="{ isRow: props.direction == 'row' }">
    <label class="title-label">{{ props.title }}
      <a
        v-if="props.small_title"
        target="_blank"
        :href="props.small_title_link"
        >{{ props.small_title }}</a
      >
    </label>
    <div>
      <slot />
      <p class="tips" v-if="tips" v-html="tips"></p>
    </div>
  </div>
</template>

<!-- 样式配置（部分开源代码） -->
<style lang="scss" scoped>
.form-item {
  width: 100%;
  margin-bottom: 20px;
  label {
    display: block;
    width: 100%;
    margin: 0px 0px 5px 10px;
    a {
      text-decoration: underline;
      margin-left: 10px;
      color: var(--text-color-2);
    }
  }
  .tips {
    font-size: 12px;
    color: var(--text-color-2);
    padding: 10px;
    line-height: 18px;
  }
}
.isRow {
  display: flex;
  align-items: center;
  label {
    width: auto;
    padding-right: 10px;
    display: inline-block;
  }
}
</style>
