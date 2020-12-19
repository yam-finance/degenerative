<template>
  <footer>
    <Container :size="1000">
      <div>Footer</div>
    </Container>
  </footer>
</template>

<style lang="scss" scoped></style>

<script>
import store from "@/store";
import { mapActions } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      account: store.state.account,
    };
  },
  components: {},
  methods: {},
  // mounted() {},
};
</script>
