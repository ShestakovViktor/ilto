import {MimeType} from "@src/core/enum";

export class Mime {
	private map = [
		{mime: MimeType.Svg, extension: "svg"},
		{mime: MimeType.Png, extension: "png"},
		{mime: MimeType.Jpg, extension: "jpg"},
		{mime: MimeType.Jpeg, extension: "jpeg"},
		{mime: MimeType.Js, extension: "js"},
		{mime: MimeType.Json, extension: "json"},
		{mime: MimeType.Css, extension: "css"},
	];

	toExt(type: string): string | undefined {
		return this.map
			.find((item) => item.mime == type)?.extension;
	}

	fromExt(extension: string): string | undefined {
		return this.map
			.find((item) => item.extension == extension)?.mime;
	}
}
