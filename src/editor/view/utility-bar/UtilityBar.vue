<script setup lang="ts">
import {type Component, computed} from "vue";
import {useEditorContext, useScopeContext} from "@src/editor/context";
import {ActivityKind} from "@src/editor/enum";
import {Button, Icon} from "@src/core/view";
import {IconName} from "@src/core/enum";
import {
	EntityCreateUtility,
	EntityUtility,
	ProjectExploreUtility,
	ImageCreateUtility,
	ProjectInitUtility,
	LayerUtility,
	SystemUtility,
	MarkerCreateUtility,
} from "@src/editor/view/utility-bar/widget";

const {session} = useEditorContext();

const activities: Record<ActivityKind, Component[]> = {
	[ActivityKind.System]: [SystemUtility],
	[ActivityKind.ProjectInit]: [ProjectInitUtility],
	[ActivityKind.ProjectExplore]: [ProjectExploreUtility],
	[ActivityKind.EntityCreate]: [
		EntityCreateUtility,
		LayerUtility,
		EntityUtility,
	],
	[ActivityKind.ImageCreate]: [ImageCreateUtility],
	[ActivityKind.MarkerCreate]: [MarkerCreateUtility],
};

const kit = computed(() => activities[session.value.activity.kind]);

useScopeContext("UtilityBar");

function goBack(): void {
	if (session.value.history.length < 2) return;
	const previousActivity = session.value.history.splice(-2)[0];
	session.value.activity = previousActivity;
}

</script>

<template>
<div class="UtilityBar">
	<template v-if="kit.length">
		<div class="Head">
			<label>{{ session.activity.kind }} </label>
			<Button
				class="Button"
				@click="goBack()"
			>
				<Icon
					class="Icon"
					:name="IconName.Back"
				/>
			</Button>
		</div>
		<component
			:is="utility"
			v-for="(utility, index) in kit"
			:key="index"
		/>
	</template>
</div>
</template>

<style lang="scss" scoped>
.UtilityBar {
    padding: 8px;
    gap: 8px;
    overflow: scroll;

    background-color: var(--gray-94);

	.Head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;

		.Button {
			width: 42px;
			height: 42px;
			border: 1px solid var(--gray-60);
			border-radius: .5em;
			.Icon {
				width: 24px;
				height: 24px;
				color: lightgray;
			}
		}
	}
}
</style>