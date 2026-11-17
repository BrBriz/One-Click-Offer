import { resetPage, pageAttr } from "./setup.js";
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { toCurrencyTypes, pickCurrency } from "../src/steam/currency.js";

let nextId = 1;
function items(name, n) {
    return Array.from({ length: n }, () => ({ id: String(nextId++), name }));
}

function countByName(list) {
    const counts = {};
    for (const item of list) counts[item.name] = (counts[item.name] ?? 0) + 1;
    return counts;
}

beforeEach(resetPage);

test("toCurrencyTypes: 1.33 ref x3 rounds to 4 ref", () => {
    assert.deepEqual(toCurrencyTypes("1.33 ref", 3), [0, 4, 0, 0, 0]);
});

test("pickCurrency: enough metal to buy 3 MvM parts at 1.33 ref", () => {
    const ourInventory = [...items("Refined Metal", 3), ...items("Reclaimed Metal", 4)];
    const [taken, change] = pickCurrency(ourInventory, ...toCurrencyTypes("1.33 ref", 3));

    assert.deepEqual(countByName(taken), { "Refined Metal": 3, "Reclaimed Metal": 3 });
    assert.deepEqual(change, [0, 0, 0, 0]);
});

test("pickCurrency: paying 1.11 ref with 2 ref asks for 2 rec + 2 scrap back", () => {
    const ourInventory = items("Refined Metal", 2);
    const [taken, change] = pickCurrency(ourInventory, ...toCurrencyTypes("1.11 ref", 1));

    assert.deepEqual(countByName(taken), { "Refined Metal": 2 });
    assert.deepEqual(change, [0, 2, 2, 0]);
});

test("pickCurrency: not enough metal throws insufficient_metal", () => {
    const ourInventory = items("Refined Metal", 2);

    assert.throws(() => pickCurrency(ourInventory, ...toCurrencyTypes("1.33 ref", 3)));
    assert.equal(pageAttr("data-one-click-offer-status"), "error");
    assert.equal(pageAttr("data-one-click-offer-error-id"), "insufficient_metal");
});

test("pickCurrency: no keys throws insufficient_keys", () => {
    const ourInventory = items("Refined Metal", 10);

    assert.throws(() => pickCurrency(ourInventory, ...toCurrencyTypes("1 key, 5 ref", 1)));
    assert.equal(pageAttr("data-one-click-offer-error-id"), "insufficient_keys");
});

test("toCurrencyTypes: unparsable price throws invalid_price", () => {
    assert.throws(() => toCurrencyTypes("abc", 1));
    assert.equal(pageAttr("data-one-click-offer-error-id"), "invalid_price");
});

test("pickCurrency quiet: change side short on metal returns null without an error", () => {
    const sellerInventory = items("Scrap Metal", 1);

    assert.equal(pickCurrency(sellerInventory, 0, 0, 0, 2, 0, true), null);
    assert.equal(pageAttr("data-one-click-offer-status"), null);
});
