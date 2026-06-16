/**
 * home.js - Portfolio homepage + interactive terminal overlay
 * Vanilla JS, no imports, no build step. Runs as a plain <script src>.
 *
 * Requires in the page:
 *   <script id="site-data" type="application/json">…JSON…</script>
 *
 * DATA shape:
 *   profile  : { name, title, tagline, location, email, github, linkedin,
 *                status, typewriter[], about[], education[] }
 *   experience[]: { when, current?, role, org, points[] }
 *   skills[]  : { group, items[] }
 *   certs[]   : string[]
 *   projects[]: { slug, name, excerpt, stat, tech[], github, url }
 */

(function () {
  'use strict';

  /* =========================================================
   * 0. DATA
   * ======================================================= */
  var DATA;
  try {
    var dataEl = document.getElementById('site-data');
    DATA = dataEl ? JSON.parse(dataEl.textContent) : {};
  } catch (e) {
    DATA = {};
    console.warn('home.js: could not parse #site-data JSON', e);
  }
  var PROFILE    = DATA.profile    || {};
  var EXPERIENCE = DATA.experience || [];
  var SKILLS     = DATA.skills     || [];
  var CERTS      = DATA.certs      || [];
  var PROJECTS   = DATA.projects   || [];

  /* =========================================================
   * 0b. THEME TOGGLE (light/dark, persisted; terminal stays dark)
   * ======================================================= */
  (function () {
    var root = document.documentElement;
    function syncIcons() {
      var light = root.classList.contains('light');
      document.querySelectorAll('.theme-dark-icon').forEach(function (el) { el.classList.toggle('hidden', light); });
      document.querySelectorAll('.theme-light-icon').forEach(function (el) { el.classList.toggle('hidden', !light); });
    }
    syncIcons();
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var light = root.classList.toggle('light');
        try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
        syncIcons();
      });
    }
  })();

  /* =========================================================
   * 1. UTILITIES
   * ======================================================= */
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* =========================================================
   * 2. SMOOTH-SCROLL for [data-scroll] buttons
   * ======================================================= */
  function initScrollButtons() {
    document.querySelectorAll('[data-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.querySelector(btn.getAttribute('data-scroll'));
        if (target) target.scrollIntoView({ behavior: rm ? 'auto' : 'smooth' });
      });
    });
  }

  /* =========================================================
   * 3. HERO RAIN CANVAS
   * ======================================================= */
  function initRain() {
    var canvas = document.getElementById('rain');
    if (!canvas) return;
    if (rm) return; // skip for reduced-motion

    var ctx = canvas.getContext('2d');
    var y = [];
    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      var cols = Math.floor(canvas.width / 16);
      for (var i = 0; i < cols; i++) if (y[i] === undefined) y[i] = Math.random() * (canvas.height / 16);
      y.length = cols;
    }
    resize();
    window.addEventListener('resize', resize);

    setInterval(function () {
      var cs = getComputedStyle(document.documentElement);
      var bg = (cs.getPropertyValue('--c-bg') || '#06080d').trim();
      var term = (cs.getPropertyValue('--c-term') || '#3ddc97').trim();
      // fade trail toward current bg
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = term;
      ctx.font = '13px monospace';
      y.forEach(function (v, idx) {
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', idx * 16, v * 16);
        if (v * 16 > canvas.height && Math.random() > 0.98) y[idx] = 0;
        y[idx]++;
      });
    }, 70);
  }

  /* =========================================================
   * 4. TYPEWRITER  (#tline)
   * ======================================================= */
  function initTypewriter() {
    var el = document.getElementById('tline');
    if (!el) return;

    var phrases = (PROFILE.typewriter && PROFILE.typewriter.length)
      ? PROFILE.typewriter
      : ['Fullstack Software Engineer'];

    var p = 0, c = 0, deleting = false;

    function tick() {
      var cur = phrases[p];
      el.innerHTML = esc(cur.slice(0, c)) + '<span style="color:#3ddc97;animation:blink 1s steps(1) infinite">▋</span>';
      if (!deleting && c < cur.length) {
        c++;
      } else if (!deleting && c === cur.length) {
        deleting = true;
        setTimeout(tick, 1500);
        return;
      } else if (deleting && c > 0) {
        c--;
      } else {
        deleting = false;
        p = (p + 1) % phrases.length;
      }
      setTimeout(tick, deleting ? 30 : 65);
    }
    tick();
  }

  /* =========================================================
   * 5. INTERSECTION OBSERVER - reveal
   * ======================================================= */
  function initReveal() {
    if (rm) {
      // skip animation, just make them visible immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }
    if (!window.IntersectionObserver) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* =========================================================
   * 6. MAGNETIC BUTTONS (.btn-magnetic)
   * ======================================================= */
  function initMagnetic() {
    if (rm) return;
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var tx = (e.clientX - r.left - r.width  / 2) * 0.2;
        var ty = (e.clientY - r.top  - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* =========================================================
   * 7. TERMINAL ENGINE
   * ======================================================= */

  // ---- 7a. constants & helpers ----
  var PS1 = 'visitor@portfolio:$ ~ ';
  var TERM_BOOTED_KEY = 'term-booted';

  var ASCII =
    '   ____       _                       ____         _    _          \n' +
    '  / ___|  ___| (_)_ __ __ _ _ __ ___ | __ )  ___ | | _| | ____ _  \n' +
    '  \\___ \\ / _ \\ | | \'__/ _` | \'_ ` _ \\|  _ \\ / _ \\| |/ / |/ / _` | \n' +
    '   ___) |  __/ | | | | (_| | | | | | | |_) | (_) |   <|   < (_| | \n' +
    '  |____/ \\___|_|_|_|  \\__,_|_| |_| |_|____/ \\___/|_|\\_\\_|\\_\\__,_| ';

  // project slugs for tab completion pool
  function getSlugs() {
    return PROJECTS.map(function (p) { return p.slug; });
  }

  // ---- 7b. DOM references (resolved lazily after overlay opens) ----
  var termEl     = null;
  var inputEl    = null;
  var hist       = [];
  var hi         = 0;
  var lastTab    = 0;

  function getTermEl() {
    return termEl || (termEl = document.getElementById('term'));
  }

  // ---- 7c. append a line to #term ----
  function append(html, extraClass) {
    var t = getTermEl();
    if (!t) return;
    var d = document.createElement('div');
    d.className = 'line' + (extraClass ? ' ' + extraClass : '');
    d.innerHTML = html;
    t.appendChild(d);
    t.scrollTop = t.scrollHeight;
    return d;
  }

  function appendAscii(text) {
    var t = getTermEl();
    if (!t) return;
    var d = document.createElement('pre');
    d.className = 'line ascii';
    d.textContent = text;
    t.appendChild(d);
    t.scrollTop = t.scrollHeight;
  }

  function echoCmd(cmd) {
    append('<span class="t-prompt">' + esc(PS1) + '</span>' + esc(cmd));
  }

  // ---- 7d. COMMANDS ----
  var COMMAND_NAMES = [
    'help','about','whoami','banner','sumfetch','ls','cd','projects','cat',
    'experience','skills','certs','education','contact','github','linkedin',
    'email','resume','echo','date','google','theme','sudo','clear',
    'vi','vim','nvim','emacs'
  ];

  var COMMANDS = {
    help: function () {
      var cmds = COMMAND_NAMES.slice();
      var rows = [];
      for (var i = 0; i < cmds.length; i += 5) {
        var chunk = cmds.slice(i, i + 5).map(function (c) {
          return '<span class="t-cyan">' + c.padEnd(11) + '</span>';
        });
        rows.push('  ' + chunk.join(''));
      }
      return [
        '<span class="t-green t-b">Welcome! Here are all the available commands:</span>',
        '',
        rows.join('\n'),
        '',
        '<span class="t-muted">[tab]</span>      trigger completion (double-tap to list all)',
        '<span class="t-muted">[ctrl+l]</span>   clear terminal     <span class="t-muted">[ctrl+c]</span> cancel line',
        '<span class="t-muted">[↑]/[↓]</span>    command history    <span class="t-muted">[ctrl+u]</span> clear input',
        '',
        "Type <span class='t-cyan'>sumfetch</span> to display a summary, or <span class='t-cyan'>cat &lt;slug&gt;</span> to open a project."
      ].join('\n');
    },

    whoami: function () {
      return '<span class="t-green">visitor</span>';
    },

    about: function () {
      var lines = [
        'Hi, I am <span class="t-green t-b">' + esc(PROFILE.name || 'Sairam Bokka') + '</span>.',
        'Welcome to my website!',
        '',
        "I'm a <span class='t-yellow'>" + esc(PROFILE.title || 'Fullstack Software Engineer') + '</span>.',
      ];
      if (PROFILE.about && PROFILE.about.length) {
        lines.push('');
        PROFILE.about.forEach(function (para) {
          lines.push(esc(para));
        });
      }
      lines = lines.concat([
        '',
        'More about me:',
        "  <span class='t-cyan'>'github'</span>   - my project portfolio",
        "  <span class='t-cyan'>'linkedin'</span> - my social media (say hi!)",
        "  <span class='t-cyan'>'resume'</span>   - my latest resume",
        "  <span class='t-cyan'>'projects'</span> - what I've built"
      ]);
      return lines.join('\n');
    },

    ls: function () {
      return 'a\nbunch\nof\nfake\ndirectories\n<span class="t-muted"># real stuff → </span><span class="t-cyan">projects</span><span class="t-muted">, </span><span class="t-cyan">cat &lt;slug&gt;</span>';
    },

    cd: function () {
      return 'unfortunately, i cannot afford more directories.';
    },

    projects: function () {
      var lines = ['<span class="t-green t-b">projects</span>'];
      PROJECTS.forEach(function (p) {
        lines.push('  <span class="t-cyan">' + esc((p.slug || '').padEnd(14)) + '</span> ' + esc(p.name || ''));
      });
      if (PROJECTS.length === 0) lines.push('  <span class="t-muted">(no projects found in DATA)</span>');
      lines.push('<span class="t-muted">open one → </span><span class="t-cyan">cat &lt;slug&gt;</span>');
      return lines.join('\n');
    },

    cat: function (arg) {
      if (!arg) return '<span class="t-pink">usage:</span> cat &lt;slug&gt;  (try <span class="t-cyan">projects</span> first)';
      var p = null;
      for (var i = 0; i < PROJECTS.length; i++) {
        if (PROJECTS[i].slug === arg) { p = PROJECTS[i]; break; }
      }
      if (!p) return '<span class="t-pink">cat: ' + esc(arg) + ': no such project</span>  (run <span class="t-cyan">projects</span>)';
      var url  = p.url    || p.github || '#';
      var gh   = p.github || url;
      var tech = (p.tech  || []).join(', ');
      var lines = [
        '<span class="t-green t-b">' + esc(p.name) + '</span>',
        esc(p.excerpt || ''),
        '<span class="t-muted">stack:</span> <span class="t-yellow">' + esc(tech) + '</span>',
        '<span class="t-muted">stat:</span>  <span class="t-cyan">'  + esc(p.stat  || '') + '</span>',
      ];
      if (gh && gh !== '#') {
        lines.push('<span class="t-muted">→</span> <a href="' + esc(gh) + '" target="_blank" rel="noopener">' + esc(gh) + '</a>');
      }
      return lines.join('\n');
    },

    experience: function () {
      var lines = ['<span class="t-green t-b">experience.log</span>'];
      var colors = ['t-yellow', 't-blue', 't-cyan', 't-muted'];
      EXPERIENCE.forEach(function (j, idx) {
        var col = colors[Math.min(idx, colors.length - 1)];
        var prefix = j.current
          ? '<span class="' + col + '">' + esc(j.when) + '</span>'
          : '<span class="' + col + '">' + esc(j.when) + '</span>';
        lines.push(prefix + '  ' + esc(j.org || '') + '  ·  ' + esc(j.role || ''));
        if (j.points && j.points.length) {
          j.points.slice(0, 2).forEach(function (pt) {
            // strip HTML tags from points (they may have <b> tags)
            lines.push('          <span class="t-muted">› </span>' + pt);
          });
        }
      });
      return lines.join('\n');
    },

    skills: function () {
      var lines = ['<span class="t-green t-b">skills.json</span>'];
      SKILLS.forEach(function (s) {
        lines.push('  <span class="t-cyan">' + esc((s.group || '').padEnd(12)) + '</span>: ' + esc((s.items || []).join(', ')));
      });
      return lines.join('\n');
    },

    certs: function () {
      var lines = ['<span class="t-green t-b">certs/</span>'];
      CERTS.forEach(function (c) {
        lines.push('  ✓ ' + esc(c));
      });
      return lines.join('\n');
    },

    education: function () {
      var lines = ['<span class="t-green t-b">education.md</span>'];
      var edu = PROFILE.education || [];
      edu.forEach(function (e) {
        lines.push('  <span class="t-yellow">' + esc(e.degree || '') + '</span>  ' + esc(e.school || ''));
        if (e.meta) lines.push('  ' + esc(e.meta));
        if (e.gpa)  lines.push('  <span class="t-muted">GPA:</span> <span class="t-green">' + esc(e.gpa) + '</span>');
      });
      return lines.join('\n');
    },

    contact: function () {
      var em = PROFILE.email    || '';
      var gh = PROFILE.github   || '';
      var li = PROFILE.linkedin || '';
      var lines = ['<span class="t-green t-b">contact.vcf</span>'];
      if (em) lines.push('  email    <a href="mailto:' + esc(em) + '">' + esc(em) + '</a>');
      if (li) lines.push('  linkedin <a href="' + esc(li) + '" target="_blank" rel="noopener">' + esc(li) + '</a>');
      if (gh) lines.push('  github   <a href="' + esc(gh) + '" target="_blank" rel="noopener">' + esc(gh) + '</a>');
      return lines.join('\n');
    },

    github: function () {
      var url = PROFILE.github || '';
      if (url) window.open(url, '_blank', 'noopener');
      return 'Opening github...';
    },

    linkedin: function () {
      var url = PROFILE.linkedin || '';
      if (url) window.open(url, '_blank', 'noopener');
      return 'Opening linkedin...';
    },

    email: function () {
      var em = PROFILE.email || '';
      if (em) window.open('mailto:' + em, '_blank');
      return em ? 'Opening mailto:' + esc(em) + '...' : 'No email address configured.';
    },

    resume: function () {
      return 'Opening resume...  <span class="t-muted">(no resume URL in DATA; add profile.resume to site data)</span>';
    },

    echo: function (arg) {
      return arg ? esc(arg) : '';
    },

    date: function () {
      return esc(new Date().toString());
    },

    google: function (arg) {
      if (!arg) return 'Usage: google &lt;query&gt;';
      window.open('https://google.com/search?q=' + encodeURIComponent(arg), '_blank', 'noopener');
      return 'Searching google for ' + esc(arg) + '...';
    },

    sumfetch: function () {
      var name   = esc(PROFILE.name   || 'Sairam Bokka');
      var title  = esc(PROFILE.title  || 'Fullstack SWE');
      var em     = esc(PROFILE.email  || '');
      var gh     = PROFILE.github   || '';
      var ghesc  = esc(gh);
      var ghText = gh ? '/sairambokka' : '';
      var status = esc(PROFILE.status || 'open to SWE roles');
      var loc    = esc(PROFILE.location || '');
      return [
        '<span class="t-green">        ___        </span>  <span class="t-cyan t-b">' + name + '</span>',
        '<span class="t-green">       /   \\       </span>  ----------------------',
        '<span class="t-green">      | <span class="t-yellow">o</span> <span class="t-yellow">o</span> |      </span>  <span class="t-yellow">Role</span>    ' + title,
        '<span class="t-green">      |  <span class="t-pink">^</span>  |      </span>  <span class="t-yellow">Loc</span>     ' + loc,
        '<span class="t-green">      |  <span class="t-cyan">\\_/</span> |      </span>  <span class="t-yellow">Email</span>   ' + (em ? '<a href="mailto:' + em + '">' + em + '</a>' : ''),
        '<span class="t-green">       \\___/       </span>  <span class="t-yellow">GitHub</span>  ' + (gh ? '<a href="' + ghesc + '" target="_blank" rel="noopener">' + ghText + '</a>' : ''),
        '<span class="t-green">                   </span>  <span class="t-yellow">Status</span>  <span class="t-green">● ' + status + '</span>'
      ].join('\n');
    },

    vi:    function () { return "woah, you still use 'vi'? just try 'vim'."; },
    vim:   function () { return "'vim' is so outdated. how about 'nvim'?"; },
    nvim:  function () { return "'nvim'? too fancy. why not 'emacs'?"; },
    emacs: function () { return 'you know what? just use vscode.'; },

    sudo: function (arg) {
      if ((arg || '').indexOf('rm') !== -1) {
        return '<span class="t-pink">nice try.</span> this incident will be reported.';
      }
      return 'Permission denied: with little power comes... no responsibility?';
    },

    theme: function (arg) {
      if (arg === 'matrix') {
        document.documentElement.style.setProperty('--fg',    '#00ff66');
        document.documentElement.style.setProperty('--green', '#00ff9c');
        document.body.style.background = '#000';
        startMatrixCanvas();
        return '<span class="t-green">matrix mode engaged. follow the white rabbit. 🐇</span>';
      }
      if (arg === 'reset') {
        location.reload();
        return '';
      }
      return 'themes: <span class="t-cyan">matrix</span>, <span class="t-cyan">reset</span>';
    },

    banner: function () {
      appendAscii(ASCII);
      return '<span class="t-muted">            Fullstack Software Engineer · AI + Security</span>';
    },

    clear: function () {
      var t = getTermEl();
      if (t) t.innerHTML = '';
      return null;
    }
  };

  // Full autocomplete pool
  function getAutocompletePool() {
    return COMMAND_NAMES.concat(getSlugs());
  }

  // ---- 7e. matrix canvas (theme matrix command) ----
  function startMatrixCanvas() {
    if (document.getElementById('term-matrix-canvas')) return;
    var c = document.createElement('canvas');
    c.id = 'term-matrix-canvas';
    Object.assign(c.style, {
      position: 'fixed', inset: '0', zIndex: '0',
      opacity: '0.18', pointerEvents: 'none'
    });
    document.body.prepend(c);
    var ctx = c.getContext('2d');
    function sz() { c.width = window.innerWidth; c.height = window.innerHeight; }
    sz();
    window.addEventListener('resize', sz);
    var cols = Math.floor(window.innerWidth / 14);
    var y2 = [];
    for (var i = 0; i < cols; i++) y2[i] = 0;
    setInterval(function () {
      ctx.fillStyle = 'rgba(0,0,0,.08)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#00ff66';
      ctx.font = '14px monospace';
      y2.forEach(function (v, idx) {
        var t = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(t, idx * 14, v * 14);
        if (v * 14 > c.height && Math.random() > 0.975) y2[idx] = 0;
        y2[idx]++;
      });
    }, 50);
  }

  // ---- 7f. run a command ----
  function runCmd(raw) {
    var cmd = raw.trim();
    if (!cmd) { newPrompt(); return; }
    echoCmd(cmd);
    hist.push(cmd);
    hi = hist.length;

    var parts = cmd.split(/\s+/);
    var name  = parts[0].toLowerCase();
    var arg   = parts.slice(1).join(' ').toLowerCase();
    var fn    = COMMANDS[name];

    if (fn) {
      var out = fn(arg);
      if (out !== null && out !== undefined && out !== '') {
        append(out);
      }
    } else {
      append(
        '<span class="t-pink">shell: command not found: ' + esc(name) +
        '.</span> Try <span class="t-cyan">help</span> to get started.'
      );
    }
    newPrompt();
  }

  // ---- 7g. prompt ----
  function newPrompt() {
    var t = getTermEl();
    if (!t) return;

    // freeze old input line
    if (inputEl) {
      inputEl.removeEventListener('keydown', onKey);
      var cur = inputEl.parentElement && inputEl.parentElement.querySelector('.cursor');
      if (cur) cur.remove();
      var val = inputEl.value;
      var parent = inputEl.parentElement;
      if (parent) {
        var span = document.createElement('span');
        span.textContent = val;
        parent.replaceChild(span, inputEl);
      }
      inputEl = null;
    }

    var wrap = document.createElement('div');
    wrap.className = 'line inputline';
    wrap.innerHTML =
      '<span class="ps1">' + esc(PS1) + '</span>' +
      '<input id="cmd" autocomplete="off" autocapitalize="off" spellcheck="false">';
    t.appendChild(wrap);
    inputEl = wrap.querySelector('#cmd');
    inputEl.addEventListener('keydown', onKey);
    t.scrollTop = t.scrollHeight;
    inputEl.focus();
  }

  // freeze input without creating new prompt (used for Ctrl+C)
  function commitLine(suffix) {
    if (!inputEl) return;
    inputEl.removeEventListener('keydown', onKey);
    var cur = inputEl.parentElement && inputEl.parentElement.querySelector('.cursor');
    if (cur) cur.remove();
    var val = inputEl.value;
    var parent = inputEl.parentElement;
    if (parent) {
      var span = document.createElement('span');
      span.innerHTML = esc(val) + (suffix || '');
      parent.replaceChild(span, inputEl);
    }
    inputEl = null;
  }

  // keep input value but render a fresh prompt below (used after Tab-Tab listing)
  function newPromptKeepInput(v) {
    commitLine();
    newPrompt();
    if (inputEl) inputEl.value = v;
  }

  // ---- 7h. keyboard handler ----
  function onKey(e) {
    // Ctrl+C
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      commitLine('<span class="t-muted">^C</span>');
      hi = hist.length;
      newPrompt();
      return;
    }
    // Ctrl+L
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      var saved = inputEl ? inputEl.value : '';
      var t = getTermEl();
      if (t) t.innerHTML = '';
      inputEl = null;
      newPrompt();
      if (inputEl) inputEl.value = saved;
      return;
    }
    // Ctrl+U
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      if (inputEl) inputEl.value = '';
      return;
    }
    if (e.key === 'Enter') {
      var v = inputEl ? inputEl.value : '';
      commitLine();
      runCmd(v);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hi > 0) { hi--; if (inputEl) inputEl.value = hist[hi] || ''; }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hi < hist.length) { hi++; if (inputEl) inputEl.value = hist[hi] || ''; }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!inputEl) return;
      var cur  = inputEl.value;
      var pparts = cur.split(/\s+/);
      var last = pparts[pparts.length - 1];
      // if there's a command word already, complete from project slugs; else full pool
      var pool = pparts.length > 1 ? getSlugs() : getAutocompletePool();
      var matches = pool.filter(function (n) { return n.indexOf(last) === 0; });

      if (matches.length === 1) {
        pparts[pparts.length - 1] = matches[0];
        inputEl.value = pparts.join(' ') + (pparts.length > 1 ? '' : ' ');
      } else if (matches.length > 1) {
        var now = Date.now();
        if (now - lastTab < 400) {
          // double-tab: list all matches
          append('<span class="t-muted">' + matches.map(esc).join('   ') + '</span>');
          newPromptKeepInput(cur);
        }
        lastTab = now;
      }
      return;
    }
  }

  // ---- 7i. boot sequence ----
  function runBootSequence(cb) {
    var bootLines = [
      ['<pre class="line ascii">' + esc(ASCII) + '</pre>', 120, true],
      ['', 60, false],
      ['<span class="t-muted">            Fullstack Software Engineer · AI + Security</span>', 180, false],
      ['', 80, false],
      ['* Hi! Welcome to my portfolio. I am a <span class="t-green t-b">' + esc(PROFILE.name || 'Sairam Bokka') + '</span>.', 120, false],
      ['* ' + esc(PROFILE.title || 'Fullstack Software Engineer'), 100, false],
      ['', 60, false],
      ["Type <span class='t-cyan t-b'>help</span> to see the list of available commands.", 90, false],
      ["Type <span class='t-cyan'>github</span> to see my latest inventions, or <span class='t-cyan'>sumfetch</span> for a summary.", 60, false],
      ['', 40, false]
    ];

    var idx = 0;
    function step() {
      if (idx >= bootLines.length) { if (cb) cb(); return; }
      var item = bootLines[idx++];
      var html = item[0], delay = item[1], isRaw = item[2];
      if (isRaw) {
        // insert raw HTML element
        var t = getTermEl();
        if (t) {
          var tmp = document.createElement('div');
          tmp.innerHTML = html;
          while (tmp.firstChild) t.appendChild(tmp.firstChild);
          t.scrollTop = t.scrollHeight;
        }
      } else {
        append(html);
      }
      setTimeout(step, delay);
    }
    step();
  }

  // ---- 7j. terminal open/close/minimize/fullscreen ----
  function openTerminal() {
    var overlay = document.getElementById('terminal-overlay');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    termEl = document.getElementById('term'); // refresh reference

    var alreadyBooted = sessionStorage.getItem(TERM_BOOTED_KEY);

    if (alreadyBooted) {
      // skip boot, just show a fresh prompt
      newPrompt();
    } else {
      sessionStorage.setItem(TERM_BOOTED_KEY, '1');
      runBootSequence(function () { newPrompt(); });
    }

    // focus input after a short delay (overlay may animate in)
    setTimeout(function () { if (inputEl) inputEl.focus(); }, 80);
  }

  function closeTerminal() {
    var overlay = document.getElementById('terminal-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function initTerminalControls() {
    // Red: close overlay, return to portfolio
    var btnClose = document.getElementById('btn-close');
    if (btnClose) {
      btnClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeTerminal();
      });
    }

    // Yellow: minimize (toggle .min on #term-win)
    var btnMin = document.getElementById('btn-min');
    if (btnMin) {
      btnMin.addEventListener('click', function (e) {
        e.stopPropagation();
        var win = document.getElementById('term-win');
        if (win) win.classList.toggle('min');
        if (win && !win.classList.contains('min') && inputEl) inputEl.focus();
      });
    }

    // Green: fullscreen toggle on #term-win
    var btnFull = document.getElementById('btn-full');
    if (btnFull) {
      btnFull.addEventListener('click', function (e) {
        e.stopPropagation();
        var win = document.getElementById('term-win');
        if (!win) return;
        try {
          if (!document.fullscreenElement) {
            var req = win.requestFullscreen || win.webkitRequestFullscreen;
            if (req) req.call(win);
          } else {
            document.exitFullscreen();
          }
        } catch (err) {
          // silently ignore fullscreen errors (e.g. user gesture not present)
        }
      });
    }

    // Click on title bar while minimized → restore
    var termBar = document.getElementById('term-bar');
    if (termBar) {
      termBar.addEventListener('click', function () {
        var win = document.getElementById('term-win');
        if (win && win.classList.contains('min')) {
          win.classList.remove('min');
          if (inputEl) inputEl.focus();
        }
      });
    }

    // Click anywhere inside terminal body → focus input
    var overlay = document.getElementById('terminal-overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        if (inputEl) inputEl.focus();
      });
    }

    // Esc while terminal is open → close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var ov = document.getElementById('terminal-overlay');
        if (ov && !ov.classList.contains('hidden')) {
          closeTerminal();
        }
      }
    });
  }

  // ---- 7k. #open-terminal button + Cmd/Ctrl+K ----
  function initTerminalLauncher() {
    var btn = document.getElementById('open-terminal');
    if (btn) {
      btn.addEventListener('click', function () { openTerminal(); });
    }

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        var ov = document.getElementById('terminal-overlay');
        if (ov) {
          e.preventDefault();
          if (ov.classList.contains('hidden')) {
            openTerminal();
          } else {
            // toggle: if already open, close it
            closeTerminal();
          }
        }
      }
    });
  }

  /* =========================================================
   * 8. INIT (DOMContentLoaded)
   * ======================================================= */
  function init() {
    initScrollButtons();
    initRain();
    initTypewriter();
    initReveal();
    initMagnetic();
    initTerminalControls();
    initTerminalLauncher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
