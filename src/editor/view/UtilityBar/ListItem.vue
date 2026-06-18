<script setup lang="ts">
const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent): void {
	emit("click", event);
}
</script>

<template>
<div
	class="ListItem"
	@click="handleClick"
>
	<slot />
</div>
</template>

<style lang="scss" module>
.ListItem {
	cursor: pointer;
	padding: 8px;

	&:hover {
		background: var(--gray-80);
	}
}
</style>