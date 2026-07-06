<script setup lang="ts">
import type {Asset} from "@src/core/type";
import type {AssetKind} from "@src/core/enum";
import {useEditorContext} from "@src/editor/context";
import {computed} from "vue";

const props = defineProps<{
	type?: AssetKind;
	multiple?: boolean;
	selected?: number[];
	onCreate?: () => void;
	onSelect?: (ids: number[]) => void;
	onDelete?: (ids: number[]) => void;
}>();

const {storage} = useEditorContext();

const assets = computed(() => {
	return props.type
		? storage.asset
			.selectByParams<Asset>({assetTypeId: props.type})
		: storage.asset
			.selectAll<Asset>();
});

// const [selected, setSelected] = createSignal<number[]>([] as number[]);

// createEffect(() => {
// 	setSelected(props.selected ?? []);
// });

</script>

<template>
<div class="AssetBrowser">
	<div class="Assets">
		<table>
			<thead>
				<tr>
					<th>id</th>
					<th>name</th>
					<th>media</th>
					<th>size (in kb)</th>
					<th>
						<Button>
							Добавить
						</Button>>
					</th>
				</tr>
			</thead>
			<tbody>
				<!-- <tr>
						<td>{asset.id}</td>
						<td>{asset.name}</td>
						<td>{asset.mime}</td>
						<td>{Math.floor(asset.size / 1024)}</td>
						<td>
							<Show when="{props.onDelete}">
								<Button
									icon="{SaltireIconSvg}"
									on-click="{()"
									=
								>
									{
									if (props.onDelete) {
									props.onDelete(
									[asset.id]
									);
									}
									}}
									/>
								</button>
							</Show>
						</td>
					</tr> -->
			</tbody>
		</table>
	</div>
	<Button />
</div>
</template>

<style lang="scss" scoped>
.AssetBrowser {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 16px;

    .Assets {
        border-collapse: collapse;
        overflow: scroll;

        button {
            width: 24px;
            height: 24px;
        }

        table {
            width: 100%;

            thead {
                position: sticky;
                top: 0;
            }

            tr {
                cursor: pointer;
                text-align: center;
                user-select: none;

                &.Selected {
                    background-color: lemonchiffon;
                }

                th, td {
                    padding: 8px;
                }
            }

        }
    }
}
</style>