const path = require("path");
var webpack = require("webpack");

const NODE_ENV = "development";
const VueLoaderPlugin = require("vue-loader/lib/plugin");
module.exports = {
  mode: "development",
  // This is the "main" file which should include all other modules
  entry: {
    main: "./src/main.js",
    contents: "./src/contents.js"
  },
  // Where should the compiled file go?
  output: {
    // To the `dist` folder, path Variable sagt in welchem Ordner die Datein hingespeichert werden, und in der globalen Variable
    //, die in jedem node Programm verfügbar ist __dirname, steht immer der Pfad drinnen, wo die aktuelle Datei drinnsteht, webpack.config.js
    path: path.resolve(__dirname, "dist"),
    // With the filename `build.js` so it's dist/build.js
    filename: "[name].js"
  },

  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ],
  /*plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],*/
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          //presets: ['es2015']
          presets: ["@babel/preset-env"]
        }
      },
      /*{
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },*/
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "stylus-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        //test: /\.css$/,
        //use: ['style-loader', 'css-loader']
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },

  watch: true,
  resolve: {
    extensions: ["*", ".js", ".vue", ".json", ".mjs"],
    modules: [path.join(__dirname, "src"), "node_modules"],
    alias: {
      vue: "vue/dist/vue.common.js",
      src: path.resolve(__dirname, "../src"),
      assets: path.resolve(__dirname, "../src/assets"),
      components: path.resolve(__dirname, "../src/components")
    }
  }
};
