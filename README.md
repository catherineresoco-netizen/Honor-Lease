# Honor Flex — Pitch Experience (GitHub Pages edition)

This is the **static, browser-storage version** of Honor Flex. Its new **Pitch experience** tab contains eight animated scenes, fullscreen and keyboard navigation, auto play/pause, and an interactive payment-scheme illustration. It needs no API hosting or paid services.

## Update the public website

1. **Back up** the current `main` branch of `catherineresoco-netizen/Honor-Lease` (for example, create a `before-pitch` branch).
2. Copy this edition's `index.html`, `pitch.css`, and `pitch.js` to the root of the **main branch**. Do **not** copy backend server files over `main`.
3. Commit and push. GitHub Pages deploys the static site from the existing Pages branch/folder.
4. Hard refresh the public site and choose **✦ Pitch experience** in the navigation.

Before overwriting main's `index.html`, compare it with your latest live version: this package is based on your saved cinematic **static** app. Any edits made independently on GitHub after that version would need to be merged. The private `real-api-demo` branch remains separate.

## Present

Use the navigation tab, click **Full screen**, then tap the scene bars or press the right/left arrows. **Auto** cycles through scenes (around two minutes); pause it to use the interactive deposit slider. ESC exits fullscreen. The presentation is deliberately **silent**.

The fictional marketplace, properties, and policy controls on GitHub Pages use browser storage and do not synchronize across users. The pitch has a separate interactive cost calculator; it does not write landlord policies.

## Safety and claims

No partner or Zillow integration is claimed. The real Node.js + SQLite API works **locally** in the separate development branch but is **not deployed publicly**. Policy terms are illustrative and not legal advice.
