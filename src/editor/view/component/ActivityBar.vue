<script setup lang="ts">
import {ActivityAction, ActivityTarget} from "@src/editor/enum";

import {useEditorContext} from "@src/editor/view/context";
import {IconName} from "@src/shared/enum";
import {Scope, Button} from "@src/editor/view/component";
import type {Activities} from "@src/editor/type/activity";
import {ActivitySetAction} from "@src/editor/action";

type Data = {
	icon: IconName;
	activity: Activities;
	nested: {target: ActivityTarget; action: ActivityAction}[];
};

const {session, engine} = useEditorContext();

const datas: Data[] = [
	{
		icon: IconName.File,
		activity: {
			target: ActivityTarget.System,
			action: ActivityAction.Setup,
		},
		nested: [],
	},
	{
		icon: IconName.Tree,
		activity: {
			target: ActivityTarget.Project,
			action: ActivityAction.Explore,
		},
		nested: [],
	},
	{
		icon: IconName.Edit,
		activity: {
			target: ActivityTarget.Entity,
			action: ActivityAction.Create,
		},
		nested: [
			{
				target: ActivityTarget.Image,
				action: ActivityAction.Create,
			},
			{
				target: ActivityTarget.Marker,
				action: ActivityAction.Create,
			},
		],
	},
];

async function handleClick(data: Data): Promise<void> {
	session.history = [];

	await engine.apply(
		new ActivitySetAction(session, {activity: data.activity})
	);
}

function isPressed(data: Data): boolean {
	return session.activity.target == data.activity.target
		&& session.activity.action == data.activity.action
		|| data.nested.some(activity => {
			return activity.target == session.activity.target
				&& activity.action == session.activity.action;
		});
}

</script>

<template>
<Scope name="ActivityBar">
	<div class="ActivityBar">
		<Button
			v-for="data in datas"
			:key="data.activity.action + data.activity.action"
			:pressed="isPressed(data)"
			:icon="data.icon"
			@click="handleClick(data)"
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