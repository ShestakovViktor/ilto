<script setup lang="ts">
import type {IconName} from "@src/core/enum";
import Icon from "./Icon.vue";

type Props = {
	pressed?: boolean;
	type?: "submit" | "button" | "reset";
	icon?: IconName;
	label?: string;
};

const props = withDefaults(defineProps<Props>(), {
	pressed: false,
	type: "button",
});

const emit = defineEmits<(e: "click", event: MouseEvent) => void>();

function handleClick(event: MouseEvent): void {
	emit("click", event);
}
</script>

<template>
<button
	class="Button"
	:class="{'Pressed': props.pressed}"
	:type="props.type"
	@click="handleClick"
>
	<Icon
		v-if="props.icon"
		:name="props.icon"
	/>
	<label
		v-if="props.label"
		class="Label"
	>
		{{ props.label }}
	</label>
</button>
</template>

<style scoped lang="scss">
.Button {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: unset;
	gap: 8px;

    color: inherit;

    cursor: pointer;

	border: unset;
	outline: unset;

	width: fit-content;

	&.Pressed {
		color: var(--red-30);
		.Icon {
			border: 1px solid var(--red-30);
			color: inherit;
		}
	}

	.Icon {
		border: 1px solid var(--gray-60);
		border-radius: .5em;

		width: 42px;
		height: 42px;

		padding: 8px;

		color: var(--gray-30);
	}

	.Label {
		cursor: inherit;
	}
}
</style>