<script setup lang="ts">
import type {IconName} from "@src/core/enum";
import {Button, Icon} from "@src/core/view";

const props = defineProps<{
	icon: IconName;
	pressed?: boolean;

}>();
</script>

<template>
<Button
	class="Button"
	:pressed="props.pressed"
>
	<Icon
		class="Icon"
		:name="props.icon"
	/>
</Button>
</template>

<style lang="scss" scoped>
.Button {
    width: 2em;
}
.Icon {
    width: 16px;
    height: 16px;
}
</style>