(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var ready = false;

    var start = function () {
      if (!video || !stream) {
        return;
      }

      if (!ready) {
        ready = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          video.hlsPlayer = hls;
        } else {
          video.src = stream;
        }

        video.controls = true;
      }

      player.classList.add('is-playing');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }

    player.addEventListener('click', function (event) {
      if (event.target === video || event.target.closest('[data-play]')) {
        return;
      }
      start();
    });

    if (video) {
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    }
  });
})();
