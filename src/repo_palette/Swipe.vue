<template>
  <div><input id="switch" type="checkbox" @click="switchTheme($event)" /><label for="switch"></label></div>
</template>

<style lang="scss" scoped>
input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 32px;
  height: 19px;
  background: #dedede;
  // background: #ffffff40;
  display: block;
  border-radius: 5px;
  position: relative;
}

label:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 15px;
  height: 15px;
  background: #fff;
  // background: #ffffffe6;
  border-radius: 4px;
  transition: 0.1s;
}

input:checked + label {
  background: #00000050;
  // background: #ffffff80;
}

input:checked + label:after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}

label:active:after {
  width: 20px;
}
</style>

<script>
import store from "@/store";
export default {
  props: {
    bgOff: String,
    bgOn: String,
    tickOff: String,
    tickOn: String,
  },
  methods: {
    switchTheme(event) {
      if (event.target.checked) {
        store.dispatch("updateTheme", { theme: "dark" });
      } else {
        store.dispatch("updateTheme", { theme: "light" });
      }
    },
  },
  mounted() {
    // if (localStorage.getItem("theme") === "dark") {
    //   document.querySelector("#switch").checked = true;
    // }
  },
};
</script>
