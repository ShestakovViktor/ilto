import {Database} from "@src/shared/controller";
import {ArchiveDriver, ImageDriver} from "@src/shared/interface";
import {WebBlobDriver, WebStashDriver} from "@src/shared/driver";

export type SharedContext = {
    archiver: ArchiveDriver;
    browser: WebStashDriver;
    linker: WebBlobDriver;
    imager: ImageDriver;
    database: Database;
};