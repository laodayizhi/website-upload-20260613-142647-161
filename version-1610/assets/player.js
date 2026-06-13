(function () {
  function playVideo(video) {
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  }

  function initPlayer(box) {
    if (!box || box.getAttribute('data-ready') === '1') {
      return;
    }
    var video = box.querySelector('video');
    if (!video) {
      return;
    }
    var stream = video.getAttribute('data-stream');
    if (!stream) {
      return;
    }
    box.setAttribute('data-ready', '1');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls) {
      var hls = new Hls({ enableWorker: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (box.classList.contains('is-playing')) {
          playVideo(video);
        }
      });
    } else {
      video.src = stream;
    }
  }

  function play(box) {
    var video = box.querySelector('video');
    if (!video) {
      return;
    }
    initPlayer(box);
    box.classList.add('is-playing');
    video.controls = true;
    playVideo(video);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.player-start');
    var box = event.target.closest('.movie-player');
    if (!button && (!box || event.target.tagName === 'VIDEO')) {
      return;
    }
    if (button) {
      box = button.closest('.movie-player');
    }
    if (box) {
      play(box);
    }
  });
})();
