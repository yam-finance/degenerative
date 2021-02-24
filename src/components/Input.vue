<template>
  <div class="input-container">
    <input type="text" name="input-box" id="input" />
    <button id="max-button">MAX</button>
  </div>
</template>

<script>
export default {
  name: "Input",
  head: {
    title: "Input",
    meta: [
      {
        name: "description",
        content: "text input component",
      },
    ],
  },
  props: {
    asset: null,
    placeholder: null,
    suffix: null,
    style: null,
  },
  data() {
    return {
      getMaxValue: function() {
        return null;
      },
    };
  },
  computed: {
    maxValue: function() {
      return null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
