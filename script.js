/* =========================================================
   SAÉ 2.02 · Mission Control — Alien<3
   Vanilla JS — Firebase Realtime DB + localStorage cache
   ========================================================= */

// ------- Data -------
const PHASES = [
  {
    id: 'phase0',
    num: '00',
    title: 'Structuration',
    subtitle: "Setup & rituels d'équipe",
    duration: 'Semaine 1',
    icon: 'settings',
    tasks: [
      'Attribuer les rôles définitifs à chaque membre',
      'Créer le Trello / Notion partagé (colonnes À faire · En cours · À valider · Fait)',
      'Créer le Drive partagé avec arborescence par livrable',
      'Canal Discord ou WhatsApp dédié au projet',
      'Rétroplanning complet à partir de la date de soutenance',
      'Point hebdomadaire fixé (15–20 min)',
      'Template de compte-rendu de réunion'
    ]
  },
  {
    id: 'phase1',
    num: '01',
    title: 'Conception & Stratégie',
    subtitle: 'Le socle du projet',
    duration: '8h',
    icon: 'target',
    tasks: [
      'Affiner le concept : gammes Métiers · Passions · Collabs',
      'Rédiger la proposition de valeur (ce qui vous distingue de Funko & Sonny Angel)',
      'Benchmark concurrentiel : Funko Pop, Sonny Angel, Labubu, Smiski',
      'Analyse SWOT du projet',
      'Affiner le ciblage : cible primaire + cible secondaire',
      'Persona principal détaillé (âge, habitudes, réseaux, budget)',
      'Stratégie de communication (teasing · lancement · engagement)',
      'Plan média : quels réseaux, fréquence, ton de voix',
      'Tagline FR & EN',
      'Dossier de conception finalisé en PDF'
    ]
  },
  {
    id: 'phase2',
    num: '02',
    title: 'Production graphique & vidéo',
    subtitle: "L'univers prend vie",
    duration: '10h',
    icon: 'palette',
    tasks: [
      'Moodboard professionnel structuré (style · couleurs · typo · concurrents)',
      'Design final du personnage alien',
      '3 à 4 déclinaisons du personnage (gammes Métiers/Passions)',
      'Logo de la marque (versions : couleur · mono · icône)',
      'Charte graphique complète (couleurs, typo, règles d\'usage)',
      'Mockup packaging blind box',
      'Mockup peluche et porte-clés',
      'Affiche promotionnelle principale',
      'Kit visuels réseaux sociaux (Instagram & TikTok)',
      'Note d\'intention vidéo',
      'Scénario & storyboard du teaser',
      'Autorisations de tournage signées',
      'Tournage du teaser',
      'Montage & post-production vidéo (2–3 min)'
    ]
  },
  {
    id: 'phase3',
    num: '03',
    title: 'Site vitrine CMS',
    subtitle: 'Présence digitale bilingue',
    duration: '8h',
    icon: 'globe',
    tasks: [
      'Choisir le CMS (WordPress recommandé)',
      'Installer le CMS et un thème de base',
      'Arborescence définitive du site',
      "Page d'accueil : concept + call-to-action",
      'Page Collections / Gammes',
      'Page À propos · Histoire de la marque',
      'Page Contact',
      'Traduction complète en anglais',
      'Intégration vidéo teaser + visuels',
      'Optimisation des médias (compression, WebP, lazy-loading)',
      'SEO basique (title, meta-description, alt sur images)',
      'Tests responsive mobile, tablette, desktop',
      'Mentions légales · CGU · politique de cookies'
    ]
  },
  {
    id: 'phase4',
    num: '04',
    title: 'Gestion & Soutenance',
    subtitle: "La ligne d'arrivée",
    duration: '8h',
    icon: 'rocket',
    tasks: [
      'Comptes rendus de réunion à jour et partagés',
      'Dossier de production complet',
      'Suivi budgétaire chiffré (production, packaging, marketing)',
      'Comparaison planning réel vs prévu',
      'Structure soutenance : problème → solution → marché → stratégie → démo',
      'Deck de présentation (15–20 min)',
      'Répétition complète minimum 2 fois',
      'Bilan de projet et retour d\'expérience',
      'Rendu final de tous les livrables'
    ]
  }
];

const LIVRABLES = [
  { id: 'l1', name: 'Dossier de conception',          phase: 'phase1' },
  { id: 'l2', name: 'Campagne de communication',      phase: 'phase2' },
  { id: 'l3', name: 'Site vitrine CMS (FR/EN)',       phase: 'phase3' },
  { id: 'l4', name: 'Dossier de production',          phase: 'phase2' },
  { id: 'l5', name: 'Supports de communication',      phase: 'phase2' },
  { id: 'l6', name: 'Soutenance + compte-rendu',      phase: 'phase4' }
];

const DEFAULT_TEAM = [
  { id: 'tm1', name: 'Chrisnaël', role: 'Chef de projet · DA',     initial: 'C' },
  { id: 'tm2', name: 'Membre 2',  role: 'Stratégie · Réseaux',     initial: 'M' },
  { id: 'tm3', name: 'Membre 3',  role: 'Production vidéo',        initial: 'M' },
  { id: 'tm4', name: 'Membre 4',  role: 'Dev CMS · Intégration',   initial: 'M' }
];

const DEFAULT_DEADLINE = '2026-06-15';

/* =========================================================
   FIREBASE — mode compat (objet global `firebase`)
   URL corrigée : firebaseio.com (zone US)
   ========================================================= */
var firebaseConfig = {
  apiKey:            "AIzaSyARPMqUNLiZSE_t695eGY7N-vngaeMJlfY",
  authDomain:        "sae-alien3-dashboard.firebaseapp.com",
  databaseURL:       "https://sae-alien3-dashboard-default-rtdb.firebaseio.com",
  projectId:         "sae-alien3-dashboard",
  storageBucket:     "sae-alien3-dashboard.firebasestorage.app",
  messagingSenderId: "990099710663",
  appId:             "1:990099710663:web:aa166f5afd67e8e17654e2"
};

var db = null;
var useFirebase = false;

try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    useFirebase = true;
    console.log('🟢 Firebase connecté — synchro temps réel activée');
  } else {
    console.warn('⚠️ SDK Firebase non chargé — mode localStorage seul');
  }
} catch (err) {
  console.warn('⚠️ Firebase init échoué, fallback localStorage :', err);
}

// ------- Storage (Firebase + localStorage cache) -------
var STORAGE_KEYS = {
  tasks:    'sae-tasks-v1',
  team:     'sae-team-v1',
  deadline: 'sae-deadline-v1',
  expanded: 'sae-expanded-v1'
};

var SYNCED_KEYS = ['tasks', 'team', 'deadline'];

function load(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}

  if (!useFirebase) return;
  var shortKey = null;
  for (var k in STORAGE_KEYS) {
    if (STORAGE_KEYS[k] === key) { shortKey = k; break; }
  }
  if (shortKey && SYNCED_KEYS.indexOf(shortKey) !== -1) {
    db.ref('dashboard/' + shortKey).set(value);
  }
}

// ------- Écoute temps réel (Firebase → UI) -------
var _firebaseReady = false;

function listenFirebase() {
  if (!useFirebase) return;

  SYNCED_KEYS.forEach(function(shortKey) {
    db.ref('dashboard/' + shortKey).on('value', function(snapshot) {
      var val = snapshot.val();
      if (val === null) return;

      var lsKey = STORAGE_KEYS[shortKey];
      try { localStorage.setItem(lsKey, JSON.stringify(val)); } catch (e) {}

      if (shortKey === 'tasks')    state.checked  = val;
      if (shortKey === 'team')     state.team     = val;
      if (shortKey === 'deadline') state.deadline = val;

      if (_firebaseReady) {
        renderHero();
        renderTeam();
        renderPhases();
        renderLivrables();
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  _firebaseReady = true;
}

// ------- State -------
var state = {
  checked: load(STORAGE_KEYS.tasks, {}),
  team: load(STORAGE_KEYS.team, DEFAULT_TEAM),
  deadline: load(STORAGE_KEYS.deadline, DEFAULT_DEADLINE),
  expanded: load(STORAGE_KEYS.expanded, 'phase1'),
  editingMember: null
};

// ------- Helpers -------
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  } catch (e) {
    return d;
  }
}

function daysUntil(d) {
  var diff = new Date(d) - new Date();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function computeStats() {
  var allKeys = [];
  PHASES.forEach(function(p) {
    p.tasks.forEach(function(_, i) { allKeys.push(p.id + '-' + i); });
  });
  var done = allKeys.filter(function(k) { return state.checked[k]; }).length;
  var total = allKeys.length;
  var pct = total ? Math.round((done / total) * 100) : 0;

  var perPhase = {};
  PHASES.forEach(function(p) {
    var keys = p.tasks.map(function(_, i) { return p.id + '-' + i; });
    var d = keys.filter(function(k) { return state.checked[k]; }).length;
    perPhase[p.id] = {
      done: d,
      total: keys.length,
      pct: keys.length ? Math.round((d / keys.length) * 100) : 0
    };
  });

  return { done: done, total: total, pct: pct, perPhase: perPhase };
}

// ------- Stars (atmosphere) -------
function renderStars() {
  var container = $('#stars');
  var count = 30;
  var frag = document.createDocumentFragment();
  for (var i = 0; i < count; i++) {
    var size = Math.random() * 2 + 1;
    var s = document.createElement('div');
    s.className = 'star';
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.top = (Math.random() * 100) + '%';
    s.style.left = (Math.random() * 100) + '%';
    s.style.animationDelay = (Math.random() * 3) + 's';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    frag.appendChild(s);
  }
  container.appendChild(frag);
}

// ------- SVG check icon (for checkbox) -------
function checkSVG() {
  return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path class="check-path" d="M5 12l4 4L19 6" fill="none" stroke="#000" stroke-width="3" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

// ------- Rendering -------
function renderHero() {
  var stats = computeStats();

  var circumference = 2 * Math.PI * 30;
  var offset = circumference * (1 - stats.pct / 100);
  var ringFill = $('#progress-ring-fill');
  ringFill.setAttribute('stroke-dasharray', circumference.toFixed(2));
  ringFill.setAttribute('stroke-dashoffset', offset.toFixed(2));

  $('#progress-pct').textContent  = stats.pct;
  $('#tasks-done').textContent    = stats.done;
  $('#tasks-total').textContent   = stats.total;
  $('#progress-fill').style.width = stats.pct + '%';

  $('#deadline-text').textContent = fmtDate(state.deadline);
  $('#deadline-days').textContent = daysUntil(state.deadline);
}

function renderTeam() {
  var grid = $('#team-grid');
  grid.innerHTML = '';
  $('#team-count').textContent = state.team.length;

  state.team.forEach(function(m, idx) {
    var card = document.createElement('div');
    card.className = 'team-card card-glow btn-lift';
    card.dataset.id = m.id;

    if (state.editingMember === m.id) {
      card.innerHTML =
        '<div class="team-card-head">' +
          '<div class="team-avatar ' + (idx === 0 ? 'lead' : '') + '">' + m.initial + '</div>' +
          (idx === 0 ? '<div class="lead-badge"><span>Lead</span></div>' : '') +
        '</div>' +
        '<div class="team-edit">' +
          '<input class="name" type="text" value="' + escapeHtml(m.name) + '" data-field="name" />' +
          '<input class="role" type="text" value="' + escapeHtml(m.role) + '" data-field="role" />' +
          '<button class="team-edit-save">Valider ↵</button>' +
        '</div>';

      card.addEventListener('click', function(e) { e.stopPropagation(); });

      var nameInput = card.querySelector('input[data-field="name"]');
      var roleInput = card.querySelector('input[data-field="role"]');
      var saveBtn   = card.querySelector('.team-edit-save');

      nameInput.focus();
      nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);

      var commit = function() {
        var name = nameInput.value.trim() || m.name;
        var role = roleInput.value.trim() || m.role;
        updateMember(m.id, { name: name, role: role, initial: name.charAt(0).toUpperCase() });
        state.editingMember = null;
        renderTeam();
      };

      saveBtn.addEventListener('click', commit);
      [nameInput, roleInput].forEach(function(inp) {
        inp.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            state.editingMember = null;
            renderTeam();
          }
        });
      });
    } else {
      card.innerHTML =
        '<div class="team-card-head">' +
          '<div class="team-avatar ' + (idx === 0 ? 'lead' : '') + '">' + escapeHtml(m.initial) + '</div>' +
          (idx === 0 ? '<div class="lead-badge"><span>Lead</span></div>' : '') +
        '</div>' +
        '<div class="team-name">' + escapeHtml(m.name) + '</div>' +
        '<div class="team-role">' + escapeHtml(m.role) + '</div>' +
        '<i class="edit-icon" data-lucide="edit-2"></i>';
      card.addEventListener('click', function() {
        state.editingMember = m.id;
        renderTeam();
      });
    }

    grid.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function renderPhases() {
  var container = $('#phases');
  container.innerHTML = '';
  var stats = computeStats();

  PHASES.forEach(function(phase) {
    var ps = stats.perPhase[phase.id];
    var isOpen = state.expanded === phase.id;
    var allDone = ps.pct === 100;

    var el = document.createElement('div');
    el.className = 'phase card-glow ' + (isOpen ? 'open' : '');
    el.dataset.id = phase.id;

    var tasksHtml = '';
    phase.tasks.forEach(function(task, tIdx) {
      var key = phase.id + '-' + tIdx;
      var done = !!state.checked[key];
      tasksHtml += '<li>' +
        '<button class="task ' + (done ? 'done' : '') + '" data-key="' + key + '">' +
          '<span class="task-checkbox ' + (done ? 'done' : '') + '">' +
            (done ? checkSVG() : '') +
          '</span>' +
          '<span class="task-label">' + escapeHtml(task) + '</span>' +
          '<span class="task-index">·' + String(tIdx + 1).padStart(2, '0') + '</span>' +
        '</button>' +
      '</li>';
    });

    el.innerHTML =
      '<button class="phase-head" aria-expanded="' + isOpen + '">' +
        '<span class="phase-num">' + phase.num + '</span>' +
        '<div class="phase-icon ' + (allDone ? 'done' : '') + '">' +
          '<i data-lucide="' + (allDone ? 'check' : phase.icon) + '"></i>' +
        '</div>' +
        '<div class="phase-info">' +
          '<div class="phase-title-row">' +
            '<h3 class="phase-title">' + escapeHtml(phase.title) + '</h3>' +
            '<span class="phase-duration">' + escapeHtml(phase.duration) + '</span>' +
          '</div>' +
          '<p class="phase-subtitle">' + escapeHtml(phase.subtitle) + '</p>' +
        '</div>' +
        '<div class="phase-stat">' +
          '<span class="phase-stat-count">' + ps.done + '/' + ps.total + '</span>' +
          '<div class="phase-stat-bar">' +
            '<div class="phase-stat-fill" style="width: ' + ps.pct + '%"></div>' +
          '</div>' +
        '</div>' +
        '<i class="chevron" data-lucide="chevron-down"></i>' +
      '</button>' +
      '<div class="phase-body">' +
        '<div class="phase-body-inner">' +
          '<div class="task-list-wrap">' +
            '<ul class="task-list">' + tasksHtml + '</ul>' +
          '</div>' +
        '</div>' +
      '</div>';

    el.querySelector('.phase-head').addEventListener('click', function() {
      state.expanded = isOpen ? null : phase.id;
      save(STORAGE_KEYS.expanded, state.expanded);
      renderPhases();
    });

    el.querySelectorAll('.task').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.dataset.key;
        state.checked[key] = !state.checked[key];
        save(STORAGE_KEYS.tasks, state.checked);
        var done = !!state.checked[key];
        btn.classList.toggle('done', done);
        var cb = btn.querySelector('.task-checkbox');
        cb.classList.toggle('done', done);
        cb.innerHTML = done ? checkSVG() : '';
        updateAggregates();
      });
    });

    container.appendChild(el);
  });

  if (window.lucide) lucide.createIcons();
}

function renderLivrables() {
  var grid = $('#livrables-grid');
  grid.innerHTML = '';
  var stats = computeStats();

  LIVRABLES.forEach(function(l, idx) {
    var phase = PHASES.find(function(p) { return p.id === l.phase; });
    var ps = stats.perPhase[l.phase];

    var el = document.createElement('div');
    el.className = 'livrable card-glow btn-lift';
    el.innerHTML =
      '<span class="livrable-num">0' + (idx + 1) + '</span>' +
      '<div class="livrable-body">' +
        '<div class="livrable-name">' + escapeHtml(l.name) + '</div>' +
        '<div class="livrable-meta">' +
          '<span class="livrable-phase">' + escapeHtml(phase ? phase.title : '') + '</span>' +
          '<span class="livrable-pct">' + ps.pct + '%</span>' +
        '</div>' +
      '</div>' +
      '<i class="livrable-arrow" data-lucide="arrow-up-right"></i>';
    grid.appendChild(el);
  });

  if (window.lucide) lucide.createIcons();
}

function updateAggregates() {
  renderHero();
  var stats = computeStats();
  PHASES.forEach(function(p) {
    var ps = stats.perPhase[p.id];
    var el = $('.phase[data-id="' + p.id + '"]');
    if (!el) return;

    var countEl = el.querySelector('.phase-stat-count');
    var fillEl  = el.querySelector('.phase-stat-fill');
    var iconEl  = el.querySelector('.phase-icon');
    if (countEl) countEl.textContent = ps.done + '/' + ps.total;
    if (fillEl)  fillEl.style.width = ps.pct + '%';

    var wasAllDone = iconEl.classList.contains('done');
    var allDone = ps.pct === 100;
    if (wasAllDone !== allDone) {
      iconEl.classList.toggle('done', allDone);
      var iName = allDone ? 'check' : p.icon;
      iconEl.innerHTML = '<i data-lucide="' + iName + '"></i>';
      if (window.lucide) lucide.createIcons();
    }
  });
  var livrableEls = $$('.livrable .livrable-pct');
  LIVRABLES.forEach(function(l, i) {
    var ps = stats.perPhase[l.phase];
    if (livrableEls[i]) livrableEls[i].textContent = ps.pct + '%';
  });
}

function updateMember(id, patch) {
  state.team = state.team.map(function(m) {
    if (m.id === id) {
      return Object.assign({}, m, patch);
    }
    return m;
  });
  save(STORAGE_KEYS.team, state.team);
}

// ------- Deadline editing -------
function setupDeadline() {
  var btn   = $('#deadline-btn');
  var input = $('#deadline-input');

  btn.addEventListener('click', function() {
    input.value = state.deadline;
    btn.hidden = true;
    input.hidden = false;
    input.focus();
    if (input.showPicker) {
      try { input.showPicker(); } catch (e) {}
    }
  });

  var commit = function() {
    if (input.value) {
      state.deadline = input.value;
      save(STORAGE_KEYS.deadline, state.deadline);
    }
    input.hidden = true;
    btn.hidden = false;
    renderHero();
  };

  input.addEventListener('change', commit);
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === 'Escape') commit();
  });
}

// ------- Reset -------
function setupReset() {
  $('#reset-btn').addEventListener('click', function() {
    if (!confirm('Réinitialiser toutes les tâches cochées ?')) return;
    state.checked = {};
    save(STORAGE_KEYS.tasks, state.checked);
    renderPhases();
    updateAggregates();
  });
}

// ------- Utility: escape HTML -------
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ------- Init -------
function init() {
  renderStars();
  renderHero();
  renderTeam();
  renderPhases();
  renderLivrables();
  setupDeadline();
  setupReset();
  listenFirebase();

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', init);
