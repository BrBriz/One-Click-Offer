import { awaitDocumentReady, waitFor } from "../common/dom-utils.js";
import { next_btn_color, DEBUG } from "../common/constants.js";


export async function run() {
    //next does not refresh page between pages, so script needs to run on any next page
    let listings_data = undefined;
    interceptSearchRequests();
    if (location.pathname.startsWith("/stats")) { //Ignore errors, I don't know who this made
        await awaitDocumentReady();
        while (!__NUXT__?.fetch?.["data-v-58d43071:0"]?.listings && !__NUXT__?.fetch?.["data-v-39eb0133:0"]?.listings) {
            await waitFor(0.1); //wait for listings request ready
        }
        const listings = __NUXT__.fetch["data-v-58d43071:0"]?.listings || __NUXT__.fetch["data-v-39eb0133:0"].listings;
        listings_data = listings.buy.items.concat(listings.sell.items);
        addSenderButtons();
    }

    /**
     * Intercepts the classifieds search results and adds buttons once data is ready
     * @typedef {Object} listings
     * @property {Object} buy
     * @property {Object} sell
     */
    function interceptSearchRequests() {
        let old_open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            if (url.match(/https:\/\/next\.backpack\.tf\/cors\/_classifieds\/(search|item)/)) {
                const this_ref = this;
                (async () => {
                    while (true) {
                        await waitFor(0.1);
                        if (this_ref.readyState === 4) {
                            const listings = JSON.parse(this_ref.responseText);
                            listings_data = listings.buy.items.concat(listings.sell.items);
                            await awaitDocumentReady();
                            await waitFor(0.2);
                            console.log("go!");
                            addSenderButtons();
                            break;
                        }
                    }
                })();
            }

            return old_open.apply(this, arguments);
        };
    }

    function addSenderButtons() {
        //add new button with item and price info in url query (for next.backpack.tf)
        const listings = Array.from(document.getElementsByClassName("listing"));

        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];
            const header = listing.children[0].children[1].children[0]; //everything's a div, nothing has an id why ;(

            //get info
            let item_name = header.children[0].innerText
                .trim()
                .replace("\n", " ")
                .replace(/ #\d+$/, ""); //\n and # dont work in urls

            // Next removes Non-Craftable from item names, check from item image
            if (listing.children[0].children[0].className.includes("uncraftable")) {
                item_name = "Non-Craftable " + item_name;
            }

            const info = listing.children[0].children[0];
            const listing_id = info.getAttribute("href").replace("/classifieds/", "");

            const current_listing = listings_data.find(l => l.id === listing_id);
            const price = current_listing.value.long;
            const item_data = current_listing.item;
            DEBUG && console.log(JSON.stringify(item_data, null, 2)); 

            const strangeParts = [];

            if (item_data && item_data.strangeParts) {
                item_data.strangeParts.forEach(part => {
                    if (part.killEater && part.killEater.item && part.killEater.name) {
                        strangeParts.push(part.killEater.name); 
                    } 
                });
            }

            //ignore buy orders on specific items
            let item_id_text = "";
            if (header.getElementsByClassName("text-buy").length !== 0) {
                if (
                    item_name.includes("Unusual") &&
                    !item_name.includes("Haunted Metal Scrap") &&
                    !item_name.includes("Horseless Headless Horsemann's Headtaker")
                ) {
                    continue; //ignore generic unusual buy orders
                }

                const modified_traits = ["fa-wrench", "fa-fill-drip", "-spell", "fa-shoe-prints", "fa-flash-round-potion"];
                const special_traits = Array.from(info.children[0].children).map(e => e.getAttribute("class"));
                let modified = false;
                for (let trait of special_traits) {
                    const found_trait = modified_traits.find(t => trait.includes(t));
                    if (found_trait) {
                        if (found_trait === "fa-fill-drip" && info.getAttribute("style").includes("Paint_Can")) continue; //don't ignore paint cans (they're always painted)
                        modified = true;
                        break;
                    }
                }

                if (modified) continue; //ignore modified buy orders
            } else {
                const id = /\/classifieds\/440_(\d+)/.exec(info.getAttribute("href"));
                item_id_text = "&tscript_id=" + id[1];
            }

            const btn_box = header.getElementsByClassName("listing__details__actions")[0];
            const send_offer_btn = btn_box.getElementsByClassName("listing__details__actions__action")[0];
            const href = send_offer_btn.getAttribute("href");
            if (!href || href.startsWith("steam://") || href.startsWith("https://marketplace.tf")) continue;

            //add new button

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

            btn_clone.id = "instant-button-" + i;
            const icon = btn_clone.children[0];
            icon.style.color = next_btn_color;

            const updateHref = () => {
                const count = quantityInput.value;
                const url = new URL(btn_clone.getAttribute("href"));
                if (item_id_text !== "") {
                    url.searchParams.set('tscript_id', item_id_text.replace(/&tscript_id=/, ""));
                }
                url.searchParams.set('tscript_price', price);
                url.searchParams.set('tscript_name', item_name);
                url.searchParams.set('tscript_count', count);

                if (strangeParts.length > 0) {
                    url.searchParams.set('tscript_strangeParts', strangeParts.join(", ")); 
                }

                btn_clone.setAttribute("href", url.toString());
            };

            updateHref();
            quantityInput.addEventListener("input", updateHref);

            const existing_button = document.getElementById(btn_clone.id); //remove if another button exists already
            if (existing_button) existing_button.remove();

            btn_box.append(btn_clone);
            btn_box.append(quantityInput);
        }
    }
}
