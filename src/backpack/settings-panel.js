import { btn_color, bg_primary, bg_secondary, color_text_dark, color_text_light } from "../common/constants.js";

export function applyWallpaper() {
    const gifUrl = GM_getValue("Wallpaper_URL", "");
    const bgSize = GM_getValue("Wallpaper_Size", "cover");
    const bgRepeat = GM_getValue("Wallpaper_Repeat", "no-repeat");
    const bgAttach = GM_getValue("Wallpaper_Attachment", "fixed");
    const bgOpacity = GM_getValue("Wallpaper_Opacity", "0.8");

    let style = document.getElementById("custom-wallpaper-style");

    if (!style) {
        style = document.createElement('style');
        style.id = "custom-wallpaper-style";
        document.head.appendChild(style);
    }

    style.innerHTML = `
        body.app-440 {
            ${gifUrl ? `background-image: url("${gifUrl}") !important;` : ""}
            background-color: #171b1e !important;
            background-size: ${bgSize} !important;
            background-repeat: ${bgRepeat} !important;
            background-attachment: ${bgAttach} !important;
        }
        .container {
            opacity: ${bgOpacity} !important;
        }
        .modal-backdrop {
            pointer-events: none !important;
        }
        .modal-backdrop.in {
            opacity: 0;
        }
    `;
}

export function createSetting() {
    const dropdown_menu = document.querySelector(".dropdown.navbar-user-dropdown .dropdown-menu");
    if (dropdown_menu) {

        /* Make line divider */

        const divider_li = document.createElement("li");
        divider_li.className = "divider";
        dropdown_menu.appendChild(divider_li);

        /* Main "button" settings */

        const li = document.createElement("li");
        const settings_button = document.createElement("a");
        settings_button.textContent = "⚙️ One Click Offer";
        settings_button.style.textAlign = "left";
        settings_button.style.background = btn_color;
        settings_button.style.borderColor = btn_color;
        settings_button.style.color = "#ffffff";

        settings_button.addEventListener("click", (event) => {
            event.stopPropagation();
            if (document.getElementById("steamapi-settings-panel")) {
                document.getElementById("steamapi-settings-panel").remove();
                return;
            }

            const panel = document.createElement("div");
            panel.id = "steamapi-settings-panel";
            panel.style.position = "fixed";
            panel.style.top = "60px";
            panel.style.right = "20px"; 
            panel.style.left = "auto";
            panel.style.background = bg_primary;
            panel.style.border = `1px solid ${bg_secondary}`;
            panel.style.padding = "10px";
            panel.style.zIndex = 9999;
            panel.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            panel.style.borderRadius = "8px";

            function createSection(activeTab = 'main') {
                const section_div = document.createElement("div");
                section_div.style.marginBottom = "10px";
                section_div.style.display = "flex";
                section_div.style.justifyContent = "space-between";
                section_div.style.alignItems = "center";
                section_div.style.borderBottom = "1px solid #ccc";
                section_div.style.paddingBottom = "6px";

                function createDivider() {
                    const divider = document.createElement('div');
                    divider.style.width = '1px';
                    divider.style.height = '24px';
                    divider.style.background = '#e0e0e0';
                    return divider;
                }

                const btn1 = document.createElement('button');
                btn1.textContent = 'One-Click-Offer';
                btn1.style.color = color_text_light;
                btn1.style.flex = '1';
                btn1.style.textAlign = 'center';
                btn1.style.fontWeight = 'bold';
                btn1.style.fontSize = '16px';
                btn1.style.background = activeTab === 'main' ? bg_secondary : 'transparent';
                btn1.style.border = 'none';
                btn1.style.borderRadius = '6px 0 0 0';
                btn1.style.cursor = 'pointer';
                btn1.style.padding = '8px 0';
                btn1.style.transition = 'background 0.2s';

                const btn2 = document.createElement('button');
                btn2.textContent = 'Wallpaper';
                btn2.style.color = color_text_light;
                btn2.style.flex = '1';
                btn2.style.textAlign = 'center';
                btn2.style.fontWeight = 'bold';
                btn2.style.fontSize = '16px';
                btn2.style.background = activeTab === 'wallpaper' ? bg_secondary : 'transparent';
                btn2.style.border = 'none';
                btn2.style.borderRadius = '0 6px 0 0';
                btn2.style.cursor = 'pointer';
                btn2.style.padding = '8px 0';
                btn2.style.transition = 'background 0.2s';

                panel.appendChild(section_div);

                btn1.onclick = () => {
                    panel.innerHTML = "";
                    createSection('main');
                    createMain();
                };
                btn2.onclick = () => {
                    panel.innerHTML = "";
                    createSection('wallpaper');
                    createWallpaperMenu();
                };

                section_div.appendChild(btn1);
                section_div.appendChild(createDivider());
                section_div.appendChild(btn2);
            }

            createSection('main');

            function getSupportDiv() {
                const supportDiv = document.createElement('div');
                supportDiv.style.marginTop = '18px';
                supportDiv.style.paddingTop = '8px';
                supportDiv.style.textAlign = 'center';
                supportDiv.style.fontSize = '15px';
                supportDiv.style.color = color_text_light;
                supportDiv.style.borderTop = '1px solid #888';
                supportDiv.innerHTML = 'Support the Developer!<a href="https://send.monobank.ua/jar/2Zk6JaVdww" target="_blank" style="color:#1976d2;text-decoration:underline;margin-left:6px;">Donate</a>';
                return supportDiv;
            }

            function createMain() {
                const SteamAPILabel = document.createElement("label");
                SteamAPILabel.style.color = color_text_light;
                SteamAPILabel.textContent = "Steam API Key:";
                SteamAPILabel.style.display = "block";

                const SteamAPI_input = document.createElement("input");
                SteamAPI_input.style.border = "1px solid #ccc";
                SteamAPI_input.style.borderRadius = "4px";
                SteamAPI_input.type = "password";
                SteamAPI_input.value = GM_getValue("SteamAPI", "");
                SteamAPI_input.style.width = "300px";
                SteamAPI_input.style.marginTop = "5px";
                SteamAPI_input.style.marginBottom = "5px";

                const saveBtn = document.createElement("button");
                saveBtn.textContent = "Save";
                saveBtn.style.marginTop = "8px";
                saveBtn.style.marginLeft = "10px";
                saveBtn.className = "btn btn-success";

                saveBtn.addEventListener("click", () => {
                    GM_setValue("SteamAPI", SteamAPI_input.value);
                    alert("Steam API Key saved!");
                });

                const BackpackTFAPILabel = document.createElement("label");
                BackpackTFAPILabel.style.color = color_text_light;
                BackpackTFAPILabel.textContent = "BacpackTF API Key:";
                BackpackTFAPILabel.style.display = "block";

                const BackpackTFAPI_input = document.createElement("input");
                BackpackTFAPI_input.style.border = "1px solid #ccc";
                BackpackTFAPI_input.style.borderRadius = "4px";
                BackpackTFAPI_input.type = "password";
                BackpackTFAPI_input.value = GM_getValue("BackpackTF_API", "");
                BackpackTFAPI_input.style.width = "300px";
                BackpackTFAPI_input.style.marginTop = "5px";
                BackpackTFAPI_input.style.marginBottom = "5px"

                const BackpackTFAPI_saveBtn = document.createElement("button");
                BackpackTFAPI_saveBtn.textContent = "Save";
                BackpackTFAPI_saveBtn.style.marginTop = "10px";
                BackpackTFAPI_saveBtn.style.marginLeft = "10px";
                BackpackTFAPI_saveBtn.className = "btn btn-success";

                BackpackTFAPI_saveBtn.addEventListener("click", () => {
                    GM_setValue("BackpackTF_API", BackpackTFAPI_input.value);
                    alert("BackpackTF API Key saved!");
                });

                const BackpackTFTOKENLabel = document.createElement("label");
                BackpackTFTOKENLabel.style.color = color_text_light;
                BackpackTFTOKENLabel.textContent = "BacpackTF TOKEN Key:";
                BackpackTFTOKENLabel.style.display = "block";

                const BackpackTFTOKEN_input = document.createElement("input");
                BackpackTFTOKEN_input.style.border = "1px solid #ccc";
                BackpackTFTOKEN_input.style.borderRadius = "4px";
                BackpackTFTOKEN_input.type = "password";
                BackpackTFTOKEN_input.value = GM_getValue("BackpackTF_TOKEN", "");
                BackpackTFTOKEN_input.style.width = "300px";
                BackpackTFTOKEN_input.style.marginTop = "5px";
                BackpackTFTOKEN_input.style.marginBottom = "5px"

                const BackpackTFTOKEN_saveBtn = document.createElement("button");
                BackpackTFTOKEN_saveBtn.textContent = "Save";
                BackpackTFTOKEN_saveBtn.style.marginTop = "10px";
                BackpackTFTOKEN_saveBtn.style.marginLeft = "10px";
                BackpackTFTOKEN_saveBtn.className = "btn btn-success";

                BackpackTFTOKEN_saveBtn.addEventListener("click", () => {
                    GM_setValue("BackpackTF_TOKEN", BackpackTFTOKEN_input.value);
                    alert("BackpackTF Token Key saved!");
                });

                panel.appendChild(SteamAPILabel);
                panel.appendChild(SteamAPI_input);
                panel.appendChild(saveBtn);

                panel.appendChild(BackpackTFAPILabel);
                panel.appendChild(BackpackTFAPI_input);
                panel.appendChild(BackpackTFAPI_saveBtn);

                panel.appendChild(BackpackTFTOKENLabel);
                panel.appendChild(BackpackTFTOKEN_input);
                panel.appendChild(BackpackTFTOKEN_saveBtn);

                panel.appendChild(getSupportDiv());
            }

            function createWallpaperMenu() {
                const menuContainer = document.createElement("div");
                menuContainer.style.width = "300px";
                menuContainer.style.maxHeight = "350px";
                menuContainer.style.overflowY = "auto";
                menuContainer.style.paddingRight = "5px";

                function addSettingRow(labelText, element) {
                    const row = document.createElement("div");
                    row.style.marginBottom = "10px";

                    const lbl = document.createElement("label");
                    lbl.textContent = labelText;
                    lbl.style.color = color_text_light;
                    lbl.style.display = "block";
                    lbl.style.fontSize = "13px";
                    lbl.style.fontWeight = "bold";
                    lbl.style.marginBottom = "2px";

                    element.style.width = "100%";
                    element.style.boxSizing = "border-box";

                    row.appendChild(lbl);
                    row.appendChild(element);
                    menuContainer.appendChild(row);
                    return lbl;
                }

                const wpInput = document.createElement("input");
                wpInput.type = "text";
                wpInput.placeholder = "https://example.com/image.gif";
                wpInput.value = GM_getValue("Wallpaper_URL", "");
                wpInput.style.padding = "4px";
                addSettingRow("Background URL:", wpInput);

                const sizeSelect = document.createElement("select");
                ["cover", "contain", "auto", "100% 100%"].forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt;
                    option.textContent = opt;
                    if(opt === GM_getValue("Wallpaper_Size", "cover")) option.selected = true;
                    sizeSelect.appendChild(option);
                });
                sizeSelect.style.padding = "4px";
                addSettingRow("Background Size:", sizeSelect);

                const repeatSelect = document.createElement("select");
                ["no-repeat", "repeat", "repeat-x", "repeat-y"].forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt;
                    option.textContent = opt;
                    if(opt === GM_getValue("Wallpaper_Repeat", "no-repeat")) option.selected = true;
                    repeatSelect.appendChild(option);
                });
                repeatSelect.style.padding = "4px";
                addSettingRow("Background Repeat:", repeatSelect);

                const attachSelect = document.createElement("select");
                ["fixed", "scroll", "local"].forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt;
                    option.textContent = opt;
                    if(opt === GM_getValue("Wallpaper_Attachment", "fixed")) option.selected = true;
                    attachSelect.appendChild(option);
                });
                attachSelect.style.padding = "4px";
                addSettingRow("Background Attachment:", attachSelect);

                const opacityInput = document.createElement("input");
                opacityInput.type = "range";
                opacityInput.min = "0.1";
                opacityInput.max = "1.0";
                opacityInput.step = "0.05";
                opacityInput.value = GM_getValue("Wallpaper_Opacity", "0.8");

                const opacityLabel = addSettingRow("Container Opacity: ", opacityInput);
                opacityLabel.style.color = color_text_light;
                const opacityValSpan = document.createElement("span");
                opacityValSpan.textContent = opacityInput.value;
                opacityValSpan.style.fontWeight = "normal";
                opacityLabel.appendChild(opacityValSpan);

                opacityInput.addEventListener("input", () => {
                    opacityValSpan.textContent = opacityInput.value;
                });

                const btnContainer = document.createElement("div");
                btnContainer.style.display = "flex";
                btnContainer.style.gap = "10px";
                btnContainer.style.marginTop = "15px";

                const wpSaveBtn = document.createElement("button");
                wpSaveBtn.textContent = "Save";
                wpSaveBtn.className = "btn btn-success";
                wpSaveBtn.style.flex = "1";

                wpSaveBtn.addEventListener("click", () => {
                    GM_setValue("Wallpaper_URL", wpInput.value);
                    GM_setValue("Wallpaper_Size", sizeSelect.value);
                    GM_setValue("Wallpaper_Repeat", repeatSelect.value);
                    GM_setValue("Wallpaper_Attachment", attachSelect.value);
                    GM_setValue("Wallpaper_Opacity", opacityInput.value);
                    applyWallpaper();
                });

                const wpClearBtn = document.createElement("button");
                wpClearBtn.textContent = "Clear";
                wpClearBtn.className = "btn btn-danger";
                wpClearBtn.style.flex = "1";

                wpClearBtn.addEventListener("click", () => {
                    GM_setValue("Wallpaper_URL", "");
                    wpInput.value = "";
                    sizeSelect.value = "cover";
                    repeatSelect.value = "no-repeat";
                    attachSelect.value = "fixed";
                    opacityInput.value = "0.8";
                    opacityValSpan.textContent = "0.8";

                    GM_setValue("Wallpaper_Size", "cover");
                    GM_setValue("Wallpaper_Repeat", "no-repeat");
                    GM_setValue("Wallpaper_Attachment", "fixed");
                    GM_setValue("Wallpaper_Opacity", "0.8");

                    applyWallpaper();
                });

                btnContainer.appendChild(wpSaveBtn);
                btnContainer.appendChild(wpClearBtn);
                menuContainer.appendChild(btnContainer);

                panel.appendChild(menuContainer);
                panel.appendChild(getSupportDiv());
            }

            createMain();
            document.body.appendChild(panel);
        
        });

        document.addEventListener("click", (event) => {
            const panel = document.getElementById("steamapi-settings-panel");
            
            if (panel) {
                const path = event.composedPath();
                const isClickInsideMenu = path.includes(panel);
                const isClickOnButton = path.includes(settings_button);

                if (!isClickInsideMenu && !isClickOnButton) {
                    panel.remove();
                }
            }
        });

        li.appendChild(settings_button);
        dropdown_menu.appendChild(li);
    }
}
