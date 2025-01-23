declare module "*.css" {
    const content: any = {};
    export default content;
}

declare module "*.svg" {
    const content: any = {};
    export default content;
}

declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.module.scss" {
    const content: {[key: string]: string} = {};
    export default content;
}