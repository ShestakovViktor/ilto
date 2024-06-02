import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import {Configuration} from "webpack";
import {merge} from "webpack-merge";
import common from "./webpack.config";

export default merge<Configuration>(common, {
    mode: "production",
    entry: {
        editor: "./src/editor.tsx",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./build"),
        publicPath: "./",
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/template.html",
            minify: false,
        }),
        new CopyWebpackPlugin({
            patterns: [{from: "./public/", to: "./"}],
        }),
    ],
});