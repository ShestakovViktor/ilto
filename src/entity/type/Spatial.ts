export type Spatial = {
    x: number;
    y: number;
};

export function isSpatial(entity: {[key: string]: unknown}): entity is Spatial {
    return "x" in entity;
}