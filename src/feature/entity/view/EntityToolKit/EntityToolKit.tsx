import MoveIconSvg from "@res/svg/move.svg";

import {Button, Toolbar} from "@shared/view";
import en from "./string/en.json";

import i18next from "i18next";
import {JSX, Signal} from "solid-js";

i18next.addResourceBundle("en", "entity", {EntityToolKit: en}, true, true);

type Props = {entityId?: Signal<number | null>};

export function EntityToolKit(props: Props): JSX.Element {
    return (
        <Toolbar>
            <Button icon={MoveIconSvg}/>
        </Toolbar>
    );
}