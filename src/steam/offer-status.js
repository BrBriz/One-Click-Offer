export function get_offer_status() {
    return document.documentElement.getAttribute("data-one-click-offer-status");
}

export function set_offer_status(status, errorId, message) {
    const root = document.documentElement;
    root.setAttribute("data-one-click-offer-status", status);
    if (errorId) {
        root.setAttribute("data-one-click-offer-error-id", errorId);
        root.setAttribute("data-one-click-offer-error-message", message);
    } else {
        root.removeAttribute("data-one-click-offer-error-id");
        root.removeAttribute("data-one-click-offer-error-message");
    }
}

export function set_offer_count(count) {
    document.documentElement.setAttribute("data-one-click-offer-count", count);
}
