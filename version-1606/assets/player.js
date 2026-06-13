(function () {
  var node = document.getElementById("movie-player-config");
  var video = document.getElementById("movie-video");
  var mask = document.getElementById("player-mask");

  if (!node || !video || !mask) {
    return;
  }

  var config = {};
  try {
    config = JSON.parse(node.textContent || "{}");
  } catch (error) {
    config = {};
  }

  var attached = false;
  var hls = null;

  function attachVideo() {
    if (attached || !config.src) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = config.src;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(config.src);
      hls.attachMedia(video);
    } else {
      video.src = config.src;
    }

    video.controls = true;
    attached = true;
  }

  function beginPlay() {
    attachVideo();
    mask.classList.add("is-hidden");
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        mask.classList.remove("is-hidden");
      });
    }
  }

  mask.addEventListener("click", beginPlay);
  video.addEventListener("click", function () {
    if (!attached || video.paused) {
      beginPlay();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
})();
