/**
 * 1. Copy this file to firebase-config.js (same folder).
 * 2. Paste your Firebase web app config from Firebase Console → Project settings → Your apps.
 * 3. Never commit firebase-config.js (it is listed in .gitignore).
 *
 * For GitHub Actions → GitHub Pages: add repository secret FIREBASE_CONFIG_JSON
 * with a single-line JSON object (same keys as below, your real values).
 */
export const firebaseConfig = {
  apiKey: 'YOUR_WEB_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.firebasestorage.app',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:xxxxxxxxxxxxxxxx',
  measurementId: 'G-XXXXXXXXXX',
};
