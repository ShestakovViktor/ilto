<script setup lang="ts">

// import {MotionBrowser} from "@src/editor/view/component";
import type {Entity, Visual} from "@src/core/type";
// import {Prop, Motion} from "@src/core/type";
import {useViewerContext} from "@src/viewer/view/context";
import {useScopeContext, useEditorContext} from "@src/editor/view/context";
import {Section, Widget} from "@src/editor/view/component/utility-bar";
import {computed} from "vue";
// import {PropBrowser} from "@src/editor/view/component";

const {storage, session} = useEditorContext();

// const entity = computed(
// 	() => session.selected || {} as Entity
// );

// function isVisual(entity: Entity | Visual): entity is Visual {
// 	return "propId" in entity;
// }

// const propSrc = computed((): string | undefined => {
// 	if (!isVisual(entity.value)) return undefined;

// 	const propId = "propId" in entity.value ? entity.value.propId : undefined;

// 	if (!propId) return undefined;

// 	const prop = storage.data.asset.select(propId);

// 	if (!prop) return undefined;

// 	const src = path + prop.path;

// 	return src;
// });

// const selectedProp = createMemo(() => {
//     const propId = entityMemo().propId;
//     return propId ? [propId] : [];
// });

// const propBrowserDialog = new Modal();
// propBrowserDialog.render(
//     <PropBrowser
//         // selected={selectedProp()}
//         onSelect={(ids: number[]) => {
//             storage.entity
//                 .update<Entity & {propId: number}>(
//                     entityMemo().id,
//                     {propId: ids[0]}
//                 );
//             propBrowserDialog.hide();
//         }}
//     />
// );

// const motionClass = createMemo((): string | undefined => {
//     const motionId = entityMemo().motionId;

//     if (!motionId) return undefined;

//     const motion = storage.data.asset
//         .select<Motion>(motionId);

//     if (!motion) return undefined;

//     return motion.class;
// });

// const classList = createMemo(() => {
//     return {[motionClass() || ""]: Boolean(motionClass())};
// });

// const selectedMotion = createMemo(() => {
//     const {motionId} = entityMemo();
//     return motionId ? [motionId] : [];
// });

// const motionBrowserDialog = new Modal();
// motionBrowserDialog.render(
//     <Dialog
//         class={styles.AssetBrowserDialog}
//         onClose={() => motionBrowserDialog.hide()}
//     >
//         <MotionBrowser
//             selected={selectedMotion()}
//             onSelect={(ids: number[]) => {
//                 storage.entity
//                     .update<Entity & {motionId: number}>(
//                         entityMemo().id,
//                         {motionId: ids[0]}
//                     );
//                 motionBrowserDialog.hide();
//             }}
//         />
//     </Dialog>
// );
useScopeContext("DisplayUtility");
</script>

<template>
<Widget
	class="DisplayUtility"
	title="Display"
>
	<!-- <Section
		v-if="isVisual(entity)"
		title="Prop"
	>
		<img
			v-if="propSrc"
			class="Preview"
			:src="propSrc"
			:draggable="false"
			@pointerDown="() => {
				// propBrowserDialog.show();
			}"
		>
	</Section> -->
	<div class="Toolbar">
		<!-- <Button
			:icon="ImageIconSvg"
		/>
		<Button
			:icon="MotionIconSvg"
		/> -->
	</div>

	*/}
</Widget>
</template>

<style lang="scss" scoped>
.DisplayUtility {
    .Toolbar {
        display: flex;
        flex-direction: row;
    }

    .Preview {
        align-self: center;
        width: 64px;
        min-height: 64px;
        height: auto;
        cursor: pointer;
    }
}

.AssetBrowserDialog {
    width: 60%;
    height: 60%;
}
</style>