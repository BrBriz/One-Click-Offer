# Changelog

# Versioning Scheme

We use a **X.X.X.x** versioning system

## [2.0.6] - 2025-06-05
### Fixed
- Fixed metal calculation (again). There should no longer be a problem with metal balancing when exchanging offers for more than 1 item

## [2.0.5] - 2025-06-02
### Added
- Settings panel for API 

### Fixed
- Balance error with half_scrap

## [2.0.4] - 2025-05-16
### Fixed
- Added an additional rebalancer to avoid incorrect metal set
- From now on www.backpack.tf the script also works

## [2.0.3] - 2025-05-15
### Added
- Ability to choose the number of items you want to buy/sell to [next.backpack.tf](https://next.backpack.tf/))

### Fixed
- Takes 1 scrap insted 2 half_scrap in toCurrencyTypes()

## Major [2.0.0] - 2025-04-27
### Addded
- Ability to choose the number of items you want to buy/sell (ONLY [Backpack.tf](https://backpack.tf/))

 ![New sell/buy order ability](/images/NewSellOrderAbility.png)

- Auto rebalancer: If your order was not balanced, the program will reduce your order by 1 item and try to balance it again until it is balanced.
Ex.: The order was for 7 items, the program found only 5 in the seller/buyer's inventory, but was only able to balance on 3 items. The exchange offer will be created with only 3 items.

- Fixed browser logs
### Notice
- next.backpack.tf will also receive an update with this feature, but later.

## [1.6.1.2] - 2025-03-06
### Added
- Use half-scrap items if not enough scrap metal in trade offers.
- Better debug in console(alert)

## [1.5.1.2] - 2025-02-28
### Added 
- Support GetTradeOffers (req. : const SteamAPI = "[API_KEY](https://steamcommunity.com/dev/apikey)";)
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

