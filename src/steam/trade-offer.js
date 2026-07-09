import { DEBUG } from "../common/constants.js";
import { throwError } from "../common/dom-utils.js";

/**
 * @typedef {number} g_sessionID
 * @typedef {Object} response_body
 * @property {String} strError
 * @property {number} tradeofferid
 */
export async function sendOffer(items_to_give, items_to_receive) {
    const params = new URLSearchParams(location.search);

    const body = {
        sessionid: g_sessionID,
        serverid: 1,
        partner: g_ulTradePartnerSteamID,
        tradeoffermessage: "",
        json_tradeoffer: JSON.stringify({
            newversion: true,
            version: items_to_give.length + items_to_receive.length + 1,
            me: { assets: items_to_give, currency: [], ready: false },
            them: { assets: items_to_receive, currency: [], ready: false },
        }),
        captcha: "",
        trade_offer_create_params: JSON.stringify({
            trade_offer_access_token: params.get("token"),
        }),
    };
    const form = new FormData();
    for (let key in body) form.append(key, body[key]);

    try {
        const response_body = await (
            await fetch("https://steamcommunity.com/tradeoffer/new/send", {
                method: "POST",
                body: form,
            })
        ).json();

        if (response_body.strError) return throwError("[sendOffer]: " + response_body.strError);

        return response_body.tradeofferid;
    } catch {}
}

/**
 * Normalize to remove any of the following prefixes: "Taunt: ", "The"
 * @param {String} name
 * @returns
 */
export function normalizeName(name) {
    const prefixes = ["Taunt: ", "The "];
    for (const prefix of prefixes) {
        if (name.startsWith(prefix)) {
            name = name.substring(prefix.length);
        }
    }
    if (DEBUG) {
        console.log("normalizeName: " + name)
    }
    return name;
}

export function toTradeOfferItem(id) {
    return {
        appid: 440,
        contextid: "2",
        amount: 1,
        assetid: id,
    };
}
