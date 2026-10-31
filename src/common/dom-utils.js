import { OfferStatus } from "./enums.js";
import { get_offer_status, set_offer_status } from "../steam/offer-status.js";

export function awaitDocumentReady() {
    return new Promise(async res => {
        if (document.readyState !== "loading") res();
        else document.addEventListener("DOMContentLoaded", res);
    });
}

export function waitFor(seconds) {
    return new Promise(res => setTimeout(res, seconds * 1000));
}

export function throwError(code, err) {
    if (get_offer_status() === OfferStatus.ERROR) throw err;
    set_offer_status(OfferStatus.ERROR, code, String(err));
    const params = new URLSearchParams(location.search);
    const buy_sell = params.has("for_item") ? "Buy" : "Sell";
    const item = params.get("tscript_name");
    const pre_string = "Unable to " + buy_sell + " " + item + ": ";

    console.error(pre_string + err);
    window.alert(pre_string + err);
    throw err;
}
