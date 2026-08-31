<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {InputKind} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/view/context";
import {Scope, Button} from "@src/editor/view/component";
import {IconName} from "@src/core/enum";
import {InputSetAction} from "@src/editor/action";

const {session, engine} = useEditorContext();
const buttons = [
	{
		input: InputKind.ImageCreate,
		icon: IconName.Image,
		label: "image",
	},
	{
		input: InputKind.MarkerCreate,
		icon: IconName.Marker,
		label: "marker",
	},
];

function checkInput(input: InputKind): boolean {
	return session.inputKind == input;
}

async function setInput(input: InputKind): Promise<void> {
	await engine.exec(new InputSetAction(session, {input}));
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
				v-for="(button, index) in buttons"
				:key="index"
				:pressed="checkInput(button.input)"
				:icon="button.icon"
				:label="button.label"
				@click="setInput(button.input)"
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