Tanisha Laud
8th June 2026 
Unvaulted take home

Tech stack: Next.js, React, TypeScript, Tailwind CSS, Supabase Auth, Supabase Postgres, Vercel, Sentry

Formula:
metal value = weight × metal base price × purity multiplier

gemstone value = gemstone carats × gemstone price per carat

estimated value = (metal value + gemstone value) × condition

Assumptions:
The app currently uses the following assumed metal prices:
Gold: $70 per gram
Silver: $0.90 per gram
Platinum: $32 per gram
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
These assumptions make the calculator predictable and easy to explain. In a production version, I would replace or supplement these fixed values with live commodity pricing, more detailed gemstone grading, and professional appraisal data.



Running Locally:
npm install
npm run dev


AI Tool Usage
I used ChatGPT to help plan the project, debug setup issues, create code structure, troubleshoot GitHub/Vercel deployment errors, and draft this README. The full chat history is attached below:


<img width="391" height="652" alt="Screenshot 2026-06-08 at 10 30 59 PM" src="https://github.com/user-attachments/assets/30b51964-b728-4ccd-9e0b-bca45da56931" />

<img width="475" height="688" alt="Screenshot 2026-06-08 at 10 38 09 PM" src="https://github.com/user-attachments/assets/0eb324e7-28b5-4d25-8891-a5a44ac030b3" />

<img width="454" height="727" alt="Screenshot 2026-06-08 at 10 39 45 PM" src="https://github.com/user-attachments/assets/104f72cc-9fac-4b63-a561-ad11d9dfb4d8" />



