import {ArchiveDriver} from "@interface";
import {Data} from "@type";
import {Signal} from "solid-js";

export type StartupContex = {
    dataSignal: Signal<Data | undefined>;
    pageSignal: Signal<"start" | "create">;
    archiveDriver: ArchiveDriver;
};