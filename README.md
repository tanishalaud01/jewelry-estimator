Tanisha Laud
8th June 2026 
Unvaulted take home

Tech stack: Next.js, React, TypeScript, Tailwind CSS, Supabase Auth, Supabase Postgres, Vercel, Sentry

Formula:
metal value = weight × metal spot price (per gram) × purity multiplier

gemstone value = gemstone carats × gemstone price per carat

estimated value = (metal value + gemstone value) × condition × brand tier

Live price index:
Metal spot prices are no longer hardcoded. `lib/priceIndex.ts` fetches live
gold/silver/platinum spot prices (via gold-api.com, no API key required),
converts troy-ounce prices to price-per-gram, and exposes them through
`GET /api/price-index` as a snapshot: `{ metal, pricePerGram, asOf, source }`.
If the live fetch fails, each metal falls back independently to a static
reference price (`source: "fallback"`) so the app degrades gracefully
instead of breaking. The dashboard displays the index (price, source, and
timestamp) above the form, and the estimate result shows exactly which
price point it was calculated against.

This mirrors a benchmark/index pattern: a dedicated layer resolves the
current market price for a commoditized input, and every downstream
calculation consumes that index rather than embedding its own assumption
of what the price is.

Assumptions:
The app currently uses the following assumed gemstone prices:
Diamond: $1,200 per carat
Ruby: $800 per carat
Sapphire: $600 per carat
Emerald: $700 per carat
The app also applies multipliers for metal purity, item condition, and brand tier.
Example purity assumptions:
10k gold = 41.7% pure gold
14k gold = 58.5% pure gold
18k gold = 75% pure gold
22k gold = 91.7% pure gold
24k gold = 100% pure gold
Sterling silver = 92.5% silver
Example condition assumptions:
Poor = 0.55x
Fair = 0.70x
Good = 0.85x
Excellent = 1.00x
Example brand assumptions:
Generic = 1.00x
Known brand = 1.20x
Luxury brand = 1.60x
Gemstone prices, purity, condition, and brand multipliers are still fixed
assumptions rather than live market data. In a production version, I'd
replace or supplement these with real transaction data, more detailed
gemstone grading (cut/clarity/color), and professional appraisal data —
the same gap between listed/assumed prices and real-transaction-based
benchmarks that pricing infrastructure providers in other commodity
markets (e.g. compute, energy) are built to close.



Running Locally:
npm install
npm run dev


AI Tool Usage
I used ChatGPT to help plan the project, debug setup issues, create code structure, troubleshoot GitHub/Vercel deployment errors, and draft this README. The full chat history is attached below:


<img width="391" height="652" alt="Screenshot 2026-06-08 at 10 30 59 PM" src="https://github.com/user-attachments/assets/30b51964-b728-4ccd-9e0b-bca45da56931" />

<img width="475" height="688" alt="Screenshot 2026-06-08 at 10 38 09 PM" src="https://github.com/user-attachments/assets/0eb324e7-28b5-4d25-8891-a5a44ac030b3" />

<img width="454" height="727" alt="Screenshot 2026-06-08 at 10 39 45 PM" src="https://github.com/user-attachments/assets/104f72cc-9fac-4b63-a561-ad11d9dfb4d8" />



