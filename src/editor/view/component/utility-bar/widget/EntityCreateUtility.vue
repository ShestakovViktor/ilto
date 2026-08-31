<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/view/context";
import {Scope, Button} from "@src/editor/view/component";
import {IconName} from "@src/shared/enum";
import {ActivitySetAction} from "@src/editor/action";
import type {Activities} from "@src/editor/type/activity";
import {DraftSetAction} from "@src/editor/action/draft";
import type {Drafts} from "@src/editor/type/draft";

type Data = {
	label: string;
	icon: IconName;
	activity: Activities;
	draft: Drafts;
};

const {session, engine} = useEditorContext();
const buttons: Data[] = [
	{
		label: "image",
		icon: IconName.Image,
		activity: {
			target: ActivityTarget.Image,
			action: ActivityAction.Create,
		},
		draft: {
			target: ActivityTarget.Image,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			rotation: 0,
			pivotX: 0,
			pivotY: 0,
			file: undefined,
			parentId: 1,
		},
	},
	{
		label: "marker",
		icon: IconName.Marker,
		activity: {
			target: ActivityTarget.Marker,
			action: ActivityAction.Create,
		},
		draft: {
			target: ActivityTarget.Marker,
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			rotation: 0,
			pivotX: 0,
			pivotY: 0,
			parentId: 1,
		},
	},
];

function checkInput(data: Data): boolean {
	return session.activity.target == data.activity.target
		&& session.activity.action == data.activity.action;
}

async function setActivity(data: Data): Promise<void> {
	await engine.apply(
		new DraftSetAction(session, data.draft)
	);
	await engine.apply(
		new ActivitySetAction(session, {activity: data.activity})
	);
}

</script>

<template>
<Scope name="CreateUtility">
	<Widget
		title="Create entity"
		class="Widget"
	>
		<div class="Panel">
			<Button
				v-for="(data, index) in buttons"
				:key="index"
				:pressed="checkInput(data)"
				:icon="data.icon"
				:label="data.label"
				@click="setActivity(data)"
			/>
		</div>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.Panel {
    display: flex;
    flex-direction: column;
	justify-content: left;
	gap: 8px;
	width: fit-content;
}
</style>