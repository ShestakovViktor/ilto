<script setup lang="ts">
import {type Component, computed, toRaw} from "vue";
import {useEditorContext, useScopeContext} from "@src/editor/context";
import {ActivityMode} from "@src/editor/enum";
import {
	CreateUtility,
	EntityUtility,
	ExploreUtility,
	InitUtility,
	LayerUtility,
	SystemUtility,
} from "@src/editor/view/utility";
import {Button, Icon} from "@src/core/view";
import {IconName} from "@src/core/enum";

type Utility = {
	component: Component;
};

const {session} = useEditorContext();

const activityMode: Record<ActivityMode, Utility[]> = {
	[ActivityMode.System]: [
		{component: SystemUtility},
	],
	[ActivityMode.Init]: [
		{component: InitUtility}],
	[ActivityMode.Explore]: [
		{component: ExploreUtility},
	],
	[ActivityMode.Create]: [
		{component: CreateUtility},
		{component: LayerUtility},
		{component: EntityUtility},
	],
};

const kit = computed(() => activityMode[session.value.activityMode]);

useScopeContext("UtilityBar");

function goBack(): void {
	if (session.value.activityHistory.length < 2) return;
	const previousMode = session.value.activityHistory.splice(-2)[0];
	session.value.activityMode = previousMode;
}

</script>

<template>
<div class="UtilityBar">
	<template v-if="kit.length">
		<div class="Head">
			<label>{{ session.activityMode }} </label>
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
			:is="utility.component"
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
			border: 1px solid lightgray;
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