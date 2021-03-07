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

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
};
