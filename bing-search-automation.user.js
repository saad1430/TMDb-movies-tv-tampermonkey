// ==UserScript==
// @name         Bing Random Search Automation
// @namespace    http://tampermonkey.net/
// @version      1.1
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

  const maxSearches = 32;
  const minDelay = 5000;  // 5 sec
  const maxDelay = 30000; // 20 sec

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

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Status badge
  const badge = document.createElement("div");
  badge.style.position = "fixed";
  badge.style.bottom = "20px";
  badge.style.left = "20px";
  badge.style.background = "#f9f9f9";
  badge.style.color = "#f25022";
  badge.style.padding = "8px 14px";
  badge.style.border = "1px solid #ddd";
  badge.style.borderRadius = "8px";
  badge.style.fontSize = "14px";
  badge.style.fontFamily = "Segoe UI, sans-serif";
  badge.style.zIndex = "9999";
  badge.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  badge.style.userSelect = "none";
  badge.style.display = "none"; // hidden by default
  document.body.appendChild(badge);

  function updateBadge() {
    if (!state.running) {
      badge.style.display = "none"; // hide if stopped
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

    const randomWord = words[randInt(0, words.length - 1)];
    state.count++;
    saveState();

    showNotification(`🔍 [${state.count}/${maxSearches}] Searching: "${randomWord}"`, 2500);

    const input = document.querySelector("input[name='q']");
    if (input) {
      input.value = randomWord;
      const form = input.closest("form");
      if (form) form.submit();
    } else {
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

  // Keybinds
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
      startAutomation();
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
      stopAutomation();
    }
  });

  showNotification("🎛️ Bing Automation ready. Ctrl+Shift+C to start, Ctrl+Shift+X to stop.", 4000);

})();