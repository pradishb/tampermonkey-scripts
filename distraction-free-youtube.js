// ==UserScript==
// @name         Distraction Free Youtube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide distracting stuffs from youtube
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    /* hide homepage browse */
    ytd-browse[page-subtype="home"] { display: none !important; }
    /* hide watch next */
    .ytd-watch-next-secondary-results-renderer { display: none !important; }
    /* hide suggestions at the end of the video */
    .ytp-suggestion-set { display: none !important; }
  `;
  document.documentElement.appendChild(style);

  function redirectShorts() {
    if (location.pathname.startsWith("/shorts/")) {
      const videoId = location.pathname.split("/shorts/")[1].split(/[?&#/]/)[0];
      if (videoId) {
        location.replace("https://www.youtube.com/watch?v=" + videoId);
        return true;
      }
    }
    return false;
  }

  window.addEventListener("yt-navigate-finish", redirectShorts);
})();
