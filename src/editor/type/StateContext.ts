type Node = {
    name: string;
    children: Node[];
    state: {
        collapsed?: boolean;
    };
};

export type StateContext = {
    root: Node;
    current: Node;

    save: () => void;
};