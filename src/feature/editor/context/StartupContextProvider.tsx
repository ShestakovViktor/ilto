import {createSignal, JSX, Signal} from "solid-js";
import {StartupContextObject} from ".";
import {Data} from "@type";
import {WebArchiveDriver} from "../controller/driver";

type Props = {
    dataSignal: Signal<Data | undefined>;
    children: JSX.Element | JSX.Element[];
};

export function StartupContextProvider(props: Props): JSX.Element {
    const archiveDriver = new WebArchiveDriver();

    const pageSignal = createSignal<"start" | "create">("start");

    const value = {
        dataSignal: props.dataSignal,
        pageSignal,
        archiveDriver,
    };

    return (
        <StartupContextObject.Provider value={value}>
            {props.children}
        </StartupContextObject.Provider>
    );
}