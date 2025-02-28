# Changelog

# Versioning Scheme

We use a **X.X.X.X.x** versioning system, where each number represents a specific type of update:

- **First X (Major)** – Major updates that significantly change the core functionality of the program.  
- **Second X (Feature)** – New features or enhancements that add new functionality.  
- **Third X (UI/UX)** – Changes in the user interface and design updates.  
- **Fourth X (Fixes & Patches)** – The last number of the bug that was fixed ([Issue](https://github.com/BrBriz/One-Click-Offer/issues)).  
- **Fifth x (Bad Fix)** - Possible under a problem fix version

## [1.5.1.2] - 2025-02-28
### Added 
- Support GetTradeOffers (req.:const SteamAPI = "[API_KEY](https://steamcommunity.com/dev/apikey)";)
- For example: If you already have offers for your things, the program will ignore them when sending an offer. The function only works if SteamAPI is not empty ("").
![Lines where need put API_KEY](/images/GetTradeOffers_Lines.png)

- Optimized browser logs

## [1.4.1.2.8] - 2025-01-21
### Added 
- More debug in console ([Issue #2](https://github.com/BrBriz/One-Click-Offer/issues/2))
### UI/UX
- Changed color button to red 

### Fixed
- In big trades script gives more scrap than needed ([Issue #2](https://github.com/BrBriz/One-Click-Offer/issues/2))

## [1.4.0.1] - 2025-01-17
### Added
- More debug in console ([Issue #1](https://github.com/BrBriz/One-Click-Offer/issues/1))

## [1.4.0] - 2025-01-10
### Added
- Supports trade offers that require half of scrap metal

