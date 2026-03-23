export type ImageTile = {
    x: number;
    y: number;
    width: number;
    height: number;
    media: string;
    size: number;
    path: string;
};

export interface ImageDriver {
    initImage(
        width: number,
        height: number,
        blob: Blob,
        mime: string
    ): Promise<ImageTile[]>;
}