import {JSX, createContext, useContext} from "solid-js";
import {SharedContext} from "@src/shared/type";
import {Schema} from "@src/shared/type";
import {Database} from "@src/shared/controller";
import {
    WebBlobDriver,
    WebStashDriver,
    WebArchiveDriver,
    WebImageDriver,
} from "@src/shared/driver";

type Props = {
    data?: Schema;
    children: JSX.Element | JSX.Element[];
};

export const sharedContext = createContext<SharedContext | undefined>();

export function SharedProvider(props: Props): JSX.Element {
    const database = new Database(props.data);
    const browser = new WebStashDriver();
    const linker = new WebBlobDriver();

    const archiver = new WebArchiveDriver();
    const imager = new WebImageDriver();

    const value = {archiver, browser, linker, imager, database};

    return (
        <sharedContext.Provider value={value}>
            {props.children}
        </sharedContext.Provider>
    );
}

export function useSharedContext(): SharedContext {
    const context = useContext(sharedContext);
    if (!context) {
        throw new Error("There is no shared context");
    }
    return context;
}