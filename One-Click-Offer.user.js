// ==UserScript==
// @name         One-Click Offer
// @namespace    https://github.com/BrBriz/One-Click-Offer
// @homepage     https://github.com/BrBriz
// @version      2.0.2
// @description  Adds a button on backpack.tf listings that instantly sends the offer.
// @author       BrBriz
// @updateURL    https://github.com/BrBriz/One-Click-Offer/raw/main/One-Click-Offer.user.js
// @downloadURL  https://github.com/BrBriz/One-Click-Offer/raw/main/One-Click-Offer.user.js
// @match        *://backpack.tf/stats/*
// @match        *://backpack.tf/classifieds*
// @match        *://backpack.tf/u/*
// @match        *://next.backpack.tf/*
// @match        *://steamcommunity.com/tradeoffer/new*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔺</text></svg>
// @run-at       document-start
// ==/UserScript==

const allow_change = true;
const btn_color = "#931F1D";
const next_btn_color = "#eb2335";
const btn_text = "One Click Offer ⇄";
const DEBUG = false;

// Use it if want better offer sender. Fill SteamAPI -> https://steamcommunity.com/dev/apikey
const SteamAPI = "";
const GetTradeOffers = "https://api.steampowered.com/IEconService/GetTradeOffers/v1/";
const GetTradeOffers_params = {
    'key': SteamAPI,
    'get_sent_offers': 1,
    'get_received_offers': 1,
    'get_descriptions': 1,
    'active_only': 1,
    'historical_only': 0
};

let internal_request_sent = false;


const itemsWithPriceHalfScrap= [
    "The Rocket Jumper",
    "The Quick-Fix",
    "The Sticky Jumper",
    "The Air Strike",
    "Ali Baba's Wee Booties",
    "The Ambassador",
    "The Amputator",
    "The Atomizer",
    "The Axtinguisher",
    "The B.A.S.E. Jumper",
    "Baby Face's Blaster",
    "The Back Scatter",
    "The Back Scratcher",
    "The Backburner",
    "The Battalion's Backup",
    "The Bazaar Bargain",
    "The Beggar's Bazooka",
    "The Big Earner",
    "The Black Box",
    "The Blutsauger",
    "Bonk! Atomic Punch",
    "The Bootlegger",
    "The Boston Basher",
    "The Brass Beast",
    "The Buff Banner",
    "The Buffalo Steak Sandvich",
    "The Bushwacka",
    "The Candy Cane",
    "The Chargin' Targe",
    "The Claidheamh Mòr",
    "The Classic",
    "The Cleaner's Carbine",
    "The Cloak and Dagger",
    "The Concheror",
    "Conniver's Kunai",
    "The Cow Mangler 5000",
    "The Cozy Camper",
    "Crit-a-Cola",
    "Crusader's Crossbow",
    "The Dalokohs Bar",
    "Darwin's Danger Shield",
    "The Dead Ringer",
    "The Degreaser",
    "Detonator",
    "The Diamondback",
    "The Direct Hit",
    "The Disciplinary Action",
    "The Dragon's Fury",
    "The Enforcer",
    "The Equalizer",
    "The Escape Plan",
    "The Eureka Effect",
    "The Eviction Notice",
    "The Eyelander",
    "The Family Business",
    "The Fan O'War",
    "The Fists of Steel",
    "The Flare Gun",
    "The Flying Guillotine",
    "The Force-A-Nature",
    "The Fortified Compound",
    "Frontier Justice",
    "The Gas Passer",
    "Gloves of Running Urgently",
    "The Gunboats",
    "The Gunslinger",
    "The Half-Zatoichi",
    "The Hitman's Heatmaker",
    "The Holiday Punch",
    "The Holy Mackere",
    "The Homewrecker",
    "The Hot Hand",
    "The Huntsman",
    "The Huo-Long Heater",
    "The Iron Bomber",
    "The Jag",
    "Jarate",
    "The Killing Gloves of Boxing",
    "The Kritzkrieg",
    "L'Etranger",
    "The Liberty Launcher",
    "The Loch-n-Load",
    "The Lollichop",
    "The Loose Cannon",
    "The Machina",
    "Mad Milk",
    "The Manmelter",
    "The Mantreads",
    "The Market Gardener",
    "Natascha",
    "The Neon Annihilator",
    "Nessie's Nine Iron",
    "The Original",
    "The Overdose",
    "The Pain Train",
    "The Panic Attack",
    "The Persian Persuader",
    "The Phlogistinator",
    "The Pomson 6000",
    "The Postal Pummeler",
    "The Powerjack",
    "Pretty Boy's Pocket Pistol",
    "The Quickiebomb Launcher",
    "The Rainblower",
    "The Razorback",
    "The Red-Tape Recorder",
    "The Rescue Ranger",
    "The Reserve Shooter",
    "The Righteous Bison",
    "The Sandman",
    "The Sandvich",
    "The Scorch Shot",
    "The Scotsman's Skullcutter",
    "The Scottish Handshake",
    "The Scottish Resistance",
    "The Second Banana",
    "The Shahanshah",
    "Sharpened Volcano Fragment",
    "The Short Circuit",
    "The Shortstop",
    "The Soda Popper",
    "The Solemn Vow",
    "The Southern Hospitality",
    "The Splendid Screen",
    "The Spy-cicle",
    "The Sun-on-a-Stick",
    "The Sydney Sleeper",
    "The Thermal Thruster",
    "The Third Degree",
    "The Tide Turner",
    "Tomislav",
    "The Tribalman's Shiv",
    "The Ubersaw",
    "The Ullapool Caber",
    "The Vita-Saw",
    "The Warrior's Spirit",
    "The Widowmaker",
    "The Winger",
    "The Wrangler",
    "The Wrap Assassin",
    "Your Eternal Reward"
];


main();

async function main() {
    "use strict";

    if (location.hostname === "backpack.tf" && location.pathname.match(/\/(stats|classifieds|u)/)) {
        await awaitDocumentReady();
    
        const list_elements = document.getElementsByClassName("media-list");
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
                if (item_id_text !== "") {
                    url.searchParams.set('tscript_id', item_id_text.replace(/&tscript_id=/, ""));
                }
                url.searchParams.set('tscript_price', price);
                url.searchParams.set('tscript_name', item_name);
                url.searchParams.set('tscript_count', count);
            
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
    } else if (location.hostname === "next.backpack.tf") {
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
                const price = listings_data.find(l => l.id === listing_id).value.long;

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
                const btn_clone = send_offer_btn.cloneNode(true);
                const url = encodeURI(href + item_id_text + "&tscript_price=" + price + "&tscript_name=" + item_name);
                btn_clone.setAttribute("href", url);
                btn_clone.id = "instant-button-" + i;
                const icon = btn_clone.children[0];
                icon.style.color = next_btn_color;

                const existing_button = document.getElementById(btn_clone.id); //remove if another button exists already
                if (existing_button) existing_button.remove();

                btn_box.append(btn_clone);
            }
        }
    } else if (location.hostname === "steamcommunity.com" && location.pathname.startsWith("/tradeoffer/new")) {
        const params = new URLSearchParams(location.search);
        if (!params.has("tscript_price")) return;
    
        interceptInventoryRequest();
        await awaitDocumentReady();
    
        let items_to_give = [];
        let items_to_receive = [];
    
        let [our_inventory, their_inventory] = await getInventories();
        window.our_inv = our_inventory;
        window.their_inv = their_inventory;
    
        const validTradeOfferStates = [2, 4, 9];
        const taked_assetIds = [];
 
        if (SteamAPI !== "") {
            try {
                const response = await fetch(GetTradeOffers + '?' + new URLSearchParams(GetTradeOffers_params));
                console.log('[SteamAPI/GetTradeOffers]: Response Status:', response.status);
    
                if (!response.ok) throw new Error(`[SteamAPI/GetTradeOffers]: Status ${response.status}`);
    
                const data = await response.json();
                data.response.trade_offers_sent?.forEach(offer => {
                    if (validTradeOfferStates.includes(offer.trade_offer_state)) {
                        offer.items_to_give.forEach(item => taked_assetIds.push(item.assetid));
                    }
                });
                console.log("[SteamAPI/GetTradeOffers]: taked_assetIds:", taked_assetIds);
            } catch (error) {
                console.error('[SteamAPI/GetTradeOffers]: Error:', error);
            }
        }
    
        let our_filtered_inventory = our_inventory.filter(item => !taked_assetIds.includes(item.id));
    
        if (!params.has("tscript_id")) {
            const needed_item_name = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
            const requested_count = parseInt(params.get("tscript_count") || "1", 10);
            const currency_string = params.get("tscript_price");
            console.log("[Buy Order]: needed_item_name:", needed_item_name);

            const needed_items = [];
            
            if (document.referrer === "https://next.backpack.tf/") {
                our_filtered_inventory = our_filtered_inventory.map(item => ({
                    ...item,
                    name: normalizeName(item.name)
                }));
            }

            console.log(our_filtered_inventory);

            const items_by_name = our_filtered_inventory.filter(item => item.name === needed_item_name);
            console.log(items_by_name);
            for (let i = 0; i < requested_count; i++) {
                if (i < items_by_name.length) {
                    needed_items.push(items_by_name[i]);
                }
            }

            if (!needed_items) return throwError("[Buy Order]: Could not find item in your inventory.");
            
            let actual_count = needed_items.length;
            console.log(`[Buy Order]: Requested ${requested_count}, Found ${actual_count}`);

            while (actual_count >= 1) {
                console.log(`[Buy Order]: Trying to buy ${actual_count} items`);
                const temp_items_to_give = [];
                for (const item of needed_items) {
                    temp_items_to_give.push(toTradeOfferItem(item.id));
                }

                const currencies = toCurrencyTypes(currency_string, actual_count);
                const [their_currency, change] = pickCurrency(their_inventory, ...currencies);

                if (change.find(c => c !== 0)) {
                    const [our_currency, change2] = pickCurrency(our_filtered_inventory, 0, ...change);
                    if (change2.find(c => c !== 0)) {
                        actual_count--;
                        // Remove one item to try new balance
                        for (let i = 0; i < needed_items.length; i++) {
                            needed_items.splice(i, 1);
                            break; 
                        }
                        continue;
                    }
                    for (const c of our_currency) temp_items_to_give.push(toTradeOfferItem(c.id));
                }
                console.warn(`[Buy Order]: Actual count balanced items: ${actual_count}`);
                items_to_give = temp_items_to_give;
                for (const c of their_currency) items_to_receive.push(toTradeOfferItem(c.id));
                break;
            }

            if (actual_count === 0) return throwError("[Buy Order]: Could not balance currencies.");

        } else {
            const item_id = params.get("tscript_id");
            const item_name = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
            const currency_string = params.get("tscript_price");
            const requested_count = parseInt(params.get("tscript_count") || "1", 10);
    
            const needed_items = [];

            const item_by_id = their_inventory.find(item => item.id === item_id);
            if (item_by_id) needed_items.push(item_by_id);

            console.log("[Sell Order]: ", item_name, their_inventory.filter(item => item.name));
            const items_by_name = their_inventory.filter(item => item.name === item_name && item.id !== item_id);
            for (let i = 0; i < requested_count - 1; i++) {
                if (i < items_by_name.length) {
                    needed_items.push(items_by_name[i]);
                }
            }

            if (!needed_items) return throwError("[Sell Order]: Item(-s) has already been sold.");

            let actual_count = needed_items.length;
            console.log(`[Sell Order]: Requested ${requested_count}, Found ${actual_count}`);

            while (actual_count >= 1) {
                console.log(`[Sell Order]: Trying to buy ${actual_count} items`);
            
                const temp_items_to_receive = [];
                for (const item of needed_items) {
                    temp_items_to_receive.push(toTradeOfferItem(item.id));
                }
                
                console.log("[Sell Order]: Items to receive: ", temp_items_to_receive);

                const total_price = toCurrencyTypes(decodeURIComponent(decodeURIComponent(currency_string)), actual_count);
                console.log("[Sell Order]: Total price: ", total_price);

                console.log(`[Sell Order]: Total price for ${actual_count} items: ${total_price}`);
            
                const [our_currency, change] = pickCurrency(our_filtered_inventory, ...total_price);
                
                if (change.find(c => c !== 0)) {
                    const [their_currency, change2] = pickCurrency(their_inventory, 0, ...change);
                    console.log("[Post_pickCurrency]: change 2 " + change2);
                    if (change2.find(c => c !== 0)) {
                        actual_count--;
                        // Remove one item to try new balance
                        for (let i = 0; i < needed_items.length; i++) {
                            if (needed_items[i].id !== item_id) {
                                needed_items.splice(i, 1);
                                break; 
                            }
                        }
                        continue;
                    }
                    for (let c of their_currency) temp_items_to_receive.push(toTradeOfferItem(c.id));
                }
                console.warn(`[Sell Order]: Actual count balanced items: ${actual_count}`);
                items_to_receive = temp_items_to_receive;

                for (const currency_item of our_currency) {
                    items_to_give.push(toTradeOfferItem(currency_item.id));
                }
                break;
            }

            if (actual_count === 0) return throwError("[Sell Order]: Could not balance currencies.");

        }
    
        const offer_id = await sendOffer(items_to_give, items_to_receive);
        if (offer_id) console.log("[One-Click-Offer/Final]: Success");
        if (offer_id && !DEBUG) window.close();
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
     *
     *
     * @typedef {number} g_ulTradePartnerSteamID
     */

function getInventories() {
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

    function getSingleInventory(User) {
        return new Promise(async res => {
            let inv = User.rgContexts["440"]["2"].inventory?.rgInventory;
            if (!inv || User.cLoadsInFlight !== 0) {
                if (User.cLoadsInFlight === 0) User.loadInventory();
                inv = await waitForInventoryLoad();
            } else inv = Object.values(inv);
            res(parseInventory(inv));
        });

        function waitForInventoryLoad() {
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
                const on_load = User.OnLoadInventoryComplete;
                User.OnLoadInventoryComplete = function (data, appid, contextid) {
                    if (appid === 440 && contextid === 2) {
                        done = true;
                        res(Object.values(data.responseJSON.rgInventory));
                    }

                    User.OnLoadInventoryComplete = on_load;
                    return on_load.apply(this, arguments);
                };
                const on_fail = User.OnInventoryLoadFailed;
                User.OnInventoryLoadFailed = async function (data, appid, contextid) {
                    if (appid === 440 && contextid === 2) {
                        console.log("[waitForInventoryLoad]: load failed, requesting manually");
                        const inv = await getInventory(User.strSteamId);
                        done = true;
                        res(inv);
                    }

                    User.OnInventoryLoadFailed = on_fail;
                    return on_fail.apply(this, arguments);
                };
            });
        }
    }

    function parseInventory(items) {
        return items.map(item => {
            return {
                id: item.id,
                name: nameFromItem(item),
            };
        });
    }
}

    /**
     * @property {Object} more_items
     */
    async function getInventory(steam_id) {
    let body;
    try {
        const response = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=2000&l=english");

        if (!response.ok) throwError("[getInventory]: response status error: " + response.status);
        body = await response.json();
        if (body.more_items) {
            const more_response = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=1000&more_start=1000&l=english");

            if (!more_response.ok) throwError("[getInventory]: more_response status error: " + more_response.status);
            const more_body = await more_response.json();

            body.assets = body.assets.concat(more_body.assets);
            body.descriptions = body.descriptions.concat(more_body.descriptions);
        }
    } catch (err) {
        return throwError("[getInventory]: Could not obtain inventory data: " + err);
    }

    const quickDescriptionLookup = {};
    const inv = [];

    for (let i = 0; i < body.assets.length; i++) {
        const description = getDescription(body.descriptions, body.assets[i].classid, body.assets[i].instanceid);
        description.id = body.assets[i].assetid;
        description.name = nameFromItem(description);
        inv.push(JSON.parse(JSON.stringify(description)));
    }

    return inv;

    /**
     * @credit node-steamcommunity by DoctorMcKay
     */
    function getDescription(descriptions, classID, instanceID) {
        const key = classID + "_" + (instanceID || "0");

        if (quickDescriptionLookup[key]) {
            return quickDescriptionLookup[key];
        }

        for (let i = 0; i < descriptions.length; i++) {
            quickDescriptionLookup[descriptions[i].classid + "_" + (descriptions[i].instanceid || "0")] = descriptions[i];
        }

        return quickDescriptionLookup[key];
    }
}

    /**
     * @typedef {number} g_sessionID
     * @typedef {Object} response_body
     * @property {String} strError
     * @property {number} tradeofferid
     */
    async function sendOffer(items_to_give, items_to_receive) {
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
     * @typedef {Object} item
     * @property {String} market_hash_name
     * @property {Object} tags
     *
     * @typedef {Object} tag
     * @property {String} category
     * @property {String} internal_name
     */
    function nameFromItem(item) {
    let name = item.market_hash_name;

    if (item.descriptions !== undefined) {
        for (let i = 0; i < item.descriptions.length; i++) {
            const desc = item.descriptions[i];

            if (desc.value.includes("''")) continue;
            else if (desc.value === "( Not Usable in Crafting )") name = "Non-Craftable " + name;
            else if (desc.value.startsWith("★ Unusual Effect: ")) {
                for (let tag of item.tags) {
                    if (tag.category === "Type" && tag.internal_name === "Supply Crate") {} //crates have normal unusual tag
                }
                const effect = desc.value.substring("★ Unusual Effect: ".length);
                name = name.replace("Unusual", effect);
            }
        }
    }

    name = name.replace("\n", " ");
    name = name.replace("Series #", "#"); //case 'series' keyword not included in bp names
    name = name.replace(/ #\d+$/, ""); //remove case number

    return name;
}
/**
 * Normalize to remove any of the following prefixes: "Taunt: ", "The"
 * @param {String} name
 * @returns
 */
function normalizeName(name) {
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

function toTradeOfferItem(id) {
    return {
        appid: 440,
        contextid: "2",
        amount: 1,
        assetid: id,
    };
}
function toCurrencyTypes(currency_string, count) {
    const match = currency_string.match(/^(\d+ keys?,? ?)?(\d+(?:\.\d+)? ref)?$/);
    if (!match) return throwError("[toCurrencyTypes]: Could not parse currency " + currency_string);

    let keys = 0;
    let metal = 0;
    if (match[1]) {
        const key_length = match[1].indexOf(" ");
        keys = Number(match[1].slice(0, key_length));
    }
    if (match[2]) {
        const ref_length = match[2].indexOf(" ");
        metal = Number(match[2].slice(0, ref_length));
    }
    metal = metal * count
    const ref = Math.floor(metal);
    const small_metal = Math.round((metal % 1) * 100);
    console.log("[toCurrencyTypes]: small_metal: ", small_metal);
    const rec = Math.floor(small_metal / 33);
    const scrap = Math.floor(small_metal / 11) % 3;
    console.log("[toCurrencyTypes]: Scrap: ", scrap);
    const small_small_metal = Math.round(((small_metal / 11) % 1) * 100);
    console.log("[toCurrencyTypes]: small_small_metal: ", small_small_metal);
    let half_scrap;
    if (small_small_metal >= 55 && small_small_metal < 100) {
        half_scrap = 2;
    } else if (small_small_metal >= 9 && small_small_metal < 55) {
        half_scrap = 1;
    } else {
        half_scrap = 0;
    }
    console.log("[toCurrencyTypes]: half_scrap: ", half_scrap);
    keys = keys * count;
    return [keys, ref, rec, scrap, half_scrap];
}

function pickCurrency(inventory, keys, ref, rec, scrap, half_scrap) {
    const inv_keys = inventory.filter(item => item.name === "Mann Co. Supply Crate Key");
    const inv_ref = inventory.filter(item => item.name === "Refined Metal");
    const inv_rec = inventory.filter(item => item.name === "Reclaimed Metal");
    const inv_scrap = inventory.filter(item => item.name === "Scrap Metal");

    if (DEBUG) {
        const logData = inventory.map(item => {
            const found = itemsWithPriceHalfScrap.includes(item.name);
            return {
                Name: item.name,
                Found: found ? '✅' : '❌'
            };
        });
        console.log("[pickCurrency]: itemsWithPriceHalfScrap:")
        console.log(logData);
    };

    const inv_half_scrap = inventory.filter(item => itemsWithPriceHalfScrap.includes(item.name));
    console.log("[pickCurrency]: Inventory:")
    console.log(inventory)
    console.log("[pickCurrency]: Inv_half_scrap:")
    console.log(inv_half_scrap)
    console.log("[pickCurrency]: Half_scrap in the start: " + half_scrap);
    if (inv_keys.length < keys) return throwError("[pickCurrency]: Insufficient Keys");
    if (allow_change && inv_ref.length + inv_rec.length / 3 + inv_scrap.length / 9 + inv_half_scrap.length / 20 < ref + rec / 3 + scrap / 9 + half_scrap / 20) return throwError("[pickCurrency]: Insufficient Metal");
    if (!allow_change && (inv_ref.length < ref || inv_rec.length < rec || inv_scrap.length < scrap || inv_half_scrap.length < half_scrap)) return throwError("[pickCurrency]: Insufficient Metal");

    let leftover_ref = inv_ref.length - ref;
    let leftover_rec = inv_rec.length - rec;
    let leftover_scrap = inv_scrap.length - scrap;
    let leftover_half_scrap = inv_half_scrap.length - half_scrap;
    let change = { ref: 0, rec: 0, scrap: 0, half_scrap: 0 };
    console.log("[pickCurrency]: leftover_ref: " + leftover_ref);
    console.log("[pickCurrency]: leftover_rec: " + leftover_rec);
    console.log("[pickCurrency]: leftover_scrap: " + leftover_scrap);
    console.log("[pickCurrency]: leftover_half_scrap: " + leftover_half_scrap);
    console.log("[pickCurrency]: scrap " + scrap)
    //use rec if not enough scrap
    if (leftover_scrap < 0) {
        leftover_scrap = -leftover_scrap;
        rec += Math.ceil(leftover_scrap / 3);
        leftover_rec -= Math.ceil(leftover_scrap / 3);
        change.scrap += 3 - (leftover_scrap % 3);
        change.scrap = change.scrap % 3;
        scrap -= leftover_scrap;
        leftover_scrap = 0;
    }

    //use ref if not enough rec
    if (leftover_rec < 0) {
        leftover_rec = -leftover_rec;
        ref += Math.ceil(leftover_rec / 3);
        leftover_ref -= Math.ceil(leftover_rec / 3);
        change.rec += 3 - (leftover_rec % 3);
        change.rec = change.rec % 3;
        rec -= leftover_rec;
        leftover_rec = 0;
    }

    //use rec if not enough ref
    if (leftover_ref < 0) {
        ref -= -leftover_ref;
        rec += -leftover_ref * 3;
        leftover_rec -= -leftover_ref * 3;
        leftover_ref = 0;
    }

    //use scrap if not enough rec
    if (leftover_rec < 0) {

        rec -= -leftover_rec;
        scrap += -leftover_rec * 3;
        leftover_scrap -= -leftover_rec * 3;
        leftover_rec = 0;
    }

    //use half_scrap if not enough scrap
    if (leftover_scrap < 0) {
        if (leftover_half_scrap < -leftover_scrap * 2) return throwError("[pickCurrency]: Insufficient Metal");

        scrap -= leftover_scrap;
        half_scrap += -leftover_scrap * 2;
        leftover_half_scrap -= -leftover_scrap * 2;
        leftover_scrap = 0;
    }

    //calculate change needed from other inventory
    if (ref !== 0 && change.ref !== 0) {
        let reduce = Math.min(ref, change.ref);
        ref -= reduce;
        change.ref -= reduce;
    }
    if (rec !== 0 && change.rec !== 0) {
        let reduce = Math.min(rec, change.rec);
        rec -= reduce;
        change.rec -= reduce;
    }
    console.log("[pickCurrency]: before scrap " + scrap + " change.scrap " + change.scrap);
    if (scrap !== 0 && change.scrap !== 0) {
        let reduce = Math.min(scrap, change.scrap);
        scrap -= reduce;
        change.scrap -= reduce;
    }
    console.log("[pickCurrency]: after scrap " + scrap + " change.scrap " + change.scrap);

    if (half_scrap !== 0 && change.half_scrap !== 0) {
        let reduce = Math.min(half_scrap, change.half_scrap);
        half_scrap -= reduce;
        change.half_scrap -= reduce;
    }
    console.log("[pickCurrency]: change ref after balance: " + change.ref);
    console.log("[pickCurrency]: change rec after balance: " + change.rec);
    console.log("[pickCurrency]: change scrap after balance: " + change.scrap);
    console.log("[pickCurrency]: change half_scrap after balance: " + change.half_scrap);
    //start taking items from random position; possible ranges are between 0 and length-amount
    const key_start = Math.floor(Math.random() * (inv_keys.length - keys + 1));
    const ref_start = Math.floor(Math.random() * (inv_ref.length - ref + 1));
    const rec_start = Math.floor(Math.random() * (inv_rec.length - rec + 1));
    const scrap_start = Math.floor(Math.random() * (inv_scrap.length - scrap + 1));
    const half_scrap_start = Math.floor(Math.random() * (inv_half_scrap.length - half_scrap + 1));

    //actually take the items
    const take_keys = inv_keys.slice(key_start, key_start + keys);
    const take_ref = inv_ref.slice(ref_start, ref_start + ref);
    const take_rec = inv_rec.slice(rec_start, rec_start + rec);
    const take_scrap = inv_scrap.slice(scrap_start, scrap_start + scrap);
    const take_half_scrap = inv_half_scrap.slice(half_scrap_start, half_scrap_start + half_scrap);
    console.log("[pickCurrency]: take_keys: " + take_keys.length);
    console.log("[pickCurrency]: take_ref: " + take_ref.length);
    console.log("[pickCurrency]: take_rec: " + take_rec.length);
    console.log("[pickCurrency]: take_scrap: " + take_scrap.length);
    console.log("[pickCurrency]: take_half_scrap: " + take_half_scrap.length);
    let items = take_keys;
    items = items.concat(take_ref);
    items = items.concat(take_rec);
    items = items.concat(take_scrap);
    items = items.concat(take_half_scrap);


    //checks if anything went wrong. This should never happen but let's check anyway.
    if (
        keys < 0 ||
        ref < 0 ||
        rec < 0 ||
        scrap < 0 ||
        half_scrap < 0 ||
        change.ref < 0 ||
        change.rec < 0 ||
        change.scrap < 0 ||
        change.half_scrap < 0 ||
        key_start < 0 ||
        ref_start < 0 ||
        rec_start < 0 ||
        scrap_start < 0 ||
        half_scrap_start < 0 ||
        keys === undefined ||
        ref === undefined ||
        rec === undefined ||
        scrap === undefined ||
        half_scrap === undefined ||
        keys > inv_keys.length ||
        ref > inv_ref.length ||
        rec > inv_rec.length ||
        scrap > inv_scrap.length ||
        half_scrap > inv_half_scrap.length ||
        items.length < keys ||
        take_keys.length !== keys ||
        take_ref.length !== ref ||
        take_rec.length !== rec ||
        take_scrap.length !== scrap ||
        take_half_scrap.length !== half_scrap ||
        Math.round((ref + rec / 3 + scrap / 9 + half_scrap / 20) * 100) !== Math.round((take_ref.length + take_rec.length / 3 + take_scrap.length / 9 + take_half_scrap.length / 20) * 100)
    ) {
        console.log("[pickCurrency]: Something went wrong balancing currencies:");
        console.log(
            [
                "keys: " + keys + " " + (keys < 0),
                "ref: " + ref + " " + (ref < 0),
                "rec: " + rec + " " + (rec < 0),
                "scrap: " + scrap + " " + (scrap < 0),
                "half_scrap: " + half_scrap + " " + (half_scrap < 0),
                "change.ref: " + change.ref + " " + (change.ref < 0),
                "change.rec: " + change.rec + " " + (change.rec < 0),
                "change.scrap: " + change.scrap + " " + (change.scrap < 0),
                "change.half_scrap: " + change.half_scrap + " " + (change.half_scrap < 0),
                "key_start: " + key_start + " " + (key_start < 0),
                "ref_start: " + ref_start + " " + (ref_start < 0),
                "rec_start: " + rec_start + " " + (rec_start < 0),
                "scrap_start: " + scrap_start + " " + (scrap_start < 0),
                "half_scrap_start: " + half_scrap_start + " " + (half_scrap_start < 0),
                "keys is undefined?: " + (keys === undefined),
                "ref is undefined?: " + (ref === undefined),
                "rec is undefined?: " + (rec === undefined),
                "scrap is undefined?: " + (scrap === undefined),
                "half_scrap is undefined?: " + (half_scrap === undefined),
                "inv_keys.length: " + inv_keys.length + " " + (keys > inv_keys.length),
                "inv_ref.length: " + inv_ref.length + " " + (ref > inv_ref.length),
                "inv_rec.length: " + inv_rec.length + " " + (rec > inv_rec.length),
                "inv_scrap.length: " + inv_scrap.length + " " + (scrap > inv_scrap.length),
                "inv_half_scrap.length: " + inv_half_scrap.length + " " + (half_scrap > inv_half_scrap.length),
                "items.length: " + items + " " + (items.length < keys),
                "take_keys: " + take_keys + " " + (take_keys.length !== keys),
                "take_ref: " + take_ref + " " + (take_ref.length !== ref),
                "take_rec: " + take_rec + " " + (take_rec.length !== rec),
                "take_scrap: " + take_scrap + " " + (take_scrap.length !== scrap),
                "take_half_scrap: " + take_half_scrap + " " + (take_half_scrap.length !== half_scrap),
                JSON.stringify(items, undefined, 4),
            ].join("\n")
        );
        return [[-1, -1, -1, -1], [-1, -1, -1, -1]];
    }

    return [items, [change.ref, change.rec, change.scrap, change.half_scrap]];
}

/**
 * Sets internal_request_sent to true once a request to the internal inventory api has been made.
 */
function interceptInventoryRequest() {
    let old_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.endsWith("/json/440/2/?trading=1")) {
            internal_request_sent = true;
            XMLHttpRequest.prototype.open = old_open;
        }

        return old_open.apply(this, arguments);
    };
}

function awaitDocumentReady() {
    return new Promise(async res => {
        if (document.readyState !== "loading") res();
        else document.addEventListener("DOMContentLoaded", res);
    });
}

function waitFor(seconds) {
    return new Promise(res => setTimeout(res, seconds * 1000));
}

function throwError(err) {
    const params = new URLSearchParams(location.search);
    const buy_sell = params.has("for_item") ? "Buy" : "Sell";
    const item = params.get("tscript_name");
    const pre_string = "Unable to " + buy_sell + " " + item + ": ";

    window.alert(pre_string + err);
    throw err;
}}
