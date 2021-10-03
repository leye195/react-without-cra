import path from "path";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}
const isDevelopment = process.env.NODE_ENV !== "production";

const config: Configuration = {
  name: "react-without-cra",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@components": path.resolve(__dirname, "components"),
      "@pages": path.resolve(__dirname, "pages"),
      "@hooks": path.resolve(__dirname, "hooks"),
    },
  },
  entry: {
    app: "./src/index",
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["IE 10"] },
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          env: {
            development: {
              plugins: [["@emotion/babel-plugin", { sourceMap: true }, require.resolve("react-refresh/babel")]],
            },
            production: {
              plugins: ["@emotion/babel-plugin"],
            },
          },
        },
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? "development" : "production" }),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
    publicPath: "/dist/",
  },
  devServer: {
    historyApiFallback: true,
    port: 3030,
    devMiddleware: { publicPath: "/dist/" },
    static: { directory: path.resolve(__dirname) },
    proxy: {
      "/api/": {
        target: "http://localhost:3030",
        changeOrigin: true,
        ws: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        useURLPolyfill: true,
      },
    }),
  );
}

if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
}

export default config;
