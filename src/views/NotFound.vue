<template>
  <Container :size="800">
    <div class="about">
      <Space />
      <div class="gray"><b>404 Not Found!</b></div>
      <Space />
    </div>
  </Container>
</template>

<script>
export default {
  name: "NotFound",
  head: {
    title: "Not Found",
    meta: [{ name: "description", content: "404" }],
  },
};
</script>

<style lang="scss" module></style>
