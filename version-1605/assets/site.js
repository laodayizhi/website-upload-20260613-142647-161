(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupImages() {
        var images = document.querySelectorAll("img[data-cover]");
        images.forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("is-empty");
                image.removeAttribute("src");
            }, { once: true });
        });
    }

    function setupHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
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
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        slider.addEventListener("mouseenter", stop);
        slider.addEventListener("mouseleave", start);
        start();
    }

    function setupFilters() {
        var list = document.querySelector("[data-filter-list]");
        if (!list) {
            return;
        }
        var input = document.querySelector("[data-filter-input]");
        var type = document.querySelector("[data-filter-type]");
        var year = document.querySelector("[data-filter-year]");
        var empty = document.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";
        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function match(card) {
            var query = input ? input.value.trim().toLowerCase() : "";
            var typeValue = type ? type.value : "";
            var yearValue = year ? year.value : "";
            var text = (card.getAttribute("data-search") || "").toLowerCase();
            var cardType = card.getAttribute("data-type") || "";
            var cardYear = card.getAttribute("data-year") || "";
            return (!query || text.indexOf(query) !== -1) && (!typeValue || cardType === typeValue) && (!yearValue || cardYear === yearValue);
        }

        function update() {
            var visible = 0;
            cards.forEach(function (card) {
                var ok = match(card);
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", update);
                control.addEventListener("change", update);
            }
        });
        update();
    }

    ready(function () {
        setupMenu();
        setupImages();
        setupHero();
        setupFilters();
    });
})();
