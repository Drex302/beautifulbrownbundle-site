/**
 * Exposes logFirebaseEvent globally for inline handlers in index.html.
 * Delegates outbound_contact_click on dynamic result list links.
 */
import { logFirebaseEvent } from './analytics-helper.js';

window.logFirebaseEvent = logFirebaseEvent;

document.addEventListener('DOMContentLoaded', () => {
  const resultList = document.getElementById('resultList');
  if (resultList) {
    resultList.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link-type]');
      if (!a) return;
      const linkType = a.getAttribute('data-link-type');
      if (linkType) {
        logFirebaseEvent('outbound_contact_click', { link_type: linkType });
      }
    });
  }
});
