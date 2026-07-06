<script setup lang="ts">

</script>

<template>
<div class="Field">
	<slot />
</div>
</template>

<style lang="scss" scoped>
.Field {
    display: flex;
    gap: 16px;

    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
}
</style>