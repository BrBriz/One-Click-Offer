/**
 * @typedef {Object} item
 * @property {String} market_hash_name
 * @property {Object} tags
 *
 * @typedef {Object} tag
 * @property {String} category
 * @property {String} internal_name
 */
export function nameFromItem(item) {
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

export function getAttachedParts(desc, partsToFind) {
    let description = desc.descriptions
    if (!description) return {};
    const foundParts = [];

    for (const line of description) {
        if (!line.value) continue;

        const match = line.value.match(/^\((.+): (\d+)\)$/)

        if (match) {
            const partName = match[1];
            for (const target of partsToFind) {
                if (partName.includes(traget)) {
                    foundParts.append(partName)
                }
            }
        }
    }
    return foundParts
}

/**
 * @credit node-steamcommunity by DoctorMcKay
 */
export function getDescription(quickDescriptionLookup, descriptions, classID, instanceID) {
    const key = classID + "_" + (instanceID || "0");

    if (quickDescriptionLookup[key]) {
        return quickDescriptionLookup[key];
    }

    for (let i = 0; i < descriptions.length; i++) {
        quickDescriptionLookup[descriptions[i].classid + "_" + (descriptions[i].instanceid || "0")] = descriptions[i];
    }

    return quickDescriptionLookup[key];
}
