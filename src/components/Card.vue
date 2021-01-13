<template>
  <div class="card" :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    size: Number,
  },
  computed: {
    style() {
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  padding: 20px 20px;
  border-radius: 5px;
  border: 2px solid #0000000f;
  box-shadow: 3px 3px 0px #0000000f;
}

[data-theme="dark"] .card {
  background: #43314a;
  box-shadow: 0px 4px 6px #27162d2b inset;
}
</style>
