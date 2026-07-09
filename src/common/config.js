// Mutable runtime configuration backed by Tampermonkey/Greasemonkey storage (GM_getValue/GM_setValue).
// Kept as a single object (rather than separate `let` exports) so that every module which imports
// `config` observes updates made by any other module (e.g. after a user fills in a prompt()).
export const config = {
    SteamAPI: GM_getValue("SteamAPI", ""),
    BackpackTF_API: GM_getValue("BackpackTF_API", ""),
    BackpackTF_TOKEN: GM_getValue("BackpackTF_TOKEN", "")
};

export const GetTradeOffers = "https://api.steampowered.com/IEconService/GetTradeOffers/v1/";

export const GetTradeOffers_params = {
    'key': config.SteamAPI,
    'get_sent_offers': 1,
    'get_received_offers': 1,
    'get_descriptions': 1,
    'active_only': 1,
    'historical_only': 0
};

export let internal_request_sent = false;

export function setInternalRequestSent(value) {
    internal_request_sent = value;
}
