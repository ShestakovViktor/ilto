<script setup lang="ts">
import {ActivityKind} from "@src/editor/enum";

import {useEditorContext} from "@src/editor/view/context";
import {IconName} from "@src/core/enum";
import {Scope, IconButton} from "@src/editor/view/component";
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
		<IconButton
			v-for="button in buttons"
			:key="button.activity.kind"
			:pressed="session.activity.kind === button.activity.kind"
			:icon="button.icon"
			@click="handleClick(button.activity)"
		/>
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

}
</style>