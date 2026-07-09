import { awaitDocumentReady } from "../common/dom-utils.js";
import { config } from "../common/config.js";
import { createSetting } from "./settings-panel.js";

export async function initFastSell() {
    await awaitDocumentReady();
    createSetting()
    const panels = document.getElementsByClassName("panel-extras");

    for (const panel of panels) {
        const refreshButton = panel.querySelector('button#refresh-inventory.btn.btn-panel');

        if (refreshButton) {
            const FastSell = document.createElement("button");
            FastSell.className = "btn btn-panel";
            FastSell.title = "Quickly list selected item for sale";
            const eraserIcon = document.createElement('i');
            eraserIcon.className = 'fa fa-sw fa-flash';
            eraserIcon.style.marginRight = '4px';
            FastSell.appendChild(eraserIcon);
            FastSell.appendChild(document.createTextNode('Fast Sell'));

            FastSell.addEventListener("click", () => {
                const panel = document.getElementById("fast-sell-panel");
                if (panel) {
                    // panel.remove();
                    return;
                }

                // Init

                let selected_item = false;

                // Get all selected items

                const backpack = document.querySelector("#backpack")
                const items = backpack.querySelectorAll("li");
                for (const item of items) {
                    const DOMTokenList = item.classList
                    const isNoPopover = DOMTokenList.contains("no-popover");
                    const isSelected = DOMTokenList.contains("unselected")
                    if (isNoPopover && !isSelected) {
                        // console.log(item);
                        if (item.getAttribute('data-tradable') === 0) {
                            continue;
                        }
                        selected_item = item.cloneNode(true);
                        break;
                    };
                };
                if (!selected_item) {
                    return;
                }

                const panel_UI = createModalPanel({
                    id: "fast-sell-panel",
                    width: "500px",
                    height: "350px",
                    title: "Fast Sell",
                    onClose: () => {
                        const panel = document.getElementById("fast-sell-panel");
                        if (panel) {
                            panel.style.transition = 'opacity 0.3s ease, top 0.5s ease';
                            panel.style.opacity = '0';
                            panel.style.top = '60%';
                            setTimeout(() => {
                                if (panel.parentNode) panel.parentNode.removeChild(panel);
                            }, 350);
                        }
                    }
                });

                function createModalPanel({id, width, height, title, onClose}) {
                    const panel = document.createElement('div');
                    panel.id = id;
                    panel.style.position = 'fixed';
                    panel.style.top = '0px';
                    panel.style.left = '50%';
                    panel.style.transform = 'translateX(-50%)';
                    panel.style.background = '#fff';
                    panel.style.padding = '0';
                    panel.style.zIndex = 9999;
                    panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    panel.style.borderRadius = '8px';
                    panel.style.width = width;
                    panel.style.height = height;
                    panel.style.transition = 'top 0.5s ease';

                    // Header
                    const header = document.createElement('div');
                    header.style.position = 'relative';
                    header.style.width = '100%';
                    header.style.height = '48px';
                    header.style.background = 'linear-gradient(to bottom, #2b3b47, #12181d)';
                    header.style.display = 'flex';
                    header.style.alignItems = 'center';
                    header.style.justifyContent = 'space-between';
                    header.style.padding = '0 16px 0 12px';
                    header.style.borderTopLeftRadius = '8px';
                    header.style.borderTopRightRadius = '8px';
                    header.style.boxSizing = 'border-box';
                    header.style.zIndex = '2';

                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = title;
                    titleSpan.style.color = '#ffffff';
                    titleSpan.style.fontSize = '17px';
                    titleSpan.style.userSelect = 'none';
                    titleSpan.style.fontFamily = 'inherit';

                    const exitBtn = document.createElement('button');
                    exitBtn.textContent = '⨯';
                    exitBtn.style.fontWeight = 'bold';
                    exitBtn.style.fontSize = '20px';
                    exitBtn.style.lineHeight = '1';
                    exitBtn.style.position = 'static';
                    exitBtn.style.marginLeft = '16px';
                    exitBtn.style.color = '#838383';
                    exitBtn.style.border = 'none';
                    exitBtn.style.backgroundColor = 'transparent';
                    exitBtn.style.cursor = 'pointer';
                    exitBtn.style.zIndex = '10';
                    exitBtn.onclick = onClose;

                    const main_div = document.createElement('div');
                    main_div.style.position = 'relative';
                    main_div.style.width = '100%';
                    main_div.style.height = `${parseInt(height) - 48 - 50}px`;
                    main_div.style.background = '#ffffffff';
                    main_div.style.display = 'flex';
                    main_div.style.alignItems = 'center';
                    main_div.style.justifyContent = 'space-between';
                    main_div.style.boxSizing = 'border-box';
                    main_div.style.zIndex = '2';

                    // Ul

                    const UI_ul = document.createElement("ul");
                    UI_ul.style.position = 'fixed';
                    UI_ul.style.top = '73px';
                    UI_ul.style.left = "0px";
                    UI_ul.appendChild(selected_item);

                    // Description

                    const UI_description = document.createElement("textarea");
                    UI_description.style.position = 'fixed';
                    UI_description.style.height = "100px";
                    UI_description.style.width = `${parseInt(width) - 84}px`;
                    UI_description.style.top = "188px";
                    UI_description.style.right = "42px";
                    UI_description.style.borderRadius = "8px";
                    UI_description.style.border = "1px solid #ccc";
                    UI_description.style.resize = "none";
                    UI_description.style.paddingLeft = "6px";

                    const UI_description_label = document.createElement("label");
                    UI_description_label.style.position = 'fixed';
                    UI_description_label.style.height = "20px";
                    UI_description_label.style.width = `${parseInt(width) - 84}px`;
                    UI_description_label.style.top = "165px";
                    UI_description_label.style.right = "42px";
                    UI_description_label.textContent = "Description";

                    // Currencies

                    const UI_keys_label = document.createElement('label');
                    UI_keys_label.style.position = 'fixed';
                    UI_keys_label.style.height = "15px";
                    UI_keys_label.style.width = "120px";
                    UI_keys_label.style.top = "60px";
                    UI_keys_label.style.left = "150px";
                    UI_keys_label.textContent = "Keys";

                    const UI_keys = document.createElement('input');
                    UI_keys.style.position = 'fixed';
                    UI_keys.value = 0;
                    UI_keys.style.height = "25px";
                    UI_keys.style.width = "120px";
                    UI_keys.style.top = "82px";
                    UI_keys.style.left = "150px";
                    UI_keys.style.borderRadius = "8px";
                    UI_keys.style.border = "1px solid #ccc";
                    UI_keys.style.paddingLeft = "6px";

                    const UI_metal = document.createElement('input');
                    UI_metal.style.position = 'fixed';
                    UI_metal.value = 0.00;
                    UI_metal.style.height = "25px";
                    UI_metal.style.width = "120px";
                    UI_metal.style.top = "135px";
                    UI_metal.style.left = "150px";
                    UI_metal.style.borderRadius = "8px";
                    UI_metal.style.border = "1px solid #ccc";
                    UI_metal.style.paddingLeft = "6px";

                    const UI_metal_label = document.createElement('label');
                    UI_metal_label.style.position = 'fixed';
                    UI_metal_label.style.height = "15px";
                    UI_metal_label.style.width = "120px";
                    UI_metal_label.style.top = "110px";
                    UI_metal_label.style.left = "150px";
                    UI_metal_label.textContent = "Metal";

                    // Bottom div
                    const bottom_div = document.createElement('div');
                    bottom_div.style.position = 'relative';
                    bottom_div.style.width = '100%';
                    bottom_div.style.height = "50px";
                    bottom_div.style.bottom = '0px';
                    bottom_div.style.background = '#ffffffff';
                    bottom_div.style.display = 'flex';
                    bottom_div.style.alignItems = 'center';
                    bottom_div.style.justifyContent = 'flex-start';
                    bottom_div.style.gap = '16px';
                    bottom_div.style.padding = '0 16px';
                    bottom_div.style.boxSizing = 'border-box';
                    bottom_div.style.zIndex = '2';

                    // First select: Add me to trade / Send me a Trade Offer
                    const select_offers = document.createElement('select');
                    select_offers.style.height = '36px';
                    select_offers.style.width = '180px';
                    select_offers.style.marginRight = '8px';
                    select_offers.className = 'form-control';
                    const option1 = document.createElement('option');
                    option1.value = '1';
                    option1.textContent = 'Send me a Trade Offer';
                    const option2 = document.createElement('option');
                    option2.value = '0';
                    option2.textContent = 'Add me to trade';
                    select_offers.appendChild(option1);
                    select_offers.appendChild(option2);

                    // Second select: Allow negotiation / Offer buyout only
                    const select_buyout = document.createElement('select');
                    select_buyout.style.height = '36px';
                    select_buyout.style.width = '180px';
                    select_buyout.className = 'form-control';
                    const option3 = document.createElement('option');
                    option3.value = '1';
                    option3.textContent = 'Offer buyout only';
                    const option4 = document.createElement('option');
                    option4.value = '0';
                    option4.textContent = 'Allow negotiation';
                    select_buyout.appendChild(option3);
                    select_buyout.appendChild(option4);

                    // Sell button
                    const sell_btn = document.createElement('button');
                    sell_btn.id = "fast-sell-panel-btn-sell";
                    sell_btn.textContent = "Sell";
                    sell_btn.style.color = "#dc3545";
                    sell_btn.style.background = "transparent";
                    sell_btn.style.border = "2px solid #dc3545";
                    sell_btn.style.height = "36px";
                    sell_btn.style.width = "80px";
                    sell_btn.style.marginLeft = 'auto';
                    sell_btn.style.borderRadius = "8px";
                    sell_btn.style.fontWeight = "bold";
                    sell_btn.style.fontSize = "16px";

                    sell_btn.addEventListener("click", async () => {
                        const url = `https://backpack.tf/api/v2/classifieds/listings?token=${encodeURIComponent(config.BackpackTF_TOKEN)}&api=${encodeURIComponent(config.BackpackTF_API)}`;
                        const intent = "sell";
                        const backpack_tf2_id = String(selected_item.getAttribute('data-id'));
                        const tradeofferspreferred = select_offers.value === '1';
                        const buyoutonly = select_buyout.value === '1';
                        const details = UI_description.value;
                        const currencies = {"metal": parseFloat(UI_metal.value), "keys": parseFloat(UI_keys.value)};

                        if (config.BackpackTF_API === "") {
                            config.BackpackTF_API = prompt("Enter your BackpackTF API Key for use Fast Sell (Get API: next.backpack.tf/account/api-access -> API Key");
                                if (config.BackpackTF_API) {
                                    GM_setValue("BackpackTF_API", config.BackpackTF_API);
                                }
                        }

                        if (config.BackpackTF_TOKEN === "") {
                            config.BackpackTF_TOKEN = prompt("Enter your BackpackTF TOKEN Key for use Fast Sell (Get TOKEN: next.backpack.tf/account/api-access -> Access Token");
                                if (config.BackpackTF_TOKEN) {
                                    GM_setValue("BackpackTF_TOKEN", config.BackpackTF_TOKEN);
                                }
                        }

                        const payload = {
                            "id": backpack_tf2_id,
                            "intent": intent,
                            "details": details,
                            "tradeOffersPreferred": tradeofferspreferred,
                            "buyoutOnly": buyoutonly,
                            "currencies": currencies
                        }

                        console.log("[sell_btn(click)] payload:", payload)

                        try {
                            const response_create_offer = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                            });
                            console.log("[sell_btn(click)] response:",response_create_offer);
                            if (response_create_offer.status === 201) {
                                sell_btn.style.border = "2px solid #28a745";
                                sell_btn.textContent = "Success!";
                                sell_btn.style.color = "#28a745";
                            } else {
                                sell_btn.style.border = "2px solid #ffc107";
                                sell_btn.textContent = "Error!";
                                sell_btn.style.color = "#ffc107";
                            }
                            setTimeout(() => {
                                sell_btn.style.border = "2px solid #dc3545";
                                sell_btn.textContent = "Sell";
                                sell_btn.style.color = "#dc3545";
                            }, 1500);
                        } catch (err) {
                            sell_btn.style.border = "2px solid #ffc107";
                            sell_btn.textContent = "Error!";
                            sell_btn.style.color = "#ffc107";
                            setTimeout(() => {
                                sell_btn.style.border = "2px solid #dc3545";
                                sell_btn.textContent = "Sell";
                                sell_btn.style.color = "#dc3545";
                            }, 1500);
                        }
                    });

                    header.appendChild(titleSpan);
                    header.appendChild(exitBtn);

                    main_div.appendChild(UI_ul);
                    main_div.appendChild(UI_description);
                    main_div.appendChild(UI_description_label);
                    main_div.appendChild(UI_keys_label);
                    main_div.appendChild(UI_keys);
                    main_div.appendChild(UI_metal);
                    main_div.appendChild(UI_metal_label);

                    bottom_div.appendChild(select_offers);
                    bottom_div.appendChild(select_buyout);
                    bottom_div.appendChild(sell_btn);

                    panel.appendChild(header);
                    panel.appendChild(main_div);
                    panel.appendChild(bottom_div);
                    return panel;
                }

                setTimeout(() => {
                    panel_UI.style.top = "50%";
                    panel_UI.style.transform = "translate(-50%, -50%)";
                    panel_UI.style.opacity = '1';
                }, 10);

                panel_UI.style.opacity = '0';
                document.body.appendChild(panel_UI);
                setTimeout(() => {
                    panel_UI.style.opacity = '1';
                }, 10);

            });

            panel.querySelector("#inventory-toolbar")?.appendChild(FastSell);

            break;
        }
    }
}
