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

declare module "*.scss";

declare module "*.module.scss" {
    const classes: {readonly [key: string]: string};
    export default classes;
}
