import Vue from "vue";

Vue.filter("capitalize", (value: any) => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("uppercase", (value: any) => {
  if (!value) return "";
  return value.toUpperCase();
});
