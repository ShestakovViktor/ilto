<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext} from "@src/editor/view/context";
import {Scope, Button} from "@src/editor/view/component";
import {IconName} from "@src/shared/enum";
import {ActivitySetAction} from "@src/editor/action";
import {computed} from "vue";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import type {Activities} from "@src/editor/type/activity";

type ButtonPayload = {
	label: string;
	icon: IconName;
	activity: Activities;
};

const {session, engine} = useEditorContext();
const buttons: ButtonPayload[] = [
	{
		label: "image",
		icon: IconName.Image,
		activity: {
			target: ActivityTarget.Image,
			action: ActivityAction.Create,
			payload: {
				parentId: 1,
				tiled: false,
				draft: {
					name: "",
					x: 0,
					y: 0,
					width: 0,
					height: 0,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
					pivotX: 0.5,
					pivotY: 0.5,
					file: undefined,
				},
			},
		},
	},
];

function checkInput(payload: ButtonPayload): boolean {
	return session.activity.target == payload.activity.target
		&& session.activity.action == payload.activity.action;
}

async function setActivity(data: ButtonPayload) {
	// await engine.exec(
	// 	new DraftSetAction(session, data.draft)
	// );
	await engine.exec(
		new ActivitySetAction(session, {activity: data.activity})
	);
}

</script>

<template>
<Scope name="EntityKindToolbarWidget">
	<Widget
		title="Entity kind toolbar"
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