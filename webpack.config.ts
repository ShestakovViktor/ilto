import path from "path";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";

export default {
    stats: {
        errorDetails: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        "loader": "babel-loader",
                        "options": {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        "targets": ">0.25%",
                                        "modules": "commonjs",
                                    },
                                ],
                                "solid",
                            ],
                        },
                    },
                    {
                        loader: "ts-loader",
                    },

                ],
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
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                auto: /\.module\.scss$/,
                                mode: "local",
                                localIdentName: "[local]_[hash:base64:6]",
                                exportLocalsConvention: "camelCase",
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            api: "modern",
                            sassOptions: {
                                loadPaths: [
                                    path.join(__dirname, "res/style"),
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsWebpackPlugin()],
    },
};
