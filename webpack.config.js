const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    uniqueName: "remoteLogin",
    publicPath: "http://localhost:4200/"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteLogin",
      filename: "remoteEntry.js",
      exposes: {
        './webcomponent': './src/bootstrap.ts',
      },
      shared: {
        "@angular/core": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/common": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/common/http": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/router": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/forms": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/platform-browser": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "@angular/elements": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        },
        "rxjs": {
          singleton: true,
          strictVersion: false,
          requiredVersion: false
        }
      }
    }),
  ],
};
