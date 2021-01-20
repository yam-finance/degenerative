<template>
  <a :href="link" target="_blank">
    <div class="cardlink" :style="style">
      <div class="title-text">{{ title }}</div>
      <SpacePush />
      <div class="icon">{{ icon }}</div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    size: Number,
    link: String,
    title: String,
    icon: String,
  },
  computed: {
    style() {
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.cardlink {
  display: flex;
  width: 100%;
  padding: 20px 20px;
  font-weight: bold;
  border-radius: 5px;
  border: 2px solid #0000000f;
  &:hover {
    border: 2px solid #e57067;
  }
}
</style>
