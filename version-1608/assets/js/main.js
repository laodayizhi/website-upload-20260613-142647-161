(function () {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    const hero = document.querySelector("[data-hero]");
    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let active = 0;
        let timer;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === active);
            });
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        restart();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        const scope = panel.parentElement.querySelector("[data-filter-scope]") || document;
        const search = panel.querySelector("[data-filter-search]");
        const fields = Array.from(panel.querySelectorAll("[data-filter-field]"));
        const targets = Array.from(scope.querySelectorAll("[data-search-target]"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            const keyword = normalize(search ? search.value : "");
            targets.forEach(function (target) {
                const text = normalize(target.getAttribute("data-search-text") || target.textContent);
                let visible = !keyword || text.indexOf(keyword) !== -1;
                fields.forEach(function (field) {
                    const fieldName = field.getAttribute("data-filter-field");
                    const expected = normalize(field.value);
                    const actual = normalize(target.getAttribute("data-" + fieldName));
                    if (expected && actual !== expected) {
                        visible = false;
                    }
                });
                target.classList.toggle("is-hidden", !visible);
            });
        }

        if (search) {
            search.addEventListener("input", apply);
        }
        fields.forEach(function (field) {
            field.addEventListener("change", apply);
        });
    });
}());
