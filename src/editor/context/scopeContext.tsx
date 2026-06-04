import {JSX, createContext, useContext} from "solid-js";

type ScopeContext = {
    data: Record<string, unknown>;
    children: Record<string, ScopeContext>;
};

const data = localStorage.getItem("data");

const root: ScopeContext = data ? JSON.parse(data) : {
    data: {},
    children: {},
};

const scopeContext = createContext<ScopeContext>(root);

type Props = {
    value: string | ScopeContext;
    children: JSX.Element | JSX.Element[];
};

export function ScopeProvidor(props: Props): JSX.Element {
    const scope = useContext(scopeContext);

    let value: ScopeContext;

    if (typeof props.value == "string") {
        if (!(props.value in scope.children)) {
            scope.children[props.value] = {
                data: {},
                children: {},
            };
        }

        value = scope.children[props.value];
    }
    else {
        value = props.value;
    }

    return (
        <scopeContext.Provider value={value}>
            {props.children}
        </scopeContext.Provider>
    );
}

export function useScopeContext<T = Record<string, unknown>>(
    value?: string
): {
    scope: ScopeContext;
    data: () => Readonly<T>;
    setData: (data: Partial<T>) => void;
} {
    let scope = useContext(scopeContext);

    if (value && !(value in scope.children)) {
        scope.children[value] = {
            data: {},
            children: {},
        };
        scope = scope.children[value];
    }

    return {
        scope: scope as ScopeContext,

        data: (): Readonly<T> => {
            return scope.data as Readonly<T>;
        },

        setData: (data: Partial<T>) => {
            Object.assign(scope.data, data);
            localStorage.setItem("data", JSON.stringify(root));
        },
    };
}
