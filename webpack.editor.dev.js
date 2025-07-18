import HtmlWebpackPlugin from "html-webpack-plugin";
import {merge} from "webpack-merge";
import common from "./webpack.config.js";

export default merge(common, {
    mode: "development",
    entry: {
        editor: "./src/editor.tsx",
    },
    output: {
        filename: "[name].[fullhash].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./res/html/editor.html",
            minify: false,
        }),
    ],
    devtool: "inline-source-map",
    devServer: {
        port: 3000,
        hot: true,
        compress: true,
        static: ["./build"],
    },
});