<script setup lang="ts">

import {
	ListItem,
	List,
	Section,
	Widget,
} from "@src/editor/view/component/utility-bar";

import {useEditorContext} from "@src/editor/view/context";
import {useCoreContext} from "@src/core/view/context";
import {Scope} from "@src/editor/view/component";
import {useViewerContext} from "@src/viewer/view/context";
import {ActivityKind} from "@src/editor/enum";
import {
	ProjectRestoreScript,
} from "@src/editor/script";
import {
	DemoRestoreAction,
	ProjectDownloadAction,
	ProjectSaveAction,
} from "@src/core/action/project";

const {archiver, fetcher, linker, storage} = useCoreContext();
const {session, engine} = useEditorContext();
const {scene, loop, canvas} = useViewerContext();

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
	session.activity = {
		kind: ActivityKind.ProjectInit,
		payload: {
			name: "Test",
			width: 1920,
			height: 1080,
		},
	};
}

async function handleSave(): Promise<void> {
	await engine.exec(
		new ProjectSaveAction(
			storage,
			linker,
			archiver,
			fetcher,
			{name: "save.ilto"}
		)
	);
}

async function projectRestore(): Promise<void> {
	await engine.exec(
		new ProjectRestoreScript(
			storage,
			fetcher,
			archiver,
			linker,
			scene,
			loop,
			canvas,
			{name: "save.ilto"}
		)
	);
}

async function handleLoadDemo(): Promise<void> {
	await engine.exec(
		new DemoRestoreAction(
			storage,
			linker,
			archiver,
			fetcher,
			{name: "demo.ilto"}
		)
	);
}

async function handleDownload(): Promise<void> {
	await engine.exec(
		new ProjectDownloadAction(
			storage,
			linker,
			archiver,
			fetcher,
			{name: "project.ilto"}
		)
	);
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
					<ListItem @click="projectRestore">
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