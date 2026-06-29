<script setup lang="ts">
import {ActivityKind} from "@src/editor/enum";
import Button from "@src/core/view/Button.vue";

import {useEditorContext} from "@src/editor/context";
import {Icon} from "@src/core/view";
import {IconName} from "@src/core/enum";
import {Scope} from "@src/editor/view";
import {
	type Activity,
	EntityCreateActivity,
	SystemActivity,
	ProjectExploreActivity,
} from "@src/editor/type/activity";

import type {Activities} from "@src/editor/type/activity";

const {session} = useEditorContext();

const buttons: {icon: IconName; activity: Activities}[] = [
	{
		icon: IconName.File,
		activity: {kind: ActivityKind.System},
	},
	{
		icon: IconName.Tree,
		activity: {kind: ActivityKind.ProjectExplore},

	},
	{
		icon: IconName.Edit,
		activity: {kind: ActivityKind.EntityCreate},
	},
];

function handleClick(activity: Activities): void {
	session.value.history = [];
	session.value.activity = activity;
}

</script>

<template>
<Scope name="ActivityBar">
	<div class="ActivityBar">
		<Button
			v-for="button in buttons"
			:key="button.activity.kind"
			:pressed="session.activity.kind === button.activity.kind"
			:icon="button.icon"
			@click="handleClick(button.activity)"
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