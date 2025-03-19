import {createContext, useContext} from "solid-js";
import {StoreContext} from "@feature/store/type";

export const StoreContextObject = createContext<StoreContext | undefined>();

export function useStoreContext(): StoreContext {
    const context = useContext(StoreContextObject);
    if (!context) {
        throw new Error("There is no store context");
    }
    return context;
}
