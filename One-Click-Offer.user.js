// ==UserScript==
// @name         One-Click Offer
// @namespace    https://github.com/BrBriz/One-Click-Offer
// @homepage     https://github.com/BrBriz
// @version      3.1.0
// @description  Adds a button on backpack.tf listings that instantly sends the offer.
// @author       BrBriz
// @updateURL    https://github.com/BrBriz/One-Click-Offer/raw/main/One-Click-Offer.user.js
// @downloadURL  https://github.com/BrBriz/One-Click-Offer/raw/main/One-Click-Offer.user.js
// @match        *://backpack.tf/profiles/*
// @match        *://backpack.tf/stats/*
// @match        *://backpack.tf/classifieds*
// @match        *://backpack.tf/u/*
// @match        *://www.backpack.tf/stats/*
// @match        *://www.backpack.tf/classifieds*
// @match        *://www.backpack.tf/u/*
// @match        *://next.backpack.tf/*
// @match        *://steamcommunity.com/tradeoffer/new*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔺</text></svg>
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(() => {
  // src/common/constants.js
  var allow_change = true;
  var btn_color = "#931F1D";
  var next_btn_color = "#eb2335";
  var btn_text = "One Click Offer \u21C4";
  var bg_primary = "#020202";
  var bg_secondary = "#0D2818";
  var color_text_light = "#FFEDDF";
  var DEBUG = false;
  var itemsWithPriceHalfScrap = /* @__PURE__ */ new Set([
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
    "The Claidheamh M\xF2r",
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
    "The Holy Mackerel",
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
  ]);

  // src/backpack/settings-panel.js
  function applyWallpaper() {
    const gifUrl = GM_getValue("Wallpaper_URL", "");
    const bgSize = GM_getValue("Wallpaper_Size", "cover");
    const bgRepeat = GM_getValue("Wallpaper_Repeat", "no-repeat");
    const bgAttach = GM_getValue("Wallpaper_Attachment", "fixed");
    const bgOpacity = GM_getValue("Wallpaper_Opacity", "0.8");
    let style = document.getElementById("custom-wallpaper-style");
    if (!style) {
      style = document.createElement("style");
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
  function createSetting() {
    const dropdown_menu = document.querySelector(".dropdown.navbar-user-dropdown .dropdown-menu");
    if (dropdown_menu) {
      const divider_li = document.createElement("li");
      divider_li.className = "divider";
      dropdown_menu.appendChild(divider_li);
      const li = document.createElement("li");
      const settings_button = document.createElement("a");
      settings_button.textContent = "\u2699\uFE0F One Click Offer";
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
        function createSection(activeTab = "main") {
          const section_div = document.createElement("div");
          section_div.style.marginBottom = "10px";
          section_div.style.display = "flex";
          section_div.style.justifyContent = "space-between";
          section_div.style.alignItems = "center";
          section_div.style.borderBottom = "1px solid #ccc";
          section_div.style.paddingBottom = "6px";
          function createDivider() {
            const divider = document.createElement("div");
            divider.style.width = "1px";
            divider.style.height = "24px";
            divider.style.background = "#e0e0e0";
            return divider;
          }
          const btn1 = document.createElement("button");
          btn1.textContent = "One-Click-Offer";
          btn1.style.color = color_text_light;
          btn1.style.flex = "1";
          btn1.style.textAlign = "center";
          btn1.style.fontWeight = "bold";
          btn1.style.fontSize = "16px";
          btn1.style.background = activeTab === "main" ? bg_secondary : "transparent";
          btn1.style.border = "none";
          btn1.style.borderRadius = "6px 0 0 0";
          btn1.style.cursor = "pointer";
          btn1.style.padding = "8px 0";
          btn1.style.transition = "background 0.2s";
          const btn2 = document.createElement("button");
          btn2.textContent = "Wallpaper";
          btn2.style.color = color_text_light;
          btn2.style.flex = "1";
          btn2.style.textAlign = "center";
          btn2.style.fontWeight = "bold";
          btn2.style.fontSize = "16px";
          btn2.style.background = activeTab === "wallpaper" ? bg_secondary : "transparent";
          btn2.style.border = "none";
          btn2.style.borderRadius = "0 6px 0 0";
          btn2.style.cursor = "pointer";
          btn2.style.padding = "8px 0";
          btn2.style.transition = "background 0.2s";
          panel.appendChild(section_div);
          btn1.onclick = () => {
            panel.innerHTML = "";
            createSection("main");
            createMain();
          };
          btn2.onclick = () => {
            panel.innerHTML = "";
            createSection("wallpaper");
            createWallpaperMenu();
          };
          section_div.appendChild(btn1);
          section_div.appendChild(createDivider());
          section_div.appendChild(btn2);
        }
        createSection("main");
        function getSupportDiv() {
          const supportDiv = document.createElement("div");
          supportDiv.style.marginTop = "18px";
          supportDiv.style.paddingTop = "8px";
          supportDiv.style.textAlign = "center";
          supportDiv.style.fontSize = "15px";
          supportDiv.style.color = color_text_light;
          supportDiv.style.borderTop = "1px solid #888";
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
          BackpackTFAPI_input.style.marginBottom = "5px";
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
          BackpackTFTOKEN_input.style.marginBottom = "5px";
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
          ["cover", "contain", "auto", "100% 100%"].forEach((opt) => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (opt === GM_getValue("Wallpaper_Size", "cover")) option.selected = true;
            sizeSelect.appendChild(option);
          });
          sizeSelect.style.padding = "4px";
          addSettingRow("Background Size:", sizeSelect);
          const repeatSelect = document.createElement("select");
          ["no-repeat", "repeat", "repeat-x", "repeat-y"].forEach((opt) => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (opt === GM_getValue("Wallpaper_Repeat", "no-repeat")) option.selected = true;
            repeatSelect.appendChild(option);
          });
          repeatSelect.style.padding = "4px";
          addSettingRow("Background Repeat:", repeatSelect);
          const attachSelect = document.createElement("select");
          ["fixed", "scroll", "local"].forEach((opt) => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (opt === GM_getValue("Wallpaper_Attachment", "fixed")) option.selected = true;
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

  // src/common/dom-utils.js
  function awaitDocumentReady() {
    return new Promise(async (res) => {
      if (document.readyState !== "loading") res();
      else document.addEventListener("DOMContentLoaded", res);
    });
  }
  function waitFor(seconds) {
    return new Promise((res) => setTimeout(res, seconds * 1e3));
  }
  function throwError(err) {
    const params = new URLSearchParams(location.search);
    const buy_sell = params.has("for_item") ? "Buy" : "Sell";
    const item = params.get("tscript_name");
    const pre_string = "Unable to " + buy_sell + " " + item + ": ";
    console.error(pre_string + err);
    window.alert(pre_string + err);
    throw err;
  }

  // src/backpack/listings.js
  async function addOfferButtonsToListings() {
    await awaitDocumentReady();
    const list_elements = document.getElementsByClassName("media-list");
    createSetting();
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
      let send_offer_btn = document.querySelector(btn_selector + "success") || document.querySelector(btn_selector + "primary");
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
      quantityInput.addEventListener("input", () => {
        const length = quantityInput.value.length;
        quantityInput.style.width = `${35 + 6 * length}px`;
      });
      const btn_clone = send_offer_btn.cloneNode(true);
      const updateHref = () => {
        const count = quantityInput.value;
        const url = new URL(btn_clone.getAttribute("href"));
        const strangeParts = [];
        if (item_id_text !== "") {
          url.searchParams.set("tscript_id", item_id_text.replace(/&tscript_id=/, ""));
        }
        for (let i = 1; info.getAttribute(`data-part_name_${i}`); i++) {
          const partName = info.getAttribute(`data-part_name_${i}`);
          strangeParts.push(partName);
          i++;
        }
        url.searchParams.set("tscript_price", price);
        url.searchParams.set("tscript_name", item_name);
        url.searchParams.set("tscript_count", count);
        if (strangeParts.length > 0) {
          url.searchParams.set("tscript_strangeParts", strangeParts.join(","));
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

  // src/common/config.js
  var config = {
    SteamAPI: GM_getValue("SteamAPI", ""),
    BackpackTF_API: GM_getValue("BackpackTF_API", ""),
    BackpackTF_TOKEN: GM_getValue("BackpackTF_TOKEN", "")
  };
  var GetTradeOffers = "https://api.steampowered.com/IEconService/GetTradeOffers/v1/";
  var GetTradeOffers_params = {
    "key": config.SteamAPI,
    "get_sent_offers": 1,
    "get_received_offers": 1,
    "get_descriptions": 1,
    "active_only": 1,
    "historical_only": 0
  };
  var internal_request_sent = false;
  function setInternalRequestSent(value) {
    internal_request_sent = value;
  }

  // src/backpack/fast-sell.js
  async function initFastSell() {
    await awaitDocumentReady();
    createSetting();
    const panels = document.getElementsByClassName("panel-extras");
    for (const panel of panels) {
      const refreshButton = panel.querySelector("button#refresh-inventory.btn.btn-panel");
      if (refreshButton) {
        const FastSell = document.createElement("button");
        FastSell.className = "btn btn-panel";
        FastSell.title = "Quickly list selected item for sale";
        const eraserIcon = document.createElement("i");
        eraserIcon.className = "fa fa-sw fa-flash";
        eraserIcon.style.marginRight = "4px";
        FastSell.appendChild(eraserIcon);
        FastSell.appendChild(document.createTextNode("Fast Sell"));
        FastSell.addEventListener("click", () => {
          const panel2 = document.getElementById("fast-sell-panel");
          if (panel2) {
            return;
          }
          let selected_item = false;
          const backpack = document.querySelector("#backpack");
          const items = backpack.querySelectorAll("li");
          for (const item of items) {
            const DOMTokenList = item.classList;
            const isNoPopover = DOMTokenList.contains("no-popover");
            const isSelected = DOMTokenList.contains("unselected");
            if (isNoPopover && !isSelected) {
              if (item.getAttribute("data-tradable") === 0) {
                continue;
              }
              selected_item = item.cloneNode(true);
              break;
            }
            ;
          }
          ;
          if (!selected_item) {
            return;
          }
          const panel_UI = createModalPanel({
            id: "fast-sell-panel",
            width: "500px",
            height: "350px",
            title: "Fast Sell",
            onClose: () => {
              const panel3 = document.getElementById("fast-sell-panel");
              if (panel3) {
                panel3.style.transition = "opacity 0.3s ease, top 0.5s ease";
                panel3.style.opacity = "0";
                panel3.style.top = "60%";
                setTimeout(() => {
                  if (panel3.parentNode) panel3.parentNode.removeChild(panel3);
                }, 350);
              }
            }
          });
          function createModalPanel({ id, width, height, title, onClose }) {
            const panel3 = document.createElement("div");
            panel3.id = id;
            panel3.style.position = "fixed";
            panel3.style.top = "0px";
            panel3.style.left = "50%";
            panel3.style.transform = "translateX(-50%)";
            panel3.style.background = "#fff";
            panel3.style.padding = "0";
            panel3.style.zIndex = 9999;
            panel3.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            panel3.style.borderRadius = "8px";
            panel3.style.width = width;
            panel3.style.height = height;
            panel3.style.transition = "top 0.5s ease";
            const header = document.createElement("div");
            header.style.position = "relative";
            header.style.width = "100%";
            header.style.height = "48px";
            header.style.background = "linear-gradient(to bottom, #2b3b47, #12181d)";
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.style.justifyContent = "space-between";
            header.style.padding = "0 16px 0 12px";
            header.style.borderTopLeftRadius = "8px";
            header.style.borderTopRightRadius = "8px";
            header.style.boxSizing = "border-box";
            header.style.zIndex = "2";
            const titleSpan = document.createElement("span");
            titleSpan.textContent = title;
            titleSpan.style.color = "#ffffff";
            titleSpan.style.fontSize = "17px";
            titleSpan.style.userSelect = "none";
            titleSpan.style.fontFamily = "inherit";
            const exitBtn = document.createElement("button");
            exitBtn.textContent = "\u2A2F";
            exitBtn.style.fontWeight = "bold";
            exitBtn.style.fontSize = "20px";
            exitBtn.style.lineHeight = "1";
            exitBtn.style.position = "static";
            exitBtn.style.marginLeft = "16px";
            exitBtn.style.color = "#838383";
            exitBtn.style.border = "none";
            exitBtn.style.backgroundColor = "transparent";
            exitBtn.style.cursor = "pointer";
            exitBtn.style.zIndex = "10";
            exitBtn.onclick = onClose;
            const main_div = document.createElement("div");
            main_div.style.position = "relative";
            main_div.style.width = "100%";
            main_div.style.height = `${parseInt(height) - 48 - 50}px`;
            main_div.style.background = "#ffffffff";
            main_div.style.display = "flex";
            main_div.style.alignItems = "center";
            main_div.style.justifyContent = "space-between";
            main_div.style.boxSizing = "border-box";
            main_div.style.zIndex = "2";
            const UI_ul = document.createElement("ul");
            UI_ul.style.position = "fixed";
            UI_ul.style.top = "73px";
            UI_ul.style.left = "0px";
            UI_ul.appendChild(selected_item);
            const UI_description = document.createElement("textarea");
            UI_description.style.position = "fixed";
            UI_description.style.height = "100px";
            UI_description.style.width = `${parseInt(width) - 84}px`;
            UI_description.style.top = "188px";
            UI_description.style.right = "42px";
            UI_description.style.borderRadius = "8px";
            UI_description.style.border = "1px solid #ccc";
            UI_description.style.resize = "none";
            UI_description.style.paddingLeft = "6px";
            const UI_description_label = document.createElement("label");
            UI_description_label.style.position = "fixed";
            UI_description_label.style.height = "20px";
            UI_description_label.style.width = `${parseInt(width) - 84}px`;
            UI_description_label.style.top = "165px";
            UI_description_label.style.right = "42px";
            UI_description_label.textContent = "Description";
            const UI_keys_label = document.createElement("label");
            UI_keys_label.style.position = "fixed";
            UI_keys_label.style.height = "15px";
            UI_keys_label.style.width = "120px";
            UI_keys_label.style.top = "60px";
            UI_keys_label.style.left = "150px";
            UI_keys_label.textContent = "Keys";
            const UI_keys = document.createElement("input");
            UI_keys.style.position = "fixed";
            UI_keys.value = 0;
            UI_keys.style.height = "25px";
            UI_keys.style.width = "120px";
            UI_keys.style.top = "82px";
            UI_keys.style.left = "150px";
            UI_keys.style.borderRadius = "8px";
            UI_keys.style.border = "1px solid #ccc";
            UI_keys.style.paddingLeft = "6px";
            const UI_metal = document.createElement("input");
            UI_metal.style.position = "fixed";
            UI_metal.value = 0;
            UI_metal.style.height = "25px";
            UI_metal.style.width = "120px";
            UI_metal.style.top = "135px";
            UI_metal.style.left = "150px";
            UI_metal.style.borderRadius = "8px";
            UI_metal.style.border = "1px solid #ccc";
            UI_metal.style.paddingLeft = "6px";
            const UI_metal_label = document.createElement("label");
            UI_metal_label.style.position = "fixed";
            UI_metal_label.style.height = "15px";
            UI_metal_label.style.width = "120px";
            UI_metal_label.style.top = "110px";
            UI_metal_label.style.left = "150px";
            UI_metal_label.textContent = "Metal";
            const bottom_div = document.createElement("div");
            bottom_div.style.position = "relative";
            bottom_div.style.width = "100%";
            bottom_div.style.height = "50px";
            bottom_div.style.bottom = "0px";
            bottom_div.style.background = "#ffffffff";
            bottom_div.style.display = "flex";
            bottom_div.style.alignItems = "center";
            bottom_div.style.justifyContent = "flex-start";
            bottom_div.style.gap = "16px";
            bottom_div.style.padding = "0 16px";
            bottom_div.style.boxSizing = "border-box";
            bottom_div.style.zIndex = "2";
            const select_offers = document.createElement("select");
            select_offers.style.height = "36px";
            select_offers.style.width = "180px";
            select_offers.style.marginRight = "8px";
            select_offers.className = "form-control";
            const option1 = document.createElement("option");
            option1.value = "1";
            option1.textContent = "Send me a Trade Offer";
            const option2 = document.createElement("option");
            option2.value = "0";
            option2.textContent = "Add me to trade";
            select_offers.appendChild(option1);
            select_offers.appendChild(option2);
            const select_buyout = document.createElement("select");
            select_buyout.style.height = "36px";
            select_buyout.style.width = "180px";
            select_buyout.className = "form-control";
            const option3 = document.createElement("option");
            option3.value = "1";
            option3.textContent = "Offer buyout only";
            const option4 = document.createElement("option");
            option4.value = "0";
            option4.textContent = "Allow negotiation";
            select_buyout.appendChild(option3);
            select_buyout.appendChild(option4);
            const sell_btn = document.createElement("button");
            sell_btn.id = "fast-sell-panel-btn-sell";
            sell_btn.textContent = "Sell";
            sell_btn.style.color = "#dc3545";
            sell_btn.style.background = "transparent";
            sell_btn.style.border = "2px solid #dc3545";
            sell_btn.style.height = "36px";
            sell_btn.style.width = "80px";
            sell_btn.style.marginLeft = "auto";
            sell_btn.style.borderRadius = "8px";
            sell_btn.style.fontWeight = "bold";
            sell_btn.style.fontSize = "16px";
            sell_btn.addEventListener("click", async () => {
              const url = `https://backpack.tf/api/v2/classifieds/listings?token=${encodeURIComponent(config.BackpackTF_TOKEN)}&api=${encodeURIComponent(config.BackpackTF_API)}`;
              const intent = "sell";
              const backpack_tf2_id = String(selected_item.getAttribute("data-id"));
              const tradeofferspreferred = select_offers.value === "1";
              const buyoutonly = select_buyout.value === "1";
              const details = UI_description.value;
              const currencies = { "metal": parseFloat(UI_metal.value), "keys": parseFloat(UI_keys.value) };
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
              };
              console.log("[sell_btn(click)] payload:", payload);
              try {
                const response_create_offer = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(payload)
                });
                console.log("[sell_btn(click)] response:", response_create_offer);
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
            panel3.appendChild(header);
            panel3.appendChild(main_div);
            panel3.appendChild(bottom_div);
            return panel3;
          }
          setTimeout(() => {
            panel_UI.style.top = "50%";
            panel_UI.style.transform = "translate(-50%, -50%)";
            panel_UI.style.opacity = "1";
          }, 10);
          panel_UI.style.opacity = "0";
          document.body.appendChild(panel_UI);
          setTimeout(() => {
            panel_UI.style.opacity = "1";
          }, 10);
        });
        panel.querySelector("#inventory-toolbar")?.appendChild(FastSell);
        break;
      }
    }
  }

  // src/backpack/index.js
  async function run() {
    if (location.pathname.match(/\/(stats|classifieds|u)/)) {
      await addOfferButtonsToListings();
    } else {
      await initFastSell();
    }
  }

  // src/next_backpack/index.js
  async function run2() {
    let listings_data = void 0;
    interceptSearchRequests();
    if (location.pathname.startsWith("/stats")) {
      await awaitDocumentReady();
      while (!__NUXT__?.fetch?.["data-v-58d43071:0"]?.listings && !__NUXT__?.fetch?.["data-v-39eb0133:0"]?.listings) {
        await waitFor(0.1);
      }
      const listings = __NUXT__.fetch["data-v-58d43071:0"]?.listings || __NUXT__.fetch["data-v-39eb0133:0"].listings;
      listings_data = listings.buy.items.concat(listings.sell.items);
      addSenderButtons();
    }
    function interceptSearchRequests() {
      let old_open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
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
      const listings = Array.from(document.getElementsByClassName("listing"));
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        const header = listing.children[0].children[1].children[0];
        let item_name = header.children[0].innerText.trim().replace("\n", " ").replace(/ #\d+$/, "");
        if (listing.children[0].children[0].className.includes("uncraftable")) {
          item_name = "Non-Craftable " + item_name;
        }
        const info = listing.children[0].children[0];
        const listing_id = info.getAttribute("href").replace("/classifieds/", "");
        const current_listing = listings_data.find((l) => l.id === listing_id);
        const price = current_listing.value.long;
        const item_data = current_listing.item;
        DEBUG && console.log(JSON.stringify(item_data, null, 2));
        const strangeParts = [];
        if (item_data && item_data.strangeParts) {
          item_data.strangeParts.forEach((part) => {
            if (part.killEater && part.killEater.item && part.killEater.name) {
              strangeParts.push(part.killEater.name);
            }
          });
        }
        let item_id_text = "";
        if (header.getElementsByClassName("text-buy").length !== 0) {
          if (item_name.includes("Unusual") && !item_name.includes("Haunted Metal Scrap") && !item_name.includes("Horseless Headless Horsemann's Headtaker")) {
            continue;
          }
          const modified_traits = ["fa-wrench", "fa-fill-drip", "-spell", "fa-shoe-prints", "fa-flash-round-potion"];
          const special_traits = Array.from(info.children[0].children).map((e) => e.getAttribute("class"));
          let modified = false;
          for (let trait of special_traits) {
            const found_trait = modified_traits.find((t) => trait.includes(t));
            if (found_trait) {
              if (found_trait === "fa-fill-drip" && info.getAttribute("style").includes("Paint_Can")) continue;
              modified = true;
              break;
            }
          }
          if (modified) continue;
        } else {
          const id = /\/classifieds\/440_(\d+)/.exec(info.getAttribute("href"));
          item_id_text = "&tscript_id=" + id[1];
        }
        const btn_box = header.getElementsByClassName("listing__details__actions")[0];
        const send_offer_btn = btn_box.getElementsByClassName("listing__details__actions__action")[0];
        const href = send_offer_btn.getAttribute("href");
        if (!href || href.startsWith("steam://") || href.startsWith("https://marketplace.tf")) continue;
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
        quantityInput.addEventListener("input", () => {
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
            url.searchParams.set("tscript_id", item_id_text.replace(/&tscript_id=/, ""));
          }
          url.searchParams.set("tscript_price", price);
          url.searchParams.set("tscript_name", item_name);
          url.searchParams.set("tscript_count", count);
          if (strangeParts.length > 0) {
            url.searchParams.set("tscript_strangeParts", strangeParts.join(", "));
          }
          btn_clone.setAttribute("href", url.toString());
        };
        updateHref();
        quantityInput.addEventListener("input", updateHref);
        const existing_button = document.getElementById(btn_clone.id);
        if (existing_button) existing_button.remove();
        btn_box.append(btn_clone);
        btn_box.append(quantityInput);
      }
    }
  }

  // src/steam/item-descriptions.js
  function nameFromItem(item) {
    let name = item.market_hash_name;
    if (item.descriptions !== void 0) {
      for (let i = 0; i < item.descriptions.length; i++) {
        const desc = item.descriptions[i];
        if (desc.value.includes("''")) continue;
        else if (desc.value === "( Not Usable in Crafting )") name = "Non-Craftable " + name;
        else if (desc.value.startsWith("\u2605 Unusual Effect: ")) {
          for (let tag of item.tags) {
            if (tag.category === "Type" && tag.internal_name === "Supply Crate") {
            }
          }
          const effect = desc.value.substring("\u2605 Unusual Effect: ".length);
          name = name.replace("Unusual", effect);
        }
      }
    }
    name = name.replace("\n", " ");
    name = name.replace("Series #", "#");
    name = name.replace(/ #\d+$/, "");
    return name;
  }
  function getAttachedParts(desc, partsToFind) {
    let description = desc.descriptions;
    if (!description) return {};
    const foundParts = [];
    for (const line of description) {
      if (!line.value) continue;
      const match = line.value.match(/^\((.+): (\d+)\)$/);
      if (match) {
        const partName = match[1];
        for (const target of partsToFind) {
          if (partName.includes(traget)) {
            foundParts.append(partName);
          }
        }
      }
    }
    return foundParts;
  }
  function getDescription(quickDescriptionLookup, descriptions, classID, instanceID) {
    const key = classID + "_" + (instanceID || "0");
    if (quickDescriptionLookup[key]) {
      return quickDescriptionLookup[key];
    }
    for (let i = 0; i < descriptions.length; i++) {
      quickDescriptionLookup[descriptions[i].classid + "_" + (descriptions[i].instanceid || "0")] = descriptions[i];
    }
    return quickDescriptionLookup[key];
  }

  // src/steam/inventory.js
  function interceptInventoryRequest() {
    let old_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      if (url.endsWith("/json/440/2/?trading=1")) {
        setInternalRequestSent(true);
        XMLHttpRequest.prototype.open = old_open;
      }
      return old_open.apply(this, arguments);
    };
  }
  function getInventories() {
    return new Promise(async (res) => {
      while (!UserYou.rgContexts["440"]) {
        await waitFor(0.1);
      }
      if (!internal_request_sent) UserYou.getInventory(440, 2);
      UserThem.LoadForeignAppContextData(g_ulTradePartnerSteamID, 440, 2);
      let done = false;
      setTimeout(() => {
        if (!done) throwError("[getInventories]: Timeout waiting for inventory data.");
      }, 15e3);
      const inventories = await Promise.all([getSingleInventory(UserYou), getSingleInventory(UserThem)]);
      done = true;
      res(inventories);
    });
  }
  function getSingleInventory(User) {
    return new Promise(async (res) => {
      let inv = User.rgContexts["440"]["2"].inventory?.rgInventory;
      if (!inv || User.cLoadsInFlight !== 0) {
        if (User.cLoadsInFlight === 0) User.loadInventory();
        inv = await waitForInventoryLoad(User);
      } else inv = Object.values(inv);
      res(parseInventory(inv));
    });
  }
  function waitForInventoryLoad(User) {
    return new Promise(async (res) => {
      let done = false;
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
      const onLoad = User.OnLoadInventoryComplete;
      User.OnLoadInventoryComplete = function(data, appid, contextid) {
        if (appid === 440 && contextid === 2) {
          done = true;
          res(Object.values(data.responseJSON.rgInventory));
        }
        User.OnLoadInventoryComplete = onLoad;
        return onLoad.apply(this, arguments);
      };
      const on_Fail = User.OnInventoryLoadFailed;
      User.OnInventoryLoadFailed = async function(data, appid, contextid) {
        if (appid === 440 && contextid === 2) {
          console.log("[waitForInventoryLoad]: load failed, requesting manually");
          const inv = await getInventory(User.strSteamId);
          done = true;
          res(inv);
        }
        User.OnInventoryLoadFailed = on_Fail;
        return on_Fail.apply(this, arguments);
      };
    });
  }
  function parseInventory(items) {
    return items.map((item) => {
      return {
        id: item.id,
        defindex: item.app_data.def_index,
        name: nameFromItem(item),
        descriptions: item.descriptions
      };
    });
  }
  async function getInventory(steam_id) {
    let body;
    try {
      const response = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=2000&l=english");
      if (!response.ok) throwError("[getInventory]: response status error: " + response.status);
      body = await response.json();
      if (body.more_items) {
        const moreResponse = await fetch("https://steamcommunity.com/inventory/" + steam_id + "/440/2?count=1000&more_start=1000&l=english");
        if (!moreResponse.ok) throwError("[getInventory]: more_response status error: " + moreResponse.status);
        const more_body = await moreResponse.json();
        body.assets = body.assets.concat(more_body.assets);
        body.descriptions = body.descriptions.concat(more_body.descriptions);
      }
    } catch (err) {
      return throwError("[getInventory]: Could not obtain inventory data: " + err);
    }
    const quickDescriptionLookup = {};
    const inv = [];
    for (let i = 0; i < body.assets.length; i++) {
      const description = getDescription(quickDescriptionLookup, body.descriptions, body.assets[i].classid, body.assets[i].instanceid);
      description.id = body.assets[i].assetid;
      description.name = nameFromItem(description);
      description.tags = {
        strangeParts: []
      };
      description.tags.strangeParts.push(...getAttachedParts(description));
      inv.push(JSON.parse(JSON.stringify(description)));
    }
    return inv;
  }

  // src/steam/trade-offer.js
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
        them: { assets: items_to_receive, currency: [], ready: false }
      }),
      captcha: "",
      trade_offer_create_params: JSON.stringify({
        trade_offer_access_token: params.get("token")
      })
    };
    const form = new FormData();
    for (let key in body) form.append(key, body[key]);
    try {
      const response_body = await (await fetch("https://steamcommunity.com/tradeoffer/new/send", {
        method: "POST",
        body: form
      })).json();
      if (response_body.strError) return throwError("[sendOffer]: " + response_body.strError);
      return response_body.tradeofferid;
    } catch {
    }
  }
  function normalizeName(name) {
    const prefixes = ["Taunt: ", "The "];
    for (const prefix of prefixes) {
      if (name.startsWith(prefix)) {
        name = name.substring(prefix.length);
      }
    }
    if (DEBUG) {
      console.log("normalizeName: " + name);
    }
    return name;
  }
  function toTradeOfferItem(id) {
    return {
      appid: 440,
      contextid: "2",
      amount: 1,
      assetid: id
    };
  }

  // src/steam/currency.js
  function correctCurrency(metal) {
    let keys = metal[0];
    let ref = metal[1];
    let rec = metal[2];
    let scrap = metal[3];
    let half_scrap = metal[4];
    if (scrap >= 3) {
      scrap -= 3;
      rec += 1;
    }
    if (rec >= 3) {
      rec -= 3;
      ref += 1;
    }
    ;
    return [keys, ref, rec, scrap, half_scrap];
  }
  function toCurrencyTypes(currencyString, count) {
    const match = currencyString.match(/^(\d+ keys?,? ?)?(\d+(?:\.\d+)? ref)?$/);
    if (!match) return throwError("[toCurrencyTypes]: Could not parse currency: " + currencyString);
    let keys = 0;
    let metal = 0;
    if (match[1]) {
      const keyLength = match[1].indexOf(" ");
      keys = Number(match[1].slice(0, keyLength));
    }
    if (match[2]) {
      const refLength = match[2].indexOf(" ");
      metal = Number(match[2].slice(0, refLength));
    }
    function roundToHalf(value) {
      return Math.round(value * 2) / 2;
    }
    const metalInScrap = roundToHalf(metal * 9);
    const totalScrap = metalInScrap * count;
    metal = totalScrap;
    const ref = Math.floor(totalScrap / 9);
    metal -= ref * 9;
    const rec = Math.floor(metal / 3);
    metal -= rec * 3;
    const scrap = Math.floor(metal);
    metal -= scrap;
    let halfScrap = 0;
    if (metal === 0.5) {
      halfScrap += 1;
    }
    console.groupCollapsed("[toCurrencyTypes]: Metal");
    console.table({
      metalInScrap,
      totalScrap,
      refined: ref,
      reclimed: rec,
      scrap,
      halfScrap,
      metal
    });
    console.groupEnd();
    keys = keys * count;
    return correctCurrency([keys, ref, rec, scrap, halfScrap]);
  }
  function pickCurrency(inventory, keys, ref, rec, scrap, halfScrap) {
    const invKeys = inventory.filter((item) => item.name === "Mann Co. Supply Crate Key");
    const invRef = inventory.filter((item) => item.name === "Refined Metal");
    const invRec = inventory.filter((item) => item.name === "Reclaimed Metal");
    const invScrap = inventory.filter((item) => item.name === "Scrap Metal");
    if (DEBUG) {
      const logData = inventory.map((item) => {
        const found = itemsWithPriceHalfScrap.has(item.name);
        return {
          Name: item.name,
          Found: found ? "\u2705" : "\u274C"
        };
      });
      console.groupCollapsed("[pickCurrency]: Items with price half scrap:");
      console.log(logData);
      console.groupEnd();
    }
    ;
    const invHalfScrap = inventory.filter((item) => itemsWithPriceHalfScrap.has(item.name));
    DEBUG && console.log("[pickCurrency]: Inventory:", inventory);
    DEBUG && console.log("[pickCurrency]: Inventory (half scrap):", invHalfScrap);
    console.log("[pickCurrency]: Half scrap in the start: " + halfScrap);
    if (invKeys.length < keys) return throwError("[pickCurrency]: Insufficient Keys");
    if (allow_change && invRef.length + invRec.length / 3 + invScrap.length / 9 + invHalfScrap.length / 20 < ref + rec / 3 + scrap / 9 + halfScrap / 20) return throwError("[pickCurrency]: Insufficient Metal");
    if (!allow_change && (invRef.length < ref || invRec.length < rec || invScrap.length < scrap || invHalfScrap.length < halfScrap)) return throwError("[pickCurrency]: Insufficient Metal");
    let leftoverRef = invRef.length - ref;
    let leftoverRec = invRec.length - rec;
    let leftoverScrap = invScrap.length - scrap;
    let leftoverHalfScrap = invHalfScrap.length - halfScrap;
    let change = { ref: 0, rec: 0, scrap: 0, halfScrap: 0 };
    console.log(`[pickCurrency]: leftoverRef: ${leftoverRef}; leftoverRec: ${leftoverRec}; leftoverScrap: ${leftoverScrap}; leftoverHalfScrap: ${leftoverHalfScrap}`);
    console.log(`[pickCurrency]: scrap: ${scrap}`);
    if (leftoverScrap < 0) {
      leftoverScrap = -leftoverScrap;
      rec += Math.ceil(leftoverScrap / 3);
      leftoverRec -= Math.ceil(leftoverScrap / 3);
      change.scrap += 3 - leftoverScrap % 3;
      change.scrap = change.scrap % 3;
      scrap -= leftoverScrap;
      leftoverScrap = 0;
    }
    if (leftoverRec < 0) {
      leftoverRec = -leftoverRec;
      ref += Math.ceil(leftoverRec / 3);
      leftoverRef -= Math.ceil(leftoverRec / 3);
      change.rec += 3 - leftoverRec % 3;
      change.rec = change.rec % 3;
      rec -= leftoverRec;
      leftoverRec = 0;
    }
    if (leftoverRef < 0) {
      ref -= -leftoverRef;
      rec += -leftoverRef * 3;
      leftoverRec -= -leftoverRef * 3;
      leftoverRef = 0;
    }
    if (leftoverRec < 0) {
      rec -= -leftoverRec;
      scrap += -leftoverRec * 3;
      leftoverScrap -= -leftoverRec * 3;
      leftoverRec = 0;
    }
    if (leftoverScrap < 0) {
      if (leftoverHalfScrap < -leftoverScrap * 2) return throwError("[pickCurrency]: Insufficient Metal");
      scrap -= leftoverScrap;
      halfScrap += -leftoverScrap * 2;
      leftoverHalfScrap -= -leftoverScrap * 2;
      leftoverScrap = 0;
    }
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
    console.groupCollapsed("[pickCurrency]: Before & change: ");
    console.log("[pickCurrency]: Before scrap: " + scrap + "; change.scrap: " + change.scrap);
    if (scrap !== 0 && change.scrap !== 0) {
      let reduce = Math.min(scrap, change.scrap);
      scrap -= reduce;
      change.scrap -= reduce;
    }
    console.log("[pickCurrency]: After scrap: " + scrap + "; change.scrap: " + change.scrap);
    if (halfScrap !== 0 && change.halfScrap !== 0) {
      let reduce = Math.min(halfScrap, change.halfScrap);
      halfScrap -= reduce;
      change.halfScrap -= reduce;
    }
    console.log(`[pickCurrency]: Change after balance: Ref: ${change.ref}; Rec: ${change.rec}; Scrap: ${change.scrap}; Half scrap: ${change.halfScrap}`);
    console.groupEnd();
    const keyStart = Math.floor(Math.random() * (invKeys.length - keys + 1));
    const refStart = Math.floor(Math.random() * (invRef.length - ref + 1));
    const recStart = Math.floor(Math.random() * (invRec.length - rec + 1));
    const scrapStart = Math.floor(Math.random() * (invScrap.length - scrap + 1));
    const halfScrapStart = Math.floor(Math.random() * (invHalfScrap.length - halfScrap + 1));
    const takeKeys = invKeys.slice(keyStart, keyStart + keys);
    const takeRef = invRef.slice(refStart, refStart + ref);
    const takeRec = invRec.slice(recStart, recStart + rec);
    const takeScrap = invScrap.slice(scrapStart, scrapStart + scrap);
    const takeHalfScrap = invHalfScrap.slice(halfScrapStart, halfScrapStart + halfScrap);
    console.log(`[pickCurrency]: Take: Keys: ${takeKeys.length}; Ref: ${takeRef.length}; Rec: ${takeRec.length}; Scrap: ${takeScrap.length}; 
        Half scrap: ${takeHalfScrap.length}`);
    const items = [...takeKeys, ...takeRef, ...takeRec, ...takeScrap, ...takeHalfScrap];
    if (keys < 0 || ref < 0 || rec < 0 || scrap < 0 || halfScrap < 0 || change.ref < 0 || change.rec < 0 || change.scrap < 0 || change.halfScrap < 0 || keyStart < 0 || refStart < 0 || recStart < 0 || scrapStart < 0 || halfScrapStart < 0 || keys === void 0 || ref === void 0 || rec === void 0 || scrap === void 0 || halfScrap === void 0 || keys > invKeys.length || ref > invRef.length || rec > invRec.length || scrap > invScrap.length || halfScrap > invHalfScrap.length || items.length < keys || takeKeys.length !== keys || takeRef.length !== ref || takeRec.length !== rec || takeScrap.length !== scrap || takeHalfScrap.length !== halfScrap || Math.round((ref + rec / 3 + scrap / 9 + halfScrap / 20) * 100) !== Math.round((takeRef.length + takeRec.length / 3 + takeScrap.length / 9 + takeHalfScrap.length / 20) * 100)) {
      console.error("[pickCurrency]: Something went wrong balancing currencies: ", {
        values: { keys, ref, rec, scrap, half_scrap: halfScrap },
        change: {
          ref: change.ref,
          rec: change.rec,
          scrap: change.scrap,
          half_scrap: change.halfScrap
        },
        start: { key_start: keyStart, ref_start: refStart, rec_start: recStart, scrap_start: scrapStart, half_scrap_start: halfScrapStart },
        isNegative: {
          keys: keys < 0,
          ref: ref < 0,
          rec: rec < 0,
          scrap: scrap < 0,
          half_scrap: halfScrap < 0,
          changeRef: change.ref < 0,
          changeRec: change.rec,
          changeScrap: change.scrap,
          changeHalfScrap: change.halfScrap,
          key_start: keyStart < 0,
          refStart: refStart < 0,
          recStart: recStart < 0,
          scrapStart: scrapStart < 0,
          halfScrapStart: halfScrapStart < 0
        },
        isUndefined: {
          keys: keys === void 0,
          ref: ref === void 0,
          rec: rec === void 0,
          scrap: scrap === void 0,
          half_scrap: halfScrap === void 0
        },
        inventoryLengthChecks: {
          keys: keys > invKeys.length,
          ref: ref > invRef.length,
          rec: rec > invRec.length,
          scrap: scrap > invScrap.length,
          halfScrap: halfScrap > invHalfScrap.length
        },
        takeLengthMismatch: {
          keys: takeKeys.length !== keys,
          ref: takeRef.length !== ref,
          rec: takeRec !== rec,
          scrap: takeScrap !== scrap,
          halfScrap: takeHalfScrap !== halfScrap
        },
        items: {
          value: items,
          isTooShort: items.length < keys
        }
      });
      return [[-1, -1, -1, -1], [-1, -1, -1, -1]];
    }
    return [items, [change.ref, change.rec, change.scrap, change.halfScrap]];
  }

  // src/steam/index.js
  async function run3() {
    const params = new URLSearchParams(location.search);
    if (!params.has("tscript_price")) return;
    interceptInventoryRequest();
    await awaitDocumentReady();
    let itemsToGive = [];
    let itemsToReceive = [];
    let [ourInventory, theirInventory] = await getInventories();
    window.our_inv = ourInventory;
    window.their_inv = theirInventory;
    const validTradeOfferStates = [2, 4, 9];
    const takedAssetIds = [];
    if (config.SteamAPI !== "" && config.SteamAPI !== "Null") {
      try {
        const response = await fetch(GetTradeOffers + "?" + new URLSearchParams(GetTradeOffers_params));
        console.log("[SteamAPI/GetTradeOffers]: Response Status:", response.status);
        if (!response.ok) throw new Error(`[SteamAPI/GetTradeOffers]: Status ${response.status}`);
        const data = await response.json();
        data.response.trade_offers_sent?.forEach((offer) => {
          if (validTradeOfferStates.includes(offer.trade_offer_state)) {
            offer.items_to_give.forEach((item) => takedAssetIds.push(item.assetid));
          }
        });
        console.log("[SteamAPI/GetTradeOffers]: taked_assetIds:", takedAssetIds);
      } catch (error) {
        console.error("[SteamAPI/GetTradeOffers]: Error:", error);
      }
    } else if (config.SteamAPI === "") {
      config.SteamAPI = prompt("Enter your Steam API Key for use trade fetch feature in next time or 'Null' if don't want use it:");
      if (config.SteamAPI) {
        GM_setValue("SteamAPI", config.SteamAPI);
      }
    }
    let ourFilteredInventory = ourInventory.filter((item) => !takedAssetIds.includes(item.id));
    if (!params.has("tscript_id")) {
      const neededItemName = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
      const currencyString = params.get("tscript_price");
      const requestedCount = parseInt(params.get("tscript_count") || "1", 10);
      const strangeParts = params.get("tscript_strangeParts")?.split(",").filter(Boolean) || [];
      console.groupCollapsed("[Buy Order]: Request: ");
      console.table({
        itemName: neededItemName,
        currency: currencyString,
        count: requestedCount,
        strangeParts
      });
      console.groupEnd();
      const neededItems = [];
      if (document.referrer === "https://next.backpack.tf/") {
        ourFilteredInventory = ourFilteredInventory.map((item) => ({
          ...item,
          name: normalizeName(item.name)
        }));
      }
      DEBUG && console.log("[Buy Order]: ourFilteredInventory: ", ourFilteredInventory);
      let itemsByName = ourFilteredInventory.filter((item) => item.name === neededItemName);
      if (strangeParts && strangeParts.length > 0) {
        itemsByName = itemsByName.filter((item) => {
          const myItemParts = item.tags?.strangeParts;
          if (!myItemParts || myItemParts.length === 0) {
            return false;
          }
          return strangeParts.every((neededPart) => {
            return myItemParts.some((myPart) => myPart.includes(neededPart));
          });
        });
      }
      console.log("[Buy Order]: itemsByName: ", itemsByName);
      for (let i = 0; i < requestedCount; i++) {
        if (i < itemsByName.length) {
          neededItems.push(itemsByName[i]);
        }
      }
      if (!neededItems) return throwError("[Buy Order]: Could not find item in your inventory.");
      let actualCount = neededItems.length;
      if (requestedCount == actualCount) {
        console.log(`[Buy Order]: Requested ${requestedCount}, Found ${actualCount}`);
      } else {
        console.warn(`[Buy Order]: Requested ${requestedCount} != Found ${actualCount}`);
      }
      while (actualCount >= 1) {
        console.log(`[Buy Order]: Trying to buy ${actualCount} items`);
        const tempItemsToGive = [];
        for (const item of neededItems) {
          tempItemsToGive.push(toTradeOfferItem(item.id));
        }
        const currencies = toCurrencyTypes(currencyString, actualCount);
        const [theirCurrency, change] = pickCurrency(theirInventory, ...currencies);
        if (change.find((c) => c !== 0)) {
          const [ourCurrency, change2] = pickCurrency(ourFilteredInventory, 0, ...change);
          if (change2.find((c) => c !== 0)) {
            actualCount--;
            for (let i = 0; i < neededItems.length; i++) {
              neededItems.splice(i, 1);
              break;
            }
            continue;
          }
          for (const c of ourCurrency) tempItemsToGive.push(toTradeOfferItem(c.id));
        }
        console.warn(`[Buy Order]: Actual count balanced items: ${actualCount}`);
        itemsToGive = tempItemsToGive;
        for (const c of theirCurrency) itemsToReceive.push(toTradeOfferItem(c.id));
        break;
      }
      if (actualCount === 0) return throwError("[Buy Order]: Could not balance currencies.");
    } else {
      const itemId = params.get("tscript_id");
      const itemName = decodeURIComponent(decodeURIComponent(params.get("tscript_name"))).replace("u0023", "#");
      const currencyString = params.get("tscript_price");
      const requestedCount = parseInt(params.get("tscript_count") || "1", 10);
      const strangeParts = params.get("tscript_strangeParts")?.split(",").filter(Boolean) || [];
      console.groupCollapsed("[Sell Order]: Request: ");
      console.table({
        itemId,
        itemName,
        currency: currencyString,
        count: requestedCount,
        strangeParts
      });
      console.groupEnd();
      const neededItems = [];
      const itemById = theirInventory.find((item) => item.id === itemId);
      if (itemById) neededItems.push(itemById);
      DEBUG && console.log("[Sell Order]: theirInventory: ", theirInventory.filter((item) => item.name));
      let itemsByName = theirInventory.filter((item) => item.name === itemName && item.id !== itemId);
      if (strangeParts && strangeParts.length > 0) {
        itemsByName = itemsByName.filter((item) => {
          const myItemParts = item.tags?.strangeParts;
          if (!myItemParts || myItemParts.length === 0) {
            return false;
          }
          return strangeParts.every((neededPart) => {
            return myItemParts.some((myPart) => myPart.includes(neededPart));
          });
        });
      }
      for (let i = 0; i < requestedCount - 1; i++) {
        if (i < itemsByName.length) {
          neededItems.push(itemsByName[i]);
        }
      }
      if (!neededItems) return throwError("[Sell Order]: Item(-s) has already been sold.");
      let actualCount = neededItems.length;
      if (actualCount == requestedCount) {
        console.log(`[Sell Order]: Requested ${requestedCount}, Found ${actualCount}`);
      } else {
        console.warn(`[Sell Order]: Requested ${requestedCount} != Found ${actualCount}`);
      }
      while (actualCount >= 1) {
        console.log(`[Sell Order]: Trying to buy ${actualCount} items`);
        const tempItemsToReceive = [];
        for (const item of neededItems) {
          tempItemsToReceive.push(toTradeOfferItem(item.id));
        }
        console.log("[Sell Order]: Items to receive: ", tempItemsToReceive);
        const totalPrice = toCurrencyTypes(decodeURIComponent(decodeURIComponent(currencyString)), actualCount);
        console.log(`[Sell Order]: Total price for ${actualCount} items: ${totalPrice}`);
        const [ourCurrency, change] = pickCurrency(ourFilteredInventory, ...totalPrice);
        if (change.find((c) => c !== 0)) {
          const [theirCurrency, change2] = pickCurrency(theirInventory, 0, ...change);
          console.log("[Post_pickCurrency]: change 2 " + change2);
          if (change2.find((c) => c !== 0)) {
            actualCount--;
            for (let i = 0; i < neededItems.length; i++) {
              if (neededItems[i].id !== itemId) {
                neededItems.splice(i, 1);
                break;
              }
            }
            continue;
          }
          for (let c of theirCurrency) tempItemsToReceive.push(toTradeOfferItem(c.id));
        }
        console.warn(`[Sell Order]: Actual count balanced items: ${actualCount}`);
        itemsToReceive = tempItemsToReceive;
        for (const currency_item of ourCurrency) {
          itemsToGive.push(toTradeOfferItem(currency_item.id));
        }
        break;
      }
      if (actualCount === 0) return throwError("[Sell Order]: Could not balance currencies.");
    }
    const offerId = await sendOffer(itemsToGive, itemsToReceive);
    if (offerId) console.log("[One-Click-Offer/Final]: Success");
    if (offerId && !DEBUG) window.close();
  }

  // src/main.js
  main();
  async function main() {
    applyWallpaper();
    const hostname = location.hostname;
    const pathname = location.pathname;
    if (hostname === "backpack.tf" || hostname === "www.backpack.tf") {
      await run();
    } else if (hostname === "next.backpack.tf") {
      await run2();
    } else if (hostname === "steamcommunity.com" && pathname.startsWith("/tradeoffer/new")) {
      await run3();
    }
  }
})();