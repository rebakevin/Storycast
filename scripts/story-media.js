// Watch / Listen / Read tabs for each story, plus a transcript that follows the video or audio.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const instances = [...document.querySelectorAll('.story-media')].map(setUpStoryMedia);

// Stop playback when the reader leaves the page the media is on.
window.addEventListener('hashchange', () => {
  instances.forEach(({ root, pause }) => {
    if (!root.offsetParent) pause();
  });
});

// The YouTube IFrame API is loaded once, the first time any video is on screen.
let youTubeApi = null;
function loadYouTubeApi() {
  youTubeApi ??= new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.append(script);
  });
  return youTubeApi;
}

function setUpStoryMedia(root) {
  const tablist = root.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const audio = root.querySelector('audio');
  const iframe = root.querySelector('iframe');
  let player = null; // YouTube player, once its API has loaded

  const pause = () => {
    audio.pause();
    player?.pauseVideo?.();
  };

  // ---- Tabs (the HTML shows every option until this script turns the tabs on)
  function selectTab(tab) {
    tabs.forEach((other) => {
      const selected = other === tab;
      other.setAttribute('aria-selected', selected);
      other.tabIndex = selected ? 0 : -1;
      document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
    });
    pause();
  }

  tablist.hidden = false;
  selectTab(tabs[0]);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const next = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });

  // ---- Transcripts: show or hide, highlight the playing cue, click a cue to jump there
  function setUpTranscript(panel, { play, seek }) {
    const toggle = panel.querySelector('.synced-transcript__toggle');
    const body = panel.querySelector('.synced-transcript__body');
    const items = [...panel.querySelectorAll('.cues__item')];
    const times = items.map((item) => ({ start: Number(item.dataset.start), end: Number(item.dataset.end) }));
    let active = null;
    let lastUserScroll = 0;

    toggle.addEventListener('click', () => {
      const show = body.hidden;
      body.hidden = !show;
      toggle.setAttribute('aria-expanded', show);
      toggle.querySelector('.synced-transcript__label').textContent = show ? 'Hide transcript' : 'Show transcript';
    });

    ['wheel', 'touchmove'].forEach((type) =>
      body.addEventListener(type, () => (lastUserScroll = Date.now()), { passive: true })
    );

    items.forEach((item) =>
      item.querySelector('button').addEventListener('click', () => {
        seek(Number(item.dataset.start));
        play();
      })
    );

    return function highlight(time) {
      const current = items[times.findLastIndex((cue) => cue.start <= time && time < cue.end + 1)];
      if (current === active) return;

      active?.classList.remove('is-active');
      active?.querySelector('button').removeAttribute('aria-current');
      current?.classList.add('is-active');
      current?.querySelector('button').setAttribute('aria-current', 'true');
      active = current;

      // Scroll the transcript only, never the page, and not while the reader is scrolling it.
      if (current && !body.hidden && Date.now() - lastUserScroll > 3000) {
        // offsetTop is measured from the nearest positioned ancestor, which is not this box,
        // so measure from the box itself to put the cue at its top edge.
        const offset = current.getBoundingClientRect().top - body.getBoundingClientRect().top - body.clientTop;
        body.scrollTo({
          top: body.scrollTop + offset,
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
      }
    };
  }

  // ---- Audio
  const highlightAudio = setUpTranscript(root.querySelector('[data-panel="listen"]'), {
    play: () => audio.play(),
    seek: (time) => (audio.currentTime = time),
  });
  ['timeupdate', 'seeked'].forEach((type) =>
    audio.addEventListener(type, () => highlightAudio(audio.currentTime))
  );

  // ---- Video
  const highlightVideo = setUpTranscript(root.querySelector('[data-panel="watch"]'), {
    play: () => player?.playVideo?.(),
    seek: (time) => player?.seekTo?.(time, true),
  });

  let timer = null;
  function onPlayerState({ data }) {
    clearInterval(timer);
    highlightVideo(player.getCurrentTime());
    if (data === window.YT.PlayerState.PLAYING) {
      timer = setInterval(() => highlightVideo(player.getCurrentTime()), 250);
    }
  }

  // Start the player when the video first becomes visible (its page is hidden until visited).
  new IntersectionObserver((entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    loadYouTubeApi().then((YT) => {
      player = new YT.Player(iframe, { events: { onStateChange: onPlayerState } });
    });
  }).observe(iframe);

  return { root, pause };
}
