import {
    Size,
    Spatial,
    Visual,
    Dynamic,
} from "@feature/entity/type";

export type Entity = Partial<Size>
    & Partial<Spatial>
    & Partial<Visual>
    & Partial<Dynamic>
    & {
        id: number;
        entityTypeId: number;
    };