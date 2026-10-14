'use strict';

// Progressive enhancement: links, photos and contact details work without JS.
document.body.classList.add('has-js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-navigation');
menuButton.hidden = false;
function syncMobileNavTop() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  document.documentElement.style.setProperty('--mobile-nav-top', `${header.getBoundingClientRect().bottom}px`);
}
function setMenuOpen(open) {
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('is-menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
  if (open) syncMobileNavTop();
}
function closeMenu() {
  setMenuOpen(false);
}
menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
window.addEventListener('resize', () => {
  if (navigation.classList.contains('is-open')) syncMobileNavTop();
});
window.addEventListener('scroll', () => {
  if (navigation.classList.contains('is-open')) syncMobileNavTop();
}, { passive: true });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') && navigation.classList.contains('is-open')) closeMenu();
});
const desktopQuery = window.matchMedia('(min-width: 901px)');
desktopQuery.addEventListener('change', event => { if (event.matches) closeMenu(); });

const gallery = document.querySelector('.gallery-grid');
const photos = [...document.querySelectorAll('.gallery-item')];
const filters = [...document.querySelectorAll('.filter-button')];
function filterGallery(category) {
  const selected = filters.some(button => button.dataset.filter === category) ? category : 'all';
  photos.forEach(photo => { photo.hidden = selected !== 'all' && photo.dataset.category !== selected; });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
  gallery.classList.toggle('is-filtered', selected !== 'all');
  const count = photos.filter(photo => !photo.hidden).length;
  document.querySelector('.gallery-count').textContent = `${count} little glimpse${count === 1 ? '' : 's'}`;
}
filters.forEach(button => button.addEventListener('click', () => filterGallery(button.dataset.filter)));
document.querySelectorAll('[data-gallery-filter]').forEach(link => {
  link.addEventListener('click', () => filterGallery(link.dataset.galleryFilter));
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
let visiblePhotos = [];
let currentPhoto = 0;
let opener = null;
function displayPhoto() {
  const photo = visiblePhotos[currentPhoto];
  if (!photo) return;
  lightboxImage.src = photo.href;
  lightboxImage.alt = photo.querySelector('img').alt;
  lightboxImage.width = photo.querySelector('img').width;
  lightboxImage.height = photo.querySelector('img').height;
  document.querySelector('#lightbox-caption').textContent = photo.dataset.caption;
  document.querySelector('#lightbox-counter').textContent = `${currentPhoto + 1} / ${visiblePhotos.length}`;
}
function movePhoto(offset) {
  if (!visiblePhotos.length) return;
  currentPhoto = (currentPhoto + offset + visiblePhotos.length) % visiblePhotos.length;
  displayPhoto();
}
photos.forEach(photo => photo.addEventListener('click', event => {
  if (typeof lightbox.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  visiblePhotos = photos.filter(item => !item.hidden);
  currentPhoto = visiblePhotos.indexOf(photo);
  opener = photo;
  displayPhoto();
  document.body.classList.add('is-modal');
  lightbox.showModal();
  lightbox.querySelector('.lightbox-close').focus();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => movePhoto(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => movePhoto(1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
});
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('close', () => {
  document.body.classList.remove('is-modal');
  if (opener) opener.focus();
});
let touchStartX = null;
let touchStartY = null;
lightboxImage.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });
lightboxImage.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const dx = event.changedTouches[0].clientX - touchStartX;
  const dy = event.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) movePhoto(dx < 0 ? 1 : -1);
  touchStartX = null;
  touchStartY = null;
}, { passive: true });

// The map makes no third-party request until a visitor chooses to load it.
const locations = {
  river: {
    label: 'Alpine Shirt Co., River Street', shortName: 'River Street',
    external: 'https://maps.google.com/?cid=7030248114201978366',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.173523981072!2d-83.72984489999999!3d34.700803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885f49e5f5da614f%3A0x6190756979de65fe!2sAlpine%20Shirt%20Company!5e0!3m2!1sen!2sus!4v1698980126760!5m2!1sen!2sus'
  },
  main: {
    label: 'Alpine Shirt Co., Main Street', shortName: 'Main Street',
    external: 'https://maps.google.com/?cid=4318962963659079152',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.133186866608!2d-83.7335896!3d34.7018205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885f376350569971%3A0x3bf009eebef7bdf0!2sAlpine%20Shirt%20Company!5e0!3m2!1sen!2sus!4v1698981624748!5m2!1sen!2sus'
  }
};
let selectedLocation = 'river';
const mapContainer = document.querySelector('#map-container');
const mapPreview = document.querySelector('#map-preview');
function showMap(locationId) {
  if (!locations[locationId]) return;
  selectedLocation = locationId;
  const location = locations[locationId];
  document.querySelectorAll('.map-location').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.map === locationId)));
  document.querySelectorAll('.location-card').forEach(card => card.classList.toggle('is-selected', card.dataset.locationCard === locationId));
  document.querySelector('#map-label-text').textContent = location.label;
  document.querySelector('#map-external').href = location.external;
  document.querySelector('#map-fallback').href = location.external;
  let frame = mapContainer.querySelector('iframe');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    mapContainer.append(frame);
  }
  frame.title = `${location.shortName} shop, Alpine Shirt Co. in Helen, Georgia`;
  if (frame.getAttribute('src') !== location.embed) frame.src = location.embed;
  mapPreview.hidden = true;
  mapContainer.hidden = false;
  if (window.matchMedia('(max-width: 680px)').matches) {
    mapContainer.closest('.map-panel').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
}
document.querySelector('#load-map').addEventListener('click', () => showMap(selectedLocation));
document.querySelectorAll('.map-location').forEach(button => button.addEventListener('click', () => showMap(button.dataset.map)));
document.querySelector('#copyright-year').textContent = new Date().getFullYear();

const storySlider = document.querySelector('#story-slider');
if (storySlider) {
  const storySlides = [...storySlider.querySelectorAll('.story-slide')];
  const storyDots = [...storySlider.closest('.story-visual').querySelectorAll('.story-dot')];
  let storyIndex = 0;
  let storyTimer;
  const storyMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function showStorySlide(index) {
    storyIndex = (index + storySlides.length) % storySlides.length;
    storySlides.forEach((slide, i) => slide.classList.toggle('is-active', i === storyIndex));
    storyDots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === storyIndex);
      dot.setAttribute('aria-selected', String(i === storyIndex));
    });
  }
  function startStorySlider() {
    clearInterval(storyTimer);
    if (!storyMotion.matches) storyTimer = setInterval(() => showStorySlide(storyIndex + 1), 10000);
  }
  storyDots.forEach((dot, i) => dot.addEventListener('click', () => {
    showStorySlide(i);
    startStorySlider();
  }));
  storyMotion.addEventListener('change', startStorySlider);
  showStorySlide(0);
  startStorySlider();
}
