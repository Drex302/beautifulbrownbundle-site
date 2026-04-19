/**
 * Firebase Web SDK (modular). getAnalytics(app) records default page_view on any page that loads this file.
 * Custom events use logFirebaseEvent from js/site-analytics.js (same Firebase app).
 *
 * Config lives in ./firebase-config.js (gitignored). The web API key is still sent to browsers;
 * restrict the key in Google Cloud (HTTP referrers + APIs) and enforce Firestore rules.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
getAnalytics(app);

export { app, db };
