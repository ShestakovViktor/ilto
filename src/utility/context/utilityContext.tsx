import {JSX, createContext, useContext} from "solid-js";
import {UtilityContext} from "@src/utility/type";
import {Schema} from "@src/storage/type";
import {
    WebBlobDriver,
    WebStashDriver,
    WebArchiveDriver,
    WebImageDriver,
} from "@src/utility/driver";

type Props = {
    data?: Schema;
    children: JSX.Element | JSX.Element[];
};

export const utilityContext = createContext<UtilityContext | undefined>();

export function UtilityProvider(props: Props): JSX.Element {
    const browser = new WebStashDriver();
    const linker = new WebBlobDriver();

    const archiver = new WebArchiveDriver();
    const imager = new WebImageDriver();

    const value = {archiver, browser, linker, imager};

    return (
        <utilityContext.Provider value={value}>
            {props.children}
        </utilityContext.Provider>
    );
}

export function useUtilityContext(): UtilityContext {
    const context = useContext(utilityContext);
    if (!context) {
        throw new Error("There is no shared context");
    }
    return context;
}