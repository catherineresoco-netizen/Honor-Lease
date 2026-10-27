# Honor Flex — Working API + Premium Marketplace

A **functional local API** demonstration for the Google + Foothill Case Competition. It preserves the cinematic Impact & Business page, eight fictional properties, equal and custom installment schemes, first-month rent concessions, Revenue Lab, and Developer View.

## Run in VS Code (Windows / PowerShell)

1. Extract the ZIP into a folder.
2. In VS Code choose **File → Open Folder** and select `Honor_Flex_Real_API_VSCode`.
3. Open **Terminal → New Terminal**.
4. Verify Node.js version is 22.13+ (`node --version`; Node.js 24 is recommended).
5. Run `node server.js` or `npm.cmd start` (PowerShell may block `npm`, so use `npm.cmd`).
6. Open **http://127.0.0.1:3000** in Chrome or Edge.

No `npm install` is necessary. The project uses Node's built-in SQLite module and creates a local database file (`honor-flex-demo.sqlite`) automatically. If port 3000 is in use, in PowerShell run `$env:PORT=3215; node server.js` and browse to `http://127.0.0.1:3215`.

## Demonstrate the real integration

1. Open two browser windows at `http://127.0.0.1:3000`.
2. In the first, select **Property Manager** → **Lake Merritt Residence**.
3. Enter deposit **1800**, move-in deposit **600**, three later monthly installments; choose **Custom** and enter **600**, **400**, **200**.
4. Enable a **$250 first-month rent credit**. Click **Publish**.
5. In the second window, view **Explore Homes** and open Lake Merritt Residence. Changes appear after a brief refresh (the app fetches from the API every five seconds, or reload the page).
6. In **Developer View**, inspect the actual JSON response fetched from the API.
7. Close the browser/restart the server: policies remain in the SQLite database. **Reset demo data** restores defaults.

Illustrative result: $2,400 first rent + $1,800 full deposit = $4,200 normally; with $600 initial deposit and $250 rent credit, immediate cash = $2,750. This represents **$1,200 deferred deposit**, plus **$250 in rent credit**, not a $1,450 deposit discount.

## Real endpoints

- `GET /api/health` → storage status
- `GET /api/properties` → eight fictional listings
- `GET /api/properties/:id/policy` → calculated JSON schedule, costs and balance
- `GET /api/properties/:id/schedule` → same calculated policy payload
- `PUT /api/properties/:id/policy` → validate and persist landlord policy as JSON
- `POST /api/reset` → reset fictional seed data

Sample API read: http://127.0.0.1:3000/api/properties/lake/policy

Test the backend with `node test-api.js`. The script tests the endpoints and resets demo data.

## Files

- `index.html`: existing premium simulated rental marketplace and business storytelling, now integrated with real HTTP calls
- `server.js`: working HTTP API, validation, local-only server, and SQLite storage
- `seed-properties.json`: eight fictional starter properties
- `test-api.js`: endpoint and calculation tests
- `package.json`: launch commands
- `build_seed.js`: development helper for generating initial seed fixtures; not needed to run the demo

## Important security and scope limitations

This is a **local demo only**, bound to `127.0.0.1`. Its administrative `PUT` and reset endpoints intentionally have **no partner authentication**: this is acceptable only because it is not reachable from other computers by default. **Do not deploy this server directly to Render, GitHub Pages, Netlify or the public internet**. To host it publicly, first implement real administrator/partner authentication, authorization, rate limiting, logging, privacy safeguards, and proper per-partner tenant isolation. The database contains entirely fictional property data and no applicant data.

GitHub Pages can host a static frontend, but cannot run this SQLite Node.js backend. To demonstrate the real API, run locally or use an appropriately secured host.

No Zillow or property-management company is integrated; **Haven Homes** is a fictional marketplace simulation. This is software architecture proof of concept, not a validated landlord agreement, real rent concession, or an approved California deposit installment product.
