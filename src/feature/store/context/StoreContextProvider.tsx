import {JSX} from "solid-js";
import {StoreContextObject} from ".";
import {Data} from "@type";
import {Store} from "@feature/store";

type Props = {
    data: Data;
    children: JSX.Element | JSX.Element[];
};

export function StoreContextProvider(props: Props): JSX.Element {
    const store = new Store(props.data);

    const value = {store};

    return (
        <StoreContextObject.Provider value={value}>
            {props.children}
        </StoreContextObject.Provider>
    );
}