<script setup lang="ts">
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/shared/view/context/index.ts";
import {computed} from "vue";
import Icon from "./Icon.vue";
import {IconName} from "@src/shared/enum";
import {vec2} from "@src/shared/math/vec2.ts";
import {mat3} from "@src/shared/math/mat3.ts";

const {session} = useEditorContext();
const {scene, view} = useViewerContext();

const parent = computed(() => {
	return "parentId" in session.draft
		? scene.getNodeById(session.draft.parentId)
		: undefined;
});

const parentTranslate = computed(() => {
	if (!parent.value) return undefined;

	const position = vec2.init(0, 0);
	mat3.multiplyVec2(position, parent.value.worlMatrix, position);

	return `translate(${position[0] * view.s}px, ${position[1] * view.s}px)`;
});

const draftTranslate = computed(() => {
	if (!("x" in session.draft) || !parent.value) return undefined;

	const position = vec2.init(session.draft.x, session.draft.y);
	mat3.multiplyVec2(position, parent.value.worlMatrix, position);

	return `translate(${position[0] * view.s}px, ${position[1] * view.s}px)`;
});

</script>

<template>
<div class="ScaffoldLayer">
	<div
		v-if="parentTranslate"
		class="ParentPivot"
		:style="{ transform: parentTranslate }"
	>
		<Icon
			class=""
			:name="IconName.Pivot"
		/>
	</div>

	<div
		v-if="draftTranslate"
		class="DraftPivot"
		:style="{ transform: draftTranslate }"
	>
		<Icon
			class=""
			:name="IconName.Pivot"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.ScaffoldLayer {
    position: absolute;
    width: 100%;
    height: 100%;
	left: 0;
	top: 0;

    pointer-events: none;

	.Icon {
		width: 48px;
		height: 48px;
	}

	.ParentPivot, .DraftPivot {
		position: absolute;
		left: 0;
		top: 0;
	}

	.ParentPivot {
		color: var(--dark-yellow);
	}

	.DraftPivot {
		color: var(--dark-red);
	}
}
</style>