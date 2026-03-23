export class MimeMapper {
    private map = [
        {mime: "image/svg+xml", extension: "svg"},
        {mime: "image/png", extension: "png"},
        {mime: "image/jpg", extension: "jpg"},
        {mime: "image/jpeg", extension: "jpg"},
        {mime: "text/javascript", extension: "js"},
        {mime: "text/css", extension: "css"},
        {mime: "application/json", extension: "json"},
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