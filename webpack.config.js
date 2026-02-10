import path from "path";
import url from "url";
import {merge} from "webpack-merge";
import {
    WebpackHtmlPlugin,
    WebpackTscPlugin,
    WebpackCopyPlugin,
} from "./webpack.plugin.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
    const conditional = env.WEBPACK_BUILD
        ? {
            mode: "production",
            externals: {
                "jszip": "JSZip",
            },
            output: {
                filename: "[name].js",
                path: path.resolve(__dirname, "./build"),
                publicPath: "./",
                clean: true,
            },
            plugins: [
                new WebpackCopyPlugin(
                    path.resolve(__dirname, "./public/demo.ilto"),
                    path.resolve(__dirname, "./build/demo.ilto")
                ),
            ],
        }
        : {
            mode: "development",
            devtool: "inline-source-map",
            devServer: {
                port: 3000,
                hot: true,
                compress: true,
                static: ["./public"],
            },
            plugins: [
                new WebpackTscPlugin(),
            ],
            output: {
                filename: "[name]_[fullhash:5].js",
            },
        };

    return merge(conditional, {
        entry: {
            editor: "./src/editor.tsx",
            viewer: "./src/viewer.tsx",
        },
        plugins: [
            new WebpackHtmlPlugin(),
        ],
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader",
                },
                {
                    test: /\.html$/,
                    loader: "html-loader",
                    options: {
                        minimize: false,
                    },
                },
                {
                    test: /\.svg$/,
                    loader: "svg-inline-loader",
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    auto: /\.module\.scss$/,
                                    mode: "local",
                                    localIdentName: "[local]_[hash:base64:2]",
                                    exportLocalsConvention: "camel-case",
                                },
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    loadPaths: [
                                        path.join(__dirname, "./res/style"),
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        stats: {
            errorDetails: true,
        },
    });
};
