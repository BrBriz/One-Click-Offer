import { applyWallpaper } from "./backpack/settings-panel.js";
import * as backpack from "./backpack/index.js";
import * as nextBackpack from "./next_backpack/index.js";
import * as steam from "./steam/index.js";

main();

async function main() {
    applyWallpaper();

    const hostname = location.hostname;
    const pathname = location.pathname;

    if (hostname === "backpack.tf" || hostname === "www.backpack.tf") {
        await backpack.run();
    } else if (hostname === "next.backpack.tf") {
        await nextBackpack.run();
    } else if (hostname === "steamcommunity.com" && pathname.startsWith("/tradeoffer/new")) {
        await steam.run();
    }
}
