<script setup lang="ts">
import {downloadData, saveData} from "@src/editor/service";

import {
	ListItem,
	List,
	Section,
	Widget,
} from "@src/editor/view/component/utility-bar";

import {useEditorContext} from "@src/editor/view/context";
import {loadDemo} from "@src/editor/service/loadDemo";
import {useCoreContext} from "@src/core/context";
import {Scope} from "@src/editor/view/component";
import {useViewerContext} from "@src/viewer/context";
import {DataRestoreScript} from "@src/editor/script";
import {ProjectInitActivity} from "@src/editor/type/activity";
import {ActivityKind} from "@src/editor/enum";

const {archiver, fetcher, linker} = useCoreContext();
const {storage, session, engine} = useEditorContext();
const {loop, canvas} = useViewerContext();

// const {notification} = useEditorContext();

// async function handleProjectUpload(): Promise<void> {
//     const file = await uploadFile({type: "file", accept: ".ilto"});
//     const data = await importData(file, startupContext.archiveDriver);
//     setData(data);
// }

// async function handleExport(): Promise<void> {
//     const data = storage.extract();
//     const archive = await archiveData(archiver, data);
//     browser.downloadFile(archive, "test.ilto");
// }

// async function handleCompile(): Promise<void> {
//     const data = storage.extract();
//     const archive = await compileData(archiver, data);
//     browser.downloadFile(archive, "test.ilto");
// }

function handleInit(): void {
	session.value.activity = {
		kind: ActivityKind.ProjectInit,
		payload: {
			name: "Test",
			width: 1920,
			height: 1080,
		},
	};
}

async function handleSave(): Promise<void> {
	await saveData(storage, linker, archiver, fetcher);
}

async function handleRestore(): Promise<void> {
	await engine.exec(
		new DataRestoreScript(
			storage,
			linker,
			archiver,
			fetcher,
			{name: "save.ilto"}
		)
	);

	// viewport.setCanvas({
	// 	x: 0,
	// 	y: 0,
	// 	w: storage.config.width,
	// 	h: storage.config.height,
	// });

	loop.requestUpdate();
}

async function handleLoadDemo(): Promise<void> {
	await loadDemo(storage, linker, archiver, fetcher);
}

async function handleDownload(): Promise<void> {
	await downloadData(storage, linker, archiver, fetcher);
}

// const strings = {
// 	"exportProject": "export project",
// 	"compileProject": "compile project",
// 	"projectSettings": "project setting",
// 	"save": "save",
// 	"load": "load from memory",
// };
</script>

<template>
<Scope name="SystemUtility">
	<Widget title="System">
		<Scope name="CreateSection">
			<Section title="Create">
				<List>
					<ListItem @click="handleInit">
						New project
					</ListItem>
				</List>
			</Section>
		</Scope>
		<Scope name="SaveSection">
			<Section title="Save">
				<List>
					<ListItem @click="handleSave">
						Save
					</ListItem>
				</List>
			</Section>
		</Scope>
		<Scope name="LoadSection">
			<Section title="Load">
				<List>
					<ListItem @click="handleRestore">
						Load from memory
					</ListItem>
					<ListItem @click="handleLoadDemo">
						Load demo project
					</ListItem>
				</List>
			</Section>
		</Scope>
		<Scope name="ExportSection">
			<Section title="Export">
				<List>
					<ListItem @click="handleDownload">
						Download
					</ListItem>
				</List>
			</Section>
		</Scope>
	</Widget>
</Scope>
</template>