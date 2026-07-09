import { allow_change, DEBUG, itemsWithPriceHalfScrap } from "../common/constants.js";
import { throwError } from "../common/dom-utils.js";

export function correctCurrency(metal) {
    // Using for correct currency balance
    // Ex. 10.98 ref -> 11 ref
    let keys = metal[0];
    let ref = metal[1];
    let rec = metal[2];
    let scrap = metal[3];
    let half_scrap = metal[4];

    // Rebalance the currency
    if (scrap >= 3) {
        scrap -= 3;
        rec += 1;
    }
    if (rec >= 3) {
        rec -= 3;
        ref += 1;
    };
    return [keys, ref, rec, scrap, half_scrap];
}

export function toCurrencyTypes(currencyString, count) {
    const match = currencyString.match(/^(\d+ keys?,? ?)?(\d+(?:\.\d+)? ref)?$/);
    if (!match) return throwError("[toCurrencyTypes]: Could not parse currency: " + currencyString);

    let keys = 0;
    let metal = 0;
    if (match[1]) {
        const keyLength = match[1].indexOf(" ");
        keys = Number(match[1].slice(0, keyLength));
    }
    if (match[2]) {
        const refLength = match[2].indexOf(" ");
        metal = Number(match[2].slice(0, refLength));
    }

    function roundToHalf(value) {
        return Math.round(value * 2) / 2;
    }

    const metalInScrap = roundToHalf(metal * 9);
    const totalScrap = metalInScrap * count;
    metal = totalScrap;

    const ref = Math.floor(totalScrap / 9);
    metal -= ref * 9;

    const rec = Math.floor(metal / 3);
    metal -= rec * 3;

    const scrap = Math.floor(metal);
    metal -= scrap;

    let halfScrap = 0;
    if (metal === 0.5) {
        halfScrap += 1;
    }

    console.groupCollapsed("[toCurrencyTypes]: Metal");
    console.table({
        metalInScrap: metalInScrap,
        totalScrap: totalScrap,
        refined: ref,
        reclimed: rec,
        scrap: scrap,
        halfScrap: halfScrap,
        metal: metal
    });
    console.groupEnd();
    keys = keys * count;
    return correctCurrency([keys, ref, rec, scrap, halfScrap]);
}

export function pickCurrency(inventory, keys, ref, rec, scrap, halfScrap) {
    const invKeys = inventory.filter(item => item.name === "Mann Co. Supply Crate Key");
    const invRef = inventory.filter(item => item.name === "Refined Metal");
    const invRec = inventory.filter(item => item.name === "Reclaimed Metal");
    const invScrap = inventory.filter(item => item.name === "Scrap Metal");

    if (DEBUG) {
        const logData = inventory.map(item => {
            const found = itemsWithPriceHalfScrap.has(item.name);
            return {
                Name: item.name,
                Found: found ? '✅' : '❌'
            };
        });
        console.groupCollapsed("[pickCurrency]: Items with price half scrap:")
        console.log(logData);
        console.groupEnd();
    };

    const invHalfScrap = inventory.filter(item => itemsWithPriceHalfScrap.has(item.name));
    DEBUG && console.log("[pickCurrency]: Inventory:", inventory);
    DEBUG && console.log("[pickCurrency]: Inventory (half scrap):", invHalfScrap)
    console.log("[pickCurrency]: Half scrap in the start: " + halfScrap);
    if (invKeys.length < keys) return throwError("[pickCurrency]: Insufficient Keys");
    if (allow_change && invRef.length + invRec.length / 3 + invScrap.length / 9 + invHalfScrap.length / 20 < ref + rec / 3 + scrap / 9 + halfScrap / 20) return throwError("[pickCurrency]: Insufficient Metal");
    if (!allow_change && (invRef.length < ref || invRec.length < rec || invScrap.length < scrap || invHalfScrap.length < halfScrap)) return throwError("[pickCurrency]: Insufficient Metal");

    let leftoverRef = invRef.length - ref;
    let leftoverRec = invRec.length - rec;
    let leftoverScrap = invScrap.length - scrap;
    let leftoverHalfScrap = invHalfScrap.length - halfScrap;
    let change = { ref: 0, rec: 0, scrap: 0, halfScrap: 0 };
    console.log(`[pickCurrency]: leftoverRef: ${leftoverRef}; leftoverRec: ${leftoverRec}; leftoverScrap: ${leftoverScrap}; leftoverHalfScrap: ${leftoverHalfScrap}`);

    console.log(`[pickCurrency]: scrap: ${scrap}`)
    //use rec if not enough scrap
    if (leftoverScrap < 0) {
        leftoverScrap = -leftoverScrap;
        rec += Math.ceil(leftoverScrap / 3);
        leftoverRec -= Math.ceil(leftoverScrap / 3);
        change.scrap += 3 - (leftoverScrap % 3);
        change.scrap = change.scrap % 3;
        scrap -= leftoverScrap;
        leftoverScrap = 0;
    }

    //use ref if not enough rec
    if (leftoverRec < 0) {
        leftoverRec = -leftoverRec;
        ref += Math.ceil(leftoverRec / 3);
        leftoverRef -= Math.ceil(leftoverRec / 3);
        change.rec += 3 - (leftoverRec % 3);
        change.rec = change.rec % 3;
        rec -= leftoverRec;
        leftoverRec = 0;
    }

    //use rec if not enough ref
    if (leftoverRef < 0) {
        ref -= -leftoverRef;
        rec += -leftoverRef * 3;
        leftoverRec -= -leftoverRef * 3;
        leftoverRef = 0;
    }

    //use scrap if not enough rec
    if (leftoverRec < 0) {

        rec -= -leftoverRec;
        scrap += -leftoverRec * 3;
        leftoverScrap -= -leftoverRec * 3;
        leftoverRec = 0;
    }

    //use half_scrap if not enough scrap
    if (leftoverScrap < 0) {
        if (leftoverHalfScrap < -leftoverScrap * 2) return throwError("[pickCurrency]: Insufficient Metal");

        scrap -= leftoverScrap;
        halfScrap += -leftoverScrap * 2;
        leftoverHalfScrap -= -leftoverScrap * 2;
        leftoverScrap = 0;
    }

    //calculate change needed from other inventory
    if (ref !== 0 && change.ref !== 0) {
        let reduce = Math.min(ref, change.ref);
        ref -= reduce;
        change.ref -= reduce;
    }
    if (rec !== 0 && change.rec !== 0) {
        let reduce = Math.min(rec, change.rec);
        rec -= reduce;
        change.rec -= reduce;
    }
    console.groupCollapsed("[pickCurrency]: Before & change: ");
    console.log("[pickCurrency]: Before scrap: " + scrap + "; change.scrap: " + change.scrap);
    if (scrap !== 0 && change.scrap !== 0) {
        let reduce = Math.min(scrap, change.scrap);
        scrap -= reduce;
        change.scrap -= reduce;
    }
    console.log("[pickCurrency]: After scrap: " + scrap + "; change.scrap: " + change.scrap);

    if (halfScrap !== 0 && change.halfScrap !== 0) {
        let reduce = Math.min(halfScrap, change.halfScrap);
        halfScrap -= reduce;
        change.halfScrap -= reduce;
    }
    console.log(`[pickCurrency]: Change after balance: Ref: ${change.ref}; Rec: ${change.rec}; Scrap: ${change.scrap}; Half scrap: ${change.halfScrap}`);
    console.groupEnd();
    //start taking items from random position; possible ranges are between 0 and length-amount
    const keyStart = Math.floor(Math.random() * (invKeys.length - keys + 1));
    const refStart = Math.floor(Math.random() * (invRef.length - ref + 1));
    const recStart = Math.floor(Math.random() * (invRec.length - rec + 1));
    const scrapStart = Math.floor(Math.random() * (invScrap.length - scrap + 1));
    const halfScrapStart = Math.floor(Math.random() * (invHalfScrap.length - halfScrap + 1));

    //actually take the items
    const takeKeys = invKeys.slice(keyStart, keyStart + keys);
    const takeRef = invRef.slice(refStart, refStart + ref);
    const takeRec = invRec.slice(recStart, recStart + rec);
    const takeScrap = invScrap.slice(scrapStart, scrapStart + scrap);
    const takeHalfScrap = invHalfScrap.slice(halfScrapStart, halfScrapStart + halfScrap);
    console.log(`[pickCurrency]: Take: Keys: ${takeKeys.length}; Ref: ${takeRef.length}; Rec: ${takeRec.length}; Scrap: ${takeScrap.length}; 
        Half scrap: ${takeHalfScrap.length}`);

    const items = [...takeKeys, ...takeRef, ...takeRec, ...takeScrap, ...takeHalfScrap];

    //checks if anything went wrong. This should never happen but let's check anyway.
    if (
        keys < 0 ||
        ref < 0 ||
        rec < 0 ||
        scrap < 0 ||
        halfScrap < 0 ||
        change.ref < 0 ||
        change.rec < 0 ||
        change.scrap < 0 ||
        change.halfScrap < 0 ||
        keyStart < 0 ||
        refStart < 0 ||
        recStart < 0 ||
        scrapStart < 0 ||
        halfScrapStart < 0 ||
        keys === undefined ||
        ref === undefined ||
        rec === undefined ||
        scrap === undefined ||
        halfScrap === undefined ||
        keys > invKeys.length ||
        ref > invRef.length ||
        rec > invRec.length ||
        scrap > invScrap.length ||
        halfScrap > invHalfScrap.length ||
        items.length < keys ||
        takeKeys.length !== keys ||
        takeRef.length !== ref ||
        takeRec.length !== rec ||
        takeScrap.length !== scrap ||
        takeHalfScrap.length !== halfScrap ||
        Math.round((ref + rec / 3 + scrap / 9 + halfScrap / 20) * 100) !== Math.round((takeRef.length + takeRec.length / 3 + takeScrap.length / 9 + takeHalfScrap.length / 20) * 100)
    ) {  
       console.error("[pickCurrency]: Something went wrong balancing currencies: ", {
            values: {keys, ref, rec, scrap, half_scrap: halfScrap},
            change: {
                ref: change.ref,
                rec: change.rec,
                scrap: change.scrap,
                half_scrap: change.halfScrap
            },
            start: {key_start: keyStart, ref_start: refStart, rec_start: recStart, scrap_start: scrapStart, half_scrap_start: halfScrapStart},
            isNegative: {
                keys: keys < 0, ref: ref < 0, rec: rec < 0, scrap: scrap < 0, half_scrap: halfScrap < 0,
                changeRef: change.ref < 0, changeRec: change.rec, changeScrap: change.scrap, changeHalfScrap: change.halfScrap,
                key_start: keyStart < 0, refStart: refStart < 0, recStart: recStart < 0, scrapStart: scrapStart < 0, halfScrapStart: halfScrapStart < 0
            },
            isUndefined: {
                keys: keys === undefined, ref: ref === undefined, rec: rec === undefined, scrap: scrap === undefined, half_scrap: halfScrap === undefined
            },
            inventoryLengthChecks: {
                keys: keys > invKeys.length, ref: ref > invRef.length, rec: rec > invRec.length, scrap: scrap > invScrap.length, halfScrap: halfScrap > invHalfScrap.length
            },
            takeLengthMismatch: {
                keys: takeKeys.length !== keys, ref: takeRef.length !== ref, rec: takeRec !== rec, scrap: takeScrap !== scrap, halfScrap: takeHalfScrap !== halfScrap
            },
            items: {
                value: items,
                isTooShort: items.length < keys
            }
        });
        return [[-1, -1, -1, -1], [-1, -1, -1, -1]];
    }

    return [items, [change.ref, change.rec, change.scrap, change.halfScrap]];
}
