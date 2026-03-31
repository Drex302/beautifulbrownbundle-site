/**
 * Firebase Analytics (GA4) custom events — use logFirebaseEvent from the landing page and forms.
 */
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js';
import { app } from './firebase-init.js';

const analytics = getAnalytics(app);

/**
 * @param {string} name - GA4 event name (max 40 chars, [a-zA-Z0-9_])
 * @param {Record<string, string|number>} [params] - GA4 limits string length; avoid PII where possible
 */
export function logFirebaseEvent(name, params) {
  const p = params && typeof params === 'object' ? { ...params } : {};
  try {
    logEvent(analytics, name, p);
  } catch (e) {
    console.warn('logFirebaseEvent', name, e);
  }
}
