// ==UserScript==
// @name         Amazon Archived Orders Restoration – Archived Orders tab + per-order Archive Order link
// @namespace    https://github.com/esscey/amazon-archived-orders
// @version      1.0
// @description  Restores "Archived Orders" tab and adds "Archive Order" links next to order actions on Your Orders page
// @match        https://www.amazon.com/gp/your-account/order-history*
// @match        https://www.amazon.com/your-orders/orders*
// @match        https://www.amazon.com/gp/css/order-history*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- Utility: simple safe selector wait ---
    function onReady(selector, cb, timeout = 15000) {
        const found = document.querySelector(selector);
        if (found) return cb(found);
        const obs = new MutationObserver(() => {
            const node = document.querySelector(selector);
            if (node) {
                obs.disconnect();
                cb(node);
            }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), timeout);
    }

    // --- Top tab: "Archived Orders" ---
    function addArchivedOrdersTab() {
        onReady('.page-tabs > ul', (ul) => {
            if (ul.querySelector('a[href*="orderFilter=archived"], a[href*="orderFilter=archived"]')) return;
            const li = document.createElement('li');
            li.className = 'page-tabs__tab';

            const a = document.createElement('a');
            a.className = 'a-link-normal';
            a.href = '/gp/your-account/order-history?orderFilter=archived';
            a.textContent = 'Archived Orders'; // changed per your request

            li.appendChild(a);

            const cancelled = ul.querySelector('a[href*="orderFilter=cancelled"]');
            const cancelledLi = cancelled && cancelled.closest('li');
            if (cancelledLi && cancelledLi.parentNode) {
                cancelledLi.parentNode.insertBefore(li, cancelledLi.nextSibling);
            } else {
                ul.appendChild(li);
            }
        });
    }

    // --- Helper to extract orderId from href or nearby DOM ---
    function extractOrderIdFromHrefOrDom(anchor) {
        const href = anchor.getAttribute('href') || '';
        // Try from href parameters first (orderID or orderId)
        const m = href.match(/[?&](?:orderID|orderId)=([^&]+)/i);
        if (m) return decodeURIComponent(m[1]);

        // Fallback: find nearby element with the order number text (class used in your saved page)
        // search upward for a container that contains '.yohtmlc-order-id'
        let parent = anchor;
        for (let i = 0; i < 8 && parent; i++) {
            parent = parent.parentElement;
            if (!parent) break;
            const el = parent.querySelector && parent.querySelector('.yohtmlc-order-id');
            if (el) {
                const txt = el.textContent || '';
                // common Amazon order ID pattern: 123-1234567-1234567
                const m2 = txt.match(/\d{3}-\d{7}-\d{7}/);
                if (m2) return m2[0];
                // looser fallback: any long chunk of digits+hyphens
                const m3 = txt.match(/[\d-]{10,}/);
                if (m3) return m3[0].trim();
            }
        }
        return null;
    }

    // --- Insert "Archive Order" links next to "View order details" ---
    function addArchiveLinksToOrders() {
        // Anchors that point to the order-details page (relative href)
        const detailAnchors = Array.from(document.querySelectorAll('a[href*="/gp/css/order-details"], a[href*="order-details?orderID="], a[href*="/gp/your-account/order-details"]'));

        detailAnchors.forEach(a => {
            // find a reasonable insertion container: the closest list item, or the anchor's parent
            const li = a.closest('li') || a.parentElement;
            if (!li) return;

            // avoid adding duplicates inside this li
            if (li.querySelector('.archive-order-link')) return;

            // extract order id
            const orderId = extractOrderIdFromHrefOrDom(a);
            if (!orderId) return; // couldn't find an id

            // Build separator (matches existing Amazon separators)
            const sep = document.createElement('i');
            sep.className = 'a-icon a-icon-text-separator';
            sep.setAttribute('role', 'img');

            // Build the archive link
            const link = document.createElement('a');
            link.className = 'a-link-normal archive-order-link';
            // Use encodeURIComponent to be safe
            link.href = `https://www.amazon.com/gp/css/order-history/archive/archiveModal.html?orderId=${encodeURIComponent(orderId)}`;
            link.target = '_blank';
            link.textContent = 'Archive Order';

            // Insert: put separator then link immediately after the "View order details" anchor
            // prefer inserting after the specific anchor (so it's near invoice/details)
            a.insertAdjacentElement('afterend', sep);
            sep.insertAdjacentElement('afterend', link);
        });
    }

    // Kick off
    function init() {
        addArchivedOrdersTab();
        addArchiveLinksToOrders();
    }
    init();

    // Observe for dynamically added content (lazy loading)
    const obs = new MutationObserver((mutations) => {
        if (!mutations || mutations.length === 0) return;
        addArchiveLinksToOrders();
    });
    obs.observe(document.body, { childList: true, subtree: true });

})();
