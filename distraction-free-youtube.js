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

  document.querySelectorAll('ytd-browse[page-subtype="home"]').forEach((el) => {
    el.style.display = "none";
  });
  document
    .querySelectorAll(
      "ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer",
    )
    .forEach((el) => {
      el.style.display = "none";
    });

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
