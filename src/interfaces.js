// @flow

// id, path, value, toValue
export type Patch = ['+' | '-' | 'r', string[], mixed, mixed]

export type RFC9602Patch = {
    op: 'add';
    path: string;
    value: mixed;
} | {
    op: 'remove';
    path: string;
} | {
    op: 'test';
    path: string;
    value: mixed;
} | {
    op: 'replace';
    path: string;
    value: mixed;
}

export type ForEachCb<V> = (el: V, key: string|number) => void;

export interface Adapter<D> {
    data: D;

    isEmpty(): boolean;

    size(): number;

    get<V>(key: string|number): V;

    has(key: string|number): boolean;

    addIn<V>(path: string[], value: V): Adapter<D>;

    setIn<V>(path: string[], value: V): Adapter<D>;

    getIn<V>(path: string[]): V;

    hasIn(path: string[]): Adapter<D>;

    removeIn(path: string[]): Adapter<D>;

    toJS(): Object;

    isMap(): boolean;

    isIndexed(): boolean;

    is<I, O>(src: I, dest: O): boolean;

    forEach<V>(cb: ForEachCb<V>): Adapter<D>;

    normalize(p: Patch[]): Patch[];
}

export interface Codec {
    encodeSegment(s: string|number): string;

    add<V>(ops: Patch[], path: string[], value: V): void;

    remove<V>(ops: Patch[], path: string[], value: V): void;

    replace<V, R>(ops: Patch[], path: string[], value: V, toValue: R): void;

    invert(patches: Patch[]): Patch[];
}

export interface Processor {
    eq(): void;
    neq<V, N>(val: V, newVal: N): void;
    add<V>(val: V): void;
    sub<V>(newVal: V): void;
}
