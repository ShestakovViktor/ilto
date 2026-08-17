<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/view/context";
import {Scope, Button, Field} from "@src/editor/view/component";
import {ActivityKind} from "@src/editor/enum";
import {useCoreContext} from "@src/core/view/context";
import {computed} from "vue";
import {ProjectInitAction} from "@src/core/action/project";
import {SceneUpdateAction} from "@src/viewer/action";
import {ActivitySetAction} from "@src/editor/action";

const {storage} = useCoreContext();
const {session, engine} = useEditorContext();
const {loop, scene, canvas} = useViewerContext();

const activity = computed(() => {
	if (session.activity.kind !== ActivityKind.ProjectInit) throw new Error();
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

	await engine.exec(
		new SceneUpdateAction(scene, loop, canvas)
	);

	await engine.exec(
		new ActivitySetAction(session, {activity: {kind: ActivityKind.System}})
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