declare module "*.css" {
    const content: string;
    export default content;
}

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.module.scss" {
    const classes: {[key: string]: string} = {};
    export = classes;
}