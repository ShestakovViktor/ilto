<script setup lang="ts">
import {type Component, computed} from "vue";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import {Button} from "@src/editor/view/component";
import {IconName} from "@src/shared/enum";
import {
	EntityCreateUtility,
	SceneExploreUtility,
	ImageCreateUtility,
	ProjectInitUtility,
	SystemUtility,
	MarkerCreateUtility,
} from "@src/editor/view/component/utility-bar/widget";
import type {ActivityMap} from "@src/editor/type";

const {session} = useEditorContext();

const utilities: ActivityMap<Component[]> = {
	[ActivityTarget.System]: {
		[ActivityAction.Setup]: [SystemUtility],
	},
	[ActivityTarget.Project]: {
		[ActivityAction.Init]: [ProjectInitUtility],
		[ActivityAction.Explore]: [SceneExploreUtility],
	},
	[ActivityTarget.Entity]: {
		[ActivityAction.Create]: [
			EntityCreateUtility,
			SceneExploreUtility,
		],
	},
	[ActivityTarget.Image]: {
		[ActivityAction.Create]: [
			EntityCreateUtility,
			SceneExploreUtility,
			ImageCreateUtility,
		],
	},
	[ActivityTarget.Marker]: {
		[ActivityAction.Create]: [MarkerCreateUtility],
	},
};

const kit = computed(() => {
	return utilities[session.activity.target]
		?.[session.activity.action] || [];
});

useScopeContext("UtilityBar");

function goBack(): void {
	if (session.history.length < 2) return;
	const previousActivity = session.history.splice(-2)[0];
	session.activity = previousActivity;
}

</script>

<template>
<div class="UtilityBar">
	<template v-if="kit.length">
		<div class="Head">
			<label>
				{{ session.activity.target }}
				{{ session.activity.action }} </label>
			<Button
				class="Button"
				:icon="IconName.Back"
				@click="goBack()"
			/>
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

	}
}
</style>