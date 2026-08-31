<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/shared/view/context";
import {Scope, Button, Field} from "@src/editor/view/component";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import {useStorageContext} from "@src/storage/view/context";
import {computed} from "vue";
import {ProjectInitAction} from "@src/storage/action/project";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {ActivitySetAction} from "@src/editor/action";
import {isProjectInitActivity} from "@src/editor/type/activity";

const {repo: storage} = useStorageContext();
const {session, engine} = useEditorContext();
const viewer = useViewerContext();

const activity = computed(() => {
	if (!isProjectInitActivity(session.activity)) throw new Error();
	return session.activity;
});

async function projectCreate(event: MouseEvent): Promise<void> {
	event.preventDefault();

	await engine.exec(
		new ProjectInitAction(
			storage,
			{
				name: activity.value.payload.name,
				width: activity.value.payload.width,
				height: activity.value.payload.height,
			}
		)
	);

	await engine.exec(new SceneUpdateAction(viewer));

	await engine.exec(
		new ActivitySetAction(
			session,
			{
				target: ActivityTarget.System,
				action: ActivityAction.Setup,
			}
		)
	);
}

const strings = {
	"nameField": "name",
	"backgroundField": "background",
	"create": "create",
	"cancel": "cancel",
	"width": "width",
	"height": "height",
};

</script>

<template>
<Scope name="ProjectInitUtility">
	<Widget
		title="Init"
	>
		<Field>
			<label for="name">name</label>
			<input
				id="name"
				v-model="activity.payload.name"
				type="string"
			>
		</Field>
		<Field>
			<label for="width">width</label>
			<input
				id="width"
				v-model="activity.payload.width"
				type="number"
			>
		</Field>
		<Field>
			<label for="height">height</label>
			<input
				id="height"
				v-model="activity.payload.height"
				type="number"
			>
		</Field>
		<Button
			label="Create"
			@click="projectCreate"
		/>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.ProjectInitUtility {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>