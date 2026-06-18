<script setup lang="ts">
import {useScopeContext} from "@src/editor/context";

const props = defineProps<{
	name: string;
}>();

useScopeContext(props.name);
</script>

<template>
<slot />
</template>