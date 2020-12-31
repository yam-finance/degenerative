module.exports = {
  transpileDependencies: ["vue-echarts", "resize-detector"],
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/style/colors.scss";
        `,
      },
    },
  },
};
