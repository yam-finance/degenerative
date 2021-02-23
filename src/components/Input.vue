<template>
  <div class="input-container">
    <input type="text" name="input-box" id="input">
    <button id="max-button">MAX</button>
  </div>
</template>

<script>
  export default {
    name: "Input",
    head: {
      title: "Input",
      meta: [{
        name: "description",
        content: "text input component"
      }]
    },
    props: {
      asset: '',
      placeholder: '',
      suffix: '',
      style: ''
    },
    data() {
      return {
        getMaxValue: function() {
        },
      }
    },
    computed: {
      maxValue: function() {
        
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>