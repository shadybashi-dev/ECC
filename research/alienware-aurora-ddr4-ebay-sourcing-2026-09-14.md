# eBay US – DDR4 Sourcing Report: Dell Alienware Aurora (Intel)

**Scan date:** 2026-09-14 · **Destination:** California (priced to ZIP 90001) · **Currency:** USD
**Persona:** Hardware Procurement Specialist / eBay Sourcing Bot

## Scan parameters

| Parameter | Value |
|---|---|
| Platform | Dell Alienware Aurora, Intel board, 4 × DDR4 UDIMM slots |
| Target form factor | DDR4 288-pin **UDIMM**, unbuffered, **non-ECC**, **1.2 V JEDEC** |
| Target speed | 3200 MHz (PC4-25600, CL22 preferred) — 2933 MHz acceptable fallback |
| Sort | `_sop=15` (Price + Shipping: lowest first) |
| Shipping quote | `_stpos=90001` (Los Angeles, CA) |
| Landed cost | Item + Shipping + 8.5% est. CA sales tax on (item + shipping) |
| Auto-exclusion terms applied | `-ecc -server -registered -laptop -sodimm` |

### Platform verification (before buying anything)

Dell's own spec for the Intel Aurora confirms the ceiling and the slot map [1](https://www.dell.com/support/manuals/en-us/alienware-aurora-r11-desktop/alienware-aurora-r11-setup-and-specifications/memory?guid=guid-e9d2ea83-38a4-431d-803c-96d63c1dbc34&lang=en-us) [2](https://www.dell.com/support/manuals/en-ae/alienware-aurora-r12-desktop/alienware-aurora-r12-setup-and-specifications/memory?guid=guid-e9d2ea83-38a4-431d-803c-96d63c1dbc34&lang=en-us):

- **Alienware Aurora R11** (10th Gen, Z490): four UDIMM slots, DDR4, **max 128 GB**, 2933 MHz native, 3200/3400 MHz via XMP. Memory per slot: 8 / 16 / 32 GB.
- **Alienware Aurora R12** (11th Gen): four UDIMM slots, DDR4, **max 128 GB**, **3200 MHz** up to 3400 MHz XMP. Memory per slot: 8 / 16 / 32 GB.

**Consequences for this buy:**

1. **1.2 V JEDEC (PC4-3200AA / CL22) is the correct class.** It hits rated speed with *no* XMP profile, which matters because the Aurora BIOS only exposes XMP on K-series configs. A 1.35 V XMP-only kit (Corsair C16, OLOY, Patriot Viper) has no 3200 JEDEC profile and will fall back to 2133/2666 — exactly what the spec's voltage rule excludes.
2. On an **R11 (10th Gen)**, DDR4-3200 is a CPU-native 2933 part, so even a JEDEC 3200 kit trains at **2933 MHz**. Still inside spec, just not 3200. On an **R12 (11th Gen)** you get the full **3200**.
3. Filling all four slots with **32 GB 2Rx8** (dual-rank) modules puts 8 ranks on the bus; Intel 10th/11th Gen runs 2 DPC dual-rank at reduced speed. Expect ~2933 or a one-step downclock at 4 × 32 GB even on an R12. Cosmetic, not a compatibility failure.

---

## TIER 1 — 128 GB Total (4 × 32 GB)

### Tier 1 – Option 1 ⭐ RECOMMENDED (best verified Buy-It-Now)

* **Brand & Model:** MB (US-built, major-brand IC) — generic MPN, listed as "128GB 4x32GB DDR4-3200MHz UDIMM RAM, Compatible w/ Dell Precision 3640/3650 Tower"
* **Configuration:** 4 × 32 GB kit (fills all 4 slots)
* **Specs:** 3200 MHz / PC4-25600, **2Rx8 dual rank**, **1.2 V**, 288-pin, non-ECC Unbuffered UDIMM — all four hard specs confirmed in the listing's item specifics
* **Condition:** Brand New
* **Total Landed Cost:** $1,056.00 + $0.00 + ~$89.76 = **$1,145.76 CA**
* **Listing Type:** Buy It Now (free delivery, 2–4 days)
* **Seller Reliability:** mem-store — **99.9% positive (29.5K)**, located in United States
* **Direct eBay URL:** https://www.ebay.com/itm/204656482800

**Why it wins:** it is the cheapest *US-shipped, new, spec-verified* 128 GB kit on eBay right now, from a seller with a 29.5K feedback base. Free delivery and no import exposure.

---

### Tier 1 – Option 2 (lowest absolute price — auction risk)

* **Brand & Model:** Crucial by Micron, **CT32G4DFD832A** (32 GB DDR4-3200 UDIMM, CL22, 1.2 V, 2Rx8)
* **Configuration:** 4 × 32 GB kit (fills all 4 slots)
* **Specs:** DDR4-3200 / PC4-25600, CL22, **1.2 V**, 288-pin non-ECC UDIMM
* **Condition:** Pre-Owned (pulled, tested working)
* **Total Landed Cost:** $475.00 (current bid) + $5.58 + ~$40.85 = **~$521.43 CA at the current bid** — final price unknown
* **Listing Type:** **Auction, ending Sunday ~10:12 PM** (0 bids at time of scan)
* **Seller Reliability:** coco-1062 — **100% positive (30)**, located in United States
* **Direct eBay URL:** https://www.ebay.com/itm/298672333834

**Risk:** this is the cheapest route to 128 GB by roughly half, but it is a live auction with six days left — bid discovery will almost certainly move it. Seller feedback is perfect but thin (30). Set a snipe and a hard ceiling.

---

### Tier 1 – Option 3 (2 × 64 GB kits, same seller — conditional)

* **Brand & Model:** Micron **MTA16ATF4G64AZ-3G2F1** — 32 GB PC4-3200AA 2Rx8 UDIMM
* **Configuration:** 2 × (2 × 32 GB) kits = 4 × 32 GB
* **Specs:** DDR4-3200 / **PC4-3200AA** (JEDEC), 2Rx8, **1.2 V**, CL22, 288-pin non-ECC UDIMM
* **Condition:** Used
* **Total Landed Cost:** $719.98 + $10.96 + ~$62.13 = **~$793.07 CA** (combined shipping may be lower)
* **Listing Type:** Buy It Now, $359.99 each, USPS Ground Advantage
* **Seller Reliability:** **pcrefurbplus** — **100% positive (92)**, Burlington, Washington
* **Direct eBay URL:** https://www.ebay.com/itm/188914088795

**Condition/caveat:** the listing appears to be a **single kit** (1 already in a cart) — message the seller before assuming you can buy two. **Seller does not accept returns** (eBay Money Back Guarantee still applies). If two are available, this is the best *Buy-It-Now* 128 GB price by ~$350.

---

### Tier 1 – Option 4 (flagged, not recommended)

* **Brand & Model:** Crucial CT32G4DFD832A, 4 × 32 GB, 3200 MHz CL22 1.2 V
* **Total Landed Cost:** $1,085.00 + $0.00 + ~$92.23 = **~$1,177.23 CA** (import fees stated as included)
* **Sellers:** computer_server_parts 100% (67) · star_memory 98.7% (153) · **acetech_memory 93.3% (35) → AUTO-REJECT, under 98%**
* **Direct eBay URL:** https://www.ebay.com/itm/236936742056

**Why rejected:** costs *more* landed than Option 1 ($1,177 vs $1,146), ships from China, and two of the three sellers fail the 98% / feedback-depth gate. No upside over the US kit.

---

## TIER 2 — 64 GB Total (Budget Max)

### Tier 2 – Option 1 ⭐ LOWEST LANDED COST (fills all 4 slots)

* **Brand & Model:** MB (US-built) — "64GB 4x16GB DDR4-3200 UDIMM RAM Memory"
* **Configuration:** 4 × 16 GB kit (fills all 4 slots)
* **Specs:** 3200 MHz / PC4-25600, **1Rx8**, **1.2 V**, 288-pin, non-ECC Unbuffered UDIMM — verified in item specifics
* **Condition:** Brand New
* **Total Landed Cost:** $348.00 + $0.00 + ~$29.58 = **$377.58 CA**
* **Listing Type:** Buy It Now (free delivery, 2–4 days)
* **Seller Reliability:** mem-store — **99.9% positive (29.5K)**, located in United States
* **Direct eBay URL:** https://www.ebay.com/itm/204739659661

**Trade-off:** cheapest way to 64 GB, and new with free shipping, but it consumes all four slots — no upgrade path to 128 GB without replacing every module.

---

### Tier 2 – Option 2 ⭐ BEST UPGRADE PATH (2 slots left open)

* **Brand & Model:** Micron **MTA16ATF4G64AZ-3G2F1** — 32 GB PC4-3200AA 2Rx8 UDIMM
* **Configuration:** 2 × 32 GB kit (leaves 2 slots open)
* **Specs:** DDR4-3200 / PC4-3200AA (JEDEC), 2Rx8, **1.2 V**, CL22, 288-pin non-ECC UDIMM
* **Condition:** Used
* **Total Landed Cost:** $359.99 + $5.48 + ~$31.06 = **$396.53 CA**
* **Listing Type:** Buy It Now, USPS Ground Advantage (est. Sep 17–23)
* **Seller Reliability:** pcrefurbplus — **100% positive (92)**, Burlington, WA
* **Direct eBay URL:** https://www.ebay.com/itm/188914088795

**Why it matters:** $19 more than Option 1 buys you two empty slots — you can drop in a second identical kit later for 128 GB at the same per-GB cost. This is the same listing as Tier 1 Option 3, so buying it now and again later is the staged path to 128 GB.

**Caveat:** no returns accepted by this seller.

---

### Tier 2 – Option 3 (name-brand Crucial, highest-trust seller)

* **Brand & Model:** Crucial Pro **CP2K32G4DFRA32A** — 64 GB Kit (2 × 32 GB) DDR4-3200 UDIMM, CL22, 1.2 V
* **Configuration:** 2 × 32 GB kit (leaves 2 slots open)
* **Specs:** DDR4-3200 / PC4-25600, **CL22**, **1.2 V**, 288-pin non-ECC Unbuffered UDIMM
* **Condition:** Pre-Owned
* **Total Landed Cost:** $399.00 + $0.00 + ~$33.92 = **$432.92 CA**
* **Listing Type:** Buy It Now (free delivery)
* **Seller Reliability:** jdjenkin1 — **100% positive (341)**, located in United States
* **Direct eBay URL:** https://www.ebay.com/itm/298662517121

*New, if you prefer sealed retail:* Crucial Pro CP2K32G4DFRA32A, Brand New, **$589.99 or Best Offer**, free delivery, kingdv789 100% (4.9K) → $589.99 + $0.00 + ~$50.15 = **$640.14 CA**. Worth an offer at ~$500.

---

## Auto-rejected listings (hard exclusions fired)

| Listing | Price | Voltage | Feedback | Action | Reason |
|---|---|---|---|---|---|
| Corsair Vengeance LPX 64GB (2×32) 3200 **C16** | $300 auction / $600 BIN + $20 | **1.35 V XMP-only** | dihardgamr 100% (97) | ⛔ REJECT | No 1.2 V JEDEC 3200 profile; falls back to 2133/2666 on Aurora |
| OLOY 64GB (4×16) DDR4-3200 **C16 XMP** | $349.99 + $6.24 | **1.35 V XMP-only** | js_tech330 100% (31) | ⛔ REJECT | Same voltage failure |
| Patriot Viper Elite II 64GB DDR4-3200 XMP lot | $399.99 | **1.35 V XMP** | patriotmemory 99.8% (7.6K) | ⛔ REJECT | Same voltage failure |
| Crucial Pro 64GB (4×16) DDR4-3200, Open Box | $430.00 + $6.24 | 1.2 V ✅ | **sup-7928 91.3% (35)** | ⛔ REJECT | Seller below 98% floor |
| Crucial Pro 64GB (2×32), Pre-Owned | $409.00 | 1.2 V ✅ | **scstoregroup 0% (13)** | ⛔ REJECT | Zero positive-feedback score |
| Crucial Pro 64GB (2×32), Open Box | $400.00 + $5.17 | 1.2 V ✅ | whitneywu528 100% (**6**) | ⚠️ MARGINAL | Technically passes; feedback depth too thin to trust |
| Corsair Vengeance LPX 64GB (2×32) | $400.00 + $5.58 | 1.35 V | **pid_94 0% (0)** | ⛔ REJECT | Zero sales + voltage failure |
| Transcend JetRAM 128GB (4×32) CL22, new | $786.41 + $3.83 | 1.2 V ✅ | bato287 100% (275), **Germany** | ⚠️ REJECT | Import fees due at delivery; landed cost not competitive with US kit |
| 128GB (4×32) DDR4 PC4-3200AA-**E ECC UDIMM** (PowerEdge) | $1,595.99 | — | — | ⛔ REJECT | ECC Unbuffered — Aurora is non-ECC |
| Various 128GB Micron/Samsung **RDIMM / LRDIMM / 4Rx4** | $249.99–$7,561.92 | — | — | ⛔ REJECT | Registered/server memory |
| Timetec 128GB (4×32) DDR4-3200 **SODIMM** | — | — | — | ⛔ REJECT | 260-pin laptop module |

---

## Ranked summary — ascending true landed cost

| Rank | Tier | Listing | Condition | Landed (CA) | Verdict |
|---|---|---|---|---|---|
| 1 | T2 | MB 4×16GB 3200 1.2V (mem-store) | New | **$377.58** | ⭐ Cheapest 64 GB, no upgrade path |
| 2 | T2 | Micron 2×32GB PC4-3200AA (pcrefurbplus) | Used | **$396.53** | ⭐ Best value + upgrade path |
| 3 | T2 | Crucial Pro 2×32GB CP2K32G4DFRA32A (jdjenkin1) | Pre-owned | **$432.92** | Name-brand, trusted seller |
| 4 | T1 | Crucial 4×32GB CT32G4DFD832A (auction) | Pre-owned | **~$521.43** *at current bid* | Lowest 128 GB price, auction risk |
| 5 | T1 | 2 × Micron 2×32GB (pcrefurbplus) | Used | **~$793.07** | Best BIN 128 GB — **confirm qty 2** |
| 6 | T1 | MB 4×32GB 3200 2Rx8 1.2V (mem-store) | New | **$1,145.76** | ⭐ Safest 128 GB BIN |
| 7 | T1 | Crucial 4×32GB (China sellers) | New | ~$1,177.23 | Rejected — pricier + import risk |

## Bottom line

- **On a budget, 64 GB now:** buy the **Micron 2×32 GB PC4-3200AA kit at $396.53 landed**. It leaves two slots free, so the identical kit later takes you to 128 GB at the same $198/32 GB rate.
- **128 GB now, no risk:** buy the **mem-store 4×32 GB kit at $1,145.76 landed** — new, US, free shipping, 1.2 V 2Rx8 verified, 29.5K-feedback seller.
- **128 GB now, cheapest:** bid on the **Crucial CT32G4DFD832A auction** (currently $475) but cap yourself at ~$700 — past that, Option 1's new-kit-with-warranty is the better buy.

## Caveats on this scan

- Prices, bids, and shipping were read from eBay on **2026-09-14 ~00:00–07:00 UTC**; eBay's own page stamp reads "Sep-14 00:02." Auctions move; re-check before committing.
- Sales tax is modeled at a flat **8.5%** on (item + shipping) per the sourcing spec. Atascadero's actual combined rate is collected by eBay at checkout and may differ by a few tenths.
- Shipping was quoted to **ZIP 90001** (LA). Your rate to Atascadero (93422) will be within a dollar or so for USPS Ground; free-delivery listings stay free.
- Item quantities were not always exposed by the search render — **confirm stock with the seller** before any multi-kit order.
