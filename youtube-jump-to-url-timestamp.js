// ==UserScript==
// @name         YouTube Jump to URL Timestamp
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Jump to &t= timestamp in YouTube URL via button
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function parseTimeParam(timeStr) {
        if (!timeStr) return null;
        if (/^\d+s?$/.test(timeStr)) return parseInt(timeStr, 10);
        let total = 0;
        const match = timeStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
        if (match) {
            const [, h, m, s] = match;
            total += (parseInt(h, 10) || 0) * 3600;
            total += (parseInt(m, 10) || 0) * 60;
            total += (parseInt(s, 10) || 0);
        }
        return total > 0 ? total : null;
    }

    function getTimeFromUrl() {
        const url = new URL(window.location.href);
        return parseTimeParam(url.searchParams.get('t'));
    }

    function showToast(msg) {
        const existing = document.getElementById('yt-jump-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.id = 'yt-jump-toast';
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '6px',
            zIndex: '99999',
            fontSize: '14px',
            fontFamily: 'Roboto, Arial, sans-serif',
            pointerEvents: 'none',
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function jumpNow() {
        const seconds = getTimeFromUrl();
        if (seconds === null) {
            showToast('No &t= parameter in URL');
            return;
        }
        const video = document.querySelector('video');
        if (!video) {
            showToast('No video found');
            return;
        }
        video.currentTime = seconds;
        const mm = Math.floor(seconds / 60);
        const ss = String(seconds % 60).padStart(2, '0');
        showToast(`Jumped to ${mm}:${ss}`);
    }

    function addButton() {
        if (document.getElementById('yt-jump-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'yt-jump-btn';
        btn.textContent = '⏱ Jump to t=';
        btn.title = 'Jump to &t= timestamp in URL';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            background: '#cc0000',
            color: '#fff',
            border: 'none',
            padding: '10px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        });
        btn.addEventListener('click', jumpNow);
        document.body.appendChild(btn);
    }

    addButton();
    // Re-add button after SPA navigation if it gets removed
    window.addEventListener('yt-navigate-finish', () => setTimeout(addButton, 500));
})();