import { db } from './firebase-init.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { logFirebaseEvent } from './analytics-helper.js';

function showErr(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function initStoryForm() {
  const form = document.getElementById('storyForm');
  if (!form || form.tagName !== 'FORM') return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('storyFormError');
    const btn = form.querySelector('button[type="submit"]');
    showErr(err, '');

    const consent = document.getElementById('consent');
    if (!consent || !consent.checked) {
      showErr(err, 'Please check the permission box so we can share your story with the community.');
      return;
    }

    const story = (document.getElementById('storyBody')?.value || '').trim();
    if (story.length < 10) {
      showErr(err, 'Please share your story in at least a few sentences (10+ characters).');
      return;
    }

    const payload = {
      story,
      consentShare: true,
      anonymousOnly: !!(document.getElementById('anon') && document.getElementById('anon').checked),
      submittedAt: serverTimestamp(),
      source: 'landing',
    };

    const firstName = (document.getElementById('storyFirstName')?.value || '').trim();
    const cityState = (document.getElementById('storyCityState')?.value || '').trim();
    const stage = (document.getElementById('storyStage')?.value || '').trim();
    const referralSource = (document.getElementById('storyReferral')?.value || '').trim();
    const culturalRemedy = (document.getElementById('storyCultural')?.value || '').trim();

    if (firstName) payload.firstName = firstName;
    if (cityState) payload.cityState = cityState;
    if (stage) payload.stage = stage;
    if (referralSource) payload.referralSource = referralSource;
    if (culturalRemedy) payload.culturalRemedy = culturalRemedy;

    const prevText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    try {
      await addDoc(collection(db, 'story_submissions'), payload);
      logFirebaseEvent('story_submit_success', {
        anonymous_only: payload.anonymousOnly ? 1 : 0,
        has_stage: stage ? 1 : 0,
      });
      form.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) success.style.display = 'block';
    } catch (ex) {
      console.error(ex);
      logFirebaseEvent('story_submit_error', { reason: 'firestore_write_failed' });
      showErr(
        err,
        'Something went wrong sending your story. Please check your connection and try again, or email us later.'
      );
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = prevText;
      }
    }
  });
}

function initDirectoryForm() {
  const form = document.getElementById('listForm');
  if (!form || form.tagName !== 'FORM') return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('directoryFormError');
    const btn = form.querySelector('button[type="submit"]');
    showErr(err, '');

    const orgName = (document.getElementById('dirOrgName')?.value || '').trim();
    const contactName = (document.getElementById('dirContactName')?.value || '').trim();
    const contactEmail = (document.getElementById('dirEmail')?.value || '').trim();
    const city = (document.getElementById('dirCity')?.value || '').trim();
    const state = (document.getElementById('listStateSelect')?.value || '').trim();
    const serviceDescription = (document.getElementById('dirDescription')?.value || '').trim();
    const blackOwnedOrLed = (document.getElementById('dirBlackOwned')?.value || '').trim();

    const catEls = form.querySelectorAll('input[name="dirCategory"]:checked');
    /** Same order as directory filter chips / CAT_ICONS keys in bbb-resource-directory.html */
    const CATEGORY_ORDER = ['maternal', 'postpartum', 'nutrition', 'childcare', 'mental', 'national'];
    let categories = Array.from(catEls).map((c) => c.value);
    categories = [...new Set(categories)].sort(
      (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
    );

    if (!orgName || !contactName || !contactEmail || !city || !state || !serviceDescription || !blackOwnedOrLed) {
      showErr(err, 'Please fill in all required fields (marked *).');
      return;
    }
    if (categories.length < 1) {
      showErr(err, 'Please select at least one resource category.');
      return;
    }

    const payload = {
      orgName,
      contactName,
      contactEmail,
      city,
      state,
      serviceDescription,
      blackOwnedOrLed,
      categories,
      /** First value after sort — use as primary `cat` when adding to the public directory */
      primaryCategory: categories[0],
      submittedAt: serverTimestamp(),
      source: 'directory_page',
    };

    const phone = (document.getElementById('dirPhone')?.value || '').trim();
    const websiteUrl = (document.getElementById('dirWebsite')?.value || '').trim();
    const slidingScale = (document.getElementById('dirSliding')?.value || '').trim();
    const additionalNotes = (document.getElementById('dirNotes')?.value || '').trim();

    if (phone) payload.phone = phone;
    if (websiteUrl) payload.websiteUrl = websiteUrl;
    if (slidingScale) payload.slidingScale = slidingScale;
    if (additionalNotes) payload.additionalNotes = additionalNotes;

    const prevText = btn ? btn.textContent : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    try {
      await addDoc(collection(db, 'directory_listing_requests'), payload);
      logFirebaseEvent('directory_submit_success', {
        has_phone: phone ? 1 : 0,
        categories_count: categories.length,
      });
      form.style.display = 'none';
      const success = document.getElementById('listSuccess');
      if (success) success.style.display = 'block';
      const anchor = document.getElementById('list-your-org');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
    } catch (ex) {
      console.error(ex);
      logFirebaseEvent('directory_submit_error', { reason: 'firestore_write_failed' });
      showErr(
        err,
        'Something went wrong sending your listing. Please check your connection and try again.'
      );
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = prevText;
      }
    }
  });
}

initStoryForm();
initDirectoryForm();
