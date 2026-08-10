import {type App, inject, provide, reactive, watch} from "vue";

export type ScopeContext = {
	data: Record<string, unknown>;
	children: Record<string, ScopeContext>;
};

const savedData = localStorage.getItem("data");

const root: ScopeContext = reactive<ScopeContext>(
	savedData
		? JSON.parse(savedData)
		: {data: {}, children: {}}
);

watch(
	root,
	() => localStorage.setItem("data", JSON.stringify(root)),
	{deep: true}
);

const scopeContextKey = Symbol("scopeContext");

export function setScopeContext(app: App): void {
	app.provide<ScopeContext>(scopeContextKey, root);
}

export function useScopeContext<T = Record<string, unknown>>(
	value?: string
): {
	scope: ScopeContext;
	data: T;
} {

	let scope = inject<ScopeContext>(scopeContextKey);

	if (!scope) throw new Error();

	if (value) {
		if (!(value in scope.children)) {
			scope.children[value] = {
				data: {},
				children: {},
			};
		}
		scope = scope.children[value];
		provide(scopeContextKey, scope);
	}

	return {
		scope,
		data: scope.data as T,
	};
}