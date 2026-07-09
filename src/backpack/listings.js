import { awaitDocumentReady } from "../common/dom-utils.js";
import { btn_color, btn_text } from "../common/constants.js";
import { createSetting } from "./settings-panel.js";

export async function addOfferButtonsToListings() {
    await awaitDocumentReady();

    const list_elements = document.getElementsByClassName("media-list");

    createSetting()

    let order_elements = [];
    for (const elements of list_elements) {
        const buy_sell_listings = Array.from(elements.getElementsByTagName("li"));
        order_elements = order_elements.concat(buy_sell_listings);
    }

    for (const order of order_elements) {
        const header = document.querySelector(`#${order.id} > div.listing-body > div.listing-header > div.listing-title > h5`);
        if (!header) continue;

        const item_name = header.firstChild.textContent.trim().replace("\n", " ").replace(/ #\d+$/, "");
        const info = document.querySelector(`#${order.id} > div.listing-item > div`);
        const price = info?.getAttribute("data-listing_price");
        if (!price) continue;

        let item_id_text = "";
        if (info.getAttribute("data-listing_intent") === "buy") {
            if (item_name.includes("Unusual") && !item_name.includes("Haunted Metal Scrap") && !item_name.includes("Horseless Headless Horsemann's Headtaker")) {
                continue;
            }
            const attributes = ["data-spell_1", "data-part_name_1", "data-killstreaker", "data-sheen", "data-level", "data-paint_name"];
            let modified = false;
            for (const attr of attributes) {
                if (info.hasAttribute(attr)) {
                    if (attr === "data-paint_name" && item_name.includes(info.getAttribute("data-paint_name"))) continue;
                    modified = true;
                    break;
                }
            }
            if (modified) continue;
        } else {
            item_id_text = `&tscript_id=${info.getAttribute("data-id")}`;
        }

        const btn_selector = `#${order.id} > div.listing-body > div.listing-header > div.listing-buttons > a.btn.btn-bottom.btn-xs.btn-`;
        let send_offer_btn = document.querySelector(btn_selector + "success")
            || document.querySelector(btn_selector + "primary");

        if (!send_offer_btn || send_offer_btn.getAttribute("href").startsWith("steam://")) continue;

        const listingBody = document.querySelector(`#${order.id} > div.listing-body`);
        if (listingBody) {
            listingBody.style.width = "90%";
        }

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = "1";
        quantityInput.min = "1";
        quantityInput.style.borderRadius = ".5em .5em 0 0";
        quantityInput.style.fontSize = "12px";
        quantityInput.style.lineHeight = "18px";
        quantityInput.style.padding = "1px 5px";
        quantityInput.style.width = "40px";
        quantityInput.style.marginBottom = "2px";
        quantityInput.style.border = "2px solid rgba(151, 143, 143, 0.5)";
        quantityInput.style.marginLeft = "5px";
        quantityInput.style.verticalAlign = "middle";

        quantityInput.addEventListener('input', () => {
            const length = quantityInput.value.length;
            quantityInput.style.width = `${35 + 6 * length}px`;
        });

        const btn_clone = send_offer_btn.cloneNode(true);

        const updateHref = () => {
            const count = quantityInput.value;
            const url = new URL(btn_clone.getAttribute("href"));
            const strangeParts = [];

            if (item_id_text !== "") {
                url.searchParams.set('tscript_id', item_id_text.replace(/&tscript_id=/, ""));
            }
            for (let i = 1;info.getAttribute(`data-part_name_${i}`); i++) {
                const partName = info.getAttribute(`data-part_name_${i}`);
                strangeParts.push(partName);
                i++;
            }
            url.searchParams.set('tscript_price', price);
            url.searchParams.set('tscript_name', item_name);
            url.searchParams.set('tscript_count', count);

            if (strangeParts.length > 0) {
                url.searchParams.set('tscript_strangeParts', strangeParts.join(','));
            }

            btn_clone.setAttribute("href", url.toString());
        };

        updateHref();
        quantityInput.addEventListener("input", updateHref);

        btn_clone.style.backgroundColor = btn_color;
        btn_clone.style.borderColor = btn_color;
        if (!btn_text) {
            btn_clone.removeAttribute("title");
            btn_clone.removeAttribute("data-tip");
        } else {
            btn_clone.setAttribute("title", btn_text);
        }

        const listingButtons = document.querySelector(`#${order.id} > div.listing-body > div.listing-header > div.listing-buttons`);
        if (listingButtons) {
            listingButtons.appendChild(btn_clone);
            listingButtons.appendChild(quantityInput);
        }
    }
}
