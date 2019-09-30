const path = require("path");
const glob = require("glob");
const TerserPlugin = require("terser-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const config = {
  performance: { hints: false },
  //mode: "production",
  mode: "development",
  entry: [path.resolve(__dirname, "src/index.tsx")],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader"
      },
      {
        test: /\.(js|jsx)$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loaders: "url-loader"
      }
    ]
  },
  resolve: {
    symlinks: false,
    extensions: [".ts", ".js", ".tsx", ".scss", "css", ".svg", ".gif"],
    modules: ["node_modules"],
    alias: {
      "styled-components": path.resolve("node_modules", "styled-components"),
      "react": path.resolve("node_modules", "react")
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ],

    providedExports: true,
    usedExports: true,
    concatenateModules: true
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "index.html"
    })
  ],
  devServer: {
    open: true,
    //openPage:"dist",
    inline: true,
    contentBase: path.join(__dirname, "."),
    host: "localhost"
  }
};
//if (config.mode === "development") {
config.devtool = "source-map";
//}
module.exports = config;
