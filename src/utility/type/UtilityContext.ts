import {ArchiveDriver, ImageDriver} from "@src/utility/interface";
import {WebBlobDriver, WebStashDriver} from "@src/utility/driver";

export type UtilityContext = {
    archiver: ArchiveDriver;
    browser: WebStashDriver;
    linker: WebBlobDriver;
    imager: ImageDriver;
};