<script setup lang="ts">
import {Widget, Button} from "@src/editor/view/UtilityBar";
import {InputMode} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/context";
import {Scope} from "@src/editor/view";
import {IconName} from "@src/core/enum";

const {session} = useEditorContext();
const buttons = [
	{input: InputMode.ImageCreate, icon: IconName.Image},
	{input: InputMode.MarkerCreate, icon: IconName.Marker},
	{input: InputMode.DecorCreate, icon: IconName.Decor},
	{input: InputMode.AreaCreate, icon: IconName.Polygon},
];

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
				@click="() => session.inputMode = button.input"
			/>
		</div>
	</Widget>
</Scope>
</template>

<style lang="scss" scoped>
.Panel {
    display: flex;
    flex-direction: row;
}
</style>