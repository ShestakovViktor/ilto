import {JSX} from "solid-js";

type Props = {
    children?: JSX.Element | JSX.Element[];
    class?: string;
};

export function Page(props: Props): JSX.Element {
    return (
        <div
            classList={{
                [props.class ?? ""]: Boolean(props.class),
            }}
        >
            {props.children}
        </div>
    );
}