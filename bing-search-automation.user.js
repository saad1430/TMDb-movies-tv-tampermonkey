// ==UserScript==
// @name         Bing Random Search Automation
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automates Bing searches with human-like delays. Keybinds + notifications + clean Bing-styled status badge included.
// @author       Saad1430
// @match        https://www.bing.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const words = [
    // --- Phrases (50) ---
    "how to make homemade pizza", "best tourist places in europe", "upcoming movies 2025", "meditation techniques for stress",
    "why is the sky blue", "new technology trends 2025", "easiest coding languages to learn", "photography tips for beginners",
    "football world cup highlights", "healthy breakfast recipes", "top 10 netflix shows right now", "meaning of life quotes",
    "how volcanoes are formed", "interesting history facts", "best laptops for students 2025", "current weather in new york",
    "python vs javascript differences", "cheapest flights to london", "top universities in the world", "how to plant tomatoes",
    "best smartphones under 500", "how to play guitar chords", "best free coding resources", "latest news headlines today",
    "benefits of daily exercise", "popular anime series 2025", "best books to read this year", "how to improve memory power",
    "quick dinner ideas easy", "how to learn french fast", "top travel destinations 2025", "best budget gaming laptops",
    "most expensive paintings ever sold", "how to meditate properly", "famous historical events", "best sci fi movies 2025",
    "tips for better sleep", "upcoming sports events", "how to bake chocolate cake", "simple workout routines at home",
    "reasons why cats are popular", "fastest cars in the world", "best coffee shops near me", "how to reduce screen time",
    "fun facts about space", "best productivity apps 2025", "how to tie a tie", "famous landmarks in paris",
    "difference between ai and ml", "what is quantum computing",
    // --- Phrases (50) ---
    "best hiking trails in usa", "cheap recipes for students", "how to build a website", "benefits of drinking green tea",
    "fastest trains in the world", "how to create a podcast", "top 10 android apps 2025", "who won the last champions league",
    "famous quotes about friendship", "easy yoga poses for beginners", "how to invest in stocks", "most popular tourist attractions",
    "how to lose weight naturally", "best movies released this year", "why do we dream at night", "new iphone release date",
    "what is the metaverse explained", "fun science experiments at home", "how to save money quickly", "best programming languages 2025",
    "places to visit in japan", "how to cook pasta perfectly", "top rated horror movies 2025", "how to stay motivated",
    "best free photo editing software", "who invented the internet", "easy breakfast smoothie recipes", "what is blockchain technology",
    "best action games for pc", "how to train your dog", "top rated restaurants near me", "how to write a good resume",
    "latest cricket match highlights", "best online learning platforms", "simple hacks for productivity", "how to clean a laptop keyboard",
    "famous inventions in history", "how to take better selfies", "best sci fi books ever", "top 10 richest people in the world",
    "easy ways to learn spanish", "benefits of drinking coffee", "who painted the mona lisa", "fastest growing cities in 2025",
    "best strategies for chess", "how to make money online", "upcoming concerts near me", "famous landmarks in italy",
    "how to start a youtube channel", "difference between cloud and edge computing",

    // TV / Movies (25)
    "what happened in episode 5 of the latest season of a popular tv show",
    "how many seasons does that tv series have",
    "best plot twists in movies of the last decade",
    "who directed the most popular films in 2024",
    "what are the top rated tv dramas right now",
    "how to understand ambiguous movie endings",
    "which actors won awards this year for tv roles",
    "how to find movie release dates by country",
    "what are the must watch indie films this year",
    "which streaming service has exclusive tv series x",
    "how to binge watch a long tv series efficiently",
    "what is the recommended viewing order for this franchise",
    "how to find behind the scenes for my favorite movie",
    "best documentary films about history",
    "how are tv show ratings calculated",
    "which movie adaptations are faithful to the book",
    "how to follow a tv show's production updates",
    "what are the best limited series of all time",
    "how to find episode summaries for old tv shows",
    "where to watch classic movies legally online",
    "what are the highest grossing films by genre",
    "how to identify cameos in movies",
    "what questions to ask during a film festival Q&A",
    "how to research actor filmographies quickly",
    "what are the most rewatchable tv shows",

    // Video Games (25)
    "best role playing games to play in 2025",
    "how to beat the final boss in a tough rpg",
    "what are the top indie games this year",
    "how to fix controller drift on xbox and playstation",
    "best strategies for winning battle royale matches",
    "how to get started with speedrunning a game",
    "what hardware is needed for pc gaming on a budget",
    "how to set up a streaming overlay for gameplay",
    "best co op games to play with friends",
    "how to improve aim in first person shooters",
    "where to find game walkthroughs and guides",
    "how to mod a single player game safely",
    "what are the most anticipated game releases",
    "how to optimize game settings for performance",
    "best retro games to play for nostalgia",
    "how to trade items safely in online games",
    "what esports tournaments are happening this year",
    "how to build a gaming pc step by step",
    "best controllers for pc and console gaming",
    "how to record high quality gameplay on a laptop",
    "top puzzle games to train your brain",
    "how to troubleshoot common connection issues in online games",
    "what are good beginner friendly strategy games",
    "how to manage game library storage on consoles",
    "which games have the best open world exploration",

    // Football & Cricket (25)
    "how to improve shooting accuracy in football",
    "best training drills for midfielders",
    "what is the schedule for upcoming international football matches",
    "how to choose the right football boots for wet pitches",
    "who are the leading goal scorers in the current season",
    "how to read football analytics and heatmaps",
    "what are the rules for offside in simple terms",
    "how to practice free kicks effectively",
    "top tactics used by successful football managers",
    "what equipment is essential for starting a local football club",
    "how to play cricket as a beginner",
    "what are common batting techniques in cricket",
    "how to bowl yorkers consistently in limited overs",
    "what is the cricket world cup qualification process",
    "how to maintain a cricket pitch at home",
    "best drills to improve fielding agility",
    "how to understand dls calculations in rain-affected matches",
    "who are rising stars in international cricket",
    "what is the difference between t20 and test cricket strategies",
    "how to choose cricket gear for juniors",
    "top clubs to watch in european football right now",
    "how to follow live football stats and commentary",
    "what nutrition helps football players recover faster",
    "how to handle pressure situations in penalty shootouts",
    "what are the safest ways to train during off season",

    // Camping in the Wild (25)
    "best lightweight tents for backpacking",
    "what to pack for a three day wild camping trip",
    "how to build a safe campfire in the wilderness",
    "tips for camping solo safely at night",
    "how to choose a campsite away from hazards",
    "what are essential first aid items for camping",
    "how to find potable water while camping",
    "best sleeping pads for cold weather camping",
    "how to navigate with a map and compass",
    "what food packs well for multi day hikes",
    "how to store food safely to avoid wildlife encounters",
    "best lightweight stoves for backpackers",
    "how to set up a campsite in rainy conditions",
    "what clothing layers are needed for alpine camping",
    "how to treat minor injuries when far from help",
    "best practices for Leave No Trace camping",
    "how to identify local poisonous plants while camping",
    "what are the pros and cons of hammock camping",
    "how to plan a safe solo overnight hike route",
    "what gadgets are worth carrying for wilderness camping",
    "how to keep warm without a tent in an emergency",
    "best ways to signal for help in the wild",
    "how to prevent blisters on long hikes",
    "what permits are typically needed for backcountry camping",
    "how to choose a reliable headlamp for overnight trips"
  ];

  // --- Extra phrases (100) ---
  words.push(
    "how to plan a cross country road trip",
    "best apps to track personal finance",
    "how to grow herbs indoors year round",
    "easy one pot meals for weeknights",
    "how to start learning piano as an adult",
    "tips for reducing household energy use",
    "how to write a short story in a week",
    "best practices for remote team communication",
    "how to set SMART goals and stick to them",
    "simple portrait photography tips",
    "how to host a successful podcast episode",
    "ways to improve indoor air quality",
    "how to prepare for a technical interview",
    "beginner guide to containerization with docker",
    "how to read financial statements for beginners",
    "tips for creating a minimalist wardrobe",
    "how to do a basic home electrical repair safely",
    "ways to practice mindful eating",
    "how to make sourdough starter from scratch",
    "best browser extensions for productivity",
    "how to organize photos on your computer",
    "easy watercolor painting techniques",
    "how to backup your phone and cloud data",
    "tips for long distance relationships",
    "how to design a small urban garden",
    "best study techniques backed by science",
    "how to negotiate a salary increase",
    "ways to learn a new language fast",
    "how to build a simple mobile app",
    "top security tips for home wifi networks",
    "how to compost kitchen scraps at home",
    "tips for staying focused while working from home",
    "how to choose the right running shoes",
    "easy knitting patterns for beginners",
    "how to declutter your email inbox",
    "tips for preparing quick healthy lunches",
    "how to research family history online",
    "best tools for creating wireframes",
    "how to make cold brew coffee at home",
    "ways to reduce single use plastics",
    "how to perform basic bicycle maintenance",
    "strategies for better time blocking",
    "how to cultivate a reading habit",
    "tips for improving public speaking skills",
    "how to set up two factor authentication",
    "best compact cameras for travel",
    "how to build simple electronics projects",
    "ways to support local small businesses",
    "how to prepare for a marathon training plan",
    "tips for photographing the night sky",
    "how to build an emergency savings fund",
    "creative gift ideas for friends",
    "how to choose a good domain name",
    "tips for managing inbox zero",
    "how to create a basic API with nodejs",
    "ways to grow plants from cuttings",
    "how to turn a hobby into a side business",
    "tips for cutting monthly subscription costs",
    "how to map out a personal development plan",
    "easy meal prep ideas for families",
    "how to improve handwriting quickly",
    "best online courses for data science beginners",
    "how to build confidence before interviews",
    "ways to make your resume stand out",
    "how to take care of indoor succulents",
    "tips for creating engaging social media content",
    "how to plan a zero waste picnic",
    "best practices for securing web applications",
    "how to use git like a pro",
    "easy vegetarian recipes for weeknights",
    "how to choose a mattress for back pain",
    "tips for learning calculus effectively",
    "how to audit your personal finances",
    "best habits for better mental health",
    "how to build a basic wordpress site",
    "ways to improve workplace ergonomics",
    "how to prepare a beginner woodworking project",
    "tips for saving for your first home",
    "how to plan a culturally rich vacation",
    "ways to create a capsule wardrobe",
    "how to clean and maintain your camera lens",
    "tips for building an online portfolio",
    "how to brew kombucha at home safely",
    "ways to practice coding every day",
    "how to create a monthly budget spreadsheet",
    "best stretches for desk workers",
    "how to choose the right insurance coverage",
    "tips for better sleep hygiene",
    "how to teach kids to cook safely",
    "ways to improve concentration during study",
    "how to build a simple chatbot with javascript",
    "tips for sustainable gift wrapping",
    "how to identify reliable news sources",
    "ways to reduce food waste at home",
    "how to maintain a bike chain and gears",
    "tips for staying hydrated throughout the day",
    "how to choose a reliable used car",
    "ways to create a calming bedtime routine",
    "how to start a vertical herb garden",
    "tips for photographing portraits with natural light",
    "how to memorize speeches effectively",
    "ways to set up a basic home lab for learning",
    "how to run effective one on one meetings",
    "tips for decorating small apartments",
    "how to pick the perfect houseplant for beginners"
  );

  const maxSearches = 32;
  const minDelay = 5000;  // 5 sec
  const maxDelay = 30000; // 30 sec

  // Notification queue system
  const notificationQueue = [];
  let notificationActive = false;

  function showNotification(message, duration = 3000) {
    notificationQueue.push({ message, duration });
    if (!notificationActive) processQueue();
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

    // Bing-style notification (bottom-right)
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.backgroundColor = '#f9f9f9';
    notification.style.color = '#ffb902';
    notification.style.border = '1px solid #ddd';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '9999';
    notification.style.textAlign = 'center';
    notification.style.fontFamily = 'Segoe UI, sans-serif';
    notification.style.fontSize = '14px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
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
        processQueue();
      }, 500);
    }, duration);
  }

  // Persistent state
  let state = JSON.parse(localStorage.getItem("bingAutoState") || "{}");
  if (!state.running) state.running = false;
  if (!state.count) state.count = 0;

  let timerId = null;
  let countdownInterval = null;
  let nextDelay = 0;

  function saveState() {
    localStorage.setItem("bingAutoState", JSON.stringify(state));
  }

  // Persistent seen-phrases tracking (so each phrase is used only once until reset)
  function loadSeen() {
    try {
      const raw = localStorage.getItem('bingAutoSeen');
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) { return new Set(); }
  }
  function saveSeen() {
    try { localStorage.setItem('bingAutoSeen', JSON.stringify(Array.from(seenSet))); } catch (e) {}
  }
  function resetSeen() {
    seenSet = new Set();
    saveSeen();
    showNotification('🔁 Seen list reset. All phrases are available again.', 3000);
    updateBadge();
  }

  let seenSet = loadSeen();

  // Simple persistent config (daily cap, browsing mode)
  const DEFAULT_DAILY_CAP = 200;
  function loadConfig() {
    try { return JSON.parse(localStorage.getItem('bingAutoConfig') || '{}') || {}; } catch { return {}; }
  }
  function saveConfig(cfg) { try { localStorage.setItem('bingAutoConfig', JSON.stringify(cfg)); } catch (e) {} }
  let CONFIG = loadConfig();
  if (typeof CONFIG.dailyCap !== 'number') CONFIG.dailyCap = DEFAULT_DAILY_CAP;
  if (typeof CONFIG.browsingMode !== 'boolean') CONFIG.browsingMode = false;
  if (typeof CONFIG.browseDwellMin !== 'number') CONFIG.browseDwellMin = 6; // seconds
  if (typeof CONFIG.browseDwellMax !== 'number') CONFIG.browseDwellMax = 12; // seconds

  // Daily counter to avoid too many searches per calendar day
  function loadDaily() {
    try {
      const raw = JSON.parse(localStorage.getItem('bingAutoDaily') || '{}');
      const today = new Date().toISOString().slice(0,10);
      if (raw.date !== today) return { date: today, count: 0 };
      return raw;
    } catch { return { date: new Date().toISOString().slice(0,10), count: 0 }; }
  }
  function saveDaily(d) { try { localStorage.setItem('bingAutoDaily', JSON.stringify(d)); } catch (e) {} }
  let DAILY = loadDaily();
  function incrementDaily() { DAILY.count++; saveDaily(DAILY); }

  // Simple event log (capped)
  const LOG_MAX = 300;
  function loadLog() { try { return JSON.parse(localStorage.getItem('bingAutoLog') || '[]'); } catch { return []; } }
  function saveLog(arr) { try { localStorage.setItem('bingAutoLog', JSON.stringify(arr.slice(-LOG_MAX))); } catch {} }
  let eventLog = loadLog();
  function logEvent(type, message) {
    const entry = { t: new Date().toISOString(), type: type, message: message };
    eventLog.push(entry);
    saveLog(eventLog);
    console.log('[BingAuto]', type, message);
  }
  function downloadLog() {
    const blob = new Blob([JSON.stringify(eventLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bing-auto-log-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function clearLog() { eventLog = []; saveLog(eventLog); showNotification('🧹 Log cleared.', 2000); }

  // Detect interstitials / bot checks (defensive: stop and notify)
  function detectInterstitial() {
    try {
      const txt = (document.body && document.body.innerText || '').toLowerCase();
      const checks = ['captcha', 'are you a robot', 'verify', 'please verify', 'enter the characters', 'unusual traffic', 'access to this page has been denied', 'press and hold', 'we have detected', 'prove you are human'];
      for (const c of checks) if (txt.includes(c)) return c;
      return null;
    } catch (e) { return null; }
  }

  // Visibility pause/resume
  let pausedByVisibility = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (state.running) {
        pausedByVisibility = true;
        clearTimeout(timerId); clearInterval(countdownInterval);
        showNotification('⏸️ Paused (tab hidden). Will resume when visible.', 3000);
        updateBadge();
        logEvent('pause', 'Paused due to tab hidden');
      }
    } else {
      if (pausedByVisibility) {
        pausedByVisibility = false;
        // resume after a randomized short delay
        const delay = randInt(Math.max(minDelay,5000), Math.max(maxDelay,10000));
        showNotification('▶️ Resuming automation after short delay...', 2500);
        logEvent('resume', 'Resumed after tab visible');
        startCountdown(Math.floor(delay/1000));
        timerId = setTimeout(() => { if (state.running) doSearch(); }, delay);
      }
    }
  });

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Controls container: badge + start/stop buttons
  const controls = document.createElement("div");
  controls.style.position = "fixed";
  controls.style.bottom = "20px";
  controls.style.left = "20px";
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "8px";
  controls.style.zIndex = "9999";
  document.body.appendChild(controls);

  const badge = document.createElement("div");
  badge.style.background = "#f9f9f9";
  badge.style.color = "#f25022";
  badge.style.padding = "8px 14px";
  badge.style.border = "1px solid #ddd";
  badge.style.borderRadius = "8px";
  badge.style.fontSize = "14px";
  badge.style.fontFamily = "Segoe UI, sans-serif";
  badge.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  badge.style.userSelect = "none";
  badge.style.display = "none"; // hidden by default
  controls.appendChild(badge);

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.title = "Ctrl+Shift+C";
  startButton.style.padding = "8px 12px";
  startButton.style.borderRadius = "8px";
  startButton.style.border = "1px solid #ddd";
  startButton.style.background = "#0f9d58";
  startButton.style.color = "#fff";
  startButton.style.cursor = "pointer";
  startButton.style.fontFamily = "Segoe UI, sans-serif";
  startButton.style.fontSize = "13px";
  startButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.12)";
  startButton.style.display = state.running ? "none" : "inline-block";
  startButton.addEventListener("click", startAutomation);
  controls.appendChild(startButton);

  const stopButton = document.createElement("button");
  stopButton.textContent = "Stop";
  stopButton.title = "Ctrl+Shift+X";
  stopButton.style.padding = "8px 12px";
  stopButton.style.borderRadius = "8px";
  stopButton.style.border = "1px solid #ddd";
  stopButton.style.background = "#d9534f";
  stopButton.style.color = "#fff";
  stopButton.style.cursor = "pointer";
  stopButton.style.fontFamily = "Segoe UI, sans-serif";
  stopButton.style.fontSize = "13px";
  stopButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.12)";
  stopButton.style.display = state.running ? "inline-block" : "none";
  stopButton.addEventListener("click", stopAutomation);
  controls.appendChild(stopButton);

  const resetSeenButton = document.createElement("button");
  resetSeenButton.textContent = "Reset Seen";
  resetSeenButton.title = "Reset seen searches";
  resetSeenButton.style.padding = "8px 12px";
  resetSeenButton.style.borderRadius = "8px";
  resetSeenButton.style.border = "1px solid #ddd";
  resetSeenButton.style.background = "#f0ad4e";
  resetSeenButton.style.color = "#062538";
  resetSeenButton.style.cursor = "pointer";
  resetSeenButton.style.fontFamily = "Segoe UI, sans-serif";
  resetSeenButton.style.fontSize = "13px";
  resetSeenButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.12)";
  resetSeenButton.addEventListener("click", resetSeen);
  controls.appendChild(resetSeenButton);

  // Daily cap display / edit
  const dailyCapBtn = document.createElement('button');
  dailyCapBtn.textContent = `Daily: ${DAILY.count}/${CONFIG.dailyCap}`;
  dailyCapBtn.title = 'Click to change daily cap';
  dailyCapBtn.style.padding = '8px 10px';
  dailyCapBtn.style.borderRadius = '8px';
  dailyCapBtn.style.border = '1px solid #ddd';
  dailyCapBtn.style.background = '#ffffff';
  dailyCapBtn.style.color = '#333';
  dailyCapBtn.style.cursor = 'pointer';
  dailyCapBtn.style.fontFamily = 'Segoe UI, sans-serif';
  dailyCapBtn.style.fontSize = '12px';
  dailyCapBtn.addEventListener('click', () => {
    const next = parseInt(prompt('Set daily cap (number of searches per day):', CONFIG.dailyCap), 10);
    if (!isNaN(next) && next > 0) { CONFIG.dailyCap = next; saveConfig(CONFIG); showNotification(`✅ Daily cap set to ${next}`, 2000); dailyCapBtn.textContent = `Daily: ${DAILY.count}/${CONFIG.dailyCap}`; }
  });
  controls.appendChild(dailyCapBtn);

  // Browsing mode toggle (opt-in)
  const browseToggle = document.createElement('button');
  browseToggle.textContent = CONFIG.browsingMode ? 'Browse: ON' : 'Browse: OFF';
  browseToggle.title = 'Toggle browsing mode (opt-in)';
  browseToggle.style.padding = '8px 10px';
  browseToggle.style.borderRadius = '8px';
  browseToggle.style.border = '1px solid #ddd';
  browseToggle.style.background = CONFIG.browsingMode ? '#2b6cb0' : '#fff';
  browseToggle.style.color = CONFIG.browsingMode ? '#fff' : '#333';
  browseToggle.style.cursor = 'pointer';
  browseToggle.style.fontFamily = 'Segoe UI, sans-serif';
  browseToggle.style.fontSize = '12px';
  browseToggle.addEventListener('click', () => {
    CONFIG.browsingMode = !CONFIG.browsingMode; saveConfig(CONFIG);
    browseToggle.textContent = CONFIG.browsingMode ? 'Browse: ON' : 'Browse: OFF';
    browseToggle.style.background = CONFIG.browsingMode ? '#2b6cb0' : '#fff';
    browseToggle.style.color = CONFIG.browsingMode ? '#fff' : '#333';
    showNotification(CONFIG.browsingMode ? '🔎 Browsing mode enabled (opt-in)' : '🔒 Browsing mode disabled', 2500);
  });
  controls.appendChild(browseToggle);

  // Log controls
  const downloadLogBtn = document.createElement('button');
  downloadLogBtn.textContent = 'Download Log';
  downloadLogBtn.style.padding = '8px 10px';
  downloadLogBtn.style.borderRadius = '8px';
  downloadLogBtn.style.border = '1px solid #ddd';
  downloadLogBtn.style.background = '#6c757d';
  downloadLogBtn.style.color = '#fff';
  downloadLogBtn.style.cursor = 'pointer';
  downloadLogBtn.style.fontFamily = 'Segoe UI, sans-serif';
  downloadLogBtn.style.fontSize = '12px';
  downloadLogBtn.addEventListener('click', downloadLog);
  controls.appendChild(downloadLogBtn);

  const clearLogBtn = document.createElement('button');
  clearLogBtn.textContent = 'Clear Log';
  clearLogBtn.style.padding = '8px 10px';
  clearLogBtn.style.borderRadius = '8px';
  clearLogBtn.style.border = '1px solid #ddd';
  clearLogBtn.style.background = '#adb5bd';
  clearLogBtn.style.color = '#062538';
  clearLogBtn.style.cursor = 'pointer';
  clearLogBtn.style.fontFamily = 'Segoe UI, sans-serif';
  clearLogBtn.style.fontSize = '12px';
  clearLogBtn.addEventListener('click', () => { if (confirm('Clear event log?')) clearLog(); });
  controls.appendChild(clearLogBtn);

  function updateBadge() {
    // update button enabled state
    // show only the correct button
    startButton.style.display = state.running ? "none" : "inline-block";
    stopButton.style.display = state.running ? "inline-block" : "none";

    // update enabled/disabled (for accessibility) and visuals
    startButton.disabled = state.running;
    stopButton.disabled = !state.running;
    startButton.style.opacity = startButton.disabled ? "0.6" : "1";
    stopButton.style.opacity = stopButton.disabled ? "0.6" : "1";

    if (!state.running) {
      badge.style.display = "none"; // hide if stopped
      // show available pool size when stopped
      const remaining = words.length - seenSet.size;
      badge.textContent = `⏸️ Stopped | Remaining phrases: ${remaining}`;
      badge.style.display = "block";
      // when stopped show Start button, hide Stop
      startButton.style.display = "inline-block";
      stopButton.style.display = "none";
      return;
    }

    badge.style.display = "block";
    let progress = `${state.count}/${maxSearches}`;
    let timerText = state.running && nextDelay > 0 ? ` | ⏳ ${nextDelay}s` : "";
    badge.textContent = `▶️ Running | ${progress}${timerText}`;
  }

  function startCountdown(seconds) {
    nextDelay = seconds;
    clearInterval(countdownInterval);
    updateBadge();
    countdownInterval = setInterval(() => {
      if (!state.running) {
        clearInterval(countdownInterval);
        return;
      }
      if (nextDelay > 0) {
        nextDelay--;
        updateBadge();
      }
    }, 1000);
  }

  function doSearch() {
    if (!state.running || state.count >= maxSearches) {
      state.running = false;
      saveState();
      clearInterval(countdownInterval);
      updateBadge();
      showNotification("⏹️ Automation finished.", 3000);
      return;
    }

    // daily cap check
    if (DAILY.count >= CONFIG.dailyCap) {
      state.running = false; saveState(); updateBadge(); showNotification('⚠️ Daily cap reached. Automation stopped.', 4000); logEvent('stop','Daily cap reached'); return;
    }
    // build list of unseen phrases
    const unseen = words.filter(w => !seenSet.has(w));
    if (unseen.length === 0) {
      // nothing left to search
      state.running = false;
      saveState();
      clearInterval(countdownInterval);
      updateBadge();
      showNotification('✅ All phrases have been searched once. Reset seen list to run again.', 5000);
      return;
    }

  const randomWord = unseen[randInt(0, unseen.length - 1)];
    // mark seen
    seenSet.add(randomWord);
    saveSeen();
  state.count++;
  saveState();
  incrementDaily();
  dailyCapBtn.textContent = `Daily: ${DAILY.count}/${CONFIG.dailyCap}`;
  logEvent('search', `Searching: ${randomWord}`);

    showNotification(`🔍 [${state.count}/${maxSearches}] Searching: "${randomWord}"`, 2500);

    const input = document.querySelector("input[name='q']");
    // defensive interstitial detection right before navigating
    const inter = detectInterstitial();
    if (inter) {
      state.running = false; saveState(); updateBadge(); showNotification('🛑 Stopped: interstitial detected ('+inter+').', 5000); logEvent('stop','interstitial:'+inter); return;
    }
    if (input) {
      input.value = randomWord;
      const form = input.closest("form");
      if (form) form.submit();
    } else {
      // If browsing mode is enabled, after search we will optionally open a top result and dwell
      window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(randomWord)}`;
    }

    const delay = randInt(minDelay, maxDelay);
    showNotification(`⏳ Next search in ${(delay / 1000).toFixed(1)}s`, 2500);
    startCountdown(Math.floor(delay / 1000));

    timerId = setTimeout(doSearch, delay);
  }

  function startAutomation() {
    if (state.running) {
      showNotification("⚠️ Already running!", 2000);
      return;
    }
    state.running = true;
    state.count = 0;
    saveState();
    updateBadge();
    showNotification("▶️ Starting Bing automation...", 2500);
    doSearch();
  }

  function stopAutomation() {
    state.running = false;
    clearTimeout(timerId);
    clearInterval(countdownInterval);
    saveState();
    updateBadge();
    showNotification("⏹️ Automation stopped by user.", 2500);
  }

  // Resume if already running
  if (state.running) {
    showNotification("🔄 Resuming automation...", 2500);
    const delay = randInt(minDelay, maxDelay);
    startCountdown(Math.floor(delay / 1000));
    timerId = setTimeout(doSearch, delay);
  }

  // Browsing mode behavior: if enabled and this is a bing search results page
  (function setupBrowsingHook(){
    if (!CONFIG.browsingMode) return;
    // Only act on search results pages
    function isSearchPage() {
      return location.hostname.includes('bing.com') && /[?&]q=/.test(location.search);
    }
    if (!isSearchPage()) return;

    // Avoid running on pages that were opened directly by clicking a result
    // and ensure automation is running
    if (!state.running) return;

    // Run after short delay to allow results to render
    setTimeout(() => {
      try {
        // pick first organic result anchor
        const selectors = ['#b_results .b_algo a', '.b_algo a'];
        let anchor = null;
        for (const s of selectors) { const el = document.querySelector(s); if (el) { anchor = el; break; } }
        if (!anchor) { logEvent('browse','no-anchor-found'); return; }

        // open link in same tab (simulate click)
        logEvent('browse','opening first result');
        anchor.click();

        // dwell for randomized seconds then go back
        const dwell = randInt(CONFIG.browseDwellMin, CONFIG.browseDwellMax) * 1000;
        setTimeout(() => {
          try { history.back(); logEvent('browse','returned after dwell'); } catch (e) { logEvent('browse','return-failed'); }
        }, dwell);
      } catch (e) { logEvent('browse','error:'+e.message); }
    }, randInt(1200, 2600));
  })();

  // Keybinds
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
      startAutomation();
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
      stopAutomation();
    }
  });

  showNotification("🎛️ Bing Automation ready. Ctrl+Shift+C to start, Ctrl+Shift+X to stop.");

})();