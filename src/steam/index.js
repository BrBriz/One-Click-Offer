import { awaitDocumentReady, throwError } from "../common/dom-utils.js";
import { config, GetTradeOffers, GetTradeOffers_params } from "../common/config.js";
import { interceptInventoryRequest, getInventories } from "./inventory.js";
import { normalizeName, toTradeOfferItem, sendOffer } from "./trade-offer.js";
import { toCurrencyTypes, pickCurrency } from "./currency.js";
import { DEBUG } from "../common/constants.js";

export async function run() {
    const params = new URLSearchParams(location.search);
    if (!params.has("tscript_price")) return;

    interceptInventoryRequest();
    await awaitDocumentReady();

    let itemsToGive = [];
    let itemsToReceive = [];

    let [ourInventory, theirInventory] = await getInventories();
    window.our_inv = ourInventory;
    window.their_inv = theirInventory;

    const validTradeOfferStates = [2, 4, 9];
    const takedAssetIds = [];

    if (config.SteamAPI !== "" && config.SteamAPI !== "Null") {
        try {
            const response = await fetch(GetTradeOffers + '?' + new URLSearchParams(GetTradeOffers_params));
            console.log('[SteamAPI/GetTradeOffers]: Response Status:', response.status);

            if (!response.ok) throw new Error(`[SteamAPI/GetTradeOffers]: Status ${response.status}`);

            const data = await response.json();
            data.response.trade_offers_sent?.forEach(offer => {
                if (validTradeOfferStates.includes(offer.trade_offer_state)) {
                    offer.items_to_give.forEach(item => takedAssetIds.push(item.assetid));
                }
            });
            console.log("[SteamAPI/GetTradeOffers]: taked_assetIds:", takedAssetIds);
        } catch (error) {
            console.error('[SteamAPI/GetTradeOffers]: Error:', error);
        }
    } else if (config.SteamAPI === "") {
        config.SteamAPI = prompt("Enter your Steam API Key for use trade fetch feature in next time or 'Null' if don't want use it:");
            if (config.SteamAPI) {
                GM_setValue("SteamAPI", config.SteamAPI);
            }
    }

    let ourFilteredInventory = ourInventory.filter(item => !takedAssetIds.includes(item.id));

    if (!params.has("tscript_id")) {
        const neededItemName = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
        const currencyString = params.get("tscript_price");
        const requestedCount = parseInt(params.get("tscript_count") || "1", 10);
        const strangeParts = params.get("tscript_strangeParts")?.split(',').filter(Boolean) || [];

        console.groupCollapsed("[Buy Order]: Request: ");
        console.table({
            itemName: neededItemName,
            currency: currencyString,
            count: requestedCount,
            strangeParts: strangeParts
        });
        console.groupEnd();
        const neededItems = [];

        if (document.referrer === "https://next.backpack.tf/") {
            ourFilteredInventory = ourFilteredInventory.map(item => ({
                ...item,
                name: normalizeName(item.name)
            }));
        }

        DEBUG && console.log("[Buy Order]: ourFilteredInventory: ", ourFilteredInventory);

        let itemsByName = ourFilteredInventory.filter(item => item.name === neededItemName);
        if (strangeParts && strangeParts.length > 0) {
            itemsByName = itemsByName.filter(item => {
                const myItemParts = item.tags?.strangeParts;

                if (!myItemParts || myItemParts.length === 0) {
                    return false;
                }
                return strangeParts.every(neededPart => {
                    return myItemParts.some(myPart => myPart.includes(neededPart));
                });
            });
        }

        console.log("[Buy Order]: itemsByName: ", itemsByName);
        for (let i = 0; i < requestedCount; i++) {
            if (i < itemsByName.length) {
                neededItems.push(itemsByName[i]);
            }
        }

        if (!neededItems) return throwError("[Buy Order]: Could not find item in your inventory.");

        let actualCount = neededItems.length;
        if (requestedCount == actualCount) {
            console.log(`[Buy Order]: Requested ${requestedCount}, Found ${actualCount}`);
        } else {
            console.warn(`[Buy Order]: Requested ${requestedCount} != Found ${actualCount}`)
        }  

        while (actualCount >= 1) {
            console.log(`[Buy Order]: Trying to buy ${actualCount} items`);
            const tempItemsToGive = [];
            for (const item of neededItems) {
                tempItemsToGive.push(toTradeOfferItem(item.id));
            }

            const currencies = toCurrencyTypes(currencyString, actualCount);
            const [theirCurrency, change] = pickCurrency(theirInventory, ...currencies);

            if (change.find(c => c !== 0)) {
                const [ourCurrency, change2] = pickCurrency(ourFilteredInventory, 0, ...change);
                if (change2.find(c => c !== 0)) {
                    actualCount--;
                    // Remove one item to try new balance
                    for (let i = 0; i < neededItems.length; i++) {
                        neededItems.splice(i, 1);
                        break;
                    }
                    continue;
                }
                for (const c of ourCurrency) tempItemsToGive.push(toTradeOfferItem(c.id));
            }
            console.warn(`[Buy Order]: Actual count balanced items: ${actualCount}`);
            itemsToGive = tempItemsToGive;
            for (const c of theirCurrency) itemsToReceive.push(toTradeOfferItem(c.id));
            break;
        }

        if (actualCount === 0) return throwError("[Buy Order]: Could not balance currencies.");

    } else {
        const itemId = params.get("tscript_id");
        const itemName = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
        const currencyString = params.get("tscript_price");
        const requestedCount = parseInt(params.get("tscript_count") || "1", 10);
        const strangeParts = params.get("tscript_strangeParts")?.split(',').filter(Boolean) || [];

        console.groupCollapsed("[Sell Order]: Request: ");
        console.table({
            itemId: itemId,
            itemName: itemName,
            currency: currencyString,
            count: requestedCount,
            strangeParts: strangeParts
        });
        console.groupEnd();
        const neededItems = [];

        const itemById = theirInventory.find(item => item.id === itemId);
        if (itemById) neededItems.push(itemById);

        DEBUG && console.log("[Sell Order]: theirInventory: ", theirInventory.filter(item => item.name));
        let itemsByName = theirInventory.filter(item => item.name === itemName && item.id !== itemId);

        if (strangeParts && strangeParts.length > 0) {
            itemsByName = itemsByName.filter(item => {
                const myItemParts = item.tags?.strangeParts;

                if (!myItemParts || myItemParts.length === 0) {
                    return false;
                }

                return strangeParts.every(neededPart => {
                    return myItemParts.some(myPart => myPart.includes(neededPart));
                });
            });
        }

        for (let i = 0; i < requestedCount - 1; i++) {
            if (i < itemsByName.length) {
                neededItems.push(itemsByName[i]);
            }
        }

        if (!neededItems) return throwError("[Sell Order]: Item(-s) has already been sold.");

        let actualCount = neededItems.length;
        if (actualCount == requestedCount) {
             console.log(`[Sell Order]: Requested ${requestedCount}, Found ${actualCount}`);
        } else {
             console.warn(`[Sell Order]: Requested ${requestedCount} != Found ${actualCount}`);
        }

        while (actualCount >= 1) {
            console.log(`[Sell Order]: Trying to buy ${actualCount} items`);

            const tempItemsToReceive = [];
            for (const item of neededItems) {
                tempItemsToReceive.push(toTradeOfferItem(item.id));
            }

            console.log("[Sell Order]: Items to receive: ", tempItemsToReceive);

            const totalPrice = toCurrencyTypes(decodeURIComponent(decodeURIComponent(currencyString)), actualCount);

            console.log(`[Sell Order]: Total price for ${actualCount} items: ${totalPrice}`);

            const [ourCurrency, change] = pickCurrency(ourFilteredInventory, ...totalPrice);

            if (change.find(c => c !== 0)) {
                const [theirCurrency, change2] = pickCurrency(theirInventory, 0, ...change);
                console.log("[Post_pickCurrency]: change 2 " + change2);
                if (change2.find(c => c !== 0)) {
                    actualCount--;
                    // Remove one item to try new balance
                    for (let i = 0; i < neededItems.length; i++) {
                        if (neededItems[i].id !== itemId) {
                            neededItems.splice(i, 1);
                            break;
                        }
                    }
                    continue;
                }
                for (let c of theirCurrency) tempItemsToReceive.push(toTradeOfferItem(c.id));
            }
            console.warn(`[Sell Order]: Actual count balanced items: ${actualCount}`);
            itemsToReceive = tempItemsToReceive;

            for (const currency_item of ourCurrency) {
                itemsToGive.push(toTradeOfferItem(currency_item.id));
            }
            break;
        }

        if (actualCount === 0) return throwError("[Sell Order]: Could not balance currencies.");

    }

    const offerId = await sendOffer(itemsToGive, itemsToReceive);
    if (offerId) console.log("[One-Click-Offer/Final]: Success");
    if (offerId && !DEBUG) window.close();
}
