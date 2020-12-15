<template>
  <div class="assets">
    <Container :size="800">
      <Card>
        <!-- <h1 class="">Asset: {{ $route.params.key.toUpperCase() }}</h1> -->
        <h1 class="flex">
          <span>{{ $route.params.key.toUpperCase() }}</span>
          <SpacePush />
          <button @click="toNavPage('info')" :class="{ active: navPage === 'info' }">Info</button>
        </h1>
      </Card>

      <Space size="md" />

      <Container :size="440" class="maker">
        <div>
          <div class="tabs">
            <button @click="toNavAct('create')" :class="{ active: navAct === 'create' }">Create</button>
            <button @click="toNavAct('redeem')" :class="{ active: navAct === 'redeem' }">Redeem</button>
            <button @click="toNavAct('liquidity')" :class="{ active: navAct === 'liquidity' }">Liquidity</button>
            <button @click="toNavAct('trade')" :class="{ active: navAct === 'trade' }">Trade</button>
          </div>

          <div id="inputbox">
            <div class="dropdown">
              <div class="select" tabindex="1">
                <input class="selectopt" name="test" type="radio" id="default" checked />
                <label for="default" class="option">Select Token</label>

                <input id="JAN21" class="selectopt" name="test" type="radio" value="0x00000000000JAN21" v-model="tokenSelected" />
                <label for="JAN21" class="option">uGAS-JAN21</label>
                <input id="FEB" class="selectopt" name="test" type="radio" value="0x000022222222FEB" v-model="tokenSelected" />
                <label for="FEB" class="option">uGAS-FEB</label>
                <input id="MAR" class="selectopt" name="test" type="radio" value="0x000033333333MAR" v-model="tokenSelected" />
                <label for="MAR" class="option">uGAS-MAR</label>
              </div>
            </div>
            <input id="" class="numeric setvalue" type="number" name="" placeholder="0.00 WETH" />

            <button id="act" @click="act">{{ actName }}</button>

            <div class="info" v-if="info">
              <label>Liquidation Price: <b>0.00</b></label>
              <label>Collateral Ratio: <b>0.00</b></label>
              <label>Collateral Ratio (Global): <b>0.00</b></label>
              <label>Collateral Ratio (Tx): <b>0.00</b></label>
              <label
                >Selected: <b>{{ tokenSelected }}</b></label
              >
            </div>
          </div>
        </div>
      </Container>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.maker {
  zoom: 1;
}
#inputbox {
}
.tabs {
  border-radius: 10px 10px 0px 0px;
  // border-radius: 10px;
  overflow: hidden;

  button {
    cursor: pointer;
    width: calc(100% / 4);
    // border-radius: 10px;
    border: none;
    height: 50px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.1s linear;
    color: var(--primary);
    background: var(--back-act);

    &.active,
    &:hover {
      color: #fff;
      background: var(--primary);
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.info {
  font-size: 12px;
  margin: 0px 8px 0px 8px;
  padding: 4px 10px 8px 10px;
  color: #00000080;
  /* background: #ffe7e721; */
  border-radius: 0px 0px 10px 10px;
  label {
    display: block;
  }
}
.numeric {
  width: 100%;
  border: 0px;
  background: white;
  height: 50px;
  padding: 20px;
}
.setvalue {
  width: 100%;
  border: 0px;
  background: var(--back-act);
  color: #ff4a4a;
  // font-weight: 800;
  height: 50px;
  padding: 10px;
  font-size: 22px;
  // font-family: "Share Tech Mono", monospace;
  font-family: "Inconsolata", monospace;
  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 74, 74, 0.2);
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(255, 74, 74, 0.2);
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: rgba(255, 74, 74, 0.2);
  }
}
.dropdown {
  border-radius: 0px 0px 10px 10px;

  .select {
    display: flex;
    flex-direction: column;
    position: relative;
    // font-family: "Share Tech Mono", monospace;
    font-family: "Inconsolata", monospace;
    height: 40px;
    font-size: 22px;
    // font-weight: 600;
    // margin-top: 20px;
  }

  .option {
    cursor: pointer;
    padding: 0 30px 0 10px;
    min-height: 40px;
    display: flex;
    align-items: center;
    background: var(--back-act);
    border-top: var(--back-act) solid 1px;
    color: #ff4a4a;
    position: absolute;
    top: 0;
    width: 100%;
    pointer-events: none;
    order: 2;
    z-index: 1;
    transition: background 0.4s ease-in-out;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }

  .select:focus .option {
    position: relative;
    pointer-events: all;
  }

  input {
    opacity: 0;
    position: absolute;
    left: -99999px;
  }

  input:checked + label {
    order: 1;
    z-index: 2;
    background: #fff;
    background: var(--back-act);
    border-top: none;
    position: relative;
  }

  input:checked + label:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #ff4a4a;
    position: absolute;
    right: 10px;
    top: calc(50% - 2.5px);
    pointer-events: none;
    z-index: 3;
  }

  input:checked + label:before {
    position: absolute;
    right: 0;
    height: 40px;
    width: 40px;
    content: "";
    background: #fff;
    background: var(--back-act);
  }
}
#act {
  cursor: pointer;
  color: #ff4a4a;
  background: #ffe7e7;
  height: 50px;
  font-size: 20px;
  font-weight: 600;
  border: 0px;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  transition: background 0.1s ease-in-out;

  // &:hover {
  //   background: #ffe7e7;
  // }
  &:active {
    background: #ffe1e1;
  }
}
</style>

<script>
export default {
  name: "Asset",
  head: {
    title: "Asset",
    meta: [{ name: "description", content: "Degenerative uGas Asset." }],
  },
  data() {
    return {
      actName: "Mint",
      navPage: "info",
      navAct: "create",
      info: true,
      tokenSelected: null,
    };
  },
  components: {},
  methods: {
    act() {
      console.log("Act");
    },
    toNavPage(on) {
      this.navPage = on;
      console.log("toNavPage", on);
    },
    toNavAct(on) {
      this.navAct = on;
      console.log("toNavAct", on);
    },
  },
};
</script>
