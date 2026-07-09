import * as esbuild from "esbuild";
import { readFileSync } from "fs";

const banner = readFileSync("./banner.js", "utf8");

await esbuild.build({
    entryPoints: ["src/main.js"],
    bundle: true,
    outfile: "dist/One-Click-Offer.js",
    format: "iife",
    target: "es2022",
    banner: { js: banner },
    minify: false,
});

console.log("Built dist/One-Click-Offer.js");
