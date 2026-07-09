import { waitFor, throwError } from "../common/dom-utils.js";
import { internal_request_sent, setInternalRequestSent } from "../common/config.js";
import { nameFromItem, getAttachedParts, getDescription } from "./item-descriptions.js";

/**
 * Sets internal_request_sent to true once a request to the internal inventory api has been made.
 */
export function interceptInventoryRequest() {
    let old_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.endsWith("/json/440/2/?trading=1")) {
            setInternalRequestSent(true);
            XMLHttpRequest.prototype.open = old_open;
        }

        return old_open.apply(this, arguments);
    };
}

/**
 * @typedef {Object} UserYou
 * @typedef {Object} UserThem
 * @typedef {Object} User
 * @property {Object} rgContexts - Inventory data by context
 * @property {number} cLoadsInFlight - Number of inventory requests in process
 * @property {string} strSteamId - Steam ID user
 * @property {Object} inventory
 * @property {Object} rgInventory
 * @property {Object} responseJSON
 * @property {Function} loadInventory - Function for loading inventory
 * @property {Function} getInventory
 * @property {Function} LoadForeignAppContextData
 * @typedef {number} g_ulTradePartnerSteamID
 */
export function getInventories() {
    return new Promise(async res => {
        while (!UserYou.rgContexts["440"]) {
            await waitFor(0.1);
        }
        if (!internal_request_sent) UserYou.getInventory(440, 2);
        UserThem.LoadForeignAppContextData(g_ulTradePartnerSteamID, 440, 2);

        let done = false;
        setTimeout(() => {
            if (!done) throwError("[getInventories]: Timeout waiting for inventory data.");
        }, 15000);

        const inventories = await Promise.all([getSingleInventory(UserYou), getSingleInventory(UserThem)]);
        done = true;

        res(inventories);
    });
}

function getSingleInventory(User) {
    return new Promise(async res => {
        let inv = User.rgContexts["440"]["2"].inventory?.rgInventory;
        if (!inv || User.cLoadsInFlight !== 0) {
            if (User.cLoadsInFlight === 0) User.loadInventory();
            inv = await waitForInventoryLoad(User);
        } else inv = Object.values(inv);
        res(parseInventory(inv));
    });
}

function waitForInventoryLoad(User) {
    return new Promise(async res => {
        let done = false;

        //poll for inventory ready
        await (async () => {
            let inv = User.rgContexts["440"]["2"].inventory?.rgInventory;
            while (!inv) {
                await waitFor(0.5);
                if (done) return;
                inv = User.rgContexts["440"]["2"].inventory?.rgInventory;
            }

            done = true;
            const parsed_inv = Object.values(inv);
            res(parsed_inv);
        })();

        //wait for intercepted request, fast but less reliable
        const onLoad = User.OnLoadInventoryComplete;
        User.OnLoadInventoryComplete = function (data, appid, contextid) {
            if (appid === 440 && contextid === 2) {
                done = true;
                res(Object.values(data.responseJSON.rgInventory));
            }

            User.OnLoadInventoryComplete = onLoad;
            return onLoad.apply(this, arguments);
        };
        const on_Fail = User.OnInventoryLoadFailed;
        User.OnInventoryLoadFailed = async function (data, appid, contextid) {
            if (appid === 440 && contextid === 2) {
                console.log("[waitForInventoryLoad]: load failed, requesting manually");
                const inv = await getInventory(User.strSteamId);
                done = true;
                res(inv);
            }

            User.OnInventoryLoadFailed = on_Fail;
            return on_Fail.apply(this, arguments);
        };
    });
}

function parseInventory(items) {
    return items.map(item => {
        return {
            id: item.id,
            defindex: item.app_data.def_index,
            name: nameFromItem(item),
            descriptions: item.descriptions
        };
    });
}

/**
 * @property {Object} more_items
 */
export async function getInventory(steam_id) {
    let body;
    try {
        const response = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=2000&l=english");

        if (!response.ok) throwError("[getInventory]: response status error: " + response.status);
        body = await response.json();
        if (body.more_items) {
            const moreResponse = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=1000&more_start=1000&l=english");

            if (!moreResponse.ok) throwError("[getInventory]: more_response status error: " + moreResponse.status);
            const more_body = await moreResponse.json();

            body.assets = body.assets.concat(more_body.assets);
            body.descriptions = body.descriptions.concat(more_body.descriptions);
        }
    } catch (err) {
        return throwError("[getInventory]: Could not obtain inventory data: " + err);
    }

    const quickDescriptionLookup = {};
    const inv = [];

    for (let i = 0; i < body.assets.length; i++) {
        const description = getDescription(quickDescriptionLookup, body.descriptions, body.assets[i].classid, body.assets[i].instanceid);
        description.id = body.assets[i].assetid;
        description.name = nameFromItem(description);
        description.tags = {
            strangeParts: []
        };
        description.tags.strangeParts.push(...getAttachedParts(description));
        inv.push(JSON.parse(JSON.stringify(description)));
    }

    return inv;
}
