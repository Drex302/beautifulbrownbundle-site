/**
 * Firebase Web SDK (modular). getAnalytics(app) records default page_view on any page that loads this file.
 * Custom events use logFirebaseEvent from js/analytics-helper.js (same Firebase app).
 * Web API keys are public; protect data with Firestore/Storage security rules when you add backends.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBkwEw3FzkTsUb6tC970G4Pu4z_MFvWxLs',
  authDomain: 'beautifulbrownbundle.firebaseapp.com',
  projectId: 'beautifulbrownbundle',
  storageBucket: 'beautifulbrownbundle.firebasestorage.app',
  messagingSenderId: '579005235115',
  appId: '1:579005235115:web:d2cf47310950bf63f61cee',
  measurementId: 'G-LQZZJ5YJ8H',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
getAnalytics(app);

export { app, db };
