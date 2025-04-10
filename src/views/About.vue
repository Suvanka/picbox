<!-- 关于视图 -->
<template>
  <div class="about-wrapper">
    <div class="title-1">关于</div>
    <div class="content">
      图片上传管理工具PicBox<br />
      Github仓库地址：<a
        target="_blank" href="https://github.com/Suvanka/picbox"
      >https://github.com/Suvanka/picbox
      </a><br />
      由于Github在国内访问速度较慢，必要时请使用代理<br /><br />
    </div>
  </div>
</template>

<!-- 样式配置 -->
<style lang="scss" scoped>
.about-wrapper {
  max-width: 400px;
  margin: 70px auto;
  padding: 50px;
  color: var(--text-color);
  .content {
    margin-top: 20px;
    color: var(--text-color);
    line-height: 30px;
  }
}
</style>
