// ==UserScript==
// @name         Distraction Free Instagram
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        *://*.instagram.com/*
// @description  Hide distracting stuffs from instagram
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const redirectPaths = ["/", "/reels/", "/explore/"];

  const isRedirect = redirectPaths.some((path) => location.pathname === path);

  if (isRedirect) {
    location.replace("https://www.instagram.com/direct/inbox/");
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

  function enforce() {
    const isRedirect = redirectPaths.some((path) => location.pathname === path);
    if (isRedirect) {
      location.replace("https://www.instagram.com/direct/inbox/");
    }
  }
})();
