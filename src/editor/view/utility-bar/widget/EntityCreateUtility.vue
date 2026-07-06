<script setup lang="ts">
import {Widget} from "@src/editor/view/utility-bar";
import {Button, Icon} from "@src/core/view";
import {InputMode} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/context";
import {Scope} from "@src/editor/view";
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
			>
				<Icon
					class="Icon"
					:name="button.icon"
				/>
				<label>
					{{ button.label }}
				</label>
			</Button>
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

	.Button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;

		.Icon {
			height: 42px;
			width: 42px;
			padding: 8px;

			border: 1px solid var(--gray-60);
			border-radius: 8px;
		}
	}
}
</style>