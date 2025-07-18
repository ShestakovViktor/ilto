import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    stats: {
        errorDetails: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
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

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
