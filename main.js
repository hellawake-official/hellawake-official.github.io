
/* ── MOBILE MENU ── */
function initMobileMenu() {
  var btn = document.getElementById('mobile-menu-btn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('mobile-overlay');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', function() {
    var isOpen = sidebar.classList.contains('mobile-open');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  // Close on nav link click
  document.querySelectorAll('.side-link').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });

  // Close on swipe left
  var touchStartX = 0;
  sidebar.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  sidebar.addEventListener('touchend', function(e) {
    if (touchStartX - e.changedTouches[0].clientX > 60) closeMobileMenu();
  }, { passive: true });
}

function openMobileMenu() {
  var btn = document.getElementById('mobile-menu-btn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('mobile-overlay');
  sidebar && sidebar.classList.add('mobile-open');
  overlay && overlay.classList.add('show');
  btn && btn.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  var btn = document.getElementById('mobile-menu-btn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('mobile-overlay');
  sidebar && sidebar.classList.remove('mobile-open');
  overlay && overlay.classList.remove('show');
  btn && btn.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeMobileMenu = closeMobileMenu;
/* HELLAWAKE — main.js | Requires content.js loaded first */

/* ── BRANDING ── */
function applyBranding() {
  const b = SITE.branding || {};
  if (b.accentColor) document.documentElement.style.setProperty('--accent', b.accentColor);
  document.querySelectorAll('.nav-logo, #load-img, #logo-static, #nav-logo-img').forEach(el => { if (el && b.logoImage) el.src = b.logoImage; });
  const heroLogo = document.getElementById('logo-static');
  if (heroLogo && b.heroLogoWidth) heroLogo.style.width = b.heroLogoWidth;
  const heroBg = document.getElementById('hero-bg-parallax');
  if (heroBg && b.heroBackground) { heroBg.style.backgroundImage = `url('${b.heroBackground}')`; heroBg.style.opacity = b.heroBackgroundOpacity || '0.15'; }
  const tagline = document.getElementById('load-tagline');
  if (tagline) tagline.textContent = b.loaderTagline || '';
  const enterBtn = document.querySelector('.enter-btn');
  if (enterBtn) { enterBtn.textContent = b.enterBtnText || 'Enter'; enterBtn.href = b.enterBtnLink || 'episodes.html'; }
  const newsLabel = document.querySelector('.news-label');
  if (newsLabel) newsLabel.textContent = b.newsBarLabel || 'UPLINK';
  if (SITE.meta?.favicon) { const lk = document.createElement('link'); lk.rel = 'icon'; lk.href = SITE.meta.favicon; document.head.appendChild(lk); }
}

/* ── META ── */
function buildMeta() {
  if (SITE.meta?.title) document.title = SITE.meta.title;
  const s = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.content = val; };
  s('meta[property="og:title"]',       SITE.meta?.ogTitle);
  s('meta[property="og:description"]', SITE.meta?.ogDescription);
  s('meta[property="og:image"]',       SITE.meta?.ogImage);
}

/* ── ANNOUNCEMENT ── */
function buildAnnouncement() {
  const a = SITE.announcement;
  if (!a?.enabled) return;
  const bar = document.createElement('div');
  bar.className = `announcement-bar ann-${a.style || 'alert'}`;
  bar.innerHTML = `<span>${a.text}</span><button onclick="this.parentElement.remove()" class="ann-close">✕</button>`;
  document.body.insertBefore(bar, document.body.firstChild);
}

/* ── COUNTDOWN ── */
function buildCountdown() {
  const c = SITE.countdown;
  const el = document.getElementById('countdown-section');
  if (!el) return;
  if (!c?.enabled) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const lbl = document.getElementById('countdown-label');
  if (lbl) lbl.textContent = c.label;
  function tick() {
    const diff = new Date(c.targetDate) - new Date();
    if (diff <= 0) { el.style.display = 'none'; return; }
    const pad = n => String(Math.floor(n)).padStart(2,'0');
    document.getElementById('cd-days').textContent  = pad(diff/86400000);
    document.getElementById('cd-hours').textContent = pad((diff%86400000)/3600000);
    document.getElementById('cd-mins').textContent  = pad((diff%3600000)/60000);
    document.getElementById('cd-secs').textContent  = pad((diff%60000)/1000);
  }
  tick(); setInterval(tick, 1000);
}

/* ── SOCIALS ── */
function buildSocials() {
  const s = SITE.socials || {};
  const el = document.getElementById('social-links');
  if (!el) return;
  const icons = {
    youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>',
    discord: '<svg viewBox="0 0 24 24"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3a.1.1 0 0 0-.1 0 13.8 13.8 0 0 0-.6 1.3 18.3 18.3 0 0 0-5.4 0A13.3 13.3 0 0 0 8.7 3a.1.1 0 0 0-.1 0 19.7 19.7 0 0 0-4.9 1.4A20.2 20.2 0 0 0 .2 18.1a19.9 19.9 0 0 0 6.1 3.1.1.1 0 0 0 .1 0 14.4 14.4 0 0 0 1.2-2 .1.1 0 0 0-.1-.1 13.1 13.1 0 0 1-1.9-.9.1.1 0 0 1 0-.1l.4-.3a.1.1 0 0 1 .1 0 14.2 14.2 0 0 0 12 0 .1.1 0 0 1 .1 0l.4.3a.1.1 0 0 1 0 .1 12.7 12.7 0 0 1-1.9.9.1.1 0 0 0 0 .1 16.2 16.2 0 0 0 1.2 2 .1.1 0 0 0 .1 0 19.8 19.8 0 0 0 6.1-3.1 20.2 20.2 0 0 0-3.5-13.7zM8.1 15.3c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4zm7.8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.7 1.7 4.8 4.8.1 1.3.1 1.6.1 4.9s0 3.6-.1 4.8c-.1 3.2-1.6 4.7-4.8 4.8-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.2-.1-4.7-1.6-4.8-4.8C2.2 15.6 2.2 15.3 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M18.9 1h3.6l-7.9 9L24 23h-7.3l-5.7-7.5L4.7 23H1.1l8.5-9.7L0 1h7.5l5.2 6.8L18.9 1zm-1.3 19.8h2L6.5 3H4.3l13.3 17.8z"/></svg>'
  };
  let html = '';
  Object.entries(s).forEach(([k,v]) => { if (v) html += `<a href="${v}" target="_blank" rel="noopener" class="social-link hover-target" title="${k}">${icons[k]||k}</a>`; });
  el.innerHTML = html;
  el.style.display = html ? 'flex' : 'none';
}

/* ── SIDEBAR ── */
function buildSidebar() {
  buildMeta();
  const sv = document.getElementById('status-project');
  const se = document.getElementById('status-episodes');
  if (sv) sv.textContent = SITE.status?.projectStatus || '';
  if (se) se.textContent = `${SITE.status?.episodesReleased || '?'} / ${SITE.status?.episodesTotal || '??'} RELEASED`;
  const nav = document.querySelector('.side-menu');
  if (!nav) return;
  nav.innerHTML = (SITE.nav || []).map(n => {
    const isExternal = n.external || (!n.href.startsWith('#') && !n.href.startsWith('episodes'));
    return `<a href="${n.href}" class="side-link hover-target ${isExternal ? 'nav-external' : 'nav-anchor'}" ${isExternal ? 'target="_blank"' : ''}>${n.label}<span>${n.sub}</span></a>`;
  }).join('');
}

/* ── HEADINGS ── */
function buildHeadings() {
  const h = SITE.sectionHeadings || {};
  const map = { 'heading-synopsis': h.synopsis, 'heading-media': h.media, 'heading-renders': h.renders, 'heading-wiki-gateway': h.wikiGateway || 'WIKI', 'heading-directive9': 'DIRECTIVE-9', 'heading-audio': h.audio, 'heading-credits': h.credits, 'heading-watch': h.watch || 'WATCH' };
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el && val) el.textContent = val; });
}

/* ── SYNOPSIS ── */
function buildSynopsis() {
  const syn = SITE.synopsis || {};
  const tags = document.getElementById('synopsis-tags');
  if (tags) tags.innerHTML = (syn.tags||[]).map(t=>`<span class="ftag series">${t}</span>`).join('');
  const paras = document.getElementById('synopsis-paragraphs');
  if (paras) paras.innerHTML = (syn.paragraphs||[]).map(p=>`<p class="${p.style==='lead'?'lead':''}">${p.text}</p>`).join('');
  const poster = document.getElementById('synopsis-poster');
  if (poster) poster.src = syn.poster || '';
  const pt = document.getElementById('synopsis-poster-tag');
  if (pt) pt.textContent = syn.posterTag || '';
}

/* ── MEDIA ── */
function buildMedia() {
  const m = SITE.media || {};
  const slot = document.getElementById('media-main-slot');
  if (slot) {
    if (m.mainVideo?.src) {
      const id = m.mainVideo.src.replace(/.*(?:v=|youtu\.be\/)([^&]+).*/,'$1');
      slot.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>`;
      slot.style.position = 'relative';
    } else {
      slot.innerHTML = `<span style="font-size:0.6rem;letter-spacing:5px;color:#444;">${m.mainVideo?.label||'NO VIDEO'}</span>`;
    }
  }
  const plist = document.getElementById('media-playlist');
  if (plist) plist.innerHTML = (m.playlist||[]).map(p=>`<div class="pv-item hover-target" data-src="${p.src}" onclick="playMediaItem(this)">${p.label}</div>`).join('');
}
window.playMediaItem = function(el) {
  const src = el.dataset.src; if (!src) return;
  const slot = document.getElementById('media-main-slot'); if (!slot) return;
  const id = src.replace(/.*(?:v=|youtu\.be\/)([^&]+).*/,'$1');
  slot.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>`;
  slot.style.position = 'relative';
};

/* ── GALLERY ── */
function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (SITE.gallery||[]).forEach(item => {
    const div = document.createElement('div');
    div.className = `gallery-item hover-target ${item.category}`;
    div.dataset.type = item.type;
    div.dataset.src  = item.src;
    div.dataset.caption = item.caption || '';
    if (item.type === 'video') {
      div.innerHTML = `<video class="grid-thumb-video" preload="metadata" muted playsinline><source src="${item.src}#t=0.1" type="video/mp4"></video><div style="position:absolute;top:10px;right:10px;font-size:0.5rem;background:var(--accent);color:#000;padding:2px 5px;font-weight:900;z-index:2;">MOTION</div>`;
    } else {
      div.innerHTML = `<img src="${item.src}" loading="lazy">`;
    }
    grid.appendChild(div);
  });

  // Build filter buttons
  const controls = document.getElementById('gallery-controls');
  if (controls) {
    controls.innerHTML = (SITE.galleryCategories||[]).map((c,i)=>
      `<button class="control-btn hover-target ${i===0?'active':''}" data-filter="${c.key}">${c.label}</button>`
    ).join('');
  }
  initGalleryFilter();
  initLightbox();
}

function initGalleryFilter() {
  const CAP = 4;
  const viewAllWrap = document.getElementById('view-all-container');

  function applyFilter(val) {
    const allItems = document.querySelectorAll('.gallery-item');
    // Count per category
    const catCounts = {};
    allItems.forEach(item => {
      const cats = item.className.split(' ').filter(c => c !== 'gallery-item' && c !== 'hover-target' && c !== 'hidden-extra');
      cats.forEach(c => { catCounts[c] = (catCounts[c]||0) + 1; });
    });

    let shown = 0;
    let hiddenCount = 0;
    const catShown = {};

    allItems.forEach(item => {
      item.classList.remove('hidden-extra');
      const matches = val === 'all' || item.classList.contains(val);
      if (!matches) { item.style.display = 'none'; return; }

      const cat = val === 'all' ? 'all' : val;
      catShown[cat] = (catShown[cat]||0) + 1;

      if (catShown[cat] > CAP) {
        item.style.display = 'none';
        item.classList.add('hidden-extra');
        hiddenCount++;
      } else {
        item.style.display = 'block';
        gsap.fromTo(item, {opacity:0}, {opacity:1, duration:0.2, overwrite:true});
      }
    });

    if (viewAllWrap) {
      if (hiddenCount > 0) {
        viewAllWrap.innerHTML = `<button class="control-btn hover-target" id="view-all-btn">[ VIEW ALL +${hiddenCount} ]</button>`;
        viewAllWrap.style.display = 'flex';
        document.getElementById('view-all-btn').onclick = () => {
          document.querySelectorAll('.gallery-item.hidden-extra').forEach(item => {
            item.classList.remove('hidden-extra');
            item.style.display = 'block';
            gsap.fromTo(item, {opacity:0,y:20},{opacity:1,y:0,duration:0.4});
          });
          viewAllWrap.style.display = 'none';
          typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh();
        };
      } else {
        viewAllWrap.style.display = 'none';
      }
    }
    typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh();
  }

  // Initial filter
  applyFilter('all');

  document.addEventListener('click', e => {
    const btn = e.target.closest('#gallery-controls .control-btn');
    if (!btn) return;
    document.querySelectorAll('#gallery-controls .control-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
}

function initLightbox() {
  const lb = document.getElementById('lightbox');
  const lbContent = document.getElementById('lb-content');
  const lbCaption = document.getElementById('lb-caption');
  if (!lb || !lbContent) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type || 'image';
      const src  = item.dataset.src;
      const cap  = item.dataset.caption || '';
      lbContent.innerHTML = '';
      if (type === 'video') {
        lbContent.innerHTML = `<media-theme-sutro style="width:100%;max-width:900px;--media-accent-color:var(--accent);"><video slot="media" src="${src}" playsinline crossorigin="anonymous" autoplay></video></media-theme-sutro>`;
      } else {
        lbContent.innerHTML = `<img src="${src}" style="max-width:100%;max-height:72vh;border:1px solid var(--ui-border);display:block;">`;
      }
      if (lbCaption) { lbCaption.textContent = cap; lbCaption.style.display = cap ? 'block' : 'none'; }
      lb.style.display = 'flex';
      gsap.fromTo(lb, {opacity:0}, {opacity:1, duration:0.4});
    });
  });

  const close = () => {
    const vid = lbContent.querySelector('video');
    if (vid) { vid.pause(); vid.src = ''; }
    gsap.to(lb, {opacity:0, duration:0.3, onComplete:()=>{ lb.style.display='none'; lbContent.innerHTML=''; }});
  };
  document.querySelector('.lb-close')?.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.style.display !== 'none') close(); });
}

/* ── WIKI GATEWAY SECTION ── */
function buildWikiGateway() {
  const container = document.getElementById('wiki-gateway-cards');
  if (!container) return;
  const cards = [
    { title:'Characters', desc:`${(SITE.personnel||[]).filter(c=>c.visible!==false).length} filed`, href:'wiki/characters.html', accent:'var(--accent)' },
    { title:'Factions',   desc:`${(SITE.factions||[]).length} known`,   href:'wiki/factions.html',  accent:'#8B0000'          },
    { title:'Lore',       desc:`${(SITE.lore||[]).length} entries`,     href:'wiki/lore.html',      accent:'var(--accent)'    },
    { title:'Timeline',   desc:`${(SITE.timeline||[]).length} events`,  href:'wiki/timeline.html',  accent:'var(--accent)'    },
    { title:'Episodes',   desc:'Full episode guide',                    href:'wiki/episodes.html',  accent:'var(--accent)'    },
    { title:'World',      desc:'Setting & factions',                    href:'wiki/world.html',     accent:'var(--accent)'    },
  ];
  container.innerHTML = cards.map(c => `
    <a href="${c.href}" class="gateway-card hover-target" style="border-top:2px solid ${c.accent};">
      <div class="gateway-card-title">${c.title}</div>
      <div class="gateway-card-desc">${c.desc}</div>
    </a>`).join('');
}

/* ── AUDIO ── */
function buildAudio() {
  const trackList = document.getElementById('track-list');
  if (trackList) {
    trackList.innerHTML = (SITE.audio?.tracks||[]).map((t,i)=>`
      <div class="track hover-target" data-src="${t.src}" data-index="${i}">
        <div class="play-btn" id="play-btn-${i}">▶</div>
        <div class="track-meta"><span>${t.title}</span><small>${t.subtitle}</small></div>
      </div>`).join('');
    (SITE.audio?.tracks||[]).forEach((t,i) => {
      if (t.src) { const a=document.createElement('audio'); a.id=`audio-${i}`; a.src=t.src; a.preload='none'; document.body.appendChild(a); }
    });
    trackList.querySelectorAll('.track').forEach(track => {
      track.addEventListener('click', function() {
        const idx = this.dataset.index, src = this.dataset.src;
        const btn = document.getElementById(`play-btn-${idx}`);
        const isPlaying = btn?.textContent === '■';
        document.querySelectorAll('.play-btn').forEach(b=>b.textContent='▶');
        document.querySelectorAll('audio[id^="audio-"]').forEach(a=>{a.pause();a.currentTime=0;});
        if (!isPlaying && src) { btn.textContent='■'; document.getElementById(`audio-${idx}`)?.play(); gsap.to(btn,{scale:1.2,duration:0.2,yoyo:true,repeat:1}); }
      });
    });
  }
  const board = document.getElementById('voice-board');
  if (board) board.innerHTML = (SITE.audio?.voiceChips||[]).map(c=>
    `<div class="voice-chip hover-target ${c.locked?'locked':''}">${c.label}${c.locked?' [LOCKED]':''}</div>`
  ).join('');
}

/* ── CREDITS ── */
function buildCredits() {
  const grid = document.getElementById('credits-grid');
  if (!grid) return;
  grid.innerHTML = (SITE.credits||[]).map(c=>`<div class="staff-item"><span class="staff-role">${c.role}</span><span class="staff-name">${c.name}</span></div>`).join('');
}

/* ── NEWS TICKER ── */
function buildNewsTicker() {
  const el = document.getElementById('news-ticker-text');
  if (el) el.textContent = (SITE.news||[]).join(' // ');
}


/* ── EASTER EGG ENGINE ── */
function initEasterEggs() {
  const eggs = (SITE.easterEggs || []).filter(e => e.enabled);
  if (!eggs.length) return;

  // Key sequence buffer
  let keyBuffer = '';
  let konamiBuffer = [];
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  document.addEventListener('keydown', function(e) {
    // Konami
    konamiBuffer.push(e.key);
    if (konamiBuffer.length > 10) konamiBuffer.shift();
    if (konamiBuffer.join(',') === KONAMI.join(',')) {
      eggs.filter(egg => egg.triggerType === 'konami').forEach(egg => fireEgg(egg));
      konamiBuffer = [];
    }

    // Key sequences
    if (e.key.length === 1) {
      keyBuffer += e.key.toUpperCase();
      if (keyBuffer.length > 30) keyBuffer = keyBuffer.slice(-30);
      eggs.filter(egg => egg.triggerType === 'keysequence').forEach(function(egg) {
        if (keyBuffer.endsWith(egg.triggerValue.toUpperCase())) {
          fireEgg(egg);
          keyBuffer = '';
        }
      });
    }
  });

  // Click count eggs
  const clickCounts = {};
  eggs.filter(egg => egg.triggerType === 'clickcount').forEach(function(egg) {
    const parts = egg.triggerValue.split('//');
    const selector = parts[0] ? parts[0].trim() : null;
    const target = parseInt(parts[1]) || 3;
    if (!selector) return;
    document.querySelectorAll(selector).forEach(function(el) {
      const key = egg.name;
      clickCounts[key] = 0;
      el.addEventListener('click', function() {
        clickCounts[key] = (clickCounts[key] || 0) + 1;
        if (clickCounts[key] >= target) { clickCounts[key] = 0; fireEgg(egg); }
      });
    });
  });

  // Hover duration eggs
  eggs.filter(egg => egg.triggerType === 'hover').forEach(function(egg) {
    const parts = egg.triggerValue.split('//');
    const selector = parts[0] ? parts[0].trim() : null;
    const duration = parseInt(parts[1]) || 10000;
    if (!selector) return;
    document.querySelectorAll(selector).forEach(function(el) {
      let timer;
      el.addEventListener('mouseenter', function() { timer = setTimeout(function() { fireEgg(egg); }, duration); });
      el.addEventListener('mouseleave', function() { clearTimeout(timer); });
    });
  });
}

function fireEgg(egg) {
  console.log('%c[HELLAWAKE] Easter egg triggered: ' + egg.name, 'color:#ff3c00;font-weight:bold;');

  // Update news ticker hint
  if (egg.hint) {
    const ticker = document.getElementById('news-ticker-text');
    if (ticker) {
      const orig = ticker.textContent;
      ticker.textContent = egg.hint + ' // ' + orig;
      setTimeout(function() { ticker.textContent = orig; }, 8000);
    }
  }

  const content = egg.responseContent || '';

  if (egg.responseType === 'newsflash') {
    const ticker = document.getElementById('news-ticker-text');
    if (ticker) ticker.textContent = content + ' // ' + ticker.textContent;
    return;
  }

  if (egg.responseType === 'console') {
    console.log('%c' + content, 'color:#ff3c00;font-size:14px;');
    return;
  }

  if (egg.responseType === 'redirect') {
    // Show hint in ticker first
    setTimeout(function() { window.location.href = content; }, egg.hint ? 800 : 200);
    return;
  }

  // text or glitch — show overlay panel
  const existing = document.getElementById('egg-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'egg-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9000;display:flex;align-items:center;justify-content:center;padding:40px;';

  const box = document.createElement('div');
  box.style.cssText = 'max-width:600px;width:100%;background:#050505;border:1px solid #ff3c00;padding:40px;position:relative;';

  const close = document.createElement('button');
  close.textContent = 'CLOSE [X]';
  close.style.cssText = 'position:absolute;top:16px;right:16px;background:none;border:none;color:#ff3c00;font-family:var(--font-display);font-size:0.65rem;letter-spacing:3px;cursor:pointer;';
  close.onclick = function() { overlay.remove(); };

  const pre = document.createElement('pre');
  pre.style.cssText = 'font-family:var(--font-display);font-size:0.85rem;letter-spacing:2px;color:#ff3c00;line-height:1.8;white-space:pre-wrap;margin-top:8px;';

  box.appendChild(close);
  box.appendChild(pre);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function handler(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', handler); } });

  if (egg.responseType === 'glitch') {
    box.style.filter = 'url(#living-curse)';
    setTimeout(function() { box.style.filter = ''; }, 800);
  }

  // Typewriter effect
  let i = 0;
  const chars = content.split('');
  function type() {
    if (i < chars.length) { pre.textContent += chars[i++]; setTimeout(type, 18); }
  }
  type();
}

/* ── CURSOR ── */
function initCursor() {
  const wrap = document.querySelector('#cursor-wrap');
  const sq   = document.querySelector('#cursor-square');
  if (!wrap || !sq) return;
  let mPos={x:innerWidth/2,y:innerHeight/2}, cPos={x:innerWidth/2,y:innerHeight/2};
  let heroMX=0, heroMY=0, lowPerf=false;
  window.addEventListener('mousemove', e=>{
    mPos.x=e.clientX; mPos.y=e.clientY;
    heroMX=(e.clientX/innerWidth-.5)*20; heroMY=(e.clientY/innerHeight-.5)*20;
  });
  const perfBtn = document.getElementById('perf-toggle');
  // Set initial enhanced state
  if (perfBtn) {
    perfBtn.classList.add('enhanced'); perfBtn.textContent = 'ENHANCED';
    perfBtn.addEventListener('click', function() {
      lowPerf = !lowPerf;
      document.body.classList.toggle('low-perf', lowPerf);
      if (lowPerf) {
        perfBtn.textContent = 'PERFORMANCE';
        perfBtn.classList.remove('enhanced');
        // Kill all GSAP animations except essential
        gsap.set('#hero-bg-parallax', {x:0, y:0, clearProps:'filter'});
        gsap.set('#cursor-square', {rotation:0});
        // Disable gallery hover effects
        document.body.classList.add('low-perf');
      } else {
        perfBtn.textContent = 'ENHANCED';
        perfBtn.classList.add('enhanced'); perfBtn.textContent = 'ENHANCED';
        document.body.classList.remove('low-perf');
      }
    });
  }
  function tick(){
    cPos.x+=(mPos.x-cPos.x)*.35; cPos.y+=(mPos.y-cPos.y)*.35;
    gsap.set(wrap,{x:cPos.x,y:cPos.y});
    if(!lowPerf){ gsap.set(sq,{rotation:'+=1.8'}); const h=document.getElementById('hero-bg-parallax'); if(h) gsap.to(h,{x:heroMX,y:heroMY,duration:1,ease:'power2.out',overwrite:'auto'}); }
    requestAnimationFrame(tick);
  }
  tick();
  document.body.addEventListener('mouseover', e=>{ if(e.target.closest('.hover-target')) gsap.to(sq,{scale:1.8,borderColor:'var(--accent)',backgroundColor:'rgba(255,60,0,0.08)',duration:0.3}); });
  document.body.addEventListener('mouseout',  e=>{ if(e.target.closest('.hover-target')) gsap.to(sq,{scale:1,borderColor:'rgba(255,255,255,0.8)',backgroundColor:'transparent',duration:0.3}); });
  let fc=0,lt=performance.now(),triggered=false;
  function monitorFPS(){
    if(triggered||lowPerf)return; fc++;
    const now=performance.now();
    if(now>=lt+1000){ if(fc<30&&fc>5&&perfBtn){perfBtn.click();triggered=true;} fc=0;lt=now; }
    requestAnimationFrame(monitorFPS);
  }
  monitorFPS();
}

/* ── LOADER ── */
function initLoader() {
  window.addEventListener('load', ()=>{
    gsap.timeline()
      .to('#load-img',    {opacity:1,duration:1.2})
      .to('#load-tagline',{opacity:1,duration:0.8},'-=0.3')
      .to('#bar-fill',    {width:'100%',duration:2.5,ease:'power4.inOut'},'-=0.5')
      .to('#loader',      {opacity:0,filter:'blur(40px)',duration:1.5,ease:'expo.inOut',onComplete:()=>{document.getElementById('loader').style.display='none';}});
  });
}

/* ── SCROLL SYSTEM ── */
function initScrollSystem() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero parallax
  const heroBg = document.getElementById('hero-bg-parallax');
  if (heroBg) {
    gsap.to(heroBg, {yPercent:30, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
  }

  // Lenis smooth scroll — DO NOT double-drive with gsap.ticker
  const lenis = new Lenis();
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Sync lenis scroll position with ScrollTrigger
  lenis.on('scroll', function() { ScrollTrigger.update(); });

  // Smooth scroll for anchor nav links
  document.querySelectorAll('.nav-anchor').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        var el = document.querySelector(target);
        if (el) lenis.scrollTo(el, { duration: 1.0 });
      }
    });
  });

  // Build section → nav link map using IDs
  var sectionLinkMap = {};
  document.querySelectorAll('.nav-anchor').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      sectionLinkMap[href.substring(1)] = link;
    }
  });

  // Scroll-position highlight — picks section whose top is closest above viewport center
  var sections = Array.from(document.querySelectorAll('section')).filter(function(s) { return s.id && sectionLinkMap[s.id]; });

  function updateActiveNav() {
    var center = window.scrollY + window.innerHeight * 0.3;
    var best = null;
    var bestDist = Infinity;
    sections.forEach(function(sec) {
      var top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= center) {
        var dist = center - top;
        if (dist < bestDist) { bestDist = dist; best = sec; }
      }
    });
    if (best) {
      document.querySelectorAll('.side-link').forEach(function(l) { l.classList.remove('active-scroll'); });
      if (sectionLinkMap[best.id]) sectionLinkMap[best.id].classList.add('active-scroll');
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Init easter eggs
  initEasterEggs();

  // Page transition buttons
  document.querySelectorAll('.enter-btn, .short-section-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var dest = this.getAttribute('href');
      if (!dest || dest.startsWith('#') || dest.startsWith('wiki/')) return;
      e.preventDefault();
      gsap.to('main', {opacity:0, scale:1.02, filter:'blur(12px)', duration:0.8, ease:'power3.inOut'});
      gsap.to('.sidebar', {x:-20, opacity:0, duration:0.6, ease:'power2.in'});
      setTimeout(function() { window.location.href = dest; }, 700);
    });
  });
}

/* ── DIRECTIVE-9 ── */
function buildDirective9() {
  const label = document.getElementById('classified-label');
  if(label) label.textContent = SITE.directive9?.lockedLabel || '';
  window.checkCode = function(){
    const input=document.getElementById('access-input');
    const val=input.value.trim().toUpperCase();

    // Check easter egg codes first
    const eggs = (SITE.easterEggs||[]).filter(function(e){ return e.enabled && e.triggerType==='code'; });
    const matchedEgg = eggs.find(function(e){ return e.triggerValue.toUpperCase()===val; });
    if(matchedEgg){
      document.getElementById('access-error').style.display='none';
      input.value='';
      fireEgg(matchedEgg);
      return;
    }

    // Check main directive-9 unlock code
    if(val===SITE.directive9?.code?.toUpperCase()){
      document.getElementById('access-error').style.display='none';
      input.style.display='none';
      document.querySelector('.classified-submit').style.display='none';
      if(label){label.textContent=SITE.directive9.unlockedLabel;label.style.color='var(--accent)';}
      const unlocked=document.getElementById('access-unlocked');
      // Build CMD-style output
      var paras = SITE.directive9?.paragraphs || [];
      var html = '<span class="terminal-line bright">ACCESS GRANTED</span><br>';
      html += '<span class="terminal-line system">Decrypting DIRECTIVE-9 archive...</span><br><br>';
      paras.forEach(function(p, i) {
        var cls = i === paras.length - 1 ? 'dim' : '';
        html += '<p class="' + cls + '">' + p + '</p>';
      });
      unlocked.innerHTML = html;
      unlocked.style.display='block';
      gsap.fromTo(unlocked,{opacity:0,y:10},{opacity:1,y:0,duration:0.8});
    } else {
      // Add failed attempt line to terminal output
      var out = document.getElementById('terminal-output');
      if (out) {
        var line = document.createElement('span');
        line.className = 'terminal-line error';
        line.textContent = "'" + (document.getElementById('access-input').value || '') + "' is not recognised as a valid access code.";
        out.appendChild(line);
        out.appendChild(document.createElement('br'));
      }
      document.getElementById('access-error').style.display='block';
      input.classList.add('glitch-error'); setTimeout(()=>input.classList.remove('glitch-error'),500);
      const n=document.getElementById('news-ticker-text');
      if(n&&!n.textContent.includes('BREACH')) n.textContent='UNAUTHORIZED ACCESS // '+n.textContent;
    }
  };
  document.getElementById('access-input')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.checkCode();});
}

/* ── EPISODES PAGE ── */
function initEpisodesPage() {
  document.title='HELLAWAKE | WATCH';
  applyBranding();

  const watched = JSON.parse(localStorage.getItem('hw_watched')||'{}');
  const markWatched = (s,i) => { watched[`s${s}e${i}`]=true; localStorage.setItem('hw_watched',JSON.stringify(watched)); renderList(); };
  const isWatched  = (s,i) => !!watched[`s${s}e${i}`];

  let currentSeason=1, currentIndex=0;
  const video=document.getElementById('yt-player'), overlay=document.getElementById('decrypt-overlay');
  const list=document.getElementById('ep-list'), downloadBtn=document.getElementById('download-btn');
  const displayTitle=document.getElementById('display-title'), descTitle=document.getElementById('desc-title'), descText=document.getElementById('desc-text');
  const prevBtn=document.getElementById('prev-btn'), nextBtn=document.getElementById('next-btn');

  function getEps(s){ return (SITE.episodes?.seasons||[]).find(x=>x.season===s)?.episodes||[]; }

  function renderList(){
    if(!list) return;
    list.innerHTML='';
    getEps(currentSeason).forEach((ep,i)=>{
      const locked=ep.comingSoon||!ep.yt;
      const card=document.createElement('div');
      card.className=`ep-card hover-target ${i===currentIndex?'active':''} ${locked?'ep-locked':''}`;
      card.innerHTML=`<img src="${ep.yt?`https://img.youtube.com/vi/${ep.yt}/mqdefault.jpg`:''}" class="ep-thumb" onerror="this.style.background='#111'"><div class="ep-meta"><b>${i+1}. ${ep.title}${locked?' [COMING SOON]':''}</b><span>${locked?'LOCKED':'DECODED // '+ep.time}</span>${isWatched(currentSeason,i)?'<span class="watched-badge">WATCHED</span>':''}</div>`;
      if(!locked) card.onclick=()=>updateUI(i);
      list.appendChild(card);
    });
  }

  function updateUI(idx){
    currentIndex=idx;
    const eps=getEps(currentSeason); if(!eps[idx]) return;
    const ep=eps[idx];
    if(overlay) overlay.style.display='flex';
    setTimeout(()=>{
      renderList();
      if(video){video.removeAttribute('src'); if(ep.yt) video.setAttribute('src',`https://www.youtube.com/watch?v=${ep.yt}`);}
      if(displayTitle) displayTitle.textContent=ep.title;
      if(descTitle) descTitle.textContent=`S${currentSeason} E${idx+1} : ${ep.title}`;
      if(descText) descText.textContent=ep.desc||'';
      if(downloadBtn){ if(ep.book){ var bookTitle = encodeURIComponent('S'+currentSeason+' E'+(idx+1)+': '+ep.title); downloadBtn.href='reader.html?book='+encodeURIComponent(ep.book)+'&title='+bookTitle; downloadBtn.style.display=''; } else { downloadBtn.style.display='none'; } }
      if(prevBtn) prevBtn.disabled=idx===0;
      if(nextBtn) nextBtn.disabled=idx===eps.length-1;
      if(overlay) overlay.style.display='none';
      markWatched(currentSeason,idx);
    },500);
  }

  const tabsEl=document.getElementById('season-tabs');
  if(tabsEl){
    tabsEl.innerHTML='';
    (SITE.episodes?.seasons||[]).forEach(s=>{
      const tab=document.createElement('div');
      tab.className=`tab hover-target ${s.season===1?'active':''}`;
      tab.textContent=`S${s.season}`;
      if(!s.episodes.length){tab.style.opacity='0.3';tab.style.pointerEvents='none';tab.textContent+=' [LOCKED]';}
      tab.onclick=()=>switchSeason(s.season);
      tabsEl.appendChild(tab);
    });
  }
  window.switchSeason=(s)=>{
    if(s===currentSeason)return; currentSeason=s;
    document.querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',(SITE.episodes?.seasons||[])[i]?.season===s));
    updateUI(0);
  };
  window.navEp=(dir)=>updateUI(currentIndex+dir);

  renderList(); updateUI(0);
  if(overlay) overlay.style.display='none';

  const showPage=()=>{ document.body.style.opacity='1'; gsap.from('.watch-container',{opacity:0,y:30,filter:'blur(15px)',duration:1.2,ease:'expo.out'}); };
  if(document.readyState==='complete') setTimeout(showPage,100);
  else { window.addEventListener('load',()=>setTimeout(showPage,100)); setTimeout(()=>{if(document.body.style.opacity!=='1')showPage();},3000); }

  const backBtn=document.querySelector('.back-link');
  if(backBtn) backBtn.addEventListener('click',function(e){
    e.preventDefault(); const dest=this.getAttribute('href');
    gsap.to('.watch-container',{opacity:0,x:40,filter:'blur(20px)',duration:0.8,ease:'power2.inOut',onComplete:()=>{window.location.href=dest;}});
    gsap.to(this,{x:-50,opacity:0,duration:0.6});
  });
  initCursor();
initMobileMenu();
}