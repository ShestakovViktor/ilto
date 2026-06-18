<script setup lang="ts">
import { ref } from "vue";

export type TabItem = {
	title: string;
	class?: string;
	contentId: string; 
}

type Props = {
	items: TabItem[];
	selected?: number;
}

const props = withDefaults(defineProps<Props>(), {
	selected: 0,
});

const selectedIndex = ref(props.selected);

function selectTab(index: number): void {
	selectedIndex.value = index;
}
</script>

<template>
	<div class="Tabs">
		<div class="TabBar">
			<div
				v-for="(item, index) in items"
				:key="item.contentId"
				class="TabButton"
				:class="{ 'Selected': selectedIndex === index }"
				@click="selectTab(index)"
			>
				{{ item.title }}
			</div>
		</div>

		<div class="TabArea">
			<div
				v-for="(item, index) in items"
				:key="item.contentId"
				class="TabView"
				:class="[
					{ 'Selected': selectedIndex === index },
					item.class ? item.class : ''
				]"
			>
				<slot :name="item.contentId" />
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.Tabs {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 1em;



    .TabBar {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 1em;

        .TabButton {
            cursor: pointer;
            &.Selected {
                border-bottom: 2px solid var(--theme);
            }
        }
    }

    .TabArea {
        flex-grow: 1;
        .TabView {
            display: none;
            flex-direction: column;
            gap: 18px;

            width: 100%;
            height: 100%;

            &.Selected {
                display: flex;
            }
        }
    }
}
</style>