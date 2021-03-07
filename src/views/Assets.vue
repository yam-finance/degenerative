<template>
  <div class="assets">
    <Container :size="900">
      <Card>
        <h2 class="flex">
          <span>Assets</span>
          <SpacePush />
          <a class="asset-detail-switch" href="https://docs.degenerative.finance/ugas" target="_blank">Info</a>
        </h2>
      </Card>

      <Space size="20" />

      <div id="assets">
        <div v-for="(asset, index) in assets" :key="`${index}`" class="asset">
          <router-link :to="'/asset/' + index">
            <Card>
              <div class="asset-name">{{ index.toUpperCase() }}</div>
              <Space size="sm" />
              <div class="asset-picture" :class="`logo-${index}`"></div>
            </Card>
          </router-link>
          <Space size="20" />
        </div>
      </div>

      <Space size="md" />
    </Container>
  </div>
</template>

<script>
import Assets from "../../protocol/assets.json";

export default {
  name: "Assets",
  head: {
    title: "Assets",
    meta: [{ name: "description", content: "All the assets available on Degenerative." }],
  },
  data() {
    return {
      assets: {},
    };
  },
  async mounted() {
    this.getAssets();
  },
  methods: {
    getAssets() {
      this.assets = Assets;
      console.log("Assets", Assets);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
#assets {
  a {
    display: block;
    width: 100%;
  }
}

.asset-name {
  display: block;
  text-align: center;
  font-weight: bold;
  font-size: 24px;
}
.asset-picture {
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 128px;
  margin: 0 auto;
  width: 128px;
  height: 128px;
}

.logo-ugas {
  background-image: url("../assets/assets/ugas/logo.png");
}
.logo-ustonks {
  background-image: url("../assets/assets/ustonks/logo.png");
}

.row {
  display: flex;
  width: 100%;

  @media (max-width: 540px) {
    &.row-item-col {
      flex-direction: column;
      div.item,
      .flexitem {
        width: 100%;
      }
    }
    flex-flow: row nowrap; // update
    align-items: center;
  }
  div.item,
  .flexitem {
    flex: 1 1 0%;
  }
}
</style>
