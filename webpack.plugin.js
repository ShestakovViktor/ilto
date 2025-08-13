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
        compiler.hooks.compilation.tap(
            "webpack-html-plugin",
            (compilation) => this.onCompilation(compilation)
        );
    }

    async onCompilation(compilation) {
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
        let editorHtml;

        for (const fileName in compilation.assets) {
            if (this.isEditorBundle(fileName)) {
                const inject = `<script defer module src="${fileName}"></script>`;
                editorHtml = template.replace("<!-- inject -->", inject);
            }
        }

        compilation.emitAsset(
            "index.html",
            new webpack.sources.RawSource(editorHtml)
        );

        callback();
    }

    isEditorBundle(fileName) {
        return fileName.includes("editor_") && fileName.endsWith(".js");
    }

    isViewerBundle(fileName) {
        return fileName.includes("viewer_") && fileName.endsWith(".js");
    }

    async getTemplate() {
        return await fs.readFile("./res/html/template.html", "utf8");
    }
}