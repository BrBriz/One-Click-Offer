const attributes = new Map();

globalThis.document = {
    documentElement: {
        getAttribute: name => attributes.get(name) ?? null,
        setAttribute: (name, value) => attributes.set(name, String(value)),
        removeAttribute: name => attributes.delete(name),
    },
};
globalThis.location = { search: "?tscript_name=Test%20Item" };
globalThis.window = { alert() {} };

export function resetPage() {
    attributes.clear();
}

export function pageAttr(name) {
    return attributes.get(name) ?? null;
}
