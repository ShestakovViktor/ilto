<script setup lang="ts">
import {initProject} from "@src/editor/service";
import {Widget} from "@src/editor/view/utility-bar";
import {useEditorContext} from "@src/editor/context";
import {useViewerContext} from "@src/viewer/context";
import {Scope} from "@src/editor/view";
import {Field} from "@src/core/view";
import {ActivityKind} from "@src/editor/enum";
import {Button} from "@src/core/view";

const {storage, session} = useEditorContext();
const {viewport, loop: engine} = useViewerContext();

const {activity} = session.value;

if (activity.kind !== ActivityKind.ProjectInit) throw new Error();

function projectCreate(event: MouseEvent): void {
	event.preventDefault();
	if (activity.kind !== ActivityKind.ProjectInit) throw new Error();

	initProject(storage, {
		name: activity.payload.name,
		width: activity.payload.width,
		height: activity.payload.height,
	});

	viewport.setCanvas({
		x: 0,
		y: 0,
		w: storage.config.width,
		h: storage.config.height,
	});

	engine.requestUpdate();

	session.value.activity = {kind: ActivityKind.System};
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
	<Widget title="Init">
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
		<Button @click="projectCreate">
			Create
		</Button>
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