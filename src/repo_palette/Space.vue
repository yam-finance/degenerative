<template>
  <span class="style" :style="style"></span>
</template>

<script>
export default {
  props: {
    size: String,
    mobile: Boolean,
  },
  computed: {
    style() {
      if (this.mobile) {
        return;
      }
      if (this.size === "sm") {
        return {
          width: "16px",
          height: "16px",
        };
      } else if (this.size === "md") {
        return {
          width: "32px",
          height: "32px",
        };
      } else if (this.size === "dynamic") {
        if (window.screen.width > 800) {
          return {
            width: "32px",
            height: "32px",
          };
        } else {
          return {
            width: "10px",
            height: "10px",
          };
        }
      } else if (this.size === "lg") {
        return {
          width: "64px",
          height: "64px",
        };
      } else {
        if (Number(this.size)) {
          return {
            width: this.size + "px",
            height: this.size + "px",
          };
        } else {
          return {
            width: "24px",
            height: "24px",
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.style {
  display: inline-block;
}
</style>
