import numeral from "numeral";

export default {
  // data() { },
  // created: () => { },
  methods: {
    sendit: () => {
      console.log("sendit");
    },
    numeral: (format = "0.00a", ...texts) => {
      return numeral(...texts).format(format);
    },
    inputNumeric: e => {
      const char = String.fromCharCode(e.keyCode);
      if (/^[0-9]+$/.test(char)) return true;
      else e.preventDefault();
    },
  },
};
