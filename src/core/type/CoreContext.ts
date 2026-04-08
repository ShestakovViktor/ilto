import {ArchiveDriver, ImageDriver} from "@src/core/interface";
import {WebBlobDriver, WebStashDriver} from "@src/core/driver";

export type CoreContext = {
    archiver: ArchiveDriver;
    browser: WebStashDriver;
    linker: WebBlobDriver;
    imager: ImageDriver;
};