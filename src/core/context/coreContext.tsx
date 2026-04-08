import {JSX, createContext, useContext} from "solid-js";
import {CoreContext} from "@src/core/type";
import {Schema} from "@src/storage/type";
import {
    WebBlobDriver,
    WebStashDriver,
    WebArchiveDriver,
    WebImageDriver,
} from "@src/core/driver";

type Props = {
    data?: Schema;
    children: JSX.Element | JSX.Element[];
};

export const coreContext = createContext<CoreContext | undefined>();

export function CoreProvider(props: Props): JSX.Element {
    const browser = new WebStashDriver();
    const linker = new WebBlobDriver();

    const archiver = new WebArchiveDriver();
    const imager = new WebImageDriver();

    const value = {archiver, browser, linker, imager};

    return (
        <coreContext.Provider value={value}>
            {props.children}
        </coreContext.Provider>
    );
}

export function useCoreContext(): CoreContext {
    const context = useContext(coreContext);
    if (!context) {
        throw new Error("There is no shared context");
    }
    return context;
}