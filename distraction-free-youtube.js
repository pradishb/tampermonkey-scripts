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

  const hideElements = () => {
    document
      .querySelectorAll('ytd-browse[page-subtype="home"]')
      .forEach((el) => {
        el.style.display = "none";
      });
    document
      .querySelectorAll(
        "ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer",
      )
      .forEach((el) => {
        el.style.display = "none";
      });
  };

  const redirectPaths = ["/shorts"];

  const isRedirect = redirectPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  if (isRedirect) {
    location.replace("https://www.youtube.com");
  }

  // prevent client-side navigation bypass
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    enforce();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    enforce();
  };

  window.addEventListener("popstate", enforce);
  window.addEventListener("yt-navigate-finish", enforce);

  function enforce() {
    const isRedirect = redirectPaths.some((path) =>
      location.pathname.startsWith(path),
    );
    if (isRedirect) {
      location.replace("https://www.youtube.com");
    }
    hideElements();
  }
})();
