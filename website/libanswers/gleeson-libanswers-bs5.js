// GLEESON LIBRARY -- UNIVERSITY OF SAN FRANCISCO
// CUSTOM JAVASCRIPT USED ON LIBANSWERS BS5
// Last Edit: 10/23/2026

$(document).ready(function () {
  // Create the comment nodes as strings
  const beginComment = document.createComment('BEGIN: Ask A Librarian Button');
  const endComment = document.createComment('END: Ask A Librarian Button');

  // Create the HTML structure as a jQuery element
  const librarianDiv = $(`
    <div id="ask-a-librarian" class="ask-a-librarian-component">
      <a class="ask-a-librarian-button" href="https://libanswers.usfca.edu/">
        <i class="fa-regular fa-comments" aria-hidden="true"></i>Ask A Librarian
      </a>
    </div>
  `);

  // Append to body in order
  $('body').append(beginComment);
  $('body').append(librarianDiv);
  $('body').append(endComment);

  // ---------------------------------------------------------------
  // Keep the button above the cookie banner until it is dismissed
  // ---------------------------------------------------------------
  const container = librarianDiv[0];
  const link = container.querySelector('.ask-a-librarian-button');
  let resizeObserver = null;
  let observedBanner = null;
  let bannerSeen = false;

  // Lift whichever element the stylesheet makes position: fixed
  function liftTarget() {
    return getComputedStyle(container).position === 'fixed' ? container : link;
  }

  // Height of the banner if it is visible and pinned to the bottom, else 0
  function bannerHeight(banner) {
    if (!banner) return 0;
    const cs = getComputedStyle(banner);
    if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
    if (cs.position !== 'fixed') return 0;
    const rect = banner.getBoundingClientRect();
    if (rect.top < window.innerHeight / 2) return 0; // top banner: no overlap
    return Math.round(rect.height);
  }

  function setLift(el, value) {
    if (el.style.translate !== value) el.style.translate = value;
  }

  function update() {
    const banner = document.getElementById('s-ui-cc-navbar');
    const h = bannerHeight(banner);
    const target = liftTarget();
    const other = target === container ? link : container;
    setLift(other, '');
    setLift(target, h ? '0 -' + h + 'px' : '');

    if (banner) bannerSeen = true;

    // Re-measure whenever the banner changes size (mobile wrapping, rotate, hide)
    if (banner && banner !== observedBanner && 'ResizeObserver' in window) {
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(banner);
      observedBanner = banner;
    }

    // Banner was shown and is now gone: reset and stop watching
    if (bannerSeen && !banner) stop();
  }

  const mutationObserver = new MutationObserver(update);
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  function stop() {
    mutationObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener('resize', update);
  }

  window.addEventListener('resize', update);
  update();

  // If the banner never appears (consent already given), stop watching
  setTimeout(function () {
    if (!bannerSeen) stop();
  }, 5000);
});