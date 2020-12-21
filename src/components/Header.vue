<template>
  <header>
    <Container :size="1000">
      <div id="nav">
        <router-link to="/">
          <div class="degenerative-logo">
            <div class="picture"></div>
            <div class="label">Degenerative</div>
          </div>
        </router-link>
        <SpacePush />
        <div class="router-links">
          <router-link to="/">Home</router-link>
          <router-link to="/assets/ugas">uGAS</router-link>
          <a href="#" target="_blank">Learn More</a>
          <!-- <router-link to="/assets">Assets</router-link> -->
          <!-- <a href="https://yam.finance/" target="_blank">by Yam.finance</a> -->
        </div>
        <div class="flex vert">
          <!-- <Swipe></Swipe> -->
          <Space />
          <button id="wallet" @click="auth" :class="{ connected: $auth.isAuthenticated }">
            <span v-if="!$auth.isAuthenticated">Connect Wallet</span>
            <span v-if="$auth.isAuthenticated">Connected</span>
          </button>
          <!-- <button id="wallet" @click="logout">Reset Instance</button> -->
        </div>
      </div>
    </Container>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  width: 100%;
  background: var(--back);
  height: 65px;
  margin-bottom: 24px;
  position: relative;
  z-index: 20;

  a {
    margin: 0px 10px;
    font-family: "Shanti", sans-serif;
    font-size: 14px;
    color: var(--text);
    font-weight: bold;
    &.router-link-exact-active {
      color: var(--primary);
    }
  }
}

#nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  padding: 15px 0px;
}

.degenerative-logo {
  display: flex;
  .picture {
    background: url("../assets/logo/32.png");
    background-size: 32px 32px;
    width: 32px;
    height: 32px;
  }
  .label {
    color: var(--text);
    font-weight: bold;
    font-size: 18px;
    margin-left: 12px;
    line-height: 1.8;
  }
}

.router-links {
  line-height: 2;
}

#wallet {
  cursor: pointer;
  background: var(--back-wallet);
  border-radius: 2px;
  border: none;
  width: 135px;
  height: 36px;
  color: var(--text-wallet);
  //   font-weight: 600;
  font-size: 14px;

  &:hover {
    box-shadow: 0px 2px 3px var(--back-wallet-hover);
  }
  &.connected {
    background: var(--primary); //temp
    color: #fff; //temp
  }
}

[data-theme="dark"] {
  #wallet {
    &.connected {
      background: #271d2c;
    }
  }
}
</style>

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
  methods: {
    ...mapActions(["connect", "disconnect", "reset"]),
    async auth() {
      const connected = await store.getters.connected;
      if (connected) {
        console.log("open user mini popup");
      } else {
        await this.connect();
      }
    },
    async logout() {
      await this.disconnect();
      await this.reset();
    },
    // send() {
    //   this.sendit("sendit");
    // },
    // async auth("walletconnect") {
    // },
  },
  mounted() {
    // this.send();
  },
};
</script>
