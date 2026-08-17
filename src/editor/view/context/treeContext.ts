import {inject, provide, ref, type Ref} from "vue";

export type TreeContext = {
	selectedId: Ref<number | null>;
};

const treeContextKey = Symbol("treeContext");

export function useTreeContext(
	seleted: number,
	isRoot?: boolean
): {
	selectedId: Ref<number | null>;
} {
	if (isRoot) {
		const selectedId = ref<number | null>(seleted);

		provide(treeContextKey, {selectedId});

		return {selectedId};
	}

	const context = inject<TreeContext>(treeContextKey);

	if (!context) throw new Error("[useTreeContext] Контекст дерева не найден.");

	return {
		selectedId: context.selectedId,
	};
}
