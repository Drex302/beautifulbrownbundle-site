/**
 * Google Analytics 4 — Beautiful Brown Bundle (dedicated stream: G-C3HBZN96ST).
 */
(function () {
  var GA_MEASUREMENT_ID = 'G-C3HBZN96ST';

  if (!GA_MEASUREMENT_ID) {
    return;
  }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();
