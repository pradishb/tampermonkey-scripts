// ==UserScript==
// @name         Site Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks selected websites
// @match        *://*.9gag.com/*
// @match        *://9gag.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  window.location.href = "about:blank";
})();
