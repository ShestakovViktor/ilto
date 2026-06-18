<template>
    <div class="List">
        <slot/>
    </div>
</template>

<style lang="scss" module>
.List {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>