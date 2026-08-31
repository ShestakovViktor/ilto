<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext} from "@src/editor/view/context";
import {Scope, Button} from "@src/editor/view/component";
import {IconName} from "@src/shared/enum";
import {ImageCreatePrepareScript} from "@src/editor/script/image";
import {useViewerContext} from "@src/viewer/shared/view/context";
import {useStorageContext} from "@src/storage/view/context";
import {type Activities, isImageCreateActivity} from "@src/editor/type/activity";

type ToolbarItem = {
	label: string;
	icon: IconName;
	test: (activity: Activities) => boolean;
	execute: () => Promise<void>;
};

const storage = useStorageContext();
const viewer = useViewerContext();
const editor = useEditorContext();
const {session, engine} = editor;

const toolbarItems: ToolbarItem[] = [
	{
		label: "image",
		icon: IconName.Image,
		test: isImageCreateActivity,
		execute: async() => {
			await engine.exec(
				new ImageCreatePrepareScript(storage, viewer, editor)
			);
		},
	},
];

function isActive(item: ToolbarItem): boolean {
	return item.test(session.activity);
}

async function handleItemClick(item: ToolbarItem): Promise<void> {
	await item.execute();
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
				v-for="(item, index) in toolbarItems"
				:key="index"
				:pressed="isActive(item)"
				:icon="item.icon"
				:label="item.label"
				@click="handleItemClick(item)"
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