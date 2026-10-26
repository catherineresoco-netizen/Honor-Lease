# Honor Flex — Premium Marketplace + Two Deposit Payment Schemes

Eight fictional Oakland-area rental listings, modern marketplace interface, landlord-funded first-month rent concessions, and an editable Honor Flex deposit policy. **Not affiliated with Zillow or any live marketplace.**

## Run in VS Code
1. Extract this ZIP, then open the `Honor_Flex_Payment_Schemes_VSCode` folder with **File → Open Folder**.
2. Open the VS Code terminal and run `node server.js`.
3. Open http://localhost:3000 in a browser. No `npm install` needed. Alternatively, open `index.html` directly.

## Try the new landlord flow
1. Choose **Property manager** and select **Lake Merritt Residence**.
2. Set **Full security deposit** to $1,800 and **Deposit due at move-in** to $720 (40%).
3. Select either:
   - **Equal payments over time** — divide remaining $1,080 evenly over 3 months ($360 monthly); or
   - **Custom monthly payments** — set, for example, Month 2 = $500, Month 3 = $350, Month 4 = $230 (total $1,080).
4. The live preview shows every payment, remaining deposit balance, first-month rent credit, and estimated cash due at move-in. Invalid custom totals cannot be published.
5. Click **Publish to renter listing**, return to **Explore homes**, open the property, and verify the detailed timeline matches.
6. Open **Developer view** for a simulated JSON payload describing the selected payment scheme.

All eight fictional properties and landlord-funded rent specials are retained. Changes persist in localStorage; use **Reset demo data** to restore the initial demonstration.

All payments are calculated in integer cents to avoid rounding discrepancies. Custom installment amounts must add up to the unpaid deposit exactly. This demo does not collect money, guarantee deposits, underwrite renters, or connect to Zillow or another production system. Terms need landlord approval and legal review. Photos and fonts may require internet.
