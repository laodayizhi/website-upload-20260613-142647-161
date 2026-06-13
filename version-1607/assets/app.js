(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dots] button'));
    var active = 0;

    var setSlide = function (next) {
      if (!slides.length) {
        return;
      }
      active = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === active);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === active);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
      });
    });

    setSlide(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        setSlide(active + 1);
      }, 5200);
    }
  }

  var input = document.querySelector('[data-search]');
  var clearButton = document.querySelector('[data-clear-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-card'));
  var empty = document.querySelector('[data-filter-empty]');

  var normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  var filterCards = function () {
    if (!input || !cards.length) {
      return;
    }
    var keyword = normalize(input.value);
    var matched = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year')
      ].join(' '));
      var visible = !keyword || haystack.indexOf(keyword) !== -1;
      card.hidden = !visible;
      if (visible) {
        matched += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', matched === 0);
    }
  };

  if (input) {
    var query = new URLSearchParams(window.location.search).get('q');
    if (query) {
      input.value = query;
    }
    input.addEventListener('input', filterCards);
    filterCards();
  }

  if (clearButton && input) {
    clearButton.addEventListener('click', function () {
      input.value = '';
      input.focus();
      filterCards();
    });
  }
})();
