<template>
  <div>
    <span>
      <svg class="circle-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="circle-svg-path"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
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
.circle-svg-path {
  opacity: 0.75;
}

.circle {
  opacity: 0.25;
}

.circle-svg {
  height: 1.25rem;
  margin-right: 0.75rem;
  color: rgba(0, 0, 0, 1);
  width: 1.25rem;
  -webkit-animation: spin 0.5s linear infinite;
  animation: spin 0.5s linear infinite;
}

@-webkit-keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
