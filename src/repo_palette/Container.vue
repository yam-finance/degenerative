<template>
  <div class="container" :style="style">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 0px 24px;
  flex-direction: column;
  box-sizing: border-box;
}
</style>

<script>
export default {
  props: {
    size: Number,
    percent: Boolean,
  },
  computed: {
    style() {
      if (this.size) {
        return {
          // width: this.size + "px",
          "max-width": this.size + (this.percent ? "%" : "px"),
        };
      } else {
        return {
          // width: "960px",
          "max-width": "960px",
        };
      }
    },
  },
};
</script>
