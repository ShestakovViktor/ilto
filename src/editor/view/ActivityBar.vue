<script setup lang="ts">
import {ActivityMode} from "@src/editor/enum";
import Button from "@src/core/view/Button.vue";

import {useEditorContext} from "@src/editor/context";
import {Icon} from "@src/core/view";
import {IconName} from "@src/core/enum";
import Scope from "./Scope.vue";
import {toRaw} from "vue";

const {session} = useEditorContext();

const buttons = [
	{
		icon: IconName.File,
		activityMode: ActivityMode.System,
	},
	{
		icon: IconName.Tree,
		activityMode: ActivityMode.Explore,
	},
	{
		icon: IconName.Edit,
		activityMode: ActivityMode.Create,
	},
];

function handleClick(activityMode: ActivityMode): void {
	session.value.activityHistory = [];
	session.value.activityMode = activityMode;
}

</script>

<template>
<Scope name="ActivityBar">
	<div class="ActivityBar">
		<Button
			v-for="button in buttons"
			:key="button.activityMode"
			:pressed="session.activityMode === button.activityMode"
			:icon="button.icon"
			@click="handleClick(button.activityMode)"
		>
			<Icon :name="button.icon" />
		</Button>
	</div>
</Scope>
</template>

<style scoped lang="scss">
.ActivityBar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    padding: 8px;

    >.Button {
        width: 42px;
        height: 42px;

        background-color: var(--white);
        border: 1px solid var(--gray-60);
        border-radius: 8px;

        .Icon {
            width: 24px;
            height: 24px;

            path {
                stroke: var(--gray-60);
            }
        }

        &.Pressed {
            border: 1px solid var(--theme);

            svg path {
                stroke: var(--theme);
            }
        }

    }

}
</style>