import fs from "fs/promises";
import webpack from "webpack";

import {exec} from "child_process";

export class WebpackTscPlugin {
    apply(compiler) {
        compiler.hooks.done.tap("webpack-tsc-plugin", () => {
            exec("tsc --noEmit", this.process);
        });
    }

    process(error, stdout) {
        if (!error) {
            // eslint-disable-next-line no-console
            console.error("<i> [webpack-tsc-plugin] Success");
        }
        else {
            // eslint-disable-next-line no-console
            console.error("<i> [webpack-tsc-plugin] Failure:\n" + stdout);
        }
    }
}

export class WebpackHtmlPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap(
            "webpack-html-plugin",
            (compilation) => this.onCompilation(compilation)
        );
    }

    onCompilation(compilation) {
        compilation.hooks.processAssets.tapAsync(
            {
                name: "webpack-html-plugin",
                stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            },
            (assets, callback) => this.onProcessAssets(
                compilation,
                assets,
                callback
            )
        );
    }

    async onProcessAssets(compilation, assets, callback) {
        const template = await this.getTemplate();

        for (const fileName in assets) {
            if (this.isEditorBundle(fileName)) {
                const data = {
                    output: "index.html",
                    title: "Editor",
                    bundle: `<script defer module src="${fileName}"></script>`,
                    content: "<div id=\"editor\" style=\"width:100%; height: 100%\"></div>",
                };

                const editorHtml = template
                    .replace("<!-- bundle -->", data.bundle)
                    .replace("<!-- title -->", data.title)
                    .replace("<!-- content -->", data.content);

                compilation.emitAsset(
                    data.output,
                    new webpack.sources.RawSource(editorHtml)
                );
            }
            else if (this.isViewerBundle(fileName)) {
                const data = {
                    output: "viewer.html",
                    title: "Viewer",
                    bundle: `<script defer module src="${fileName}"></script>`,
                    content: "<div id=\"viewer\" style=\"width:100%; height: 100%\" data-src=\"/project/\"></div>",
                };

                const editorHtml = template
                    .replace("<!-- bundle -->", data.bundle)
                    .replace("<!-- title -->", data.title)
                    .replace("<!-- content -->", data.content);

                compilation.emitAsset(
                    data.output,
                    new webpack.sources.RawSource(editorHtml)
                );
            }
        }

        callback();
    }

    isEditorBundle(fileName) {
        return fileName.match(/editor(_\w+)?\.js/gm);
    }

    isViewerBundle(fileName) {
        return fileName.match(/viewer(_\w+)?\.js/gm);
    }

    async getTemplate() {
        return await fs.readFile("./res/html/template.html", "utf8");
    }
}