<template>
  <header>
    <Container :size="900">
      <div id="nav">
        <router-link class="logo" to="/">
          <div class="degenerative-logo">
            <div class="picture"></div>
            <div class="label">Degenerative</div>
          </div>
        </router-link>
        <SpacePush />
        <div class="router-links">
          <router-link @click.native="respNavClick" to="/">Home</router-link>
          <router-link @click.native="respNavClick" to="/assets">Assets</router-link>
          <router-link @click.native="respNavClick" to="/asset/ugas">uGAS</router-link>
          <router-link @click.native="respNavClick" to="/asset/ustonks">uSTONKS</router-link>
          <a @click="respNavClick" href="https://docs.degenerative.finance" target="_blank">Docs</a>
          <div @click="respNavClose" class="resp-links-close">Close</div>
          <Space />
        </div>

        <div class="flex vert">
          <!-- <Swipe></Swipe> -->
          <button id="wallet" @click="auth" :class="{ connected: $auth.isAuthenticated }">
            <span v-if="!$auth.isAuthenticated">Connect Wallet</span>
            <span v-if="$auth.isAuthenticated">Connected</span>
          </button>
          <!-- <button id="wallet" @click="logout">Reset Instance</button> -->
        </div>

        <div @click="respNavOpen" class="resp-links-open">
          <Space />
          <menu-icon />
        </div>
      </div>
    </Container>
  </header>
</template>

<script>
import store from "@/store";
import { mapActions } from "vuex";
import MenuIcon from "vue-material-design-icons/Menu.vue";

export default {
  name: "Header",
  data() {
    return {
      account: store.state.account,
      respNav: false,
    };
  },
  components: {
    MenuIcon,
  },
  watch: {},
  methods: {
    ...mapActions(["connect", "disconnect", "reset"]),
    async auth() {
      const connected = await store.getters.connected;
      if (connected) {
        console.log("open user mini popup");
      } else {
        await this.connect({ connector: "injected", organic: true });
      }
    },
    async logout() {
      await this.disconnect();
      await this.reset();
    },
    respNavOpen() {
      this.respNav = true;
      if (document.querySelector("body").classList.contains("navresp")) {
        document.querySelector("body").classList.remove("navresp");
        document.querySelector(".router-links").classList.add("hide");
        document.querySelector(".router-links").classList.remove("show");
      } else {
        document.querySelector("body").classList.add("navresp");
        document.querySelector(".router-links").classList.add("show");
        document.querySelector(".router-links").classList.remove("hide");
      }
    },
    respNavClose() {
      this.respNav = true;
      if (document.querySelector("body").classList.contains("navresp")) {
        document.querySelector("body").classList.remove("navresp");
        document.querySelector(".router-links").classList.remove("show");
      } else {
        document.querySelector("body").classList.add("navresp");
        document.querySelector(".router-links").classList.add("show");
        document.querySelector(".router-links").classList.remove("hide");
      }
    },
    respNavClick() {
      document.querySelector("body").classList.remove("navresp");
      document.querySelector(".router-links").classList.remove("show");
    },
  },
  // mounted() {},
};
</script>

<style lang="scss" scoped>
// 690
// 420
header {
  display: flex;
  width: 100%;
  height: 65px;
  margin-bottom: 0px;
  position: relative;
  z-index: 20;

  a {
    margin: 0px 10px;
    font-family: "Shanti", sans-serif;
    font-size: 14px;
    color: var(--text);
    font-weight: bold;
    &.logo {
      margin: 0px 10px 0px 0px;
    }
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
    // background: url("../assets/logo/templogo.svg") center -5px;
    background: url("../assets/logo/zombie.png") center 0px no-repeat;
    background-size: 21px; // 60px 40px; // 32px 32px;
    width: 32px;
    height: 32px;
  }
  .label {
    color: var(--text);
    font-weight: bold;
    font-size: 18px;
    margin-left: 12px;
    line-height: 1.8;

    @media (max-width: 420px) {
      display: none;
    }
  }
}

.router-links {
  line-height: 2;

  @media (max-width: 690px) {
    display: none;

    background: #ffffffeb;
    background: #000000d4;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 40px;

    a {
      display: block;
      height: 50px;
      line-height: 50px;
      background: #ffeded;
      margin-bottom: 20px;
      margin: 0px auto 20px auto;
      padding: 0px 20px;
      border-radius: 2px;
    }
  }

  &.show {
    display: block !important;
  }
  &.hide {
    display: none !important;
  }
}

.resp-links-open {
  display: none;
  margin-top: 5px;
  @media (max-width: 690px) {
    display: block;
  }
}

.resp-show {
  display: none;
  @media (max-width: 690px) {
    display: block;
  }
}

.resp-links-close {
  display: none;
  background: #ffeded;
  text-align: center;
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 40px;
  width: calc(100% - 80px);
  border-radius: 2px;
  @media (max-width: 690px) {
    display: block;
  }
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
