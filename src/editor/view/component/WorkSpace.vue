<template>
<div
	ref="workspaceRef"
	class="WorkSpace"
	:tab-index="0"
>
	<slot />
</div>
</template>

<style lang="scss" scoped>
.WorkSpace {
	position: relative;
	overflow: hidden;
}
</style>