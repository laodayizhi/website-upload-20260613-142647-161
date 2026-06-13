(function () {
    function showMessage(element, message) {
        if (!element) {
            return;
        }
        element.textContent = message;
        element.hidden = false;
    }

    function prepareNative(video, source) {
        video.src = source;
        return Promise.resolve();
    }

    function prepareHls(video, source) {
        return new Promise(function (resolve, reject) {
            if (!window.Hls || !window.Hls.isSupported()) {
                reject(new Error("hls-not-supported"));
                return;
            }
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                resolve();
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    reject(new Error(data.type || "hls-error"));
                }
            });
        });
    }

    function init(options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var message = document.getElementById(options.messageId);
        var started = false;
        var source = options.source;
        if (!video || !source) {
            return;
        }

        function prepare() {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                return prepareNative(video, source);
            }
            if (window.Hls && window.Hls.isSupported()) {
                return prepareHls(video, source);
            }
            video.src = source;
            return Promise.resolve();
        }

        function play() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            if (!started) {
                started = true;
                prepare().then(function () {
                    return video.play();
                }).catch(function () {
                    showMessage(message, "当前浏览器暂时无法加载播放内容，请刷新页面后重试。");
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                    started = false;
                });
                return;
            }
            video.play().catch(function () {
                showMessage(message, "当前浏览器暂时无法自动播放，请再次点击播放。");
            });
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    }

    window.StaticMoviePlayer = {
        init: init
    };
})();
