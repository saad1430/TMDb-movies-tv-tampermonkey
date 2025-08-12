// ==UserScript==
// @name         Smart Movie/Series Google Search (TMDb)
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Displays TMDb/IMDb ID of searched movie/show directly on Google results page and also show direct watch links and torrent magnet links
// @author       Saad1430
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

(async function () {
  'use strict';

  // -- API Keys setup
  let apiKeys = GM_getValue("tmdb_api_keys", null);

  if (!apiKeys) {
    // Ask user to input comma-separated keys
    const keysInput = prompt("To get your API key visit https://www.themoviedb.org/settings/api.Enter your TMDb API keys, separated by commas:");
    if (keysInput) {
      // Split into array and trim spaces
      apiKeys = keysInput.split(",").map(k => k.trim());
      GM_setValue("tmdb_api_keys", JSON.stringify(apiKeys));
      showNotification("API keys setup successfully. If you want you can reset these keys using SHIFT+R and clicking the button that appears later at any time", 15000);
    } else {
      showNotification("No API keys entered. Script cannot continue.");
      return;
    }
  } else {
    // Parse stored JSON
    apiKeys = JSON.parse(apiKeys);
  }

  let currentKeyIndex = 0;

  const hostname = location.hostname;
  const isGoogle = hostname.includes('google.');
  const isBing = hostname.includes('bing.com');
  const isDuckDuckGo = hostname.includes('duckduckgo.com');

  const query = getSearchQuery();
  if (!query) return;

  const cleanedQuery = query.replace(/(watch|online|cast|movie|movies|tv|stream|showtimes|series|episodes|trakt|tmdb|imdb)/gi, '').replace(/\s+/g, ' ').trim();

  // -- API Keys Deletion --
  function clearApiKeys() {
    GM_deleteValue("tmdb_api_keys");
    showNotification("API keys have been cleared. Please reload and enter new keys.");
    resetBtn.style.display = 'none';
  }
  window.clearApiKeys = clearApiKeys;
  // Create the button
  const resetBtn = document.createElement("reset-button");
  resetBtn.innerText = "Reset TMDb Keys";
  Object.assign(resetBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "8px 12px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    zIndex: 99999,
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    display: "none"
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your TMDb API keys?")) {
      clearApiKeys();
    }
  });

  document.body.appendChild(resetBtn);
  // Listen for Shift + R
  document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key.toLowerCase() === "r") {
      resetBtn.style.display = resetBtn.style.display === "none" ? "block" : "none";
    }
  });

  // -- UI Injection Target --
  const parent = getInsertionPoint();
  if (!parent) return;


  // -- Helper: UI Block Builder --
  function renderInfoBox(data, torrents = null, imdb = null) {
    const tmdbID = data.id;
    const title = data.title || data.name || 'Unknown Title';
    const date = data.release_date || data.first_air_date || 'Unknown Date';
    const Type = data.media_type || 'Unknown';

    let vidType = '';
    let vidType1337 = '';
    let ET_cat = '1';
    let query = '';
    let smashQuery = '';
    let multiQuery = '';
    let html = '';
    let eztv = '';
    let imdb_link = '';
    let torrentLinks = [];
    if (Type === 'movie') {
      vidType = 'movie';
      vidType1337 = 'Movies';
      imdb_link = `https://www.imdb.com/title/${imdb}`;
      if (torrents) {
        torrentLinks = buildTorrentLinks(torrents, title);
        if (torrentLinks) {
          html = `<div style="margin-top: 6px;"><strong>Torrents:</strong><br/>`;

          torrentLinks.forEach(link => {
            html += `<a href="${link.magnet}" rel="noopener" style="color: #1bb8d9; font-weight: bold;">
                                    ${link.quality} (${link.size}) - ${link.type} ${link.video} (Audio Channel: ${link.audio}) - Seeders:${link.seeds} Peers:${link.peers}
                                </a><br/>`;
          });

          html += `</ul></div>`;
        }
      }
    } else if (Type === 'tv') {
      vidType = 'tv';
      vidType1337 = 'TV';
      ET_cat = '2';
      query = '/1/1';
      smashQuery = '?s=1&e=1';
      multiQuery = '&s=1&e=1';
      eztv = `<a href="https://eztvx.to/search/${imdb}" target="_blank" style="color: #1bb8d9; font-weight: bold;">EZTVx.to ↗</a> - <a href="https://eztv1.xyz/search/${imdb}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Mirror 1 ↗</a> - <a href="https://eztv.yt/search/${imdb}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Mirror 2 ↗</a><br/>`;
    } else {
      showNotification('No Results found!');
      hideButton();
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = `
            <div style="padding: 10px; background: rgba(3, 37, 65,0.1); border-left: 5px solid #1bb8d9; margin-bottom: 12px; font-family: Arial;">
                <button id="toggle-details-btn" style="position: absolute; top: 10px; right: 10px; padding: 4px 10px; background: #1bb8d9; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Hide Details</button>
                <div style="font-size: 18px; font-weight: bold;" class="tmdb-title">${title} (${date})</div>
                <div id="tmdb-details">
                <div>
                    <strong>TMDb ID:</strong>
                    <span style="color: #1bb8d9; user-select: all; background-color: rgb(3, 37, 65);">${tmdbID}</span>
                    <a href="https://themoviedb.org/${vidType}/${tmdbID}" target="_blank" style="color: #1bb8d9; font-weight: bold;">(TMDb ↗)</a>
                </div>
                <div>
                    <strong>IMDb ID:</strong>
                    <span style="color: black; user-select: all; background-color: rgb(226, 182, 22);">${imdb}</span>
                    <a href="${imdb_link}" target="_blank" style="color: rgb(226, 182, 22); font-weight: bold;">(IMDb ↗)</a>
                    <a href="${imdb_link}/parentalguide" target="_blank" style="color: rgb(226, 182, 22); font-weight: bold;">(Parental Guide ↗)</a>
                </div>
                <div style="margin-top: 6px;">
                    <a href="stremio://detail/${vidType}/${imdb}" style="color: #1bb8d9; font-weight: bold;">Open in Stremio ↗</a><br/>
                    <a href="https://player.videasy.net/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on VidEasy.net (fastest) ↗</a><br/>
                    <a href="https://vidsrc.to/embed/${vidType}/${tmdbID}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on VidSrc.to ↗</a><br/>
                    <a href="https://multiembed.mov/?video_id=${tmdbID}&tmdb=1${multiQuery}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on MultiEmbed.mov ↗</a><br/>
                    <a href="https://spencerdevs.xyz/${vidType}/${tmdbID}?theme=ff0000${multiQuery}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on spencerdevs.xyz ↗</a><br/>
                    <a href="https://111movies.com/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on 111Movies.com ↗</a><br/>
                    <a href="https://vidora.su/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on Vidora.su ↗</a><br/>
                    <a href="https://vidfast.pro/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on VidFast.pro ↗</a><br/>
                    <a href="https://player.smashy.stream/${vidType}/${tmdbID}${smashQuery}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on Smashy.stream ↗</a><br/>
                    <a href="https://embed.su/embed/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on Embed.su (slowest) ↗</a><br/>
                </div>
                <div style="margin-top: 6px;">
                    <strong>Watch on frontends:</strong><br/>
                    <a href="https://www.cineby.app/${vidType}/${tmdbID}${query}?play=true" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on Cineby.app</a> <a href="https://www.cineby.app/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">(More Info)</a><br/>
                    <a href="https://flixer.su/watch/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on Flixer.su ↗</a> <a href="https://flixer.su/?${vidType}=${title}&id=${tmdbID}" target="_blank" style="color: #1bb8d9; font-weight: bold;">(More Info)</a><br/>
                    <a href="https://veloratv.ru/watch/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on VeloraTV.ru ↗</a><br/>
                    <a href="https://www.fmovies.cat/watch/${vidType}/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on fmovies.cat ↗</a> <a href="https://www.fmovies.cat/${vidType}/${tmdbID}" target="_blank" style="color: #1bb8d9; font-weight: bold;">(More Info)</a><br/>
                    <a href="https://xprime.tv/watch/${tmdbID}${query}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Watch on xprime.tv ↗</a><br/>
                </div>
                ${html}
                <div style="margin-top: 6px;">
                    <strong>Search on Torrent Sites:</strong><br/>
                    <a href="https://1337x.to/category-search/${title}/${vidType1337}/1/" target="_blank" style="color: #1bb8d9; font-weight: bold;">1337x.to ↗</a> - <a href="https://1337x.to/category-search/${title}/${vidType1337}/1/" target="_blank" style="color: #1bb8d9; font-weight: bold;">Mirror 1 ↗</a> - <a href="https://x1337x.cc/category-search/${title}/${vidType1337}/1/" target="_blank" style="color: #1bb8d9; font-weight: bold;">Mirror 2 ↗</a><br/>
                    ${eztv}
                    <a href="https://www.limetorrents.lol/search/${vidType1337}/${title}" target="_blank" style="color: #1bb8d9; font-weight: bold;">LimeTorrents.lol ↗</a><br/>
                    <a href="https://thepiratebay.org/search.php?q=${title}&video=on&search=Pirate+Search&page=0" target="_blank" style="color: #1bb8d9; font-weight: bold;">ThePirateBay.org ↗</a><br/>
                    <a href="https://extratorrent.st/search/?new=1&search=${title}&s_cat=${ET_cat}" target="_blank" style="color: #1bb8d9; font-weight: bold;">ExtraTorrent.st ↗</a><br/>
                    <a href="https://rutor.is/search/${title}" target="_blank" style="color: #1bb8d9; font-weight: bold;">Rutor.is ↗</a><br/>
                </div>
            </div>
            </div>
        `;
    parent.prepend(container);
    hideButton();
    const toggleBtn = container.querySelector('#toggle-details-btn');
    const detailsDiv = container.querySelector('#tmdb-details');

    // Restore previous state on load
    const isHidden = sessionStorage.getItem('tmdbToggleHidden') === 'true';
    detailsDiv.style.display = isHidden ? 'none' : 'block';
    toggleBtn.textContent = isHidden ? 'Show Details' : 'Hide Details';

    toggleBtn.addEventListener('click', () => {
      const currentlyHidden = detailsDiv.style.display === 'none';
      detailsDiv.style.display = currentlyHidden ? 'block' : 'none';
      detailsDiv.style.transition = 'all 0.3s ease-in-out';
      toggleBtn.textContent = currentlyHidden ? 'Hide Details' : 'Show Details';
      showNotification(currentlyHidden ? 'Details will be shown until you hide them.' : 'Details will be hidden until you show them.');
      sessionStorage.setItem('tmdbToggleHidden', !currentlyHidden);
    });

  }

  // -- Helper: TMDb API Call --
  async function fetchWithFallback(title, maxRetries = apiKeys.length) {
    let attempts = 0;

    while (attempts < maxRetries) {
      const apiKey = getNextApiKey();
      const tmdbURL = `https://api.themoviedb.org/3/`;
      const url = `${tmdbURL}search/multi?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
      const ytsAPI = `https://yts.mx/api/v2/list_movies.json?query_term=`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const imdb_id_url = `${tmdbURL}${data.results[0].media_type}/${data.results[0].id}/external_ids?api_key=${apiKey}`;
          const imdb = await fetch(imdb_id_url);
          const imdb_id = (await imdb.json()).imdb_id;
          if (data.results[0].media_type == 'movie') {
            let magnet = await fetch(`${ytsAPI}${imdb_id}`);
            let magnetData = await magnet.json();
            if (magnetData.status === "ok" && magnetData.data.movie_count > 0) {
              renderInfoBox(data.results[0], magnetData.data.movies[0].torrents, imdb_id); // ✅ Found results and torrents!
            }
            else {
              renderInfoBox(data.results[0], null, imdb_id); // ✅ Found!
            }
          }
          else {
            renderInfoBox(data.results[0], null, imdb_id); // ✅ Found!
          }
          addCertificationAsync(data.results[0].id, data.results[0].media_type);
          return;
        } else {
          showNotification(`No results found. Rotating API key...`);
          console.warn(`🔁 No results found for key: ${apiKey}. Rotating...`);
          attempts++;
        }
      } catch (err) {
        showNotification(`Fetch error: ${err.message}`);
        console.error(`❌ Fetch error: ${err.message}`);
        attempts++;
      }
    }
    showNotification("TMDb API failed or no results. Try refining your search?");
    console.error("🚫 All TMDb API keys failed or no results found.");
    return null;
  }

  // -- Torrents --
  function buildTorrentLinks(torrents, title_long) {
    const torrentLinks = [];

    const trackers = [
      'udp://glotorrents.pw:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://torrent.gresille.org:80/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://tracker.leechers-paradise.org:6969',
      'udp://p4p.arenabg.ch:1337',
      'udp://tracker.internetwarriors.net:1337',
    ];

    if (torrents && Array.isArray(torrents)) {
      torrents.forEach(torrent => {
        const hash = torrent.hash;
        const name = encodeURIComponent(title_long);
        const tr = trackers.map(tr => `&tr=${encodeURIComponent(tr)}`).join('');
        const magnet = `magnet:?xt=urn:btih:${hash}&dn=${name}${tr}`;

        torrentLinks.push({
          quality: torrent.quality,
          type: torrent.type,
          size: torrent.size,
          video: torrent.video_codec,
          audio: torrent.audio_channels,
          seeds: torrent.seeds,
          peers: torrent.peers,
          magnet
        });
      });
    }

    return torrentLinks;
  }

  // -- Certifications --
  async function addCertificationAsync(id, type) {
    const apiKey = getNextApiKey();
    let cert = '';

    try {
      if (type === 'movie') {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${apiKey}`);
        const json = await res.json();
        const us = json.results?.find(r => r.iso_3166_1 === "US");
        cert = us?.release_dates?.[0]?.certification || '';
        if (cert == '') {
          const tr = json.results?.find(r => r.iso_3166_1 === "TR");
          cert = tr?.rating || '';
        }
      } else if (type === 'tv') {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${apiKey}`);
        const json = await res.json();
        const us = json.results?.find(r => r.iso_3166_1 === "US");
        cert = us?.rating || '';
        if (cert == '') {
          const tr = json.results?.find(r => r.iso_3166_1 === "TR");
          cert = tr?.rating || '';
        }
      }

      if (cert) {
        const titleElem = document.querySelector('.tmdb-title');
        if (titleElem) {
          titleElem.innerHTML += ` <span style="color: gray; font-size: 14px;">[${cert}]</span>`;
        }
      }
    } catch (err) {
      showNotification('Failed to fetch certification');
      console.error('Failed to fetch certification:', err);
    }
  }

  // -- Hide Button --
  function hideButton() {
    const btn = document.getElementById('tmdb-button');
    if (btn) btn.style = "display:none;";
  }

  // Notification queue array
  const notificationQueue = [];
  let notificationActive = false;

  function showNotification(message, duration = 3000) {
    notificationQueue.push({ message, duration });
    if (!notificationActive) {
      processQueue();
    }
  }

  function processQueue() {
    if (notificationQueue.length === 0) {
      notificationActive = false;
      return;
    }

    notificationActive = true;
    const { message, duration } = notificationQueue.shift();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Styling (centered box)
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.padding = '15px 30px';
    notification.style.backgroundColor = 'rgba(3, 37, 65, 0.9)';
    notification.style.color = '#1bb8d9';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.textAlign = 'center';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.userSelect = 'none';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(notification);

    // Fade in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
    });

    setTimeout(() => {
      // Fade out
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
        processQueue(); // Show the next notification
      }, 500);
    }, duration);
  }



  // -- Smart Detection: Is It a Movie/TV Result? --
  let isMedia = false;
  if (isGoogle) {
    const rhsBlock = document.querySelector('#rhs');
    if (rhsBlock && /IMDb|TV series|Movie|Episodes|Run time/i.test(rhsBlock.innerText)) {
      isMedia = true;
    }
  } else if (isBing) {
    const bingBlock = document.querySelector('.b_entityTP') || document.querySelector('.b_vList');

    if (bingBlock) {
      const links = bingBlock.querySelectorAll('a[href*="imdb.com"], a');
      const foundMediaLink = Array.from(links).some(a =>
        /imdb\.com|TV series|Movie|Episode|Run time|Rating|Release date/i.test(a.href + a.textContent)
      );
      if (foundMediaLink) {
        isMedia = true;
      }
    }
    if (!isMedia && bingBlock.innerText && /TV series|Movie|Episode/i.test(bingBlock.innerText)) {
      isMedia = true;
    }
  }


  // -- Multi Search Engine Setup --
  function getSearchQuery() {
    const hostname = window.location.hostname;
    const params = new URLSearchParams(window.location.search);

    if (isGoogle) return params.get('q');
    if (isBing) return params.get('q');
    if (isDuckDuckGo) return params.get('q');
    // Add more engines here...

    return null;
  }

  function getInsertionPoint() {
    const hostname = window.location.hostname;

    if (isGoogle) return document.getElementById('search');
    if (isBing) return document.querySelector('#b_results');
    if (isDuckDuckGo) return document.querySelector('.results--main');

    return document.body;
  }

  // -- Action Time --
  if (isMedia) {
    fetchWithFallback(cleanedQuery);
  } else {
    // Manual Button UI
    const btn = document.createElement('button');
    btn.textContent = "Search TMDb Info";
    btn.id = "tmdb-button";
    btn.style = "margin: 10px 0; padding: 8px 12px; background: rgb(3, 37, 65); color: #1bb8d9; border: 1px solid #1bb8d9; border-radius: 4px; cursor: pointer; font-weight: bold; user-select: none;";
    // Add hover effect using mouse events
    btn.onmouseenter = () => {
      btn.style.background = '#1bb8d9';
      btn.style.color = 'rgb(3, 37, 65)';
      btn.style.borderColor = 'rgb(3, 37, 65)';
    };

    btn.onmouseleave = () => {
      btn.style.background = 'rgb(3, 37, 65)';
      btn.style.color = '#1bb8d9';
      btn.style.borderColor = '#1bb8d9';
    };
    btn.onclick = () => fetchWithFallback(cleanedQuery);
    parent.prepend(btn);
  }

  // -- API keys --
  function getNextApiKey() {
    const key = apiKeys[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    return key;
  }

})();
