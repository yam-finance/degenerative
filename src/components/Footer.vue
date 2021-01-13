<template>
  <footer>
    <Container :size="900">
      <div class="footer-links">
        <a href="https://discord.gg/fbHX7NRa52" target="_blank">Discord</a>
        <a href="https://docs.degenerative.finance" target="_blank">Docs</a>
        <a href="https://umaproject.org/" target="_blank">UMA</a>
        <a href="https://yam.finance/" target="_blank">YAM</a>
      </div>
    </Container>
  </footer>
</template>

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

<style lang="scss" scoped>
footer {
  background: var(--back-act-tran);
  padding: 20px 20px;
  text-align: center;
}
.footer-links {
  a {
    margin: 0px 10px;
    font-family: "Shanti", sans-serif;
    font-size: 14px;
    color: var(--text);
    font-weight: bold;
  }
}
</style>
