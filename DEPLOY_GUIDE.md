# Honor Flex — online deployment guide

This branch provides a publicly readable hosted demonstration with password-protected mutations. It is not production partner authorization or a real Zillow integration.

## 1. Update your real-api-demo branch

Copy the updated `server.js`, `index.html`, `render.yaml`, `.gitignore` to your cloned `Honor-Lease` repository on the `real-api-demo` branch. Do **not** commit any `.sqlite` database, passwords, or `.env` files. Then commit and push.

## 2. Deploy to Render

- Visit https://dashboard.render.com/ and select **New > Blueprint** (connected to GitHub).
- Select your `catherineresoco-netizen/Honor-Lease` repository and the `real-api-demo` branch; approve `render.yaml`. If Blueprint selection doesn't support your branch, create a **Web Service** from `real-api-demo` instead and apply the `render.yaml` settings manually.
- The Blueprint uses a **paid** Node.js service and a persistent disk mounted at `/var/data`. Confirm charges before approving. SQLite data will persist through normal deploys/restarts on that disk.
- Set secret `HONOR_ADMIN_PASSWORD` in Render to a unique, randomly generated password (14+ characters); never put it in code or GitHub.
- Wait for the service to report healthy, and copy your actual URL like `https://your-service.onrender.com`.
- Test `https://your-service.onrender.com/api/health`, then `/api/properties/lake/policy`. Both should return JSON.

## 3. Update the public GitHub Pages front end

- In the *main* branch, back up `index.html` first.
- Copy the new `index.html` from this package to *main*, then find the line near its `</head>`:
  `window.HONOR_API_BASE = window.HONOR_API_BASE || '';`
  Change the empty string to your Render URL, e.g. `window.HONOR_API_BASE = 'https://YOUR-RENDER-SERVICE.onrender.com';`
- Commit to `main`. GitHub Pages will rebuild the site. The page now sends requests to Render rather than requesting `/api` on GitHub Pages.
- Test a renter GET request, then click Publish; a browser password prompt should appear. Only team members with the admin password can edit policies or reset data.
- If you don't want to risk your public Pages site yet, demonstrate the complete app directly at your Render URL instead.

## 4. Security and limitations

- This is a **student demonstration**, not a production multi-tenant API. It uses a shared admin password and HTTP Basic authentication over HTTPS for edit routes. Don't use it for real applicants, payments, private personal data, or partner integrations. The frontend keeps the password only in memory in the current tab; refresh clears it.
- Public GET endpoints intentionally allow anyone to see fictional property data. Never add private data.
- `PUBLIC_ORIGIN` restricts allowed browser cross-origin calls to the GitHub Pages site. Requests without an Origin header can still read public endpoints; writes require the admin credential.
- Paid Render service + attached disk have recurring cost. The free Render service cannot persist SQLite.
- This is not a replacement for authenticated partner accounts, per-tenant authorization, backups and monitoring.
