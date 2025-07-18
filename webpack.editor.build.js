import path from "path";
import url from "url";
import {merge} from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";

import common from "./webpack.config.js";

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const outputPath = path.resolve(dirname, './build');

export default merge(common, {
    mode: "development",
    entry: {
        editor: "./src/editor.tsx",
    },
    output: {
        filename: "[name].js",
        path: outputPath,
        publicPath: "./",
        clean: {
            keep: "test",
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./res/html/editor.html",
            minify: false,
        }),
    ],
});