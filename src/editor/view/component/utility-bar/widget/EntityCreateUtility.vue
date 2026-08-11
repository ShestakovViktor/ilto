<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {InputMode} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/view/context";
import {Scope, Button, Icon} from "@src/editor/view/component";
import {IconName} from "@src/core/enum";

const {session} = useEditorContext();
const buttons = [
	{
		input: InputMode.ImageCreate,
		icon: IconName.Image,
		label: "image",
	},
	{
		input: InputMode.MarkerCreate,
		icon: IconName.Marker,
		label: "marker",
	},
	// {input: InputMode.DecorCreate, icon: IconName.Decor},
	// {input: InputMode.AreaCreate, icon: IconName.Polygon},
];

function handleSelect(): void {

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
				:pressed="session.inputMode == button.input"
				:icon="button.icon"
				:label="button.label"
				@click="() => session.inputMode = button.input"
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