import numeral from "numeral";

export default {
  // data() { },
  // created: () => { },
  methods: {
    sendit: () => {
      console.log("sendit");
    },
    numeral: (format = "0.00a", value) => {
      if (typeof value === "number") {
        return numeral(value).format(format);
      } else {
        return "0";
      }
    },
    titleCase: str => {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    inputNumeric: e => {
      const char = String.fromCharCode(e.keyCode);
      if (/^[0-9]+$/.test(char)) return true;
      else e.preventDefault();
    },
  },
};
