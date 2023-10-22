const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[name].css",
        })
      );

      const cssLoader = webpackConfig.module.rules.find(
        (rule) => rule.test && rule.test.toString() === "/\\.css$/"
      );
      if (cssLoader) {
        if (isDevelopment) {
          cssLoader.use.unshift("style-loader");
        } else {
          cssLoader.use.unshift(MiniCssExtractPlugin.loader);
        }
      }

      return {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          fallback: {
            url: require.resolve("url/"),
          },
        },
        entry: {
          main: [
            env === "development" &&
              require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs,
          ].filter(Boolean),
          content: "./src/extension/service-worker.ts",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
      };
    },
  },
};
