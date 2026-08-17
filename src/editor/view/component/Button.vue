<script setup lang="ts">
import type {IconName} from "@src/core/enum";
import {Icon} from "@src/editor/view/component";
import {computed} from "vue";

type Props = {
	pressed?: boolean;
	type?: "submit" | "button" | "reset";
	icon?: IconName;
	label?: string;

	size?: "medium" | "small";
};

const props = withDefaults(defineProps<Props>(), {
	pressed: false,
	type: "button",
	label: "",
	size: "medium",
});

const emit = defineEmits<(e: "click", event: MouseEvent) => void>();

const size = computed(() => {
	return props.size.charAt(0).toUpperCase() + props.size.slice(1);
});

function handleClick(event: MouseEvent): void {
	emit("click", event);
}
</script>

<template>
<button
	class="Button"
	:class="[
		size,
		{'Pressed': props.pressed},
	]"
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

	color: var(--gray-30);

	&.Pressed {
		color: var(--red-30);
	}

	&.Medium{
		&>.Icon {
			border: 1px solid var(--gray-60);
			border-radius: .5em;

			width: 42px;
			height: 42px;

			padding: 8px;

		}

		&.Pressed>.Icon {
			border: 1px solid var(--red-30);
			color: inherit;
		}
	}

	&.Small>.Icon {
		width: 16px;
		height: 16px;
	}

	.Label {
		cursor: inherit;
	}
}
</style>