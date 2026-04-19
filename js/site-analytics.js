/**
 * Site-wide Firebase Analytics (GA4): clicks, scroll depth, form starts, outbound directory links.
 * Avoids PII: truncates text, strips emails from snippets, never logs field values.
 */
import { logFirebaseEvent } from './analytics-helper.js';

window.logFirebaseEvent = logFirebaseEvent;

const MAX_TEXT = 80;
const MAX_URL = 200;

function truncate(str, n) {
  if (str == null || str === '') return '';
  return String(str)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, n);
}

/** Strip patterns that look like email fragments from analytics labels */
function sanitizeLabel(s) {
  let t = truncate(s, MAX_TEXT);
  t = t.replace(/[^\s@]{1,64}@[^\s@]{1,255}/g, '[email]');
  return t;
}

function pagePath() {
  return `${window.location.pathname}${window.location.search || ''}`.slice(0, 200);
}

function describeClickTarget(el) {
  const tag = el.tagName ? el.tagName.toLowerCase() : 'unknown';
  const id = el.id ? truncate(el.id, 64) : '';
  const cls = el.className && typeof el.className === 'string' ? truncate(el.className.split(/\s+/)[0] || '', 48) : '';
  const text = sanitizeLabel(el.innerText || el.textContent || el.value || '');
  let href = '';
  let outbound = 0;
  if (tag === 'a' && el.href) {
    try {
      const u = new URL(el.href, window.location.origin);
      href = truncate(u.href, MAX_URL);
      outbound = u.origin !== window.location.origin ? 1 : 0;
    } catch {
      href = truncate(el.getAttribute('href') || '', MAX_URL);
    }
  }
  return { tag, id, cls, text, href, outbound };
}

function initOutboundDirectoryLinks() {
  const resultList = document.getElementById('resultList');
  if (!resultList) return;
  resultList.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link-type]');
    if (!a) return;
    const linkType = a.getAttribute('data-link-type');
    if (linkType) {
      logFirebaseEvent('outbound_contact_click', { link_type: truncate(linkType, 64) });
    }
  });
}

function initDelegatedClicks() {
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      const actionable = t.closest(
        'a[href], button, [role="button"], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], summary'
      );
      if (!actionable) return;

      // Avoid duplicate with dedicated outbound event
      if (actionable.matches('a[data-link-type]')) return;

      const d = describeClickTarget(actionable);
      const payload = {
        page_path: pagePath(),
        element: d.tag,
      };
      if (d.id) payload.element_id = d.id;
      if (d.cls) payload.element_class = d.cls;
      if (d.text) payload.text_snippet = d.text;
      if (d.href) {
        payload.link_url = d.href;
        payload.is_outbound = d.outbound;
      }
      logFirebaseEvent('site_click', payload);
    },
    true
  );
}

function initScrollDepth() {
  const milestones = [25, 50, 75, 100];
  const fired = new Set();
  let ticking = false;

  function pctScrolled() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height = doc.scrollHeight - window.innerHeight;
    if (height <= 0) return 100;
    return Math.min(100, Math.round((scrollTop / height) * 100));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const p = pctScrolled();
      for (const m of milestones) {
        if (p >= m && !fired.has(m)) {
          fired.add(m);
          logFirebaseEvent('scroll_depth', {
            page_path: pagePath(),
            percent_scrolled: m,
          });
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initFormStart() {
  const formIds = ['storyForm', 'listForm'];
  for (const fid of formIds) {
    const form = document.getElementById(fid);
    if (!form) continue;
    const key = `bbb_form_start_${fid}`;
    const onFirst = () => {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      logFirebaseEvent('form_start', { form_id: fid, page_path: pagePath() });
    };
    form.addEventListener('focusin', onFirst, { capture: true });
  }
}

function init() {
  initOutboundDirectoryLinks();
  initDelegatedClicks();
  initScrollDepth();
  initFormStart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
