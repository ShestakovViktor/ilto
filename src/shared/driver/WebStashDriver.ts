export class WebStashDriver {
    downloadFile(
        file: Blob,
        name: string
    ): void {
        const fileUrl = URL.createObjectURL(file);

        const tempLink = document.createElement("a");
        tempLink.download = name;
        tempLink.href = fileUrl;
        tempLink.click();
        tempLink.remove();
    }

    uploadFile(
        props: {
            type: string;
            accept: string;
        } = {type: "", accept: ""}
    ): Promise<File> {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = props.type;
            input.accept = props.accept;
            input.click();
            input.addEventListener("change", (): void => {
                if (!input.files?.length) return;
                const file = input.files[0];

                resolve(file);
            });
        });
    }

    async getBlob(
        name: string
    ): Promise<Blob> {
        const root = await navigator.storage.getDirectory();
        const dataFileHandle = await root.getFileHandle(name);
        const blob = await dataFileHandle.getFile();
        return blob;
    }

    async putBlob(
        name: string,
        file: Blob
    ): Promise<void> {
        // const persistent = await navigator.storage.persist();
        // if (persistent) {
        //     console.log("Storage will not be cleared except by explicit user action");
        // }
        // else {
        //     console.log("Storage may be cleared by the UA under storage pressure.");
        // }

        const root = await navigator.storage.getDirectory();

        const dataFileHandle = await root.getFileHandle(name, {create: true});
        const dataFileWritableStream = await dataFileHandle.createWritable();
        await dataFileWritableStream.write(file);
        await dataFileWritableStream.close();
    }
}