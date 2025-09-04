# Tampermonkey scripts

This repository contains a set of Tampermonkey/Greasemonkey userscripts by Saad1430. Each script includes a header with metadata (name, version, @match rules and grants). Below are short summaries and usage notes for each script in this folder.

## Contents
- `bing-search-automation.user.js` — Bing Random Search Automation
- `movies-tv-series.user.js` — Smart Movie/Series Google/Bing Search (TMDb)
- `twitch-drop-claim.user.js` — Twitch Auto Claim Drops

---

## Installation
1. Install Tampermonkey (or a compatible userscript manager) in your browser.
2. Open the `.user.js` file you want to use and copy its contents, or open it locally with your browser's file:// handler.
3. In Tampermonkey, choose "Create a new script" and paste the script contents, or open the script file directly from disk (Tampermonkey will prompt to install when opening a `.user.js` URL).
4. Save and enable the script in Tampermonkey. Reload the matched pages to let the script run.

---

## Scripts

### `bing-search-automation.user.js`
- Name: Bing Random Search Automation
- Version: 1.2
- Match: `https://www.bing.com/*`
- Description: Automates randomized Bing searches using a phrase pool, with human-like randomized delays, notifications, and a compact status UI.
- Controls & keybinds:
  - Start: Click the **Start** button (bottom-left) or press `Ctrl+Shift+C`.
  - Stop: Click the **Stop** button (bottom-left) or press `Ctrl+Shift+X`.
- Behavior:
  - Runs up to `maxSearches` searches (default 32). Each search uses a random phrase from the script's `words` array and either submits the Bing search form or navigates to the search URL.
  - Shows small notifications (bottom-right) for status and next-search countdown.
  - Badge shows progress and remaining seconds until the next search.
- Customization:
  - Edit the script to change `maxSearches`, `minDelay`, `maxDelay`, or to add/remove phrases in the `words` array.
- Notes & caution:
  - Automated search activity can trigger rate-limiting or violate a website's terms of service. Use responsibly and at your own risk.

---

### `movies-tv-series.user.js`
- Name: Smart Movie/Series Google Search (TMDb) + Settings Panel
- Version: 1.1.2
- Match: `https://www.google.com/search*`, `https://www.bing.com/search*`
- Grants: `GM_getValue`, `GM_setValue`, `GM_deleteValue`, `GM_setClipboard`, `GM_addStyle`
- Description: Detects movie/TV-related search results on Google and Bing, surfaces TMDb and IMDb IDs, optional streaming/torrent links, and provides a settings panel.
- Controls & keybinds:
  - Open settings panel: `Shift+R` (also long-press on touch for ~1.5s)
- Behavior:
  - Auto-detects media-like SERP results (configurable). When detected, it inserts an info card with TMDb ID, IMDb ID, links to streaming frontends, torrent site shortcuts, and optional features controlled via settings.
  - Settings are persisted via `GM_setValue` and `GM_getValue`.
- Customization & setup:
  - This script requires a TMDb API key to fetch metadata. On first run it will prompt for TMDb keys (comma-separated). Keys are stored via Tampermonkey's GM storage.
  - Settings include toggles for streaming links, frontend links, torrent shortcuts, YTS torrents, Stremio/trakt links, episode selection, notifications, and more.
- Notes:
  - Some provided streaming/torrent links point to third-party services. The script simply constructs links; it does not host content. Use in accordance with local laws and site terms.

---

### `twitch-drop-claim.user.js`
- Name: Twitch Auto Claim Drops
- Version: 1.4
- Match: `https://www.twitch.tv/drops/inventory`
- Description: Watches the Drops inventory page and auto-clicks "Claim" buttons when available. Also displays a persistent countdown and refreshes the page periodically.
- Behavior:
  - Observes DOM mutations and periodically scans for buttons containing the text "claim" and clicks them if enabled.
  - Shows transient notifications and a persistent reload countdown (default reload every 5 minutes).
- Notes & caution:
  - Use responsibly. Automating interactions on a service can violate terms of service or trigger anti-bot measures.

---

## Common notes
- All scripts were authored by Saad1430 and include header metadata at the top of each file with `@name`, `@version`, `@match`, and `@grant` statements.
- Before using any automation script on your account, review the site terms and consider creating a throwaway or test account if you want to experiment safely.

---

## Contributing
- Send pull requests with clear descriptions of changes.
- Keep userscript metadata (headers) accurate when updating behavior.

---

## License
- No license file is included. If you want a specific license (MIT, Apache-2.0, etc.), tell me and I'll add it.
