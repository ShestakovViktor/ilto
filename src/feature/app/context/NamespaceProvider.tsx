import {JSX} from "solid-js";
import {NamespaceContext, useNamespaceContext} from "@feature/app/context";

type Props = {
    namespace: string;
    children: JSX.Element | JSX.Element[];
};

export function NamespaceContextProvider(props: Props): JSX.Element {
    const namespaceContext = useNamespaceContext();
    const delimeter = ".";

    const value = {
        namespace: namespaceContext.namespace + delimeter + props.namespace,
    };

    return (
        <NamespaceContext.Provider value={value}>
            {props.children}
        </NamespaceContext.Provider>
    );
}