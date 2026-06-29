<script setup lang="ts">
import {Field} from "@src/core/view";

defineProps<{
	label: string;
	name: string;
	type?: string;
	value?: string;
	accept?: string;
	step?: string;
	readonly?: boolean;
	required?: boolean;
}>();

</script>

<template>
<Field
	v-bind="$props"
	:class-list="$style"
/>
</template>

<style lang="scss" module>
.Field {
    gap: 16px;

    .Label {
        /**/
    }

    .Input {
        /**/
    }
}
</style>