
/* ── WIKI MOBILE MENU ── */
function initWikiMobileMenu() {
  if (window.innerWidth > 768) return;
  var btn = document.getElementById('wiki-mobile-btn');
  var sidebar = document.getElementById('wiki-sidebar');
  var overlay = document.getElementById('wiki-mobile-overlay');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', function() {
    var isOpen = sidebar.classList.contains('mobile-open');
    isOpen ? closeWikiMenu() : openWikiMenu();
  });

  // Close on link click
  sidebar.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { closeWikiMenu(); });
  });

  // Swipe to close
  var tx = 0;
  sidebar.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive:true });
  sidebar.addEventListener('touchend', function(e){ if(tx - e.changedTouches[0].clientX > 50) closeWikiMenu(); }, { passive:true });
}
function openWikiMenu() {
  var sidebar = document.getElementById('wiki-sidebar');
  var overlay = document.getElementById('wiki-mobile-overlay');
  var btn = document.getElementById('wiki-mobile-btn');
  sidebar && sidebar.classList.add('mobile-open');
  overlay && overlay.classList.add('show');
  btn && btn.classList.add('open');
}
function closeWikiMenu() {
  var sidebar = document.getElementById('wiki-sidebar');
  var overlay = document.getElementById('wiki-mobile-overlay');
  var btn = document.getElementById('wiki-mobile-btn');
  sidebar && sidebar.classList.remove('mobile-open');
  overlay && overlay.classList.remove('show');
  btn && btn.classList.remove('open');
}
window.closeWikiMenu = closeWikiMenu;

/* ── LOCKED ICON ── */
function lockedBadge() {
  return '<span class="locked-badge" title="CLASSIFIED">🔒</span>';
}
function lockedCard() {
  return '<div class="wiki-card locked-card"><div class="wiki-card-img-placeholder">🔒 CLASSIFIED</div><div class="wiki-card-body"><span class="wiki-card-tag">ACCESS RESTRICTED</span><div class="wiki-card-title">[REDACTED]</div></div></div>';
}


/* ── RANK HELPERS ── */
function getRankLabel(factionType, rankId) {
  if (!rankId) return '';
  var faction = (SITE.factions || []).find(function(f) { return f.type === factionType || f.id === factionType; });
  if (!faction || !faction.ranks) return rankId;
  var rank = faction.ranks.find(function(r) { return r.id === rankId; });
  return rank ? rank.label : rankId;
}
function getRankDesc(factionType, rankId) {
  if (!rankId) return '';
  var faction = (SITE.factions || []).find(function(f) { return f.type === factionType || f.id === factionType; });
  if (!faction || !faction.ranks) return '';
  var rank = faction.ranks.find(function(r) { return r.id === rankId; });
  return rank ? rank.desc : '';
}

/* HELLAWAKE WIKI — wiki.js */

/* ── LOGO PATH (wiki is one level deep) ── */
const ASSET_ROOT = '/';

function wikiApplyBranding() {
  if (SITE.branding?.accentColor) document.documentElement.style.setProperty('--accent', SITE.branding.accentColor);
  document.querySelectorAll('.wiki-logo-img').forEach(el => { if (SITE.branding?.logoImage) el.src = ASSET_ROOT + SITE.branding.logoImage; });
  // Apply light mode default
  if (SITE.wikiConfig?.lightModeDefault) document.body.classList.add('light-mode');
}

/* ── THEME TOGGLE ── */
function initThemeToggle() {
  // Apply saved theme immediately (flash prevention already done in head)
  var saved = localStorage.getItem('hw_wiki_theme');
  var isLight = saved === 'light';
  if (isLight) {
    document.documentElement.classList.add('wiki-light');
    document.body.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('wiki-light');
    document.body.classList.remove('light-mode');
  }
  var btn = document.getElementById('wiki-theme-btn');
  if (btn) {
    updateThemeBtn();
    btn.addEventListener('click', function() {
      var nowLight = document.body.classList.toggle('light-mode');
      document.documentElement.classList.toggle('wiki-light', nowLight);
      localStorage.setItem('hw_wiki_theme', nowLight ? 'light' : 'dark');
      updateThemeBtn();
    });
  }
}
function updateThemeBtn() {
  var btn = document.getElementById('wiki-theme-btn');
  if (!btn) return;
  var isLight = document.body.classList.contains('light-mode');
  btn.textContent = isLight ? 'DARK MODE' : 'LIGHT MODE';
}

/* ── READING PROGRESS BAR ── */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
}

/* ── INTERCEPTED TRANSMISSION ── */
function buildTransmission(containerId) {
  const el = document.getElementById(containerId);
  const txs = SITE.wikiConfig?.interceptedTransmissions || [];
  if (!el || !txs.length) return;
  function pick() {
    const t = txs[Math.floor(Math.random()*txs.length)];
    el.querySelector('.transmission-text').textContent = t;
  }
  el.innerHTML = `<span class="transmission-label">INTERCEPTED //</span><span class="transmission-text"></span><button class="transmission-refresh" onclick="this.parentElement.querySelector('.transmission-text').textContent=window._txPick()">↻ NEW</button>`;
  window._txPick = () => txs[Math.floor(Math.random()*txs.length)];
  pick();
}

/* ── TOPBAR ── */
function buildWikiTopbar(activePage) {
  var ls = (SITE.wikiConfig && SITE.wikiConfig.lockedSections) || {};
  const pages = [
    { key:'home',       label:'Wiki Home',   href:'index'      },
    { key:'characters', label:'Characters',  href:'characters' },
    { key:'factions',   label:'Factions',    href:'factions'   },
    { key:'lore',       label:'Lore',         href:'lore'       },
    { key:'timeline',   label:'Timeline',    href:'timeline'   },
    { key:'episodes',   label:'Episodes',    href:'episodes'   },
    { key:'world',      label:'World',       href:'world'      },
  ];
  const nav = document.getElementById('wiki-topbar-nav');
  if (nav) nav.innerHTML = pages.map(p => `<a href="${p.href}" data-page="${p.key}" class="${p.key===activePage?'active':''}">${p.label}</a>`).join('');
}

/* ── SIDEBAR ── */
function buildWikiSidebar(activePage) {
  var ls = (SITE.wikiConfig && SITE.wikiConfig.lockedSections) || {};
  const el = document.getElementById('wiki-sidebar');
  if (!el) return;
  const totalEps = (SITE.episodes?.seasons||[]).reduce((a,s)=>a+s.episodes.length,0);
  const sections = [
    { section:'Navigation' },
    { key:'home',       label:'Wiki Home',     href:'index',      badge:'' },
    { section:'Story' },
    { key:'characters', label:'Characters',    href:'characters', badge: ls.characters ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : String((SITE.personnel||[]).filter(function(c){return c.visible!==false&&!c.hidden;}).length) },
    { key:'factions',   label:'Factions',      href:'factions',   badge: ls.factions  ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : String((SITE.factions||[]).length) },
    { key:'lore',       label:'Lore',           href:'lore',       badge: ls.lore      ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : String((SITE.lore||[]).filter(function(e){return !e.hidden;}).length) },
    { key:'timeline',   label:'Timeline',      href:'timeline',   badge: ls.timeline  ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : String((SITE.timeline||[]).filter(function(e){return !e.hidden;}).length) },
    { section:'Media' },
    { key:'episodes',   label:'Episode Guide', href:'episodes',   badge: ls.episodes  ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : String(totalEps) },
    { section:'World' },
    { key:'world',      label:'World & Setting',href:'world',     badge:'' },
  ];
  el.innerHTML = sections.map(s => {
    if (s.section) return `<div class="wiki-sidebar-section">${s.section}</div>`;
    return '<a href="' + s.href + '" class="wiki-sidebar-link ' + (s.key===activePage?'active':'') + '" data-page="' + s.key + '">' + s.label + (s.badge ? '<span class="badge">' + s.badge + '</span>' : '') + '</a>';
  }).join('');
}

/* ── BOOK READER ── */
function openBookReader(pdfSrc, title) {
  if (!SITE.wikiConfig?.showBookReader) return;
  let overlay = document.getElementById('book-reader-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'book-reader-overlay';
    overlay.className = 'book-reader-overlay';
    overlay.innerHTML = `
      <div class="book-reader-header">
        <span class="book-reader-title" id="book-reader-title"></span>
        <button class="book-reader-close" onclick="closeBookReader()">CLOSE [X]</button>
      </div>
      <iframe class="book-reader-frame" id="book-reader-frame"></iframe>`;
    document.body.appendChild(overlay);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBookReader(); });
  }
  document.getElementById('book-reader-title').textContent = title || 'ARCHIVE DOCUMENT';
  document.getElementById('book-reader-frame').src = ASSET_ROOT + pdfSrc;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.closeBookReader = function() {
  const overlay = document.getElementById('book-reader-overlay');
  if (overlay) { overlay.classList.remove('open'); document.getElementById('book-reader-frame').src = ''; }
  document.body.style.overflow = '';
};



function buildWikiSearch() {
  var bar = document.getElementById('wiki-search-bar');
  if (!bar) return;

  // Build search index from SITE data
  var index = [];

  (SITE.personnel || []).filter(function(c) { return c.visible !== false && !c.locked && !c.hidden; }).forEach(function(c) {
    index.push({ type: 'CHARACTER', title: c.name, snippet: c.bio ? c.bio.substring(0,120) : '', href: 'character.html?id=' + c.id, tags: [c.factionLabel, c.status] });
  });

  (SITE.factions || []).forEach(function(f) {
    index.push({ type: 'FACTION', title: f.name, snippet: f.body ? f.body.substring(0,120) : '', href: 'faction.html?id=' + f.id, tags: [f.subtitle] });
  });

  (SITE.lore || []).filter(function(e) { return !e.locked && !e.classified && !e.hidden; }).forEach(function(e) {
    index.push({ type: 'LORE', title: e.term, snippet: e.body ? e.body.substring(0,120) : '', href: 'lore', tags: [] });
  });

  (SITE.timeline || []).filter(function(e) { return !e.locked && !e.classified && !e.hidden; }).forEach(function(e) {
    index.push({ type: 'TIMELINE', title: e.title, snippet: e.body ? e.body.substring(0,120) : '', href: 'timeline', tags: [e.year] });
  });

  var seasons = SITE.episodes && SITE.episodes.seasons || [];
  seasons.forEach(function(s) {
    (s.episodes || []).filter(function(ep) { return !ep.comingSoon && ep.yt; }).forEach(function(ep, i) {
      index.push({ type: 'EPISODE', title: 'S' + s.season + ' E' + (i+1) + ': ' + ep.title, snippet: ep.desc ? ep.desc.substring(0,120) : '', href: 'episodes', tags: [ep.time] });
    });
  });

  // DOM refs
  var input = document.getElementById('wiki-search-input');
  var results = document.getElementById('wiki-search-results');
  if (!input || !results) return;

  function highlight(text, q) {
    if (!q) return text;
    var safe = q.split('').map(function(c){return c.replace(/[-\/^$*+?.()|{}\[\]\\]/,'\\$&');}).join(''); var re = new RegExp('(' + safe + ')','gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function doSearch(q) {
    q = q.trim();
    if (q.length < 2) { results.style.display = 'none'; return; }
    var ql = q.toLowerCase();
    var hits = index.filter(function(item) {
      return item.title.toLowerCase().includes(ql) ||
             item.snippet.toLowerCase().includes(ql) ||
             item.tags.some(function(t) { return t && t.toLowerCase().includes(ql); });
    }).slice(0, 12);

    if (!hits.length) {
      results.innerHTML = '<div class="wiki-search-empty">NO RESULTS FOR "' + q.toUpperCase() + '"</div>';
      results.style.display = 'block';
      return;
    }

    results.innerHTML = '<div class="wiki-search-count">' + hits.length + ' RESULT' + (hits.length!==1?'S':'') + '</div>' +
      hits.map(function(item) {
        return '<a class="wiki-search-result" href="' + item.href + '">' +
          '<div class="ws-type">' + item.type + '</div>' +
          '<div>' +
            '<div class="ws-title">' + highlight(item.title, q) + '</div>' +
            '<div class="ws-snippet">' + highlight(item.snippet, q) + (item.snippet.length >= 120 ? '...' : '') + '</div>' +
          '</div>' +
        '</a>';
      }).join('');
    results.style.display = 'block';
  }

  input.addEventListener('input', function() { doSearch(this.value); });
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { results.style.display = 'none'; input.value = ''; }
    if (e.key === 'Enter') {
      var first = results.querySelector('.wiki-search-result');
      if (first) window.location.href = first.getAttribute('href');
    }
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#wiki-search-bar')) results.style.display = 'none';
  });
}


/* ── WIKI EASTER EGG TRIGGERS ── */
function initWikiEasterEggs() {
  var eggs = (SITE.easterEggs || []).filter(function(e) { return e.enabled; });
  if (!eggs.length) return;

  // Key sequence buffer
  var keyBuffer = '';
  document.addEventListener('keydown', function(e) {
    if (e.key.length !== 1) return;
    keyBuffer += e.key.toUpperCase();
    if (keyBuffer.length > 20) keyBuffer = keyBuffer.slice(-20);
    eggs.filter(function(egg) { return egg.triggerType === 'keysequence'; }).forEach(function(egg) {
      if (keyBuffer.endsWith(egg.triggerValue.toUpperCase())) {
        keyBuffer = '';
        wikiFireEgg(egg);
      }
    });
  });

  // Click count triggers — handle logo-7-clicks specially, ignore others on wiki
  var logoEl = document.querySelector('.wiki-topbar-logo');
  var logoCount = 0, logoLastTime = 0;
  eggs.filter(function(egg) { return egg.triggerType === 'clickcount'; }).forEach(function(egg) {
    var parts = egg.triggerValue.split('//');
    var selector = parts[0] ? parts[0].trim() : null;
    var target = parseInt(parts[1]) || 3;
    if (!selector) return;
    // Only handle logo-based triggers on wiki (nav-logo maps to wiki-topbar-logo)
    var isLogoTrigger = selector === '.nav-logo' || selector === '.wiki-topbar-logo';
    if (isLogoTrigger && logoEl) {
      (function(t, egg) {
        logoEl.addEventListener('click', function() {
          var now = Date.now();
          if (now - logoLastTime > 2500) logoCount = 0;
          logoLastTime = now;
          logoCount++;
          if (logoCount >= t) { logoCount = 0; wikiFireEgg(egg); }
        });
      })(target, egg);
    }
    // For non-logo clickcount triggers (voice chip etc), find specific elements
    if (!isLogoTrigger) {
      var el = document.querySelector(selector);
      if (!el) return;
      var count = 0, lastTime = 0;
      el.addEventListener('click', function() {
        var now = Date.now();
        if (now - lastTime > 2000) count = 0;
        lastTime = now;
        count++;
        if (count >= target) { count = 0; wikiFireEgg(egg); }
      });
    }
  });
}

function wikiFireEgg(egg) {
  if (egg.responseType === 'redirect') {
    // From wiki pages, terminal.html is in same folder
    var dest = egg.responseContent;
    // If path starts with wiki/, strip it since we're already in wiki/
    if (dest.startsWith('wiki/')) dest = dest.replace('wiki/', '');
    setTimeout(function() { window.location.href = dest; }, 300);
    return;
  }
  // For other types, just redirect to terminal
  window.location.href = 'terminal';
}


/* ── SECTION LOCK HELPER ── */
function isSectionLocked(key) {
  return !!(SITE.wikiConfig && SITE.wikiConfig.lockedSections && SITE.wikiConfig.lockedSections[key]);
}
function renderLockedSection(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return false;
  // Add class to parent for CSS targeting
  if (el.parentElement) el.parentElement.classList.add('is-locked');
  el.innerHTML =
    '<div class="section-locked-screen">' +
      '<div class="section-locked-icon">' +
        '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2">' +
          '<rect x="3" y="11" width="18" height="11" rx="2"/>' +
          '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>' +
        '</svg>' +
      '</div>' +
      '<div class="section-locked-title">CLASSIFIED</div>' +
      '<div class="section-locked-desc">This section is currently restricted.<br>Access will be granted when declassified.</div>' +
    '</div>';
  return true;
}


/* ── LORE CROSS-REFERENCES ── */
function linkLoreTerms(text) {
  if (!text || !SITE.lore) return text;
  var terms = (SITE.lore||[]).filter(function(e){ return !e.hidden && !e.classified; });
  // Sort by length descending so longer terms match first
  terms.sort(function(a,b){ return b.term.length - a.term.length; });
  terms.forEach(function(e) {
    var escaped = e.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('\\b(' + escaped + ')\\b', 'gi');
    text = text.replace(re, '<a href="lore" class="lore-xref" title="' + e.term + '">$1</a>');
  });
  return text;
}


/* ── EPISODE APPEARANCE TRACKER ── */
function buildAppearanceTracker(char) {
  var appearances = char.appearances || [];
  if (!appearances.length) return '';
  var seasons = SITE.episodes && SITE.episodes.seasons || [];
  var items = appearances.map(function(epId) {
    // epId format: "S1E1"
    var match = epId.match(/S(\d+)E(\d+)/i);
    if (!match) return null;
    var sNum = parseInt(match[1]), eNum = parseInt(match[2]);
    var season = seasons.find(function(s){ return s.season === sNum; });
    var ep = season && season.episodes[eNum-1];
    if (!ep) return null;
    return { id: epId, title: ep.title, season: sNum, ep: eNum, yt: ep.yt };
  }).filter(Boolean);
  if (!items.length) return '';
  return '<div class="char-appearances-section">' +
    '<div class="char-appearances-label">APPEARS IN</div>' +
    '<div class="char-appearances-list">' +
    items.map(function(item) {
      return '<a class="char-appearance-item" href="../episodes" title="' + item.title + '">' +
        (item.yt ? '<img src="https://img.youtube.com/vi/' + item.yt + '/mqdefault.jpg" alt="' + item.title + '">' : '<div class="char-appearance-thumb-placeholder"></div>') +
        '<div class="char-appearance-info">' +
          '<span class="char-appearance-num">S' + item.season + ' E' + item.ep + '</span>' +
          '<span class="char-appearance-title">' + item.title + '</span>' +
        '</div>' +
      '</a>';
    }).join('') +
    '</div></div>';
}


/* ── LAST UPDATED ── */
function formatUpdatedAt(dateStr) {
  if (!dateStr) return '';
  try {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch(e) { return dateStr; }
}

/* ── WIKI SEARCH ── */
function buildWikiSearch() {
  var bar = document.getElementById('wiki-search-bar');
  if (!bar) return;

  var input   = document.getElementById('wiki-search-input');
  var results = document.getElementById('wiki-search-results');
  if (!input || !results) return;

  // Build index
  var index = [];

  (SITE.personnel||[]).filter(function(c){ return !c.hidden && c.visible!==false; }).forEach(function(c) {
    var snippet = (c.bio||'').replace(/[#*_`>]/g,'').substring(0,120);
    index.push({ type:'CHARACTER', title:c.name, snippet:snippet, href:'character?id='+c.id, tags:[c.factionLabel, c.status, c.rank||''] });
  });

  (SITE.factions||[]).forEach(function(f) {
    index.push({ type:'FACTION', title:f.name, snippet:(f.body||'').substring(0,120), href:'faction?id='+f.id, tags:[f.subtitle] });
  });

  (SITE.lore||[]).filter(function(e){ return !e.hidden && !e.classified; }).forEach(function(e) {
    index.push({ type:'LORE', title:e.term, snippet:(e.body||'').substring(0,120), href:'lore', tags:[] });
  });

  (SITE.timeline||[]).filter(function(e){ return !e.hidden && !e.classified; }).forEach(function(e) {
    index.push({ type:'TIMELINE', title:e.title, snippet:(e.body||'').substring(0,120), href:'timeline', tags:[e.year] });
  });

  var seasons = (SITE.episodes&&SITE.episodes.seasons)||[];
  seasons.forEach(function(s) {
    (s.episodes||[]).filter(function(ep){ return !ep.comingSoon; }).forEach(function(ep,i) {
      index.push({ type:'EPISODE', title:'S'+s.season+' E'+(i+1)+': '+ep.title, snippet:(ep.desc||'').substring(0,120), href:'episodes', tags:[] });
    });
  });

  function escapeRe(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');
  }

  function highlight(text, q) {
    if (!text || !q) return text||'';
    try {
      var re = new RegExp('('+escapeRe(q)+')','gi');
      return String(text).replace(re,'<mark>$1</mark>');
    } catch(e) { return text; }
  }

  function doSearch(q) {
    q = (q||'').trim();
    if (q.length < 2) { results.style.display='none'; return; }
    var ql = q.toLowerCase();

    var hits = index.filter(function(item) {
      return item.title.toLowerCase().includes(ql) ||
             item.snippet.toLowerCase().includes(ql) ||
             item.tags.some(function(t){ return t && t.toLowerCase().includes(ql); });
    }).slice(0,10);

    if (!hits.length) {
      results.innerHTML = '<div class="wiki-search-empty">NO RESULTS FOR "'+q.toUpperCase()+'"</div>';
      results.style.display = 'block';
      return;
    }

    results.innerHTML =
      '<div class="wiki-search-count">'+hits.length+' RESULT'+(hits.length!==1?'S':'')+'</div>' +
      hits.map(function(item) {
        return '<a class="wiki-search-result" href="'+item.href+'">' +
          '<div class="ws-type">'+item.type+'</div>' +
          '<div>' +
            '<div class="ws-title">'+highlight(item.title,q)+'</div>' +
            (item.snippet ? '<div class="ws-snippet">'+highlight(item.snippet,q)+(item.snippet.length>=120?'...':'')+'</div>' : '') +
          '</div>' +
        '</a>';
      }).join('');
    results.style.display = 'block';
  }

  input.addEventListener('input', function(){ doSearch(this.value); });

  input.addEventListener('keydown', function(e) {
    if (e.key==='Escape') { results.style.display='none'; input.value=''; input.blur(); }
    if (e.key==='Enter') {
      var first = results.querySelector('.wiki-search-result');
      if (first) { window.location.href = first.getAttribute('href'); }
    }
    if (e.key==='ArrowDown') {
      var items = results.querySelectorAll('.wiki-search-result');
      if (items.length) { e.preventDefault(); items[0].focus(); }
    }
  });

  // Arrow key navigation within results
  results.addEventListener('keydown', function(e) {
    var items = Array.from(results.querySelectorAll('.wiki-search-result'));
    var idx = items.indexOf(document.activeElement);
    if (e.key==='ArrowDown' && idx < items.length-1) { e.preventDefault(); items[idx+1].focus(); }
    if (e.key==='ArrowUp') { e.preventDefault(); idx > 0 ? items[idx-1].focus() : input.focus(); }
    if (e.key==='Escape') { results.style.display='none'; input.value=''; input.blur(); }
  });

  document.addEventListener('click', function(e) {
    if (!bar.contains(e.target)) results.style.display='none';
  });
}

/* ── WIKI HOME ── */
function buildWikiHome() {
  const container = document.getElementById('wiki-home-sections');
  if (!container) return;
  const totalEps = (SITE.episodes?.seasons||[]).reduce((a,s)=>a+s.episodes.length,0);
  const sections = [
    { key:'characters', title:'Characters',    desc:'Personnel files and operative dossiers.',  href:'characters', count:(SITE.personnel||[]).filter(function(c){return c.visible!==false&&!c.hidden;}).length+' entries' },
    { key:'factions',   title:'Factions',      desc:'The Skullborns, the DHD, and beyond.',     href:'factions',   count:(SITE.factions||[]).length+' factions' },
    { key:'lore',       title:'Lore',           desc:'Terminology, events, and classified files.',href:'lore',      count:(SITE.lore||[]).filter(function(e){return !e.hidden;}).length+' entries' },
    { key:'timeline',   title:'Timeline',      desc:'In-universe chronological events.',         href:'timeline',   count:(SITE.timeline||[]).filter(function(e){return !e.hidden;}).length+' events' },
    { key:'episodes',   title:'Episode Guide', desc:'Full episode synopses and details.',        href:'episodes',   count:totalEps+' episodes' },
    { key:'world',      title:'World',         desc:'The setting, factions, and the war.',       href:'world',      count:'' },
  ];
  container.innerHTML = sections.map(s =>
    `<a href="${s.href}" class="wiki-section-card">
      <div class="wiki-section-card-icon">${s.title.substring(0,2).toUpperCase()}</div>
      <div class="wiki-section-card-title">${s.title}</div>
      <div class="wiki-section-card-desc">${s.desc}</div>
      ${s.count?`<div class="wiki-section-card-count">${s.count}</div>`:''}
    </a>`).join('');
}

/* ── CHARACTERS PAGE ── */
function buildCharactersPage() {
  if (isSectionLocked("characters")) { renderLockedSection("characters-grid"); return; }
  var grid = document.getElementById('characters-grid');
  if (!grid) return;
  var all = (SITE.personnel || []).filter(function(c){ return !c.hidden; });
  grid.innerHTML = all.map(function(char) {
    // Locked character
    if (char.locked) {
      var imgPath = char.image ? ASSET_ROOT + char.image : null;
      return '<div class="wiki-card locked-card">' +
        '<div class="wiki-card-faction-bar ' + char.faction + '"></div>' +
        (imgPath ? '<img class="wiki-card-img" src="' + imgPath + '" alt="CLASSIFIED">' : '<div class="wiki-card-img-placeholder"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#444" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>') +
        '<div class="wiki-card-body">' +
          '<span class="wiki-card-tag">' + char.factionLabel + '</span>' +
          '<div class="wiki-card-title locked-title">&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</div>' +
          '<div class="wiki-card-desc locked-desc">' + (char.teaser ? '<em>' + char.teaser + '</em>' : 'CLASSIFIED // IDENTITY RESTRICTED') + '</div>' +
        '</div>' +
        '</div>';
    }
    if (char.visible === false) return '';
    var imgPath = char.image ? ASSET_ROOT + char.image : null;
    var rankLabel = getRankLabel(char.faction, char.rank);
    return '<a href="character.html?id=' + char.id + '" class="wiki-card">' +
      '<div class="wiki-card-faction-bar ' + char.faction + '"></div>' +
      (imgPath ? '<img class="wiki-card-img" src="' + imgPath + '" alt="' + char.name + '">' : '<div class="wiki-card-img-placeholder">IMAGE PENDING</div>') +
      '<div class="wiki-card-body">' +
        '<span class="wiki-card-tag">' + char.factionLabel + (rankLabel ? ' // ' + rankLabel.toUpperCase() : '') + '</span>' +
        '<div class="wiki-card-title">' + char.name + '</div>' +
        '<div class="wiki-card-desc">' + char.bio.split('\n')[0].substring(0,100) + '...</div>' +
      '</div></a>';
  }).join('');
}

/* ── CHARACTER DETAIL ── */
function buildCharacterDetail() {
  var id = new URLSearchParams(window.location.search).get('id');
  var char = (SITE.personnel||[]).find(function(c){ return c.id===id; });
  var crumb = document.getElementById('char-breadcrumb-name');
  if (crumb) crumb.textContent = char ? char.name : '—';
  var detail = document.getElementById('char-detail');
  if (!detail) return;
  if (!char || char.hidden) { detail.innerHTML='<p style="color:var(--muted);padding:40px;">Character not found.</p>'; return; }
  document.title = char.name + ' — HELLAWAKE WIKI';

  var imgPath = char.image ? ASSET_ROOT + char.image : null;
  var statsRows = (char.stats||[]).map(function(s) {
    return '<tr><td>' + s.label + '</td><td class="' + (s.redacted?'redacted':'') + '">' + (s.redacted?'[REDACTED]':s.value) + '</td></tr>';
  }).join('');

  // Markdown bio
  var bioHTML = '';
  var rawBio = char.bio || '';
  if (typeof marked !== 'undefined' && rawBio) {
    var linkedBio = linkLoreTerms(rawBio);
    bioHTML = '<div class="char-bio-md">' + marked.parse(linkedBio) + '</div>';
  } else {
    bioHTML = '<p class="char-bio">' + linkLoreTerms(rawBio).replace(/\n/g,'<br>') + '</p>';
  }

  var appearancesHTML = buildAppearanceTracker(char);
  var lastUpdatedHTML = char.updatedAt ? '<div class="char-last-updated">LAST UPDATED: ' + formatUpdatedAt(char.updatedAt) + '</div>' : '';
  var echoHTML = (char.echoEntry && char.echoEntry.show) ?
    '<div class="char-echo-box"><p><b style="color:#6a5a8a;letter-spacing:2px;font-size:0.75rem;">ECHO</b> — ' + char.echoEntry.text + '</p></div>' : '';

  // Gallery
  var galleryHTML = '';
  var gallery = char.gallery || [];
  if (gallery.length) {
    galleryHTML = '<div class="char-gallery-section">' +
      '<div class="char-gallery-label">GALLERY</div>' +
      '<div class="char-gallery-strip">' +
      gallery.map(function(item, i) {
        var src = ASSET_ROOT + item.src;
        var cap = item.caption || '';
        return '<div class="char-gallery-item" onclick="openCharLightbox(' + i + ', charGalleryData)" data-index="' + i + '">' +
          '<img src="' + src + '" alt="' + cap + '" loading="lazy">' +
          (cap ? '<div class="char-gallery-cap">' + cap + '</div>' : '') +
        '</div>';
      }).join('') +
      '</div></div>';
  }

  // Related — use manually set list if available, else fallback to same faction
  var related = [];
  if (char.related && char.related.length) {
    char.related.forEach(function(rid) {
      var rc = (SITE.personnel||[]).find(function(c){ return c.id===rid && !c.hidden && c.visible!==false; });
      if (rc) related.push(rc);
    });
  } else {
    related = (SITE.personnel||[]).filter(function(c){ return c.id!==id && c.faction===char.faction && c.visible!==false && !c.hidden; }).slice(0,3);
  }
  var relatedHTML = related.length ? '<div style="margin-top:36px;padding-top:20px;border-top:1px solid var(--border);">' +
    '<div style="font-size:10px;letter-spacing:3px;color:var(--dim);margin-bottom:14px;">RELATED PERSONNEL</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    related.map(function(r) {
      return '<a href="character.html?id=' + r.id + '" class="char-related-link">' + r.name + '</a>';
    }).join('') +
    '</div></div>' : '';

  var rankLabel = getRankLabel(char.faction, char.rank);
  var rankDesc = getRankDesc(char.faction, char.rank);

  // Store gallery data for lightbox
  window.charGalleryData = gallery.map(function(item) {
    return { src: ASSET_ROOT + item.src, caption: item.caption || '' };
  });

  detail.innerHTML =
    '<div class="char-profile">' +
      '<div>' +
        '<div class="char-profile-img">' + (imgPath ? '<img src="' + imgPath + '" alt="' + char.name + '">' : '<span class="char-img-placeholder">IMAGE FILE PENDING</span>') + '</div>' +
      '</div>' +
      '<div>' +
        '<div class="char-profile-name">' + char.name + '</div>' +
        '<span class="char-profile-faction">' + char.factionLabel + '</span>' +
        (rankLabel ? '<span class="char-rank-badge">' + rankLabel.toUpperCase() + '</span>' : '') +
        (rankDesc ? '<div class="char-rank-desc">' + rankDesc + '</div>' : '') +
        '<span class="char-profile-status ' + char.faction + '">STATUS: ' + char.status + '</span>' +
        '<table class="char-stats-table">' + statsRows + '</table>' +
        bioHTML +
        echoHTML +
        appearancesHTML +
        galleryHTML +
        lastUpdatedHTML +
        relatedHTML +
      '</div>' +
    '</div>';
}

/* ── CHARACTER LIGHTBOX ── */
function openCharLightbox(index, items) {
  var existing = document.getElementById('char-lightbox');
  if (existing) existing.remove();

  var lb = document.createElement('div');
  lb.id = 'char-lightbox';
  lb.innerHTML =
    '<div class="char-lb-backdrop" onclick="closeCharLightbox()"></div>' +
    '<div class="char-lb-content">' +
      '<button class="char-lb-close" onclick="closeCharLightbox()">✕</button>' +
      '<button class="char-lb-prev" onclick="charLbNav(-1)" id="char-lb-prev">&#8592;</button>' +
      '<div class="char-lb-img-wrap"><img id="char-lb-img" src="' + items[index].src + '" alt=""></div>' +
      '<button class="char-lb-next" onclick="charLbNav(1)" id="char-lb-next">&#8594;</button>' +
      '<div class="char-lb-caption" id="char-lb-caption">' + items[index].caption + '</div>' +
    '</div>';
  document.body.appendChild(lb);
  window._charLbIndex = index;
  window._charLbItems = items;
  updateCharLbNav();
  requestAnimationFrame(function(){ lb.classList.add('char-lb-open'); });
  document.addEventListener('keydown', charLbKeyHandler);
}
function charLbKeyHandler(e) {
  if (e.key === 'ArrowRight') charLbNav(1);
  if (e.key === 'ArrowLeft')  charLbNav(-1);
  if (e.key === 'Escape')     closeCharLightbox();
}
function charLbNav(dir) {
  var items = window._charLbItems;
  var i = Math.max(0, Math.min(items.length-1, window._charLbIndex + dir));
  window._charLbIndex = i;
  document.getElementById('char-lb-img').src = items[i].src;
  document.getElementById('char-lb-caption').textContent = items[i].caption;
  updateCharLbNav();
}
function updateCharLbNav() {
  var i = window._charLbIndex, n = window._charLbItems.length;
  document.getElementById('char-lb-prev').style.opacity = i === 0 ? '0.2' : '1';
  document.getElementById('char-lb-next').style.opacity = i === n-1 ? '0.2' : '1';
}
function closeCharLightbox() {
  var lb = document.getElementById('char-lightbox');
  if (lb) lb.remove();
  document.removeEventListener('keydown', charLbKeyHandler);
}

/* ── FACTIONS PAGE ── */
function buildFactionsPage() {
  if (isSectionLocked("factions")) { renderLockedSection("factions-container"); return; }
  var container = document.getElementById('factions-container');
  if (!container) return;
  container.innerHTML = (SITE.factions || []).map(function(f) {
    var statsHTML = (f.stats || []).map(function(s) {
      return '<div class="faction-stat-cell"><span class="fsl">' + s.label + '</span><span class="fsv">' + s.value + '</span></div>';
    }).join('');
    return '<a href="faction.html?id=' + f.id + '" class="wiki-card" style="display:block;text-decoration:none;margin-bottom:16px;">' +
      '<div class="faction-block ' + f.type + '-block" style="margin-bottom:0;cursor:pointer;">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">' +
          '<div>' +
            '<div class="faction-block-title">' + f.name + '</div>' +
            '<span class="faction-block-sub">' + f.subtitle + '</span>' +
          '</div>' +
          '<span style="font-size:0.65rem;letter-spacing:3px;color:var(--accent);opacity:0.7;padding-top:6px;white-space:nowrap;">VIEW →</span>' +
        '</div>' +
        '<p class="faction-block-body">' + f.body + '</p>' +
        '<div class="faction-stats-row">' + statsHTML + '</div>' +
      '</div>' +
    '</a>';
  }).join('');
}


/* ── FACTION DETAIL ── */
function buildFactionDetail() {
  var id = new URLSearchParams(window.location.search).get('id');
  var faction = (SITE.factions || []).find(function(f) { return f.id === id; });
  var crumb = document.getElementById('faction-breadcrumb-name');
  if (crumb) crumb.textContent = faction ? faction.name : '—';
  var detail = document.getElementById('faction-detail');
  if (!detail) return;
  if (!faction) { detail.innerHTML = '<p style="color:var(--muted);padding:40px;">Faction not found.</p>'; return; }
  document.title = faction.name + ' — HELLAWAKE WIKI';

  var statsHTML = (faction.stats || []).map(function(s) {
    return '<div class="faction-stat-cell"><span class="fsl">' + s.label + '</span><span class="fsv">' + s.value + '</span></div>';
  }).join('');

  // Rank ladder
  var ranksHTML = '';
  if (faction.ranks && faction.ranks.length) {
    ranksHTML = '<div class="faction-ranks-section">' +
      '<div class="faction-ranks-title">RANK STRUCTURE</div>' +
      '<div class="rank-ladder">' +
      faction.ranks.map(function(r, i) {
        // Find members with this rank
        var rankMembers = (SITE.personnel || []).filter(function(c) {
          return c.faction === faction.type && c.rank === r.id && c.visible !== false && !c.locked;
        });
        var memberNames = rankMembers.map(function(c) { return c.name; }).join(', ');
        return '<div class="rank-row">' +
          '<div class="rank-index">' + String(faction.ranks.length - i).padStart(2,'0') + '</div>' +
          '<div class="rank-info">' +
            '<div class="rank-label">' + r.label.toUpperCase() + '</div>' +
            '<div class="rank-desc">' + r.desc + '</div>' +
            (memberNames ? '<div class="rank-members">↳ ' + memberNames + '</div>' : '') +
          '</div>' +
        '</div>';
      }).join('') +
      '</div></div>';
  }

  // Members grouped by rank
  var allMembers = (SITE.personnel || []).filter(function(c) {
    return c.faction === faction.type && !c.hidden;
  });
  var membersHTML = '<div class="faction-members-section">' +
    '<div style="font-size:10px;letter-spacing:3px;color:var(--dim);margin-bottom:16px;">KNOWN PERSONNEL</div>' +
    '<div class="wiki-card-grid">' +
    allMembers.map(function(c) {
      if (c.locked) {
        var imgPath2 = c.image ? ASSET_ROOT + c.image : null;
        return '<div class="wiki-card locked-card">' +
          '<div class="wiki-card-faction-bar ' + c.faction + '"></div>' +
          (imgPath2 ? '<img class="wiki-card-img" src="' + imgPath2 + '" alt="CLASSIFIED">' : '<div class="wiki-card-img-placeholder"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#444" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>') +
          '<div class="wiki-card-body">' +
            '<span class="wiki-card-tag">' + c.factionLabel + '</span>' +
            '<div class="wiki-card-title locked-title">&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;</div>' +
            '<div class="wiki-card-desc locked-desc">' + (c.teaser ? '<em>' + c.teaser + '</em>' : 'CLASSIFIED // IDENTITY RESTRICTED') + '</div>' +
          '</div></div>';
      }
      if (c.visible === false) return '';
      var imgPath = c.image ? ASSET_ROOT + c.image : null;
      var rankLabel = getRankLabel(c.faction, c.rank);
      return '<a href="character.html?id=' + c.id + '" class="wiki-card">' +
        '<div class="wiki-card-faction-bar ' + c.faction + '"></div>' +
        (imgPath ? '<img class="wiki-card-img" src="' + imgPath + '" alt="' + c.name + '">' : '<div class="wiki-card-img-placeholder">IMAGE PENDING</div>') +
        '<div class="wiki-card-body">' +
          '<span class="wiki-card-tag">' + (rankLabel ? rankLabel.toUpperCase() + ' // ' : '') + 'STATUS: ' + c.status + '</span>' +
          '<div class="wiki-card-title">' + c.name + '</div>' +
        '</div></a>';
    }).join('') +
    '</div></div>';

  detail.innerHTML =
    '<div class="faction-block ' + faction.type + '-block">' +
      '<div class="faction-block-title">' + faction.name + '</div>' +
      '<span class="faction-block-sub">' + faction.subtitle + '</span>' +
      '<p class="faction-block-body">' + faction.body + '</p>' +
      '<div class="faction-stats-row">' + statsHTML + '</div>' +
    '</div>' +
    ranksHTML + membersHTML;
}

/* ── LORE PAGE ── */
function buildLorePage() {
  if (isSectionLocked("lore")) { renderLockedSection("lore-container"); return; }
  const container = document.getElementById('lore-container');
  if (!container) return;
  container.innerHTML = (SITE.lore||[]).filter(function(e){return !e.hidden;}).map(e=>`
    <div class="lore-entry ${e.classified?'classified':''}">
      <div class="lore-entry-term">${e.term}</div>
      <div class="lore-entry-body">${e.classified?'[ACCESS RESTRICTED]':e.body}</div>
    </div>`).join('');
}

/* ── TIMELINE PAGE ── */
function buildTimelinePage() {
  if (isSectionLocked("timeline")) { renderLockedSection("timeline-container"); return; }
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = (SITE.timeline||[]).filter(function(entry){return !entry.hidden;}).map(entry=>`
    <div class="tl-row ${entry.classified?'classified':''}">
      <div class="tl-row-year">${entry.year}</div>
      <div class="tl-row-dot"></div>
      <div class="tl-row-content">
        <div class="tl-row-title">${entry.title}</div>
        <div class="tl-row-body">${entry.classified?'[CLASSIFIED // ACCESS DENIED]':entry.body}</div>
      </div>
    </div>`).join('');
}

/* ── EPISODE GUIDE PAGE ── */
function buildEpisodeGuidePage() {
  if (isSectionLocked("episodes")) { renderLockedSection("episode-guide-container"); return; }
  const container = document.getElementById('episode-guide-container');
  if (!container) return;
  container.innerHTML = '';
  (SITE.episodes?.seasons||[]).forEach(function(season) {
    if(!season.episodes.length) return;
    var sec = document.createElement('div');
    sec.className = 'ep-guide-season';
    sec.innerHTML = '<div class="ep-guide-season-title">SEASON ' + season.season + '</div>';
    season.episodes.forEach(function(ep, i) {
      var locked = ep.comingSoon || !ep.yt;
      var card = document.createElement('div');
      card.className = 'ep-guide-card' + (locked ? ' ep-guide-locked' : '');
      var bookBtn = '';
      if (ep.book && SITE.wikiConfig && SITE.wikiConfig.showBookReader) {
        var bookTitle = encodeURIComponent('S' + season.season + ' E' + (i+1) + ': ' + ep.title);
        var bookUrl = '../reader.html?book=' + encodeURIComponent(ep.book) + '&title=' + bookTitle;
        bookBtn = '<a class="ep-book-btn" href="' + bookUrl + '" target="_blank" onclick="event.stopPropagation()">📖 BOOK VERSION</a>';
      }
      var thumbHTML = ep.yt ?
        '<img class="ep-guide-thumb" src="https://img.youtube.com/vi/' + ep.yt + '/mqdefault.jpg" alt="' + ep.title + '">' :
        '<div class="ep-guide-thumb"></div>';
      card.innerHTML =
        '<div>' + thumbHTML + '</div>' +
        '<div>' +
          '<span class="ep-guide-num">S' + season.season + ' E' + (i+1) + '</span>' +
          '<div class="ep-guide-title">' + ep.title + (locked ? ' — COMING SOON' : '') + '</div>' +
          '<div class="ep-guide-desc">' + (ep.desc||'') + '</div>' +
          '<div class="ep-guide-meta">' + (ep.time ? '<span>RUNTIME: ' + ep.time + '</span>' : '') + bookBtn + '</div>' +
        '</div>';
      if (!locked) card.onclick = function() { window.location.href = '../episodes'; };
      sec.appendChild(card);
    });
    container.appendChild(sec);
  });
}

/* ── WORLD PAGE ── */
function buildWorldPage() {
  if (isSectionLocked("world")) { renderLockedSection("world-container"); return; }
  const container = document.getElementById('world-container');
  if (!container) return;
  const loreInit = (SITE.lore||[]).find(e=>e.id==='hellawake-initiative');
  const blocks = [
    { title:'THE SETTING', content:'The world of HELLAWAKE is seven years past a turning point nobody fully understands yet. Infrastructure runs. People work. The war between the Dawn Horizon Division and the Skullborns is covert by design — most civilians have no idea it is happening. That invisibility is a weapon for both sides.' },
    { title:'THE HELLAWAKE INITIATIVE', content: loreInit?.body || '' },
    { title:'THE WAR', content:(SITE.factions||[]).map(f=>`<b style="color:var(--accent)">${f.name}</b> — ${f.body}`).join('<br><br>') },
    { title:'KEY TERMINOLOGY', content:(SITE.lore||[]).filter(e=>!e.classified&&!e.hidden).map(e=>`<b style="color:var(--accent)">${e.term}</b><br><span style="color:var(--muted);font-size:13px;">${e.body}</span>`).join('<br><br>') },
  ];
  container.innerHTML = blocks.filter(b=>b.content).map(b=>
    `<div class="world-block"><div class="world-block-title">${b.title}</div><div class="world-block-body">${b.content}</div></div>`
  ).join('');
}