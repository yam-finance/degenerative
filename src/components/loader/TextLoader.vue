<template>
  <div class="animation-container">
    <div class="text-loader-container">
      <div class="text-loader"></div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    style() {
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.text-loader {
  background-color: rgba(156, 163, 175, 1);
  border-radius: 0px;
  height: 1rem;
}

.text-loader-container {
  margin-top: 1rem;
  margin-bottom: 0rem;
  flex: 1 1 0%;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.animation-container {
  margin-right: 0rem;
  margin-left: 1rem;
  display: flex;
  -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@-webkit-keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
</style>
