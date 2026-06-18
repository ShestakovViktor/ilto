<script setup lang="ts">
import {initProject} from "@src/editor/service";
import {Widget, Field} from "@src/editor/view/UtilityBar";
import {useEditorContext} from "@src/editor/context";
import {useViewerContext} from "@src/viewer/context";
import {Scope} from "@src/editor/view";
import {ActivityMode} from "@src/editor/enum";

const {storage, session} = useEditorContext();
const {viewport, loop: engine} = useViewerContext();

function projectCreate(event: SubmitEvent): void {
	event.preventDefault();

	const form = event.target as HTMLFormElement;
	const formData = new FormData(form);
	form.reset();

	const name = String(formData.get("name"));
	const width = Number(formData.get("width"));
	const height = Number(formData.get("height"));

	initProject(storage, {name, width, height});

	viewport.setCanvas({
		x: 0,
		y: 0,
		w: storage.config.width,
		h: storage.config.height,
	});

	engine.requestUpdate();

	session.value.activityMode = ActivityMode.System;
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
<Scope name="InitTool">
	<Widget title="Init">
		<form
			class="InitTool"
			@submit="projectCreate"
		>
			<Field
				:label="strings.nameField"
				name="name"
				type="text"
				required
			/>
			<Field
				:label="strings.width"
				name="width"
				type="number"
				required
			/>
			<Field
				:label="strings.height"
				name="height"
				type="number"
				required
			/>
			<input
				type="submit"
				:value="strings.create"
			>
		</form>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.InitTool {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>