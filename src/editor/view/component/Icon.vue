<script setup lang="ts">
import {computed} from "vue";
import type {IconName} from "@src/core/enum";

const props = defineProps<{
	name: IconName;
}>();

const iconPath = computed(() =>
	`${import.meta.env.ASSET_PREFIX}/icon.svg#${props.name}`
);

</script>

<template>
<svg
	class="Icon"
	aria-hidden="true"
>
	<use :href="iconPath" />
</svg>
</template>

<style scoped>
.Icon {
}
</style>