<script setup lang="ts">

import { computed, inject } from "vue";
import { Tile } from "@src/core/type";
import { Storage } from "@src/storage/controller";

type Props = {
  entity: Tile;
}

const props = defineProps<Props>();

const viewerContext = inject<{
  storage: Storage;
  path: string;
}>("viewerContext");

if (!viewerContext) {
  throw new Error("ViewerContext is not provided");
}

const { storage, path } = viewerContext;

const tileStyle = computed(() => {
  return {
    transform: `translate3d(${props.entity.x}px, ${props.entity.y}px, 0)`,
  };
});

const src = computed((): string => {
  const imageId = props.entity.imageId;

  if (!imageId) {
    return "";
  } else {
    const tile = storage.data.asset.select(imageId);

    if (!tile) throw new Error("Tile asset not found");

    return path + tile.path;
  }
});
</script>

<template>
  <img
    class="Tile"
    :src="src"
    :style="tileStyle"
    :draggable="false"
  />
</template>

<style scoped lang="scss">
.Tile {
  position: absolute;
  top: 0;
  left: 0;

  user-select: none;
  image-rendering: optimizeQuality;
}
</style>