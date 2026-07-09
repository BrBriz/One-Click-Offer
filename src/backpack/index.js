import { addOfferButtonsToListings } from "./listings.js";
import { initFastSell } from "./fast-sell.js";

export async function run() {
    if (location.pathname.match(/\/(stats|classifieds|u)/)) {
        await addOfferButtonsToListings();
    } else {
        await initFastSell();
    }
}
