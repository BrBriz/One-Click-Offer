export const OfferStatus = Object.freeze({
    STARTED: "started",
    LOADING_INVENTORIES: "loading_inventories",
    BUILDING_OFFER: "building_offer",
    SENDING: "sending",
    SENT: "sent",
    ERROR: "error",
});

export const OfferError = Object.freeze({
    INVALID_PRICE: "invalid_price",
    INSUFFICIENT_KEYS: "insufficient_keys",
    INSUFFICIENT_METAL: "insufficient_metal",
    ITEM_NOT_FOUND: "item_not_found",
    ITEM_SOLD: "item_sold",
    CANNOT_BALANCE: "cannot_balance",
    INVENTORY_TIMEOUT: "inventory_timeout",
    INVENTORY_LOAD_FAILED: "inventory_load_failed",
    SEND_FAILED: "send_failed",
});
