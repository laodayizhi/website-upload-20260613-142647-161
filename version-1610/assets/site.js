(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function initMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initLocalFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-local-search]');
      var year = panel.querySelector('[data-year-filter]');
      var type = panel.querySelector('[data-type-filter]');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

      function apply() {
        var q = normalize(input && input.value);
        var y = year ? year.value : '';
        var t = type ? type.value : '';
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region'));
          var matchText = !q || text.indexOf(q) !== -1;
          var matchYear = !y || card.getAttribute('data-year') === y;
          var matchType = !t || card.getAttribute('data-type') === t;
          card.classList.toggle('hidden-card', !(matchText && matchYear && matchType));
        });
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  function initGlobalSearch() {
    var input = document.querySelector('[data-global-search]');
    var results = document.querySelector('[data-global-results]');
    if (!input || !results || !window.MovieSearchIndex) {
      return;
    }

    function card(movie) {
      var tags = movie.tags.slice(0, 3).map(function (tag) {
        return '<span class="meta-pill">' + tag + '</span>';
      }).join('');
      return '<article class="movie-card">' +
        '<a class="movie-poster" href="' + movie.url + '"><span class="movie-badge">' + movie.year + '</span><img src="' + movie.cover + '" alt="' + movie.title + '"></a>' +
        '<div class="movie-body"><h3 class="movie-title"><a href="' + movie.url + '">' + movie.title + '</a></h3>' +
        '<p class="movie-desc">' + movie.oneLine + '</p><div class="movie-meta">' + tags + '</div></div>' +
        '</article>';
    }

    input.addEventListener('input', function () {
      var q = normalize(input.value);
      if (!q) {
        results.classList.remove('is-visible');
        results.innerHTML = '';
        return;
      }
      var matched = window.MovieSearchIndex.filter(function (movie) {
        return normalize(movie.title + ' ' + movie.region + ' ' + movie.type + ' ' + movie.genre + ' ' + movie.tags.join(' ')).indexOf(q) !== -1;
      }).slice(0, 12);
      results.innerHTML = matched.map(card).join('');
      results.classList.add('is-visible');
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initLocalFilters();
    initGlobalSearch();
  });
})();
