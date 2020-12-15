<template>
  <button class="button" :style="style">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.button {
  cursor: pointer;
  border: none;
  width: fit-content;
  padding: 10px 10px;
  border-radius: 5px;
  font-weight: 500;
  background: #fff;
  color: var(--primary);
  // box-shadow: 0px 5px 8px #00000017;
  // box-shadow: rgb(0 0 0 / 5%) 0px 4px 4px 0px, rgb(255 255 255 / 5%) 4px 0px 8px 0px;
  box-shadow: 0px 2px 4px #3b2e4317;
}
// .button:hover {
//   background: #fdf9ff;
// }

[data-theme="dark"] {
  .button {
    background: #594760;
  }
  // .button:hover {
  //   background: #66536d;
  // }
}

// .button:hover {
//   transition: 0.15s;
// }
</style>

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
