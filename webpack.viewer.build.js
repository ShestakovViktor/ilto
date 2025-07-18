import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import webpack from "webpack";
import {merge} from "webpack-merge";
import common from "./webpack.config.js";

import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge<webpack.Configuration>(common, {
    mode: "production",
    entry: {
        viewer: "./src/viewer.tsx",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./build"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "viewer.html",
            template: "./res/html/viewer.ejs",
            templateParameters: {
                bundle: "<script defer src=\"viewer.js\"></script>",
                title: "Viewer",
                src: "./project/",
            },
            inject: false,
            minify: false,
        }),
    ],
});
