import {createContext, useContext} from "solid-js";
import {StartupContex} from "@feature/editor/type";

export const StartupContextObject = createContext<StartupContex | undefined>();

export function useStartupContext(): StartupContex {
    const context = useContext(StartupContextObject);

    if (!context) {
        throw new Error("There is no startup context");
    }

    return context;
}

