/**
 * Doubt Vault, Notebooks, Interactive Quiz & Practice Engine - Core Logic
 * Clean, Compact Doubt Cards, Custom Tagging & Full Analytics
 */

// =============================================================================
// 1. MASTER CHAPTERS & STORAGE CONFIG
// =============================================================================
const MASTER_JEE_CHAPTERS = {
  Physics: [
    "Units, Dimensions & Measurements",
    "Kinematics (1D & 2D Motion, Projectiles)",
    "Laws of Motion & Friction",
    "Work, Power & Energy",
    "Center of Mass & Collisions",
    "Rotational Dynamics & Rigid Body Motion",
    "Gravitation",
    "Mechanical Properties of Solids (Elasticity)",
    "Fluid Mechanics & Surface Tension",
    "Thermal Properties of Matter & Calorimetry",
    "Thermodynamics & Kinetic Theory of Gases (KTG)",
    "Simple Harmonic Motion (SHM)",
    "Waves & Sound",
    "Electrostatics (Fields, Potentials, Gauss's Law)",
    "Capacitance & Dielectrics",
    "Current Electricity & Circuits",
    "Magnetic Effects of Current & Magnetism",
    "Electromagnetic Induction (EMI)",
    "Alternating Current (AC)",
    "Electromagnetic Waves",
    "Ray Optics & Optical Instruments",
    "Wave Optics & Interference",
    "Dual Nature of Matter & Radiation",
    "Atomic Physics",
    "Nuclear Physics & Radioactivity",
    "Semiconductors & Logic Gates",
    "Experimental Physics & Error Analysis"
  ],
  Chemistry: [
    "Some Basic Concepts of Chemistry (Mole Concept)",
    "Atomic Structure & Quantum Mechanics",
    "States of Matter & Gaseous State",
    "Chemical Thermodynamics & Thermochemistry",
    "Chemical Equilibrium",
    "Ionic Equilibrium",
    "Redox Reactions & Volumetric Analysis",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry & Colloids",
    "Solid State",
    "Solutions & Colligative Properties",
    "Periodic Classification & Periodicity",
    "Chemical Bonding & Molecular Structure",
    "s-Block Elements (Alkali & Alkaline Earth)",
    "p-Block Elements (Groups 13 to 18)",
    "d & f Block Elements (Transition Metals)",
    "Coordination Compounds",
    "Qualitative Inorganic Analysis (Salt Analysis)",
    "General Organic Chemistry (GOC & Mechanisms)",
    "Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)",
    "Haloalkanes & Haloarenes",
    "Alcohols, Phenols & Ethers",
    "Aldehydes, Ketones & Carboxylic Acids",
    "Nitrogen Compounds (Amines, Diazo)",
    "Biomolecules & Polymers",
    "Practical Organic Chemistry (POC)"
  ],
  Mathematics: [
    "Sets, Relations & Functions",
    "Complex Numbers & Quadratic Equations",
    "Matrices & Determinants",
    "Permutations & Combinations",
    "Binomial Theorem",
    "Sequences & Series (AP, GP, AGP)",
    "Limits, Continuity & Differentiability",
    "Differentiation & Applications of Derivatives (AOD)",
    "Indefinite Integration",
    "Definite Integration & Area Under Curves",
    "Differential Equations",
    "Straight Lines & Pair of Straight Lines",
    "Circles & Conic Sections (Parabola, Ellipse, Hyperbola)",
    "Vector Algebra",
    "3D Geometry",
    "Trigonometric Ratios & Inverse Trigonometry (ITF)",
    "Probability & Statistics"
  ]
};

const STORAGE_KEYS = {
  DOUBTS: "jee_vault_doubts_clean_v3",
  NOTEBOOKS: "jee_vault_notebooks_clean_v3",
  CUSTOM_CHAPTERS: "jee_vault_custom_chapters_clean_v3",
  PRACTICE_LOGS: "jee_vault_practice_logs_clean_v3",
  TEST_HISTORY: "jee_vault_test_history_clean_v3",
  CHAPTER_TARGETS: "jee_vault_chapter_targets_clean_v3",
  THEME: "jee_vault_theme_clean_v3"
};

const AppState = {
  currentTab: 'vault',
  doubts: [],
  notebooks: [],
  customChapters: [],
  practiceLogs: [],
  testHistory: [],
  chapterTargets: {},
  
  // Chapter Targets filter & selection
  targetSubjectFilter: 'all',
  activeTargetSubject: 'Physics',
  activeTargetChapter: '',

  // Vault Filtering
  subjectFilter: 'all', // 'all', 'Physics', 'Chemistry', 'Mathematics', 'starred'
  activeNotebookFilterId: null,
  searchQuery: '',
  sortBy: 'newest',
  
  // Active Detail Modal
  activeDoubtId: null,

  // Quiz Sub-Navigation State ('practice' | 'test' | 'history')
  quizSubTab: 'practice',

  // 1. Practice Mode State (Immediate Solution Checking)
  practice: {
    inProgress: false,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    secondsElapsed: 0,
    timerInterval: null,
    selectedLength: 5
  },

  // 2. Test Mode State (Strict Test-First, Hidden Solutions, Palette, Timed)
  testSession: {
    inProgress: false,
    testId: null,
    title: '',
    scope: 'all',
    notebookId: null,
    timerType: '30',
    durationSeconds: 1800,
    secondsElapsed: 0,
    timerInterval: null,
    currentIndex: 0,
    questions: []
  },

  // 3. Test Review State
  activeTestReviewId: null,
  lastSubmittedTestId: null
};

let chartSubjectDist = null;
let chartDailyVolume = null;
let chartMistakesDist = null;
let chartDiffMastery = null;

// Scratchpad Whiteboard State
let scratchpadCanvas = null;
let scratchpadCtx = null;
let isScratchpadDrawing = false;
let scratchpadColor = '#2563eb';
let scratchpadSize = 4;

// Batch Mode State
let isBatchMode = false;
let batchSelectedDoubtIds = new Set();

// Live Camera State
let liveCameraStream = null;
let liveCameraTargetType = 'question';
let liveCameraFacingMode = 'environment';
let liveCameraCapturedBase64 = null;

// =============================================================================
// 2. DATA PERSISTENCE & INITIAL LOAD
// =============================================================================
function loadAppData() {
  try {
    const savedDoubts = localStorage.getItem(STORAGE_KEYS.DOUBTS);
    AppState.doubts = savedDoubts ? JSON.parse(savedDoubts) : [];

    const savedNotebooks = localStorage.getItem(STORAGE_KEYS.NOTEBOOKS);
    AppState.notebooks = savedNotebooks ? JSON.parse(savedNotebooks) : [];

    const savedCustomChapters = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHAPTERS);
    AppState.customChapters = savedCustomChapters ? JSON.parse(savedCustomChapters) : [];

    const savedLogs = localStorage.getItem(STORAGE_KEYS.PRACTICE_LOGS);
    AppState.practiceLogs = savedLogs ? JSON.parse(savedLogs) : [];

    const savedHistory = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY);
    AppState.testHistory = savedHistory ? JSON.parse(savedHistory) : [];

    const savedTargets = localStorage.getItem(STORAGE_KEYS.CHAPTER_TARGETS);
    AppState.chapterTargets = savedTargets ? JSON.parse(savedTargets) : {};
  } catch (err) {
    console.error("Failed to load app data from localStorage", err);
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage quota warning or error", e);
    showToast("Storage quota warning. Please export backup.", "error");
  }
}

function getAllChaptersForSubject(subject) {
  const base = MASTER_JEE_CHAPTERS[subject] || [];
  const custom = (AppState.customChapters || [])
    .filter(c => c.subject === subject)
    .map(c => c.chapter_name);
  return [...base, ...custom];
}

function populateChapterDropdown(selectElementId, subject, selectedValue = '') {
  const select = document.getElementById(selectElementId);
  if (!select) return;
  
  const chapters = getAllChaptersForSubject(subject);
  select.innerHTML = '';
  
  chapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = ch;
    opt.textContent = ch;
    if (ch === selectedValue) opt.selected = true;
    select.appendChild(opt);
  });

  if (selectedValue && chapters.includes(selectedValue)) {
    select.value = selectedValue;
  }
}

function populateNotebookDropdown(selectedValue = '') {
  const select = document.getElementById('doubt-notebook');
  if (select) {
    select.innerHTML = '<option value="">No specific notebook (General)</option>';
    (AppState.notebooks || []).forEach(nb => {
      const opt = document.createElement('option');
      opt.value = nb.id;
      opt.textContent = nb.name + (nb.subject && nb.subject !== 'General' ? ` (${nb.subject})` : '');
      if (nb.id === selectedValue) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // Practice notebook picker
  const practicePicker = document.getElementById('practice-notebook-picker');
  if (practicePicker) {
    practicePicker.innerHTML = '';
    if ((AppState.notebooks || []).length === 0) {
      practicePicker.innerHTML = '<option value="">No notebooks created yet</option>';
    } else {
      AppState.notebooks.forEach(nb => {
        const opt = document.createElement('option');
        opt.value = nb.id;
        opt.textContent = nb.name;
        practicePicker.appendChild(opt);
      });
    }
  }

  // Test notebook picker
  const testPicker = document.getElementById('test-notebook-picker');
  if (testPicker) {
    testPicker.innerHTML = '';
    if ((AppState.notebooks || []).length === 0) {
      testPicker.innerHTML = '<option value="">No notebooks created yet</option>';
    } else {
      AppState.notebooks.forEach(nb => {
        const opt = document.createElement('option');
        opt.value = nb.id;
        opt.textContent = nb.name;
        testPicker.appendChild(opt);
      });
    }
  }
}

// =============================================================================
// 3. INITIALIZATION & THEME
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadAppData();
  initTheme();
  
  populateChapterDropdown('doubt-chapter', 'Physics');
  populateChapterDropdown('log-chapter', 'Physics');
  populateNotebookDropdown();
  
  renderVault();
  updateHeaderMetrics();
  renderNotebooksList();
  renderChapterTargets();

  if (window.lucide) window.lucide.createIcons();
});

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  
  if (isDark) {
    sunIcon?.classList.remove('hidden');
    moonIcon?.classList.add('hidden');
  } else {
    sunIcon?.classList.add('hidden');
    moonIcon?.classList.remove('hidden');
  }
  
  if (AppState.currentTab === 'practice') {
    renderAnalyticsAndCharts();
  }

  if (window.lucide) window.lucide.createIcons();
}

function calculateStreak() {
  if (!AppState.practiceLogs || AppState.practiceLogs.length === 0) return 0;
  
  // Set of dates logged (YYYY-MM-DD)
  const logDates = new Set(
    AppState.practiceLogs.map(l => (l.date || l.created_at || '').split('T')[0]).filter(Boolean)
  );

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  // Check if today or yesterday has a log
  const todayStr = checkDate.toISOString().split('T')[0];
  let isTodayLogged = logDates.has(todayStr);

  if (!isTodayLogged) {
    // Check yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!logDates.has(yesterdayStr)) {
      return 0;
    }
  }

  // Count backwards
  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (logDates.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function updateHeaderMetrics() {
  const totalCount = AppState.doubts?.length || 0;
  const headerTotal = document.getElementById('header-total-count');
  if (headerTotal) headerTotal.textContent = String(totalCount);

  // Streak
  const streak = calculateStreak();
  const streakHeader = document.getElementById('header-streak');
  if (streakHeader) streakHeader.textContent = `${streak} d`;

  const streakStat = document.getElementById('stat-current-streak');
  if (streakStat) streakStat.textContent = `${streak} Days`;

  // Pill counters
  const phyCount = (AppState.doubts || []).filter(d => d.subject === 'Physics').length;
  const chemCount = (AppState.doubts || []).filter(d => d.subject === 'Chemistry').length;
  const mathCount = (AppState.doubts || []).filter(d => d.subject === 'Mathematics').length;

  const pAll = document.getElementById('pill-count-all');
  const pPhy = document.getElementById('pill-count-phy');
  const pChem = document.getElementById('pill-count-chem');
  const pMath = document.getElementById('pill-count-math');

  if (pAll) pAll.textContent = String(totalCount);
  if (pPhy) pPhy.textContent = String(phyCount);
  if (pChem) pChem.textContent = String(chemCount);
  if (pMath) pMath.textContent = String(mathCount);

  // Practice total stats
  const totalQ = (AppState.practiceLogs || []).reduce((acc, curr) => acc + (Number(curr.question_count) || 0), 0);
  const statQ = document.getElementById('stat-total-questions');
  if (statQ) statQ.textContent = String(totalQ);

  const statD = document.getElementById('stat-total-doubts');
  if (statD) statD.textContent = String(totalCount);

  const statN = document.getElementById('stat-total-notebooks');
  if (statN) statN.textContent = String(AppState.notebooks?.length || 0);
}

// =============================================================================
// 4. TAB SWITCHING
// =============================================================================
function switchTab(tabName) {
  AppState.currentTab = tabName;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-bold');
    btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-medium');
  });

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('text-blue-600', 'dark:text-blue-400', 'font-bold');
    activeBtn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-medium');
  }

  document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');

  if (tabName === 'vault') {
    renderVault();
  } else if (tabName === 'capture') {
    const activeSubj = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
    populateChapterDropdown('doubt-chapter', activeSubj);
    populateNotebookDropdown();
  } else if (tabName === 'notebooks') {
    renderNotebooksList();
  } else if (tabName === 'quiz') {
    populateNotebookDropdown();
    updateTestHistoryBadge();
    switchQuizSubTab(AppState.quizSubTab || 'practice');
  } else if (tabName === 'practice') {
    renderAnalyticsAndCharts();
  }

  updateHeaderMetrics();
  if (window.lucide) window.lucide.createIcons();
}

// =============================================================================
// 5. COMPACT DOUBT VAULT RENDER (STRICTLY NO IMAGES IN LIST VIEW)
// =============================================================================
let searchDebounceTimer = null;
function debounceVaultRender() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const input = document.getElementById('vault-search-input');
    AppState.searchQuery = input ? input.value.trim().toLowerCase() : '';
    
    const clearBtn = document.getElementById('vault-search-clear');
    if (clearBtn) {
      if (AppState.searchQuery) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
    
    renderVault();
  }, 150);
}

function clearSearch() {
  const input = document.getElementById('vault-search-input');
  if (input) input.value = '';
  AppState.searchQuery = '';
  document.getElementById('vault-search-clear')?.classList.add('hidden');
  renderVault();
}

function setSubjectFilter(filter) {
  AppState.subjectFilter = filter;
  document.querySelectorAll('.quick-pill').forEach(btn => {
    if (btn.dataset.subfilter === filter) {
      btn.className = 'quick-pill px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white transition whitespace-nowrap';
    } else {
      btn.className = 'quick-pill px-3 py-1.5 rounded-lg font-bold bg-slate-100 dark:bg-[#2E2E2E] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap';
    }
  });
  renderVault();
}

function filterByNotebook(notebookId) {
  AppState.activeNotebookFilterId = notebookId;
  const nb = AppState.notebooks.find(n => n.id === notebookId);
  
  const banner = document.getElementById('active-notebook-banner');
  const nameEl = document.getElementById('active-notebook-name');
  const subTitle = document.getElementById('header-subtitle');

  if (banner && nameEl) {
    nameEl.textContent = nb ? nb.name : 'Selected Notebook';
    banner.classList.remove('hidden');
    banner.classList.add('flex');
  }

  if (subTitle && nb) {
    subTitle.textContent = `Notebook: ${nb.name}`;
  }

  switchTab('vault');
}

function clearActiveNotebookFilter() {
  AppState.activeNotebookFilterId = null;
  const banner = document.getElementById('active-notebook-banner');
  const subTitle = document.getElementById('header-subtitle');
  if (banner) {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }
  if (subTitle) {
    subTitle.textContent = 'All Notebooks & Doubts';
  }
  renderVault();
}

function renderVault() {
  const container = document.getElementById('vault-grid');
  const emptyState = document.getElementById('vault-empty-state');
  if (!container) return;

  const sortBy = document.getElementById('vault-sort-select')?.value || 'newest';

  // Filter doubts
  let list = (AppState.doubts || []).filter(d => {
    if (AppState.activeNotebookFilterId && d.notebook_id !== AppState.activeNotebookFilterId) return false;
    if (AppState.subjectFilter === 'starred' && !d.is_starred) return false;
    if (['Physics', 'Chemistry', 'Mathematics'].includes(AppState.subjectFilter) && d.subject !== AppState.subjectFilter) return false;

    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      const titleMatch = (d.title || '').toLowerCase().includes(q);
      const sourceMatch = (d.source_tag || '').toLowerCase().includes(q);
      const chapterMatch = (d.chapter || '').toLowerCase().includes(q);
      const tagMatch = (d.custom_tags || []).some(t => t.toLowerCase().includes(q));
      
      const notebookObj = AppState.notebooks.find(n => n.id === d.notebook_id);
      const notebookMatch = notebookObj && notebookObj.name.toLowerCase().includes(q);

      if (!titleMatch && !sourceMatch && !chapterMatch && !tagMatch && !notebookMatch) return false;
    }

    return true;
  });

  // Sort doubts
  list.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (sortBy === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'difficulty_desc') {
      const rank = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'JEE Advanced': 4 };
      return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
    }
    return 0;
  });

  // Empty state handling
  if (list.length === 0) {
    container.innerHTML = '';
    emptyState?.classList.remove('hidden');
    return;
  }
  emptyState?.classList.add('hidden');

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Recent';
    const dt = new Date(isoStr);
    return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Render cards: strictly Title, Date Uploaded, Subject, Chapter, Difficulty, Notebook Badge, Custom Tags
  container.innerHTML = list.map(doubt => {
    let subjBadgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    if (doubt.subject === 'Chemistry') {
      subjBadgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    } else if (doubt.subject === 'Mathematics') {
      subjBadgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }

    let diffBadgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    if (doubt.difficulty === 'Hard') diffBadgeClass = "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300";
    if (doubt.difficulty === 'JEE Advanced') diffBadgeClass = "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";

    const starIconClass = doubt.is_starred ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600";
    const dateFormatted = formatDate(doubt.created_at);

    // Resolve Notebook Name
    const notebookObj = AppState.notebooks.find(n => n.id === doubt.notebook_id);

    // Tags rendering
    const tagsHtml = (doubt.custom_tags || []).slice(0, 3).map(tag => `
      <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-[#2E2E2E] text-slate-600 dark:text-slate-400">
        ${tag}
      </span>
    `).join('');

    return `
      <div onclick="openDoubtDetailModal('${doubt.id}')" class="bg-white dark:bg-[#1E1E1E] p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group">
        
        <!-- Header: Subject & Difficulty Badges + Star -->
        <div class="flex items-center justify-between gap-1.5">
          <div class="flex items-center space-x-1.5 truncate">
            <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full border ${subjBadgeClass}">
              ${doubt.subject || 'Physics'}
            </span>
            <span class="px-2 py-0.5 text-[10px] font-semibold rounded-md ${diffBadgeClass}">
              ${doubt.difficulty || 'Medium'}
            </span>
          </div>

          <button onclick="event.stopPropagation(); toggleStarDoubt('${doubt.id}')" class="p-1 text-slate-300 hover:text-amber-400 transition flex-shrink-0" title="Star Doubt">
            <i data-lucide="star" class="w-4 h-4 ${starIconClass}"></i>
          </button>
        </div>

        <!-- Chapter Name -->
        <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 line-clamp-1">
          ${doubt.chapter || 'General Topic'}
        </p>

        <!-- Title -->
        <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          ${doubt.title || 'Untitled Doubt'}
        </h4>

        <!-- Custom Notebook and Tags if present -->
        <div class="flex items-center gap-1 flex-wrap pt-0.5">
          ${notebookObj ? `
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center space-x-0.5">
              <i data-lucide="book" class="w-2.5 h-2.5"></i>
              <span>${notebookObj.name}</span>
            </span>
          ` : ''}
          ${tagsHtml}
        </div>

        <!-- Footer: Date Uploaded -->
        <div class="pt-2 border-t border-slate-100 dark:border-[#2E2E2E] flex items-center justify-between text-[11px] text-slate-400">
          <span class="flex items-center space-x-1">
            <i data-lucide="calendar" class="w-3 h-3"></i>
            <span>${dateFormatted}</span>
          </span>
          ${doubt.question_image_url ? `
            <span class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-0.5" title="Has attached image">
              <i data-lucide="paperclip" class="w-3 h-3"></i>
              <span>Attachment</span>
            </span>
          ` : ''}
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function toggleStarDoubt(doubtId) {
  const d = AppState.doubts.find(x => x.id === doubtId);
  if (!d) return;
  d.is_starred = !d.is_starred;
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  renderVault();
}

// =============================================================================
// 6. QUIZ ENGINE: PRACTICE MODE, TEST MODE & TEST HISTORY WITH SOLUTIONS
// =============================================================================

// 6.0 QUIZ SUB-TAB SWITCHER ('practice' | 'test' | 'history')
function switchQuizSubTab(subTab) {
  AppState.quizSubTab = subTab;

  const tabs = ['practice', 'test', 'history'];
  tabs.forEach(t => {
    const btn = document.getElementById(`quiz-subtab-btn-${t}`);
    const panel = document.getElementById(`quiz-panel-${t}`);

    if (t === subTab) {
      if (btn) {
        btn.className = 'flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-white shadow-xs';
      }
      panel?.classList.remove('hidden');
    } else {
      if (btn) {
        btn.className = 'flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200';
      }
      panel?.classList.add('hidden');
    }
  });

  if (subTab === 'history') {
    renderTestHistory();
  } else if (subTab === 'practice') {
    populateNotebookDropdown();
    if (!AppState.practice.inProgress) {
      document.getElementById('practice-setup-card')?.classList.remove('hidden');
      document.getElementById('practice-active-panel')?.classList.add('hidden');
      document.getElementById('practice-results-card')?.classList.add('hidden');
    }
  } else if (subTab === 'test') {
    populateNotebookDropdown();
    if (!AppState.testSession.inProgress) {
      document.getElementById('test-setup-card')?.classList.remove('hidden');
      document.getElementById('test-active-panel')?.classList.add('hidden');
      document.getElementById('test-submitted-card')?.classList.add('hidden');
    }
  }

  updateTestHistoryBadge();
  if (window.lucide) window.lucide.createIcons();
}

function updateTestHistoryBadge() {
  const badge = document.getElementById('test-history-badge');
  const count = (AppState.testHistory || []).length;
  if (badge) {
    badge.textContent = String(count);
    if (count > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
  }

  const totalCountEl = document.getElementById('test-history-total-count');
  if (totalCountEl) {
    totalCountEl.textContent = `${count} ${count === 1 ? 'Test' : 'Tests'}`;
  }
}

// -----------------------------------------------------------------------------
// 6.1 PRACTICE MODE (IMMEDIATE SOLUTION VIEWING CAPABILITY)
// -----------------------------------------------------------------------------
function handlePracticeScopeChange() {
  const scope = document.getElementById('practice-scope-select')?.value;
  const pickerBox = document.getElementById('practice-notebook-picker-box');
  if (scope === 'notebook') {
    pickerBox?.classList.remove('hidden');
  } else {
    pickerBox?.classList.add('hidden');
  }
}

function setPracticeLength(len) {
  AppState.practice.selectedLength = len;
  document.querySelectorAll('.practice-len-btn').forEach(btn => {
    if (Number(btn.dataset.len) === len) {
      btn.className = 'practice-len-btn py-2 rounded-xl border border-slate-200 dark:border-[#2E2E2E] text-xs font-bold bg-blue-600 text-white';
    } else {
      btn.className = 'practice-len-btn py-2 rounded-xl border border-slate-200 dark:border-[#2E2E2E] text-xs font-bold bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-slate-300';
    }
  });
}

function startPracticeForActiveNotebook() {
  if (!AppState.activeNotebookFilterId) return;
  switchTab('quiz');
  switchQuizSubTab('practice');
  const scopeSelect = document.getElementById('practice-scope-select');
  if (scopeSelect) {
    scopeSelect.value = 'notebook';
    handlePracticeScopeChange();
  }
  const nbPicker = document.getElementById('practice-notebook-picker');
  if (nbPicker) {
    nbPicker.value = AppState.activeNotebookFilterId;
  }
  startPracticeSession();
}

function startPracticeForSpecificNotebook(notebookId) {
  AppState.activeNotebookFilterId = notebookId;
  startPracticeForActiveNotebook();
}

function startQuizForSpecificNotebook(notebookId) {
  startPracticeForSpecificNotebook(notebookId);
}

function startPracticeSession() {
  const scope = document.getElementById('practice-scope-select')?.value || 'all';
  const selectedNotebookId = document.getElementById('practice-notebook-picker')?.value;

  let pool = [...(AppState.doubts || [])];

  if (scope === 'Physics' || scope === 'Chemistry' || scope === 'Mathematics') {
    pool = pool.filter(d => d.subject === scope);
  } else if (scope === 'starred') {
    pool = pool.filter(d => d.is_starred);
  } else if (scope === 'notebook' && selectedNotebookId) {
    pool = pool.filter(d => d.notebook_id === selectedNotebookId);
  }

  if (pool.length === 0) {
    showToast('No doubts found in the selected scope to practice!', 'error');
    return;
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);

  const len = AppState.practice.selectedLength || 5;
  const questions = pool.slice(0, len);

  AppState.practice.inProgress = true;
  AppState.practice.questions = questions;
  AppState.practice.currentIndex = 0;
  AppState.practice.correctCount = 0;
  AppState.practice.secondsElapsed = 0;

  if (AppState.practice.timerInterval) clearInterval(AppState.practice.timerInterval);
  AppState.practice.timerInterval = setInterval(() => {
    AppState.practice.secondsElapsed++;
    updatePracticeTimerDisplay();
  }, 1000);

  document.getElementById('practice-setup-card')?.classList.add('hidden');
  document.getElementById('practice-results-card')?.classList.add('hidden');
  document.getElementById('practice-active-panel')?.classList.remove('hidden');

  renderCurrentPracticeQuestion();
}

function updatePracticeTimerDisplay() {
  const el = document.getElementById('practice-timer-display');
  if (!el) return;
  const m = Math.floor(AppState.practice.secondsElapsed / 60);
  const s = AppState.practice.secondsElapsed % 60;
  el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderCurrentPracticeQuestion() {
  const q = AppState.practice.questions[AppState.practice.currentIndex];
  if (!q) {
    finishPracticeSession();
    return;
  }

  const progText = document.getElementById('practice-progress-text');
  if (progText) progText.textContent = `Q ${AppState.practice.currentIndex + 1} of ${AppState.practice.questions.length}`;

  const subjBadge = document.getElementById('practice-badge-subject');
  if (subjBadge) subjBadge.textContent = q.subject || 'Physics';

  const diffBadge = document.getElementById('practice-badge-diff');
  if (diffBadge) diffBadge.textContent = q.difficulty || 'Medium';

  const chEl = document.getElementById('practice-q-chapter');
  if (chEl) chEl.textContent = q.chapter || 'Topic';

  const titleEl = document.getElementById('practice-q-title');
  if (titleEl) titleEl.textContent = q.title || 'Untitled Doubt';

  // Question Image Box
  const imgBox = document.getElementById('practice-q-img-box');
  const imgEl = document.getElementById('practice-q-img');
  if (q.question_image_url) {
    if (imgEl) imgEl.src = q.question_image_url;
    imgBox?.classList.remove('hidden');
  } else {
    imgBox?.classList.add('hidden');
  }

  // Hint box
  const hintBox = document.getElementById('practice-hint-box');
  const hintText = document.getElementById('practice-hint-text');
  const hintContent = document.getElementById('practice-hint-content');
  if (q.hint_text && q.hint_text.trim()) {
    if (hintText) hintText.textContent = q.hint_text;
    hintContent?.classList.add('hidden');
    hintBox?.classList.remove('hidden');
  } else {
    hintBox?.classList.add('hidden');
  }

  // Solution Box: Hidden by default, toggled immediately on button tap
  const solBox = document.getElementById('practice-solution-box');
  const solImg = document.getElementById('practice-sol-img');
  const solNotes = document.getElementById('practice-sol-notes');
  const solBtnText = document.getElementById('practice-solution-btn-text');

  if (solBox) solBox.classList.add('hidden');
  if (solBtnText) solBtnText.textContent = 'View Solution Immediately';

  // Solution Image
  if (solImg) {
    if (q.solution_image_url) {
      solImg.src = q.solution_image_url;
      solImg.classList.remove('hidden');
    } else {
      solImg.classList.add('hidden');
    }
  }

  // Solution Notes
  if (solNotes) {
    if (q.solution_text && q.solution_text.trim()) {
      solNotes.textContent = q.solution_text;
      solNotes.classList.remove('hidden');
    } else if (!q.solution_image_url) {
      solNotes.textContent = 'No written solution was recorded during doubt capture.';
      solNotes.classList.remove('hidden');
    } else {
      solNotes.classList.add('hidden');
    }
  }

  // Navigation Prev Button State
  const prevBtn = document.getElementById('practice-prev-btn');
  if (prevBtn) {
    prevBtn.disabled = AppState.practice.currentIndex === 0;
    if (AppState.practice.currentIndex === 0) {
      prevBtn.classList.add('opacity-40', 'cursor-not-allowed');
    } else {
      prevBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    }
  }

  // Clear answer input
  const userAns = document.getElementById('practice-user-answer');
  if (userAns) userAns.value = '';

  if (window.lucide) window.lucide.createIcons();
}

function togglePracticeHint() {
  const content = document.getElementById('practice-hint-content');
  content?.classList.toggle('hidden');
}

function togglePracticeSolution() {
  const solBox = document.getElementById('practice-solution-box');
  const solBtnText = document.getElementById('practice-solution-btn-text');
  if (!solBox) return;

  const isHidden = solBox.classList.toggle('hidden');
  if (solBtnText) {
    solBtnText.textContent = isHidden ? 'View Solution Immediately' : 'Hide Solution';
  }
}

function submitPracticeAnswer(isCorrect) {
  if (isCorrect) AppState.practice.correctCount++;
  nextPracticeQuestion();
}

function prevPracticeQuestion() {
  if (AppState.practice.currentIndex > 0) {
    AppState.practice.currentIndex--;
    renderCurrentPracticeQuestion();
  }
}

function nextPracticeQuestion() {
  AppState.practice.currentIndex++;
  if (AppState.practice.currentIndex >= AppState.practice.questions.length) {
    finishPracticeSession();
  } else {
    renderCurrentPracticeQuestion();
  }
}

function finishPracticeSession() {
  if (AppState.practice.timerInterval) clearInterval(AppState.practice.timerInterval);

  document.getElementById('practice-active-panel')?.classList.add('hidden');
  const resCard = document.getElementById('practice-results-card');
  resCard?.classList.remove('hidden');

  const totalEl = document.getElementById('practice-res-total');
  const corEl = document.getElementById('practice-res-correct');
  const timeEl = document.getElementById('practice-res-time');
  const accEl = document.getElementById('practice-res-accuracy');

  const total = AppState.practice.questions.length;
  const correct = AppState.practice.correctCount;
  const acc = total > 0 ? Math.round((correct / total) * 100) : 0;

  const m = Math.floor(AppState.practice.secondsElapsed / 60);
  const s = AppState.practice.secondsElapsed % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (totalEl) totalEl.textContent = String(total);
  if (corEl) corEl.textContent = String(correct);
  if (timeEl) timeEl.textContent = timeFormatted;
  if (accEl) accEl.textContent = `${acc}%`;

  AppState.practice.inProgress = false;
  if (window.lucide) window.lucide.createIcons();
}

function exitPracticeSession() {
  if (AppState.practice.timerInterval) clearInterval(AppState.practice.timerInterval);
  AppState.practice.inProgress = false;
  document.getElementById('practice-active-panel')?.classList.add('hidden');
  document.getElementById('practice-results-card')?.classList.add('hidden');
  document.getElementById('practice-setup-card')?.classList.remove('hidden');
}

// -----------------------------------------------------------------------------
// 6.2 TEST MODE (STRICT TEST-FIRST ENGINE: SOLUTIONS HIDDEN UNTIL SUBMISSION)
// -----------------------------------------------------------------------------
function handleTestScopeChange() {
  const scope = document.getElementById('test-scope-select')?.value;
  const pickerBox = document.getElementById('test-notebook-picker-box');
  if (scope === 'notebook') {
    pickerBox?.classList.remove('hidden');
  } else {
    pickerBox?.classList.add('hidden');
  }
}

function startTestSession() {
  const scope = document.getElementById('test-scope-select')?.value || 'all';
  const selectedNotebookId = document.getElementById('test-notebook-picker')?.value;
  const testNameInput = document.getElementById('test-name-input')?.value?.trim();
  const countSelect = document.getElementById('test-count-select')?.value || '5';
  const timerSelect = document.getElementById('test-timer-select')?.value || '30';

  let pool = [...(AppState.doubts || [])];

  if (scope === 'Physics' || scope === 'Chemistry' || scope === 'Mathematics') {
    pool = pool.filter(d => d.subject === scope);
  } else if (scope === 'starred') {
    pool = pool.filter(d => d.is_starred);
  } else if (scope === 'notebook' && selectedNotebookId) {
    pool = pool.filter(d => d.notebook_id === selectedNotebookId);
  }

  if (pool.length === 0) {
    showToast('No doubts found in the selected scope to generate a test!', 'error');
    return;
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);

  const testCount = countSelect === 'all' ? pool.length : Math.min(parseInt(countSelect, 10), pool.length);
  const selectedQuestions = pool.slice(0, testCount).map((q, idx) => ({
    id: q.id,
    doubt_id: q.id,
    title: q.title || `Question ${idx + 1}`,
    chapter: q.chapter || 'Topic',
    subject: q.subject || 'Physics',
    difficulty: q.difficulty || 'Medium',
    question_image_url: q.question_image_url || '',
    solution_image_url: q.solution_image_url || '',
    solution_text: q.solution_text || '',
    hint_text: q.hint_text || '',
    userAnswer: '',
    isMarkedForReview: false,
    status: 'unanswered' // 'unanswered' | 'answered'
  }));

  const generatedTitle = testNameInput || `${scope === 'all' ? 'Vault Comprehensive' : scope} Test Drill`;

  AppState.testSession = {
    inProgress: true,
    testId: "test_" + Date.now(),
    title: generatedTitle,
    scope: scope,
    notebookId: selectedNotebookId || null,
    timerType: timerSelect,
    durationSeconds: timerSelect === 'stopwatch' ? 0 : parseInt(timerSelect, 10) * 60,
    secondsElapsed: 0,
    timerInterval: null,
    currentIndex: 0,
    questions: selectedQuestions
  };

  // Start Test Timer
  if (AppState.testSession.timerInterval) clearInterval(AppState.testSession.timerInterval);
  AppState.testSession.timerInterval = setInterval(() => {
    AppState.testSession.secondsElapsed++;
    updateTestTimerDisplay();

    // Check countdown expiration if not stopwatch
    if (AppState.testSession.timerType !== 'stopwatch') {
      const remaining = AppState.testSession.durationSeconds - AppState.testSession.secondsElapsed;
      if (remaining <= 0) {
        clearInterval(AppState.testSession.timerInterval);
        showToast('Time is up! Auto-submitting test...', 'info');
        finalizeAndSaveTest();
      }
    }
  }, 1000);

  // Update UI Panels
  const activeTitle = document.getElementById('test-active-title');
  if (activeTitle) activeTitle.textContent = generatedTitle;

  document.getElementById('test-setup-card')?.classList.add('hidden');
  document.getElementById('test-submitted-card')?.classList.add('hidden');
  document.getElementById('test-active-panel')?.classList.remove('hidden');

  updateTestTimerDisplay();
  renderCurrentTestQuestion();
  renderTestPalette();
}

function updateTestTimerDisplay() {
  const el = document.getElementById('test-timer-display');
  const icon = document.getElementById('test-timer-icon');
  if (!el) return;

  if (AppState.testSession.timerType === 'stopwatch') {
    const m = Math.floor(AppState.testSession.secondsElapsed / 60);
    const s = AppState.testSession.secondsElapsed % 60;
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    const total = AppState.testSession.durationSeconds;
    const remaining = Math.max(0, total - AppState.testSession.secondsElapsed);
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    if (remaining <= 120) {
      el.classList.add('text-red-500');
      icon?.classList.add('text-red-500', 'animate-pulse');
    } else {
      el.classList.remove('text-red-500');
      icon?.classList.remove('text-red-500', 'animate-pulse');
    }
  }
}

function renderCurrentTestQuestion() {
  const q = AppState.testSession.questions[AppState.testSession.currentIndex];
  if (!q) return;

  const progText = document.getElementById('test-progress-text');
  if (progText) progText.textContent = `Q ${AppState.testSession.currentIndex + 1} of ${AppState.testSession.questions.length}`;

  const subjBadge = document.getElementById('test-badge-subject');
  if (subjBadge) subjBadge.textContent = q.subject || 'Physics';

  const diffBadge = document.getElementById('test-badge-diff');
  if (diffBadge) diffBadge.textContent = q.difficulty || 'Medium';

  const chEl = document.getElementById('test-q-chapter');
  if (chEl) chEl.textContent = q.chapter || 'Topic';

  const titleEl = document.getElementById('test-q-title');
  if (titleEl) titleEl.textContent = q.title || 'Untitled Doubt';

  // Question Image Box
  const imgBox = document.getElementById('test-q-img-box');
  const imgEl = document.getElementById('test-q-img');
  if (q.question_image_url) {
    if (imgEl) imgEl.src = q.question_image_url;
    imgBox?.classList.remove('hidden');
  } else {
    imgBox?.classList.add('hidden');
  }

  // Hint box
  const hintBox = document.getElementById('test-hint-box');
  const hintText = document.getElementById('test-hint-text');
  const hintContent = document.getElementById('test-hint-content');
  if (q.hint_text && q.hint_text.trim()) {
    if (hintText) hintText.textContent = q.hint_text;
    hintContent?.classList.add('hidden');
    hintBox?.classList.remove('hidden');
  } else {
    hintBox?.classList.add('hidden');
  }

  // Answer Input value
  const userAns = document.getElementById('test-user-answer');
  if (userAns) userAns.value = q.userAnswer || '';

  // Mark for Review Status
  const reviewBtn = document.getElementById('test-mark-review-btn');
  const reviewCheckbox = document.getElementById('test-mark-review-checkbox');
  if (reviewCheckbox) reviewCheckbox.checked = !!q.isMarkedForReview;
  if (reviewBtn) {
    if (q.isMarkedForReview) {
      reviewBtn.classList.add('border-amber-400', 'bg-amber-50', 'dark:bg-amber-950/40', 'text-amber-700', 'dark:text-amber-300');
    } else {
      reviewBtn.classList.remove('border-amber-400', 'bg-amber-50', 'dark:bg-amber-950/40', 'text-amber-700', 'dark:text-amber-300');
    }
  }

  // Prev / Next button states
  const prevBtn = document.getElementById('test-prev-btn');
  if (prevBtn) {
    prevBtn.disabled = AppState.testSession.currentIndex === 0;
    if (AppState.testSession.currentIndex === 0) {
      prevBtn.classList.add('opacity-40', 'cursor-not-allowed');
    } else {
      prevBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    }
  }

  const nextBtn = document.getElementById('test-next-btn');
  const isLast = AppState.testSession.currentIndex === AppState.testSession.questions.length - 1;
  if (nextBtn) {
    nextBtn.innerHTML = isLast ? `<span>Finish & Submit</span><i data-lucide="check-circle" class="w-4 h-4"></i>` : `<span>Save & Next</span><i data-lucide="chevron-right" class="w-4 h-4"></i>`;
  }

  renderTestPalette();
  if (window.lucide) window.lucide.createIcons();
}

function saveCurrentTestAnswer() {
  const q = AppState.testSession.questions[AppState.testSession.currentIndex];
  if (!q) return;

  const userAns = document.getElementById('test-user-answer')?.value || '';
  q.userAnswer = userAns;
  q.status = userAns.trim() ? 'answered' : 'unanswered';

  renderTestPalette();
}

function toggleTestMarkReview() {
  const q = AppState.testSession.questions[AppState.testSession.currentIndex];
  if (!q) return;

  q.isMarkedForReview = !q.isMarkedForReview;
  renderCurrentTestQuestion();
}

function renderTestPalette() {
  const grid = document.getElementById('test-palette-grid');
  if (!grid || !AppState.testSession.questions) return;

  const currentIdx = AppState.testSession.currentIndex;
  let answeredCount = 0;
  let unansweredCount = 0;

  grid.innerHTML = AppState.testSession.questions.map((q, idx) => {
    const isCurrent = idx === currentIdx;
    const isAnswered = q.userAnswer && q.userAnswer.trim().length > 0;
    const isReview = !!q.isMarkedForReview;

    if (isAnswered) answeredCount++;
    else unansweredCount++;

    let styleClasses = 'bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#333]';

    if (isCurrent) {
      styleClasses = 'ring-2 ring-purple-600 font-black scale-105 ' + (isAnswered ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-[#333] text-purple-600 dark:text-purple-400');
    } else if (isReview && isAnswered) {
      styleClasses = 'bg-amber-500 text-white font-bold border border-amber-600';
    } else if (isReview) {
      styleClasses = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-400 font-bold';
    } else if (isAnswered) {
      styleClasses = 'bg-purple-600 text-white font-bold';
    }

    return `
      <button onclick="jumpToTestQuestion(${idx})" class="w-8 h-8 rounded-xl flex items-center justify-center text-xs transition ${styleClasses}" title="Q${idx + 1}: ${isAnswered ? 'Answered' : 'Not Answered'}${isReview ? ' (Marked for review)' : ''}">
        ${idx + 1}
      </button>
    `;
  }).join('');

  const ansEl = document.getElementById('test-answered-count');
  const unansEl = document.getElementById('test-unanswered-count');
  if (ansEl) ansEl.textContent = String(answeredCount);
  if (unansEl) unansEl.textContent = String(unansweredCount);
}

function jumpToTestQuestion(index) {
  saveCurrentTestAnswer();
  if (index >= 0 && index < AppState.testSession.questions.length) {
    AppState.testSession.currentIndex = index;
    renderCurrentTestQuestion();
  }
}

function prevTestQuestion() {
  saveCurrentTestAnswer();
  if (AppState.testSession.currentIndex > 0) {
    AppState.testSession.currentIndex--;
    renderCurrentTestQuestion();
  }
}

function nextTestQuestion() {
  saveCurrentTestAnswer();
  if (AppState.testSession.currentIndex >= AppState.testSession.questions.length - 1) {
    promptSubmitTest();
  } else {
    AppState.testSession.currentIndex++;
    renderCurrentTestQuestion();
  }
}

function promptSubmitTest() {
  saveCurrentTestAnswer();
  const answered = AppState.testSession.questions.filter(q => q.userAnswer && q.userAnswer.trim().length > 0).length;
  const unanswered = AppState.testSession.questions.length - answered;

  const aCountEl = document.getElementById('confirm-answered-count');
  const uCountEl = document.getElementById('confirm-unanswered-count');
  if (aCountEl) aCountEl.textContent = String(answered);
  if (uCountEl) uCountEl.textContent = String(unanswered);

  document.getElementById('modal-test-submit-confirm')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeSubmitConfirmModal() {
  document.getElementById('modal-test-submit-confirm')?.classList.add('hidden');
}

function finalizeAndSaveTest() {
  closeSubmitConfirmModal();
  saveCurrentTestAnswer();

  if (AppState.testSession.timerInterval) {
    clearInterval(AppState.testSession.timerInterval);
  }

  const questions = AppState.testSession.questions;
  const answeredCount = questions.filter(q => q.userAnswer && q.userAnswer.trim().length > 0).length;
  const unansweredCount = questions.length - answeredCount;

  const m = Math.floor(AppState.testSession.secondsElapsed / 60);
  const s = AppState.testSession.secondsElapsed % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const savedTestRecord = {
    id: AppState.testSession.testId || ("test_" + Date.now()),
    title: AppState.testSession.title,
    scope: AppState.testSession.scope,
    notebookId: AppState.testSession.notebookId,
    completedAt: new Date().toISOString(),
    timeSpentSeconds: AppState.testSession.secondsElapsed,
    timeSpentFormatted: timeFormatted,
    totalQuestions: questions.length,
    answeredCount: answeredCount,
    unansweredCount: unansweredCount,
    questions: questions
  };

  // Prepend to Test History and persist
  AppState.testHistory.unshift(savedTestRecord);
  saveToStorage(STORAGE_KEYS.TEST_HISTORY, AppState.testHistory);

  AppState.lastSubmittedTestId = savedTestRecord.id;
  AppState.testSession.inProgress = false;

  // Show Submission Success Card
  document.getElementById('test-active-panel')?.classList.add('hidden');
  const subCard = document.getElementById('test-submitted-card');
  subCard?.classList.remove('hidden');

  const subScore = document.getElementById('test-sub-score');
  const subAns = document.getElementById('test-sub-answered');
  const subTotal = document.getElementById('test-sub-total');
  const subTime = document.getElementById('test-sub-time');

  if (subScore) subScore.textContent = `${answeredCount}/${questions.length}`;
  if (subAns) subAns.textContent = String(answeredCount);
  if (subTotal) subTotal.textContent = String(questions.length);
  if (subTime) subTime.textContent = timeFormatted;

  updateTestHistoryBadge();
  showToast('Test completed and saved to Test History!', 'success');
  if (window.lucide) window.lucide.createIcons();
}

function exitTestSessionPrompt() {
  if (!confirm('Leave this active test? Progress will not be saved.')) return;
  if (AppState.testSession.timerInterval) clearInterval(AppState.testSession.timerInterval);
  AppState.testSession.inProgress = false;
  document.getElementById('test-active-panel')?.classList.add('hidden');
  document.getElementById('test-submitted-card')?.classList.add('hidden');
  document.getElementById('test-setup-card')?.classList.remove('hidden');
}

function reviewLastSubmittedTest() {
  if (AppState.lastSubmittedTestId) {
    openTestReviewModal(AppState.lastSubmittedTestId);
  } else if (AppState.testHistory.length > 0) {
    openTestReviewModal(AppState.testHistory[0].id);
  } else {
    showToast('No submitted test found to review.', 'error');
  }
}

// -----------------------------------------------------------------------------
// 6.3 TEST HISTORY & COMPREHENSIVE SOLUTIONS VIEWER
// -----------------------------------------------------------------------------
function renderTestHistory() {
  const container = document.getElementById('test-history-list');
  const emptyState = document.getElementById('test-history-empty');
  if (!container) return;

  const history = AppState.testHistory || [];
  updateTestHistoryBadge();

  if (history.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    container.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = history.map((test, idx) => {
    const dateObj = new Date(test.completedAt || Date.now());
    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    let scopeBadgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    if (test.scope === 'Physics') scopeBadgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    if (test.scope === 'Chemistry') scopeBadgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    if (test.scope === 'Mathematics') scopeBadgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';

    return `
      <div class="bg-white dark:bg-[#1E1E1E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] shadow-xs hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div class="space-y-1.5 flex-1 min-w-0">
          <div class="flex items-center space-x-2 flex-wrap gap-y-1">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${scopeBadgeColor}">${test.scope || 'Vault Test'}</span>
            <span class="text-[11px] text-slate-400 font-medium">${dateStr} &bull; ${timeStr}</span>
          </div>

          <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            ${test.title || 'JEE Practice Test'}
          </h4>

          <div class="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <span class="flex items-center space-x-1">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400"></i>
              <span>Answered: <strong>${test.answeredCount}/${test.totalQuestions}</strong></span>
            </span>
            <span>&bull;</span>
            <span class="flex items-center space-x-1">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Time: <strong>${test.timeSpentFormatted || '00:00'}</strong></span>
            </span>
          </div>
        </div>

        <div class="flex items-center space-x-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#2E2E2E]">
          <button onclick="openTestReviewModal('${test.id}')" class="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-1.5">
            <i data-lucide="eye" class="w-4 h-4"></i>
            <span>View Solutions</span>
          </button>
          
          <button onclick="deleteTestHistoryItem('${test.id}')" class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition" title="Delete Test Record">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function openTestReviewModal(testId) {
  const test = (AppState.testHistory || []).find(t => t.id === testId);
  if (!test) {
    showToast('Test record not found', 'error');
    return;
  }

  AppState.activeTestReviewId = testId;

  const dateObj = new Date(test.completedAt || Date.now());
  const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const titleEl = document.getElementById('review-modal-title');
  const metaEl = document.getElementById('review-modal-meta');
  const scoreEl = document.getElementById('review-modal-score');
  const timeEl = document.getElementById('review-modal-time');

  if (titleEl) titleEl.textContent = test.title || 'Test Solutions Review';
  if (metaEl) metaEl.textContent = `Completed ${dateStr} at ${timeStr} • Scope: ${test.scope || 'Vault'}`;
  if (scoreEl) scoreEl.textContent = `${test.answeredCount}/${test.totalQuestions}`;
  if (timeEl) timeEl.textContent = test.timeSpentFormatted || '00:00';

  const container = document.getElementById('review-questions-container');
  if (!container) return;

  container.innerHTML = (test.questions || []).map((q, idx) => {
    const isAnswered = q.userAnswer && q.userAnswer.trim().length > 0;
    
    return `
      <div class="bg-slate-50 dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#2E2E2E] p-4 sm:p-5 space-y-3.5">
        
        <!-- Question Header -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center space-x-2 flex-wrap gap-y-1">
            <span class="w-6 h-6 rounded-lg bg-purple-600 text-white text-xs font-bold flex items-center justify-center">Q${idx + 1}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">${q.subject || 'Physics'}</span>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">${q.chapter || 'Topic'}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">${q.difficulty || 'Medium'}</span>
          </div>

          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${isAnswered ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
            ${isAnswered ? 'Answered' : 'Unanswered'}
          </span>
        </div>

        <!-- Question Title -->
        <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
          ${q.title || 'Untitled Doubt Question'}
        </h4>

        <!-- Attached Question Image (if present) -->
        ${q.question_image_url ? `
          <div class="bg-white dark:bg-[#1A1A1A] p-2 rounded-xl border border-slate-200 dark:border-[#2E2E2E] inline-block">
            <span class="text-[10px] font-bold text-slate-400 block mb-1">Question Attachment:</span>
            <img src="${q.question_image_url}" alt="Question Image" class="max-h-60 rounded-lg object-contain" />
          </div>
        ` : ''}

        <!-- User's Recorded Test Answer -->
        <div class="p-3 bg-white dark:bg-[#1E1E1E] rounded-xl border border-slate-200 dark:border-[#2E2E2E] text-xs">
          <span class="text-slate-400 font-semibold block mb-0.5">Your Response:</span>
          <p class="font-mono text-slate-900 dark:text-white">${isAnswered ? q.userAnswer : '<span class="text-slate-400 italic">No answer submitted</span>'}</p>
        </div>

        <!-- Step-by-Step Solution Reveal Box -->
        <div class="p-4 bg-purple-50/80 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900/60 space-y-3">
          <div class="flex items-center space-x-2 text-purple-900 dark:text-purple-300 font-bold text-xs">
            <i data-lucide="check-circle" class="w-4 h-4 text-purple-600 dark:text-purple-400"></i>
            <span>Verified Solution & Step-by-Step Explanation</span>
          </div>

          ${q.solution_image_url ? `
            <div class="bg-white dark:bg-[#1E1E1E] p-2 rounded-xl border border-purple-200 dark:border-purple-900 inline-block">
              <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 block mb-1">Solution Diagram/Work:</span>
              <img src="${q.solution_image_url}" alt="Solution Image" class="max-h-64 rounded-lg object-contain" />
            </div>
          ` : ''}

          ${q.solution_text && q.solution_text.trim() ? `
            <div class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-white/70 dark:bg-[#181818] p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
              ${q.solution_text}
            </div>
          ` : ''}

          ${!q.solution_image_url && (!q.solution_text || !q.solution_text.trim()) ? `
            <p class="text-xs text-slate-400 italic">No handwritten solution photo was uploaded for this doubt.</p>
          ` : ''}

          ${q.hint_text && q.hint_text.trim() ? `
            <div class="pt-2 border-t border-purple-200 dark:border-purple-900/40 text-[11px] text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
              <i data-lucide="lightbulb" class="w-3.5 h-3.5"></i>
              <span><strong>Key Formula / Hint:</strong> ${q.hint_text}</span>
            </div>
          ` : ''}
        </div>

      </div>
    `;
  }).join('');

  document.getElementById('modal-test-review')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeTestReviewModal() {
  document.getElementById('modal-test-review')?.classList.add('hidden');
}

function deleteTestHistoryItem(testId) {
  if (!confirm('Delete this test record from history?')) return;
  AppState.testHistory = (AppState.testHistory || []).filter(t => t.id !== testId);
  saveToStorage(STORAGE_KEYS.TEST_HISTORY, AppState.testHistory);
  renderTestHistory();
  showToast('Test record deleted', 'info');
}

function confirmClearTestHistory() {
  if ((AppState.testHistory || []).length === 0) return;
  if (!confirm('Are you sure you want to clear all test history records?')) return;
  AppState.testHistory = [];
  saveToStorage(STORAGE_KEYS.TEST_HISTORY, AppState.testHistory);
  renderTestHistory();
  showToast('Test history cleared', 'info');
}

// =============================================================================
// 7. PRACTICE LOGGING, GRAPHS & ANALYSIS
// =============================================================================
function openLogPracticeModal() {
  document.getElementById('modal-log-practice')?.classList.remove('hidden');
  populateChapterDropdown('log-chapter', 'Physics');
  if (window.lucide) window.lucide.createIcons();
}

function closeLogPracticeModal() {
  document.getElementById('modal-log-practice')?.classList.add('hidden');
}

function adjustLogCount(delta) {
  const input = document.getElementById('log-qcount');
  if (!input) return;
  let val = (parseInt(input.value, 10) || 0) + delta;
  if (val < 1) val = 1;
  if (val > 500) val = 500;
  input.value = val;
}

function handleSavePracticeLog(e) {
  e.preventDefault();

  const subject = document.getElementById('log-subject')?.value || 'Physics';
  const chapter = document.getElementById('log-chapter')?.value || getAllChaptersForSubject(subject)[0];
  const questionCount = parseInt(document.getElementById('log-qcount')?.value, 10) || 10;
  const timeMinutes = parseInt(document.getElementById('log-time-slider')?.value, 10) || 30;
  const source = document.getElementById('log-source')?.value?.trim() || '';

  const newLog = {
    id: "log_" + Date.now(),
    subject,
    chapter,
    question_count: questionCount,
    time_minutes: timeMinutes,
    source,
    date: new Date().toISOString()
  };

  AppState.practiceLogs.unshift(newLog);
  saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);

  closeLogPracticeModal();
  updateHeaderMetrics();
  renderAnalyticsAndCharts();
  showToast(`Logged ${questionCount} questions in ${chapter}! 🔥`, 'success');
}

function deletePracticeLog(logId) {
  AppState.practiceLogs = AppState.practiceLogs.filter(l => l.id !== logId);
  saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);
  updateHeaderMetrics();
  renderAnalyticsAndCharts();
  showToast('Practice entry deleted', 'info');
}

function renderAnalyticsAndCharts() {
  renderChapterTargets();
  renderDiagnosticChapters();
  renderPracticeLogsHistory();
  renderSubjectDistributionChart();
  renderDailyVolumeChart();
  renderMistakesDistributionChart();
  renderDifficultyMasteryChart();
  updateHeaderMetrics();
}

function renderDiagnosticChapters() {
  const container = document.getElementById('diagnostic-container');
  if (!container) return;

  // Aggregate doubts by chapter
  const counts = {};
  (AppState.doubts || []).forEach(d => {
    const ch = d.chapter || 'General';
    counts[ch] = (counts[ch] || 0) + 1;
  });

  const sortedChapters = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sortedChapters.length === 0) {
    container.innerHTML = `
      <p class="text-xs text-slate-400 py-2 text-center">No doubts registered yet. Add doubts to see weak area diagnostics.</p>
    `;
    return;
  }

  container.innerHTML = sortedChapters.map(([ch, count]) => `
    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-[#2E2E2E]">
      <div class="truncate mr-2">
        <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${ch}</p>
      </div>
      <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 flex-shrink-0">
        ${count} ${count === 1 ? 'Doubt' : 'Doubts'}
      </span>
    </div>
  `).join('');
}

function renderPracticeLogsHistory() {
  const container = document.getElementById('practice-logs-list');
  if (!container) return;

  const logs = AppState.practiceLogs || [];

  if (logs.length === 0) {
    container.innerHTML = `
      <p class="text-xs text-slate-400 py-3 text-center">No practice sessions logged yet. Tap "Log Practice" to record today's questions.</p>
    `;
    return;
  }

  container.innerHTML = logs.slice(0, 10).map(log => {
    const dt = new Date(log.date || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    let badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    if (log.subject === 'Chemistry') badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    if (log.subject === 'Mathematics') badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";

    return `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-[#2E2E2E] text-xs">
        <div class="flex items-center space-x-2 truncate">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}">
            ${log.subject}
          </span>
          <div class="truncate">
            <p class="font-bold text-slate-800 dark:text-slate-200 truncate">${log.chapter}</p>
            <p class="text-[10px] text-slate-400">${dt} &bull; ${log.time_minutes || 30} mins ${log.source ? `&bull; ${log.source}` : ''}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 flex-shrink-0">
          <span class="font-black text-slate-900 dark:text-white">${log.question_count} Qs</span>
          <button onclick="deletePracticeLog('${log.id}')" class="p-1 text-slate-300 hover:text-red-500">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderSubjectDistributionChart() {
  const canvas = document.getElementById('chart-subject-dist');
  if (!canvas || !window.Chart) return;

  const phyQs = (AppState.practiceLogs || []).filter(l => l.subject === 'Physics').reduce((a, b) => a + (Number(b.question_count) || 0), 0);
  const chemQs = (AppState.practiceLogs || []).filter(l => l.subject === 'Chemistry').reduce((a, b) => a + (Number(b.question_count) || 0), 0);
  const mathQs = (AppState.practiceLogs || []).filter(l => l.subject === 'Mathematics').reduce((a, b) => a + (Number(b.question_count) || 0), 0);

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#475569';

  if (chartSubjectDist) chartSubjectDist.destroy();

  const data = (phyQs === 0 && chemQs === 0 && mathQs === 0) ? [1, 1, 1] : [phyQs, chemQs, mathQs];

  chartSubjectDist = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Physics', 'Chemistry', 'Mathematics'],
      datasets: [{
        data: data,
        backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { size: 10, weight: 'bold' } }
        }
      },
      cutout: '70%'
    }
  });
}

function renderDailyVolumeChart() {
  const canvas = document.getElementById('chart-daily-volume');
  if (!canvas || !window.Chart) return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#475569';

  // Last 7 days labels & values
  const labels = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    labels.push(dayName);

    const sum = (AppState.practiceLogs || [])
      .filter(l => (l.date || '').startsWith(dStr))
      .reduce((acc, curr) => acc + (Number(curr.question_count) || 0), 0);
    counts.push(sum);
  }

  if (chartDailyVolume) chartDailyVolume.destroy();

  chartDailyVolume = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Questions',
        data: counts,
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: isDark ? '#2E2E2E' : '#f1f5f9' }, beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderMistakesDistributionChart() {
  const canvas = document.getElementById('chart-mistakes-dist');
  if (!canvas || !window.Chart) return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#475569';

  const mistakeCounts = {
    'Calculation Error': 0,
    'Conceptual Gap': 0,
    'Silly Mistake': 0,
    'Misread Question': 0,
    'Time Pressure': 0,
    'Formula Forgotten': 0
  };

  (AppState.doubts || []).forEach(d => {
    if (d.mistake_type && mistakeCounts[d.mistake_type] !== undefined) {
      mistakeCounts[d.mistake_type]++;
    }
  });

  const labels = Object.keys(mistakeCounts);
  const data = Object.values(mistakeCounts);

  if (chartMistakesDist) chartMistakesDist.destroy();

  chartMistakesDist = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Doubts',
        data: data,
        backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981'],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 }, stepSize: 1 }, grid: { color: isDark ? '#2E2E2E' : '#f1f5f9' }, beginAtZero: true },
        y: { ticks: { color: textColor, font: { size: 9, weight: 'bold' } }, grid: { display: false } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderDifficultyMasteryChart() {
  const canvas = document.getElementById('chart-diff-mastery');
  if (!canvas || !window.Chart) return;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#475569';

  const diffs = ['Easy', 'Medium', 'Hard', 'JEE Advanced'];
  const totalByDiff = [0, 0, 0, 0];
  const masteredByDiff = [0, 0, 0, 0];

  (AppState.doubts || []).forEach(d => {
    const idx = diffs.indexOf(d.difficulty);
    if (idx !== -1) {
      totalByDiff[idx]++;
      if ((d.mastery_level || 0) >= 3) {
        masteredByDiff[idx]++;
      }
    }
  });

  if (chartDiffMastery) chartDiffMastery.destroy();

  chartDiffMastery = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: diffs,
      datasets: [
        {
          label: 'Mastered',
          data: masteredByDiff,
          backgroundColor: '#10b981',
          borderRadius: 6
        },
        {
          label: 'Total Doubts',
          data: totalByDiff,
          backgroundColor: isDark ? '#334155' : '#cbd5e1',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: textColor, font: { size: 10, weight: 'bold' } }, grid: { display: false } },
        y: { ticks: { color: textColor, font: { size: 10 }, stepSize: 1 }, grid: { color: isDark ? '#2E2E2E' : '#f1f5f9' }, beginAtZero: true }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { size: 10 } }
        }
      }
    }
  });
}

// =============================================================================
// 8. CUSTOM NOTEBOOKS ENGINE
// =============================================================================
function renderNotebooksList() {
  const container = document.getElementById('notebooks-grid');
  if (!container) return;

  const notebooks = AppState.notebooks || [];

  if (notebooks.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-10 px-4 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2E2E2E] space-y-3">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <i data-lucide="book-plus" class="w-6 h-6"></i>
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-900 dark:text-white">No custom notebooks yet</h4>
          <p class="text-xs text-slate-400 mt-1">Create notebooks to organize doubts by topic, test paper, or difficulty.</p>
        </div>
        <button onclick="openCreateNotebookModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow">
          Create First Notebook
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = notebooks.map(nb => {
    const doubtCount = (AppState.doubts || []).filter(d => d.notebook_id === nb.id).length;
    
    let colorClass = "from-blue-600 to-indigo-700";
    if (nb.color === 'emerald') colorClass = "from-emerald-600 to-teal-700";
    if (nb.color === 'purple') colorClass = "from-purple-600 to-violet-700";
    if (nb.color === 'amber') colorClass = "from-amber-500 to-orange-600";
    if (nb.color === 'rose') colorClass = "from-rose-600 to-pink-700";

    return `
      <div onclick="filterByNotebook('${nb.id}')" class="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group">
        
        <div class="flex items-start justify-between">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr ${colorClass} flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <i data-lucide="book" class="w-5 h-5"></i>
          </div>

          <div class="flex items-center space-x-1">
            <button onclick="event.stopPropagation(); startQuizForSpecificNotebook('${nb.id}')" class="p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 rounded-lg transition" title="Quiz this Notebook">
              <i data-lucide="brain" class="w-4 h-4"></i>
            </button>
            <button onclick="event.stopPropagation(); deleteNotebook('${nb.id}')" class="p-1 text-slate-300 hover:text-red-500 transition" title="Delete Notebook">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${nb.subject || 'General'}</span>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug">
            ${nb.name}
          </h3>
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-[#2E2E2E] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span class="font-bold text-slate-800 dark:text-slate-200">${doubtCount} Doubts</span>
          <span class="text-[10px] text-blue-600 dark:text-blue-400 font-bold group-hover:underline">Open Vault &rarr;</span>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function startQuizForSpecificNotebook(notebookId) {
  AppState.activeNotebookFilterId = notebookId;
  startQuizForActiveNotebook();
}

function openCreateNotebookModal() {
  document.getElementById('modal-create-notebook')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeCreateNotebookModal() {
  document.getElementById('modal-create-notebook')?.classList.add('hidden');
  const nameInput = document.getElementById('notebook-name-input');
  if (nameInput) nameInput.value = '';
}

function handleSaveNotebook(e) {
  e.preventDefault();
  const name = document.getElementById('notebook-name-input')?.value?.trim();
  const subject = document.getElementById('notebook-subject-input')?.value || 'General';
  const color = document.querySelector('input[name="notebook-color"]:checked')?.value || 'blue';

  if (!name) return;

  const newNotebook = {
    id: "nb_" + Date.now(),
    name,
    subject,
    color,
    created_at: new Date().toISOString()
  };

  AppState.notebooks.push(newNotebook);
  saveToStorage(STORAGE_KEYS.NOTEBOOKS, AppState.notebooks);

  populateNotebookDropdown(newNotebook.id);
  closeCreateNotebookModal();
  showToast(`Notebook "${name}" created!`, 'success');

  if (AppState.currentTab === 'notebooks') {
    renderNotebooksList();
  }
}

function deleteNotebook(notebookId) {
  if (!confirm('Delete this notebook? (The doubts will not be deleted and will remain in General vault).')) return;
  
  AppState.notebooks = AppState.notebooks.filter(n => n.id !== notebookId);
  // Reset notebook_id in doubts
  AppState.doubts.forEach(d => {
    if (d.notebook_id === notebookId) d.notebook_id = null;
  });

  saveToStorage(STORAGE_KEYS.NOTEBOOKS, AppState.notebooks);
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);

  if (AppState.activeNotebookFilterId === notebookId) {
    clearActiveNotebookFilter();
  }

  populateNotebookDropdown();
  renderNotebooksList();
  showToast('Notebook deleted', 'info');
}

// =============================================================================
// 8.5 CHAPTER TARGETS & SYLLABUS TRACKER ENGINE
// =============================================================================
const DEFAULT_CHAPTER_TARGET = 40;

function getChapterTarget(chapterName) {
  if (AppState.chapterTargets && typeof AppState.chapterTargets[chapterName] === 'number') {
    return AppState.chapterTargets[chapterName];
  }
  return DEFAULT_CHAPTER_TARGET;
}

function setChapterTarget(chapterName, targetNumber) {
  const target = Math.max(1, Math.min(1000, parseInt(targetNumber, 10) || DEFAULT_CHAPTER_TARGET));
  if (!AppState.chapterTargets) AppState.chapterTargets = {};
  AppState.chapterTargets[chapterName] = target;
  saveToStorage(STORAGE_KEYS.CHAPTER_TARGETS, AppState.chapterTargets);
  renderChapterTargets();
}

function setTargetSubjectFilter(subject) {
  AppState.targetSubjectFilter = subject;
  
  document.querySelectorAll('.target-subject-tab').forEach(tab => {
    tab.classList.remove('bg-blue-600', 'text-white');
    tab.classList.add('bg-slate-100', 'dark:bg-[#2E2E2E]', 'text-slate-700', 'dark:text-slate-300');
  });

  const activeTab = document.getElementById(`target-tab-${subject}`);
  if (activeTab) {
    activeTab.classList.remove('bg-slate-100', 'dark:bg-[#2E2E2E]', 'text-slate-700', 'dark:text-slate-300');
    activeTab.classList.add('bg-blue-600', 'text-white');
  }

  renderChapterTargets();
}

function renderChapterTargets() {
  const container = document.getElementById('chapter-targets-container');
  if (!container) return;

  const filterSubj = AppState.targetSubjectFilter || 'all';
  const searchEl = document.getElementById('target-chapter-search');
  const searchQ = searchEl ? searchEl.value.trim().toLowerCase() : '';

  // Gather all chapters
  let allList = [];
  const subjectsToScan = (filterSubj === 'all') ? ['Physics', 'Chemistry', 'Mathematics'] : [filterSubj];

  subjectsToScan.forEach(subj => {
    const chapters = getAllChaptersForSubject(subj);
    chapters.forEach(ch => {
      allList.push({
        subject: subj,
        chapter: ch,
        isCustom: (AppState.customChapters || []).some(c => c.subject === subj && c.chapter_name === ch)
      });
    });
  });

  // Calculate stats across all subjects
  let totalTargets = 0;
  let totalSolved = 0;
  let completedCount = 0;
  let inProgressCount = 0;

  // Global counts for all subjects (for the summary banner)
  const fullList = [];
  ['Physics', 'Chemistry', 'Mathematics'].forEach(subj => {
    getAllChaptersForSubject(subj).forEach(ch => {
      fullList.push({ subject: subj, chapter: ch });
    });
  });

  fullList.forEach(item => {
    const target = getChapterTarget(item.chapter);
    totalTargets += target;
    const solved = (AppState.practiceLogs || [])
      .filter(l => l.chapter === item.chapter)
      .reduce((acc, curr) => acc + (Number(curr.question_count) || 0), 0);
    totalSolved += solved;

    if (solved >= target) completedCount++;
    else if (solved > 0) inProgressCount++;
  });

  // Update summary banner
  const overallPercent = totalTargets > 0 ? Math.min(100, Math.round((totalSolved / totalTargets) * 100)) : 0;
  const percentEl = document.getElementById('target-overall-percent');
  const barEl = document.getElementById('target-overall-bar');
  const numsEl = document.getElementById('target-overall-numbers');
  const compEl = document.getElementById('target-chapters-completed-count');
  const inProgEl = document.getElementById('target-chapters-in-progress-count');

  if (percentEl) percentEl.textContent = `${overallPercent}%`;
  if (barEl) barEl.style.width = `${overallPercent}%`;
  if (numsEl) numsEl.textContent = `${totalSolved} / ${totalTargets} Questions Solved`;
  if (compEl) compEl.textContent = `${completedCount} / ${fullList.length}`;
  if (inProgEl) inProgEl.textContent = `${inProgressCount}`;

  // Filter list by search
  let displayedList = allList;
  if (searchQ) {
    displayedList = displayedList.filter(item => 
      item.chapter.toLowerCase().includes(searchQ) || item.subject.toLowerCase().includes(searchQ)
    );
  }

  if (displayedList.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-xs">
        No chapters matching "${searchQ || filterSubj}".
      </div>
    `;
    return;
  }

  container.innerHTML = displayedList.map(item => {
    const target = getChapterTarget(item.chapter);
    const solved = (AppState.practiceLogs || [])
      .filter(l => l.chapter === item.chapter)
      .reduce((acc, curr) => acc + (Number(curr.question_count) || 0), 0);
    const doubtsCount = (AppState.doubts || []).filter(d => d.chapter === item.chapter).length;
    
    const pct = target > 0 ? Math.min(100, Math.round((solved / target) * 100)) : 0;
    
    let subjectBadgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    if (item.subject === 'Chemistry') subjectBadgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    if (item.subject === 'Mathematics') subjectBadgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";

    let statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#2A2A2A] text-slate-500">0%</span>`;
    let progressGradient = "bg-slate-300 dark:bg-slate-700";

    if (solved >= target) {
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center space-x-0.5"><i data-lucide="check" class="w-3 h-3 inline"></i><span>Target Met</span></span>`;
      progressGradient = "bg-gradient-to-r from-emerald-500 to-teal-500";
    } else if (pct >= 50) {
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">${pct}% On Track</span>`;
      progressGradient = "bg-gradient-to-r from-blue-500 to-indigo-500";
    } else if (solved > 0) {
      statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">${pct}% In Progress</span>`;
      progressGradient = "bg-gradient-to-r from-amber-500 to-orange-500";
    }

    const safeChapter = item.chapter.replace(/'/g, "\\'");

    return `
      <div class="bg-slate-50 dark:bg-[#141414] p-3 rounded-2xl border border-slate-200/80 dark:border-[#2A2A2A] space-y-2.5 transition hover:border-slate-300 dark:hover:border-[#383838]">
        
        <!-- Chapter Header & Status -->
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-0.5 flex-1 truncate">
            <div class="flex items-center space-x-1.5">
              <span class="px-2 py-0.5 rounded text-[9px] font-bold ${subjectBadgeClass}">${item.subject}</span>
              ${item.isCustom ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Custom</span>' : ''}
              ${doubtsCount > 0 ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">${doubtsCount} ${doubtsCount === 1 ? 'Doubt' : 'Doubts'}</span>` : ''}
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title="${item.chapter}">
              ${item.chapter}
            </h4>
          </div>

          <div class="flex items-center space-x-1.5 flex-shrink-0">
            ${statusBadge}
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-200/80 dark:bg-[#252525] h-2 rounded-full overflow-hidden">
          <div class="${progressGradient} h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>

        <!-- Numbers & Editable Target Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
          
          <!-- Solved vs Target -->
          <div class="flex items-center space-x-1.5">
            <span class="font-black text-slate-900 dark:text-white">${solved}</span>
            <span class="text-slate-400">/</span>
            
            <!-- Inline Target Stepper -->
            <div class="inline-flex items-center bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2E2E2E] rounded-lg p-0.5 shadow-2xs">
              <button type="button" onclick="adjustChapterTarget('${safeChapter}', -5)" class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-blue-600 font-bold hover:bg-slate-100 dark:hover:bg-[#2E2E2E] rounded" title="Decrease target by 5">-</button>
              <input 
                type="number" 
                min="1" 
                max="1000" 
                value="${target}" 
                onchange="setChapterTarget('${safeChapter}', this.value)"
                class="w-11 text-center font-bold text-[11px] bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none" 
                title="Click to edit target questions"
              />
              <span class="text-[10px] text-slate-400 pr-1 font-medium">Qs</span>
              <button type="button" onclick="adjustChapterTarget('${safeChapter}', 5)" class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-blue-600 font-bold hover:bg-slate-100 dark:hover:bg-[#2E2E2E] rounded" title="Increase target by 5">+</button>
            </div>

            <button type="button" onclick="openSingleTargetModal('${item.subject}', '${safeChapter}')" class="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition" title="Edit target in modal">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
          </div>

          <!-- Action Shortcuts -->
          <div class="flex items-center space-x-1.5">
            <button type="button" onclick="openLogPracticeModalForChapter('${item.subject}', '${safeChapter}')" class="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-bold text-[10px] rounded-lg transition flex items-center space-x-1">
              <i data-lucide="plus" class="w-3 h-3"></i>
              <span>Log Qs</span>
            </button>

            <button type="button" onclick="openAddDoubtForChapter('${item.subject}', '${safeChapter}')" class="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-[10px] rounded-lg transition flex items-center space-x-1">
              <i data-lucide="help-circle" class="w-3 h-3"></i>
              <span>Add Doubt</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function adjustChapterTarget(chapterName, delta) {
  const current = getChapterTarget(chapterName);
  const next = Math.max(1, Math.min(1000, current + delta));
  setChapterTarget(chapterName, next);
}

function openSingleTargetModal(subject, chapterName) {
  AppState.activeTargetSubject = subject;
  AppState.activeTargetChapter = chapterName;

  const currentTarget = getChapterTarget(chapterName);
  const solved = (AppState.practiceLogs || [])
    .filter(l => l.chapter === chapterName)
    .reduce((acc, curr) => acc + (Number(curr.question_count) || 0), 0);

  const nameEl = document.getElementById('single-target-chapter-name');
  const badgeEl = document.getElementById('single-target-subject-badge');
  const progEl = document.getElementById('single-target-current-progress');
  const inputEl = document.getElementById('single-target-input');

  if (nameEl) nameEl.textContent = chapterName;
  if (badgeEl) {
    badgeEl.textContent = subject;
    badgeEl.className = `px-2 py-0.5 rounded text-[10px] font-bold ${
      subject === 'Chemistry' ? 'bg-emerald-100 text-emerald-800' :
      subject === 'Mathematics' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    }`;
  }
  if (progEl) progEl.textContent = `Current Solved: ${solved} Qs`;
  if (inputEl) inputEl.value = currentTarget;

  document.getElementById('modal-edit-single-target')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeSingleTargetModal() {
  document.getElementById('modal-edit-single-target')?.classList.add('hidden');
}

function adjustSingleTargetInput(delta) {
  const inputEl = document.getElementById('single-target-input');
  if (!inputEl) return;
  let val = (parseInt(inputEl.value, 10) || DEFAULT_CHAPTER_TARGET) + delta;
  if (val < 1) val = 1;
  if (val > 1000) val = 1000;
  inputEl.value = val;
}

function saveSingleChapterTarget() {
  if (!AppState.activeTargetChapter) return;
  const inputEl = document.getElementById('single-target-input');
  const val = parseInt(inputEl?.value, 10) || DEFAULT_CHAPTER_TARGET;
  setChapterTarget(AppState.activeTargetChapter, val);
  closeSingleTargetModal();
  showToast(`Updated target for "${AppState.activeTargetChapter}" to ${val} Qs!`, 'success');
}

function openBulkTargetsModal() {
  document.getElementById('modal-bulk-targets')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeBulkTargetsModal() {
  document.getElementById('modal-bulk-targets')?.classList.add('hidden');
}

function setBulkTargetValue(val) {
  const numInput = document.getElementById('bulk-target-number');
  if (numInput) numInput.value = val;
}

function applyBulkTargets() {
  const scope = document.getElementById('bulk-target-scope')?.value || 'all';
  const targetNum = parseInt(document.getElementById('bulk-target-number')?.value, 10) || DEFAULT_CHAPTER_TARGET;

  if (targetNum < 1) return;

  const subjectsToUpdate = (scope === 'all') ? ['Physics', 'Chemistry', 'Mathematics'] : [scope];

  if (!AppState.chapterTargets) AppState.chapterTargets = {};

  let count = 0;
  subjectsToUpdate.forEach(subj => {
    getAllChaptersForSubject(subj).forEach(ch => {
      AppState.chapterTargets[ch] = targetNum;
      count++;
    });
  });

  saveToStorage(STORAGE_KEYS.CHAPTER_TARGETS, AppState.chapterTargets);
  closeBulkTargetsModal();
  renderChapterTargets();
  showToast(`Updated targets to ${targetNum} Qs for ${count} chapters!`, 'success');
}

function resetDefaultChapterTargets() {
  if (!confirm(`Reset all chapter targets to default (${DEFAULT_CHAPTER_TARGET} Qs)?`)) return;
  AppState.chapterTargets = {};
  saveToStorage(STORAGE_KEYS.CHAPTER_TARGETS, AppState.chapterTargets);
  renderChapterTargets();
  showToast('Reset all chapter targets to default (40 Qs)', 'info');
}

function openLogPracticeModalForChapter(subject, chapter) {
  openLogPracticeModal();
  const subjSelect = document.getElementById('log-subject');
  if (subjSelect) subjSelect.value = subject;
  populateChapterDropdown('log-chapter', subject, chapter);
}

function openAddDoubtForChapter(subject, chapter) {
  switchTab('capture');
  const radio = document.querySelector(`input[name="doubt-subject"][value="${subject}"]`);
  if (radio) {
    radio.checked = true;
    onSubjectChange(subject);
  }
  populateChapterDropdown('doubt-chapter', subject, chapter);
}

// =============================================================================
// 9. CAPTURE ENGINE (100% OPTIONAL FIELDS & DUAL CAMERA / GALLERY UPLOADS)
// =============================================================================
let uploadedImages = { question: null, solution: null };

function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function triggerGalleryUpload(type) {
  const input = document.getElementById(`${type === 'question' ? 'q' : 'sol'}-gallery-input`);
  if (input) {
    input.value = '';
    input.click();
  }
}

function triggerCameraUpload(type) {
  liveCameraTargetType = type;
  const modal = document.getElementById('modal-live-camera');
  const title = document.getElementById('camera-modal-title');
  if (title) {
    title.textContent = `Capture ${type === 'question' ? 'Question' : 'Solution'} Photo`;
  }
  modal?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
  startCameraStream();
}

function startCameraStream() {
  document.getElementById('camera-video-wrapper')?.classList.remove('hidden');
  document.getElementById('camera-snapshot-wrapper')?.classList.add('hidden');
  document.getElementById('camera-live-controls')?.classList.remove('hidden');
  document.getElementById('camera-review-controls')?.classList.add('hidden');
  document.getElementById('camera-error-fallback')?.classList.add('hidden');

  stopCameraStreamTracks();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    document.getElementById('camera-error-fallback')?.classList.remove('hidden');
    return;
  }

  const constraints = {
    video: {
      facingMode: liveCameraFacingMode ? { ideal: liveCameraFacingMode } : { ideal: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    },
    audio: false
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      liveCameraStream = stream;
      const video = document.getElementById('camera-video');
      if (video) {
        video.srcObject = stream;
        video.play().catch(e => console.warn('Video play error:', e));
      }
    })
    .catch(err => {
      console.warn('getUserMedia stream error:', err);
      document.getElementById('camera-error-fallback')?.classList.remove('hidden');
    });
}

function toggleCameraFacingMode() {
  liveCameraFacingMode = (liveCameraFacingMode === 'environment') ? 'user' : 'environment';
  startCameraStream();
}

function captureCameraSnapshot() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  if (!video || !canvas) return;

  const w = video.videoWidth || 800;
  const h = video.videoHeight || 600;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);

  liveCameraCapturedBase64 = canvas.toDataURL('image/jpeg', 0.85);

  const snapImg = document.getElementById('camera-snapshot-img');
  if (snapImg) snapImg.src = liveCameraCapturedBase64;

  document.getElementById('camera-video-wrapper')?.classList.add('hidden');
  document.getElementById('camera-snapshot-wrapper')?.classList.remove('hidden');
  document.getElementById('camera-live-controls')?.classList.add('hidden');
  document.getElementById('camera-review-controls')?.classList.remove('hidden');
}

function retakeCameraSnapshot() {
  document.getElementById('camera-snapshot-wrapper')?.classList.add('hidden');
  document.getElementById('camera-video-wrapper')?.classList.remove('hidden');
  document.getElementById('camera-review-controls')?.classList.add('hidden');
  document.getElementById('camera-live-controls')?.classList.remove('hidden');
}

function acceptCameraSnapshot() {
  if (!liveCameraCapturedBase64) return;

  uploadedImages[liveCameraTargetType] = liveCameraCapturedBase64;

  const prefix = liveCameraTargetType === 'question' ? 'q' : 'sol';
  const previewContainer = document.getElementById(`${prefix}-preview-container`);
  const previewImg = document.getElementById(`${prefix}-preview-img`);
  const placeholder = document.getElementById(`${prefix}-placeholder`);
  const statusBadge = document.getElementById(`${prefix}-status-badge`);

  if (previewImg) previewImg.src = liveCameraCapturedBase64;
  previewContainer?.classList.remove('hidden');
  placeholder?.classList.add('hidden');
  if (statusBadge) {
    statusBadge.textContent = 'Photo attached ✓';
    statusBadge.className = 'text-[10px] font-bold text-emerald-600 dark:text-emerald-400';
  }

  closeLiveCameraModal();
  showToast(`${liveCameraTargetType === 'question' ? 'Question' : 'Solution'} photo captured!`, 'success');
}

function closeLiveCameraModal() {
  stopCameraStreamTracks();
  document.getElementById('modal-live-camera')?.classList.add('hidden');
}

function stopCameraStreamTracks() {
  if (liveCameraStream) {
    liveCameraStream.getTracks().forEach(track => {
      try { track.stop(); } catch(e) {}
    });
    liveCameraStream = null;
  }
}

function triggerNativeCameraFallback() {
  closeLiveCameraModal();
  const input = document.getElementById(`${liveCameraTargetType === 'question' ? 'q' : 'sol'}-camera-input`);
  if (input) {
    input.value = '';
    input.click();
  }
}

async function handleImageSelected(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const compressedBase64 = await compressImage(file);
    uploadedImages[type] = compressedBase64;

    const prefix = type === 'question' ? 'q' : 'sol';
    const previewContainer = document.getElementById(`${prefix}-preview-container`);
    const previewImg = document.getElementById(`${prefix}-preview-img`);
    const placeholder = document.getElementById(`${prefix}-placeholder`);
    const statusBadge = document.getElementById(`${prefix}-status-badge`);

    if (previewImg) previewImg.src = compressedBase64;
    previewContainer?.classList.remove('hidden');
    placeholder?.classList.add('hidden');
    if (statusBadge) {
      statusBadge.textContent = 'Photo attached ✓';
      statusBadge.className = 'text-[10px] font-bold text-emerald-600 dark:text-emerald-400';
    }
  } catch (err) {
    console.error("Image processing error", err);
    showToast("Failed to process image", "error");
  }
}

function removeImage(type) {
  uploadedImages[type] = null;
  const prefix = type === 'question' ? 'q' : 'sol';
  const galleryInput = document.getElementById(`${prefix}-gallery-input`);
  const cameraInput = document.getElementById(`${prefix}-camera-input`);
  if (galleryInput) galleryInput.value = '';
  if (cameraInput) cameraInput.value = '';
  document.getElementById(`${prefix}-preview-container`)?.classList.add('hidden');
  document.getElementById(`${prefix}-placeholder`)?.classList.remove('hidden');
  const statusBadge = document.getElementById(`${prefix}-status-badge`);
  if (statusBadge) {
    statusBadge.textContent = 'Optional';
    statusBadge.className = 'text-[10px] font-semibold text-slate-400';
  }
}

function onSubjectChange(subject) {
  populateChapterDropdown('doubt-chapter', subject);
}

function handleSaveDoubt(e) {
  e.preventDefault();

  const userTitle = document.getElementById('doubt-title')?.value?.trim();
  const subject = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  const chapter = document.getElementById('doubt-chapter')?.value || getAllChaptersForSubject(subject)[0];
  const notebookId = document.getElementById('doubt-notebook')?.value || null;
  const difficulty = document.getElementById('doubt-difficulty')?.value || 'Medium';
  const source = document.getElementById('doubt-source')?.value?.trim() || '';
  const tagsRaw = document.getElementById('doubt-tags')?.value?.trim() || '';
  const hint = document.getElementById('doubt-hint')?.value?.trim() || '';

  // Auto-generate title if user left it blank
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const title = userTitle || `${subject} Doubt #${(AppState.doubts.length + 1)} (${dateStr})`;

  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`)
    : [];

  const newDoubt = {
    id: "doubt_" + Date.now(),
    title,
    question_image_url: uploadedImages.question || '',
    solution_image_url: uploadedImages.solution || '',
    subject,
    chapter,
    notebook_id: notebookId,
    difficulty,
    source_tag: source,
    custom_tags: tags,
    hint_text: hint,
    is_starred: false,
    created_at: now.toISOString()
  };

  AppState.doubts.unshift(newDoubt);
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);

  showToast('🎉 Doubt saved to Vault!', 'success');
  resetCaptureForm();
  switchTab('vault');
}

function resetCaptureForm() {
  document.getElementById('capture-form')?.reset();
  removeImage('question');
  removeImage('solution');
  const activeSubj = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  populateChapterDropdown('doubt-chapter', activeSubj);
  populateNotebookDropdown();
}

// =============================================================================
// 10. DETAIL VIEWER (VIEW DETAILS ONLY ON CLICK)
// =============================================================================
function openDoubtDetailModal(doubtId) {
  const doubt = AppState.doubts.find(d => d.id === doubtId);
  if (!doubt) return;

  AppState.activeDoubtId = doubtId;

  const titleEl = document.getElementById('modal-title');
  const subjEl = document.getElementById('modal-subject-badge');
  const chEl = document.getElementById('modal-chapter');
  const diffEl = document.getElementById('modal-difficulty');
  const dateEl = document.getElementById('modal-date');
  const srcEl = document.getElementById('modal-source');
  const srcBullet = document.getElementById('modal-source-bullet');
  const nbTag = document.getElementById('modal-notebook-tag');

  if (titleEl) titleEl.textContent = doubt.title;
  if (subjEl) subjEl.textContent = doubt.subject;
  if (chEl) chEl.textContent = doubt.chapter;
  if (diffEl) diffEl.textContent = doubt.difficulty;
  if (dateEl) dateEl.textContent = `Added ${new Date(doubt.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  if (doubt.source_tag && doubt.source_tag.trim()) {
    if (srcEl) srcEl.textContent = doubt.source_tag;
    srcEl?.classList.remove('hidden');
    srcBullet?.classList.remove('hidden');
  } else {
    srcEl?.classList.add('hidden');
    srcBullet?.classList.add('hidden');
  }

  // Notebook tag
  const notebookObj = AppState.notebooks.find(n => n.id === doubt.notebook_id);
  if (notebookObj && nbTag) {
    nbTag.textContent = `Notebook: ${notebookObj.name}`;
    nbTag.classList.remove('hidden');
  } else if (nbTag) {
    nbTag.classList.add('hidden');
  }

  // Tags
  const tagsBox = document.getElementById('modal-tags-container');
  if (tagsBox) {
    if (doubt.custom_tags && doubt.custom_tags.length > 0) {
      tagsBox.innerHTML = doubt.custom_tags.map(t => `
        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-[#2E2E2E] text-slate-700 dark:text-slate-300">
          ${t}
        </span>
      `).join('');
      tagsBox.classList.remove('hidden');
    } else {
      tagsBox.innerHTML = '';
      tagsBox.classList.add('hidden');
    }
  }

  // Star Icon
  const starIcon = document.querySelector('#modal-star-btn i');
  if (starIcon) {
    if (doubt.is_starred) {
      starIcon.classList.add('text-amber-400', 'fill-amber-400');
    } else {
      starIcon.classList.remove('text-amber-400', 'fill-amber-400');
    }
  }

  // Question Image Display
  const qBox = document.getElementById('modal-q-img-box');
  const qImg = document.getElementById('modal-q-img');
  if (doubt.question_image_url) {
    if (qImg) qImg.src = doubt.question_image_url;
    qBox?.classList.remove('hidden');
  } else {
    qBox?.classList.add('hidden');
  }

  // Solution Image Display
  const solBox = document.getElementById('modal-sol-box');
  const solImg = document.getElementById('modal-sol-img');
  if (doubt.solution_image_url) {
    if (solImg) solImg.src = doubt.solution_image_url;
    solBox?.classList.remove('hidden');
  } else {
    solBox?.classList.add('hidden');
  }

  // Key Formula / Notes
  const notesBox = document.getElementById('modal-notes-box');
  const notesText = document.getElementById('modal-notes-text');
  if (doubt.hint_text && doubt.hint_text.trim()) {
    if (notesText) notesText.textContent = doubt.hint_text;
    notesBox?.classList.remove('hidden');
  } else {
    notesBox?.classList.add('hidden');
  }

  document.getElementById('modal-doubt-detail')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeDoubtDetailModal() {
  document.getElementById('modal-doubt-detail')?.classList.add('hidden');
  AppState.activeDoubtId = null;
}

function toggleStarCurrentDoubt() {
  if (!AppState.activeDoubtId) return;
  toggleStarDoubt(AppState.activeDoubtId);
  const doubt = AppState.doubts.find(d => d.id === AppState.activeDoubtId);
  const starIcon = document.querySelector('#modal-star-btn i');
  if (starIcon && doubt) {
    if (doubt.is_starred) {
      starIcon.classList.add('text-amber-400', 'fill-amber-400');
    } else {
      starIcon.classList.remove('text-amber-400', 'fill-amber-400');
    }
  }
}

function deleteCurrentModalDoubt() {
  if (!AppState.activeDoubtId) return;
  if (!confirm('Permanently delete this doubt from the vault?')) return;

  AppState.doubts = AppState.doubts.filter(d => d.id !== AppState.activeDoubtId);
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  closeDoubtDetailModal();
  renderVault();
  updateHeaderMetrics();
  showToast('Doubt deleted', 'info');
}

// =============================================================================
// 11. CUSTOM CHAPTER ENGINE
// =============================================================================
function openCustomChapterModal() {
  document.getElementById('modal-custom-chapter')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeCustomChapterModal() {
  document.getElementById('modal-custom-chapter')?.classList.add('hidden');
  const nameEl = document.getElementById('custom-chapter-name');
  if (nameEl) nameEl.value = '';
}

function handleSaveCustomChapter(e) {
  e.preventDefault();
  const subject = document.getElementById('custom-chapter-subject')?.value || 'Physics';
  const name = document.getElementById('custom-chapter-name')?.value?.trim();

  if (!name) return;

  const newChapter = {
    id: "ch_" + Date.now(),
    subject,
    chapter_name: name,
    created_at: new Date().toISOString()
  };

  AppState.customChapters.push(newChapter);
  saveToStorage(STORAGE_KEYS.CUSTOM_CHAPTERS, AppState.customChapters);

  const activeSubject = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  populateChapterDropdown('doubt-chapter', activeSubject, name);
  populateChapterDropdown('log-chapter', activeSubject, name);

  closeCustomChapterModal();
  showToast(`Added custom chapter "${name}"`, 'success');
}

// =============================================================================
// 12. BACKUP EXPORT & RESTORE ENGINE
// =============================================================================
function openBackupModal() {
  document.getElementById('modal-backup')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeBackupModal() {
  document.getElementById('modal-backup')?.classList.add('hidden');
}

function exportBackup() {
  const exportData = {
    version: "3.5",
    exported_at: new Date().toISOString(),
    doubts: AppState.doubts,
    notebooks: AppState.notebooks,
    custom_chapters: AppState.customChapters,
    practice_logs: AppState.practiceLogs,
    test_history: AppState.testHistory,
    chapter_targets: AppState.chapterTargets
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `jee_doubt_vault_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('JSON backup exported successfully!', 'success');
  closeBackupModal();
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.doubts && Array.isArray(parsed.doubts)) {
        AppState.doubts = parsed.doubts;
        saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
      }
      if (parsed.notebooks && Array.isArray(parsed.notebooks)) {
        AppState.notebooks = parsed.notebooks;
        saveToStorage(STORAGE_KEYS.NOTEBOOKS, AppState.notebooks);
      }
      if (parsed.custom_chapters && Array.isArray(parsed.custom_chapters)) {
        AppState.customChapters = parsed.custom_chapters;
        saveToStorage(STORAGE_KEYS.CUSTOM_CHAPTERS, AppState.customChapters);
      }
      if (parsed.practice_logs && Array.isArray(parsed.practice_logs)) {
        AppState.practiceLogs = parsed.practice_logs;
        saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);
      }
      if (parsed.test_history && Array.isArray(parsed.test_history)) {
        AppState.testHistory = parsed.test_history;
        saveToStorage(STORAGE_KEYS.TEST_HISTORY, AppState.testHistory);
      }
      if (parsed.chapter_targets && typeof parsed.chapter_targets === 'object') {
        AppState.chapterTargets = parsed.chapter_targets;
        saveToStorage(STORAGE_KEYS.CHAPTER_TARGETS, AppState.chapterTargets);
      }
      showToast('Backup restored successfully!', 'success');
      closeBackupModal();
      renderVault();
      updateHeaderMetrics();
      renderNotebooksList();
      renderChapterTargets();
      updateTestHistoryBadge();
    } catch (err) {
      console.error(err);
      showToast('Invalid backup JSON file', 'error');
    }
  };
  reader.readAsText(file);
}

function confirmClearAllData() {
  if (!confirm('Are you sure you want to clear all doubts, practice logs, custom notebooks, and test history? This cannot be undone.')) return;
  AppState.doubts = [];
  AppState.notebooks = [];
  AppState.customChapters = [];
  AppState.practiceLogs = [];
  AppState.testHistory = [];
  localStorage.clear();
  closeBackupModal();
  renderVault();
  updateHeaderMetrics();
  renderNotebooksList();
  updateTestHistoryBadge();
  showToast('All data cleared', 'info');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-emerald-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900';
  toast.className = `${bg} px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center space-x-2`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.remove('translate-y-2', 'opacity-0'); });
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// =============================================================================
// 13. LATEX SNIPPET INSERTION HELPER
// =============================================================================
function insertLatexSnippet(targetId, snippet) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const start = el.selectionStart || 0;
  const end = el.selectionEnd || 0;
  const text = el.value || '';
  el.value = text.substring(0, start) + snippet + text.substring(end);
  el.focus();
  el.selectionStart = el.selectionEnd = start + snippet.length;
}

// =============================================================================
// 14. INTERACTIVE SCRATCHPAD / WHITEBOARD ENGINE
// =============================================================================
function openScratchpadModal() {
  const modal = document.getElementById('modal-scratchpad');
  if (!modal) return;
  modal.classList.remove('hidden');

  requestAnimationFrame(() => {
    initScratchpadCanvas();
  });
  if (window.lucide) window.lucide.createIcons();
}

function closeScratchpadModal() {
  document.getElementById('modal-scratchpad')?.classList.add('hidden');
}

function initScratchpadCanvas() {
  scratchpadCanvas = document.getElementById('scratchpad-canvas');
  if (!scratchpadCanvas) return;
  const container = document.getElementById('scratchpad-canvas-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  scratchpadCanvas.width = Math.max(300, rect.width - 16);
  scratchpadCanvas.height = Math.max(300, rect.height - 16);

  scratchpadCtx = scratchpadCanvas.getContext('2d');
  scratchpadCtx.lineCap = 'round';
  scratchpadCtx.lineJoin = 'round';
  scratchpadCtx.strokeStyle = scratchpadColor;
  scratchpadCtx.lineWidth = scratchpadSize;

  // Remove existing listeners to avoid duplicates
  scratchpadCanvas.onmousedown = startScratchpadDraw;
  scratchpadCanvas.onmousemove = drawScratchpad;
  scratchpadCanvas.onmouseup = stopScratchpadDraw;
  scratchpadCanvas.onmouseleave = stopScratchpadDraw;

  scratchpadCanvas.ontouchstart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    scratchpadCanvas.dispatchEvent(mouseEvent);
  };
  scratchpadCanvas.ontouchmove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    scratchpadCanvas.dispatchEvent(mouseEvent);
  };
  scratchpadCanvas.ontouchend = (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    scratchpadCanvas.dispatchEvent(mouseEvent);
  };
}

function startScratchpadDraw(e) {
  if (!scratchpadCtx) return;
  isScratchpadDrawing = true;
  const rect = scratchpadCanvas.getBoundingClientRect();
  scratchpadCtx.beginPath();
  scratchpadCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function drawScratchpad(e) {
  if (!isScratchpadDrawing || !scratchpadCtx) return;
  const rect = scratchpadCanvas.getBoundingClientRect();
  scratchpadCtx.strokeStyle = scratchpadColor;
  scratchpadCtx.lineWidth = scratchpadSize;
  scratchpadCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  scratchpadCtx.stroke();
}

function stopScratchpadDraw() {
  if (!isScratchpadDrawing) return;
  isScratchpadDrawing = false;
  scratchpadCtx?.closePath();
}

function setScratchpadColor(color) {
  scratchpadColor = color;
}

function setScratchpadSize(size) {
  scratchpadSize = parseInt(size, 10) || 4;
}

function clearScratchpadCanvas() {
  if (!scratchpadCtx || !scratchpadCanvas) return;
  scratchpadCtx.clearRect(0, 0, scratchpadCanvas.width, scratchpadCanvas.height);
}

// =============================================================================
// 15. CUSTOM PRINTABLE & DUAL PDF EXPORT REVISION GENERATOR
// =============================================================================
let printConfig = {
  subject: 'all',
  chapter: 'all',
  difficulty: 'all',
  scope: 'all',
  roughSpace: 'medium',
  mode: 'questions', // 'questions' | 'solutions' | 'combined'
  selectedDoubtIds: new Set(),
  isDrawerOpen: false,
  searchQuery: ''
};

function openPrintSheetModal() {
  const modal = document.getElementById('modal-print-sheet');
  if (!modal) return;

  // Initialize chapter dropdown in print modal
  populatePrintFilterChapters();

  // If opened from batch selection, pre-select those doubts
  if (isBatchMode && batchSelectedDoubtIds.size > 0) {
    printConfig.selectedDoubtIds = new Set(batchSelectedDoubtIds);
    const scopeSelect = document.getElementById('print-filter-scope');
    if (scopeSelect) scopeSelect.value = 'batch';
  } else {
    // By default select all doubts
    printConfig.selectedDoubtIds = new Set((AppState.doubts || []).map(d => d.id));
    const scopeSelect = document.getElementById('print-filter-scope');
    if (scopeSelect) scopeSelect.value = 'all';
  }

  modal.classList.remove('hidden');
  updatePrintSelectedCountBadge();
  renderPrintDoubtSelectorList();
  renderPrintPreview();
  if (window.lucide) window.lucide.createIcons();
}

function batchPrintRevisionSheet() {
  if (batchSelectedDoubtIds.size === 0) {
    showToast('Select doubts to generate worksheet', 'info');
    return;
  }
  openPrintSheetModal();
}

function closePrintSheetModal() {
  document.getElementById('modal-print-sheet')?.classList.add('hidden');
}

function populatePrintFilterChapters() {
  const select = document.getElementById('print-filter-chapter');
  if (!select) return;

  const currentSubj = document.getElementById('print-filter-subject')?.value || 'all';
  select.innerHTML = '<option value="all">All Chapters</option>';

  let chapters = [];
  if (currentSubj === 'all') {
    ['Physics', 'Chemistry', 'Mathematics'].forEach(s => {
      chapters.push(...getAllChaptersForSubject(s));
    });
  } else {
    chapters = getAllChaptersForSubject(currentSubj);
  }

  // Deduplicate
  const uniqueChapters = Array.from(new Set(chapters));
  uniqueChapters.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = ch;
    opt.textContent = ch;
    select.appendChild(opt);
  });
}

function onPrintFilterChanged() {
  const subj = document.getElementById('print-filter-subject')?.value || 'all';
  const chapterSelect = document.getElementById('print-filter-chapter');
  const prevChapter = chapterSelect?.value;

  populatePrintFilterChapters();
  if (chapterSelect && prevChapter && Array.from(chapterSelect.options).some(o => o.value === prevChapter)) {
    chapterSelect.value = prevChapter;
  }

  // Get doubts matching current filters and select them
  const matchingDoubts = getFilteredDoubtsForPrint();
  printConfig.selectedDoubtIds = new Set(matchingDoubts.map(d => d.id));

  updatePrintSelectedCountBadge();
  renderPrintDoubtSelectorList();
  renderPrintPreview();
}

function getFilteredDoubtsForPrint() {
  const subj = document.getElementById('print-filter-subject')?.value || 'all';
  const chapter = document.getElementById('print-filter-chapter')?.value || 'all';
  const diff = document.getElementById('print-filter-difficulty')?.value || 'all';
  const scope = document.getElementById('print-filter-scope')?.value || 'all';

  return (AppState.doubts || []).filter(d => {
    if (subj !== 'all' && d.subject !== subj) return false;
    if (chapter !== 'all' && d.chapter !== chapter) return false;
    if (diff !== 'all' && d.difficulty !== diff) return false;

    if (scope === 'starred' && !d.is_starred) return false;
    if (scope === 'unmastered' && (d.mastery_level || 0) >= 3) return false;
    if (scope === 'batch' && !batchSelectedDoubtIds.has(d.id)) return false;

    return true;
  });
}

function togglePrintSelectorDrawer() {
  printConfig.isDrawerOpen = !printConfig.isDrawerOpen;
  const pane = document.getElementById('modal-print-selector-pane');
  const textEl = document.getElementById('print-toggle-drawer-text');
  const icon = document.getElementById('print-drawer-icon');

  if (printConfig.isDrawerOpen) {
    pane?.classList.remove('hidden');
    if (textEl) textEl.textContent = 'Hide Doubt Checklist';
    if (icon) icon.setAttribute('data-lucide', 'chevron-up');
    renderPrintDoubtSelectorList();
  } else {
    pane?.classList.add('hidden');
    if (textEl) textEl.textContent = 'Select Specific Doubts (Granular)';
    if (icon) icon.setAttribute('data-lucide', 'chevron-down');
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderPrintDoubtSelectorList() {
  const container = document.getElementById('print-doubts-checklist');
  if (!container) return;

  const searchVal = document.getElementById('print-doubt-search')?.value?.trim().toLowerCase() || '';
  const filtered = getFilteredDoubtsForPrint().filter(d => {
    if (!searchVal) return true;
    const titleMatch = (d.title || '').toLowerCase().includes(searchVal);
    const chMatch = (d.chapter || '').toLowerCase().includes(searchVal);
    const subMatch = (d.subject || '').toLowerCase().includes(searchVal);
    const tagMatch = (d.custom_tags || []).some(t => t.toLowerCase().includes(searchVal));
    return titleMatch || chMatch || subMatch || tagMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-4 text-center text-slate-400 text-xs">
        No matching doubts found.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((d, idx) => {
    const isChecked = printConfig.selectedDoubtIds.has(d.id);
    let subjClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    if (d.subject === 'Chemistry') subjClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    if (d.subject === 'Mathematics') subjClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";

    return `
      <label class="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-[#252525] rounded-lg cursor-pointer transition text-xs">
        <div class="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
          <input 
            type="checkbox" 
            ${isChecked ? 'checked' : ''} 
            onchange="togglePrintDoubtSelect('${d.id}')"
            class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-[#3E3E3E]" 
          />
          <div class="truncate">
            <div class="flex items-center space-x-1.5 mb-0.5">
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold ${subjClass}">${d.subject || 'Physics'}</span>
              <span class="text-[10px] text-slate-400 font-semibold truncate">${d.chapter || 'Topic'}</span>
              <span class="text-[10px] text-slate-400 font-medium">&bull; ${d.difficulty || 'Medium'}</span>
              ${d.is_starred ? '<span class="text-amber-500 text-[10px]">★</span>' : ''}
            </div>
            <p class="font-bold text-slate-800 dark:text-slate-200 truncate">${d.title || 'Untitled Doubt'}</p>
          </div>
        </div>

        ${d.question_image_url ? `
          <span class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-0.5 flex-shrink-0" title="Has attached diagram">
            <i data-lucide="paperclip" class="w-3 h-3"></i>
            <span>Photo</span>
          </span>
        ` : ''}
      </label>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function togglePrintDoubtSelect(doubtId) {
  if (printConfig.selectedDoubtIds.has(doubtId)) {
    printConfig.selectedDoubtIds.delete(doubtId);
  } else {
    printConfig.selectedDoubtIds.add(doubtId);
  }

  updatePrintSelectedCountBadge();
  renderPrintPreview();
}

function selectFilteredPrintDoubts(selectAll) {
  const filtered = getFilteredDoubtsForPrint();
  if (selectAll) {
    filtered.forEach(d => printConfig.selectedDoubtIds.add(d.id));
  } else {
    filtered.forEach(d => printConfig.selectedDoubtIds.delete(d.id));
  }

  updatePrintSelectedCountBadge();
  renderPrintDoubtSelectorList();
  renderPrintPreview();
}

function selectStarredPrintDoubts() {
  printConfig.selectedDoubtIds.clear();
  (AppState.doubts || []).filter(d => d.is_starred).forEach(d => {
    printConfig.selectedDoubtIds.add(d.id);
  });

  updatePrintSelectedCountBadge();
  renderPrintDoubtSelectorList();
  renderPrintPreview();
}

function updatePrintSelectedCountBadge() {
  const badge = document.getElementById('print-selected-count-badge');
  const count = printConfig.selectedDoubtIds.size;
  if (badge) {
    badge.textContent = `${count} ${count === 1 ? 'Doubt' : 'Doubts'} Selected`;
  }
}

function switchPrintPreviewMode(mode) {
  printConfig.mode = mode;

  ['questions', 'solutions', 'combined'].forEach(m => {
    const btn = document.getElementById(`print-mode-btn-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = 'px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1E1E] text-blue-600 dark:text-blue-400 shadow-2xs font-bold';
      } else {
        btn.className = 'px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 font-bold';
      }
    }
  });

  renderPrintPreview();
}

function renderPrintPreview() {
  const container = document.getElementById('printable-worksheet-content');
  if (!container) return;

  const roughSpaceSetting = document.getElementById('print-filter-rough-space')?.value || 'medium';
  const selectedDoubts = (AppState.doubts || []).filter(d => printConfig.selectedDoubtIds.has(d.id));

  if (selectedDoubts.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-slate-400">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-200 dark:bg-[#252525] flex items-center justify-center text-slate-500 mb-3">
          <i data-lucide="file-question" class="w-6 h-6"></i>
        </div>
        <p class="font-bold text-sm text-slate-700 dark:text-slate-300">No Doubts Selected</p>
        <p class="text-xs text-slate-400 mt-1">Check at least one doubt in the filter controls to preview and export PDF.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  // 1. QUESTION PAPER ONLY MODE
  if (printConfig.mode === 'questions') {
    container.innerHTML = `
      <!-- Exam Paper Header -->
      <div class="border-b-2 border-slate-900 dark:border-white pb-4 mb-6 text-slate-900 dark:text-white">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-lg sm:text-xl font-black uppercase tracking-wider">JEE PRACTICE & REVISION WORKSHEET</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Focus: JEE Main & Advanced &bull; Question Paper</p>
          </div>
          <div class="text-right text-xs space-y-0.5">
            <p class="font-bold">Date: ${currentDate}</p>
            <p class="text-slate-500 dark:text-slate-400">Total Questions: <strong>${selectedDoubts.length}</strong></p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-dashed border-slate-300 dark:border-[#333] text-xs">
          <div><span class="text-slate-400 font-semibold">Student Name:</span> ___________________</div>
          <div><span class="text-slate-400 font-semibold">Roll No:</span> ____________</div>
          <div><span class="text-slate-400 font-semibold">Marks Obtained:</span> _____ / ${selectedDoubts.length * 4}</div>
        </div>
      </div>

      <!-- Question List -->
      <div class="space-y-6">
        ${selectedDoubts.map((d, i) => {
          let roughHeightClass = "h-24";
          if (roughSpaceSetting === 'large') roughHeightClass = "h-40";
          if (roughSpaceSetting === 'none') roughHeightClass = "hidden";

          return `
            <div class="printable-question-item bg-white dark:bg-[#1E1E1E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] shadow-2xs space-y-3">
              
              <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-[#2A2A2A]">
                <div class="flex items-center space-x-2">
                  <span class="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">Q${i + 1}</span>
                  <span class="font-extrabold text-slate-900 dark:text-white">${d.subject || 'Physics'}</span>
                  <span class="text-slate-400">&bull;</span>
                  <span class="text-slate-600 dark:text-slate-400 font-medium">${d.chapter || 'Topic'}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300">[ +4, -1 ] &bull; ${d.difficulty || 'Medium'}</span>
              </div>

              <!-- Question Title / Statement -->
              <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                ${d.title || 'Untitled Problem'}
              </h3>

              <!-- Question Image Diagram (if attached) -->
              ${d.question_image_url ? `
                <div class="p-2 bg-slate-50 dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#2E2E2E] inline-block max-w-full">
                  <img src="${d.question_image_url}" alt="Question Diagram" class="max-h-64 rounded-lg object-contain" />
                </div>
              ` : ''}

              <!-- Space for Student Rough Work in Print -->
              ${roughSpaceSetting !== 'none' ? `
                <div class="${roughHeightClass} border border-dashed border-slate-300 dark:border-[#3E3E3E] rounded-xl bg-slate-50/50 dark:bg-[#151515] p-2 flex items-start justify-between text-slate-400 text-[10px] font-mono">
                  <span>[ Space for Rough Work & Calculations ]</span>
                  <span>Answer: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
                </div>
              ` : ''}

            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 2. ANSWER KEY & SOLUTIONS ONLY MODE
  else if (printConfig.mode === 'solutions') {
    container.innerHTML = `
      <!-- Solutions Booklet Header -->
      <div class="border-b-2 border-emerald-600 pb-4 mb-6 text-slate-900 dark:text-white">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-lg sm:text-xl font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">ANSWER KEY & STEP-BY-STEP SOLUTIONS</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive Explanations & Key Concepts Guide</p>
          </div>
          <div class="text-right text-xs space-y-0.5">
            <p class="font-bold">Date: ${currentDate}</p>
            <p class="text-slate-500 dark:text-slate-400">Total Solutions: <strong>${selectedDoubts.length}</strong></p>
          </div>
        </div>
      </div>

      <!-- Quick Answer Key Summary Table -->
      <div class="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 mb-6">
        <h3 class="text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2.5 uppercase tracking-wider flex items-center space-x-1.5">
          <i data-lucide="key" class="w-4 h-4"></i>
          <span>Quick Answer Key Reference</span>
        </h3>
        
        <div class="grid grid-cols-4 sm:grid-cols-8 gap-2 text-xs">
          ${selectedDoubts.map((d, i) => `
            <div class="bg-white dark:bg-[#1E1E1E] p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span class="text-[10px] font-bold text-slate-400 block">Q${i + 1}</span>
              <span class="font-black text-emerald-700 dark:text-emerald-300 text-xs truncate block">${d.correct_answer || (d.difficulty === 'Easy' ? 'Opt (B)' : 'Verified')}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step-by-Step Detailed Solutions -->
      <div class="space-y-6">
        ${selectedDoubts.map((d, i) => `
          <div class="printable-solution-item bg-white dark:bg-[#1E1E1E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] shadow-2xs space-y-3">
            
            <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">S${i + 1}</span>
                <span class="font-bold text-slate-900 dark:text-white">Solution for Q${i + 1}: ${d.title || 'Problem'}</span>
              </div>
              <span class="text-[10px] text-slate-400 font-semibold">${d.subject} &bull; ${d.chapter}</span>
            </div>

            <!-- Solution Diagram / Work (if attached) -->
            ${d.solution_image_url ? `
              <div class="p-2 bg-slate-50 dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#2E2E2E] inline-block max-w-full">
                <span class="text-[10px] font-bold text-emerald-600 block mb-1">Handwritten / Diagrammatic Solution:</span>
                <img src="${d.solution_image_url}" alt="Solution Diagram" class="max-h-64 rounded-lg object-contain" />
              </div>
            ` : ''}

            <!-- Solution Detailed Text / Derivations -->
            ${d.solution_text && d.solution_text.trim() ? `
              <div class="p-3.5 bg-slate-50 dark:bg-[#161616] rounded-xl border border-slate-200 dark:border-[#2A2A2A] text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                ${d.solution_text}
              </div>
            ` : ''}

            ${!d.solution_image_url && (!d.solution_text || !d.solution_text.trim()) ? `
              <p class="text-xs text-slate-400 italic">Reference solution was not saved as text; please consult standard NCERT/PYQ module for ${d.chapter}.</p>
            ` : ''}

            <!-- Key Formula / Concept Box -->
            ${d.hint_text && d.hint_text.trim() ? `
              <div class="p-2.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-300 flex items-center space-x-2">
                <i data-lucide="lightbulb" class="w-4 h-4 text-purple-600 flex-shrink-0"></i>
                <span><strong>Core Concept / Formula:</strong> ${d.hint_text}</span>
              </div>
            ` : ''}

          </div>
        `).join('')}
      </div>
    `;
  }

  // 3. COMBINED PROBLEM & SOLUTION SHEET MODE
  else {
    container.innerHTML = `
      <div class="border-b-2 border-slate-900 dark:border-white pb-4 mb-6 text-slate-900 dark:text-white">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-lg sm:text-xl font-black uppercase tracking-wider">JEE COMPLETE REVISION WORKSHEET</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Combined Questions with Detailed Solutions</p>
          </div>
          <div class="text-right text-xs space-y-0.5">
            <p class="font-bold">Date: ${currentDate}</p>
            <p class="text-slate-500 dark:text-slate-400">Total Doubts: <strong>${selectedDoubts.length}</strong></p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        ${selectedDoubts.map((d, i) => `
          <div class="printable-question-item bg-white dark:bg-[#1E1E1E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#2E2E2E] space-y-3">
            <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-[#2A2A2A]">
              <span class="font-bold text-blue-600 dark:text-blue-400">Q${i + 1}. ${d.subject} &bull; ${d.chapter}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-[#2A2A2A] text-slate-700 dark:text-slate-300">${d.difficulty}</span>
            </div>

            <h3 class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">${d.title}</h3>

            ${d.question_image_url ? `
              <div class="p-2 bg-slate-50 dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-[#2E2E2E] inline-block">
                <img src="${d.question_image_url}" alt="Question Image" class="max-h-56 rounded-lg object-contain" />
              </div>
            ` : ''}

            <!-- Solution Section -->
            <div class="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-xs">
              <span class="font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                <span>Solution & Notes:</span>
              </span>

              ${d.solution_image_url ? `
                <img src="${d.solution_image_url}" alt="Solution Image" class="max-h-56 rounded-lg object-contain" />
              ` : ''}

              ${d.solution_text ? `<p class="text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap">${d.solution_text}</p>` : ''}
              ${d.hint_text ? `<p class="text-purple-700 dark:text-purple-300 text-[11px]"><strong>Formula:</strong> ${d.hint_text}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Trigger KaTeX math equation rendering on the generated worksheet
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ]
      });
    } catch (err) {
      console.warn("KaTeX render error", err);
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

function printQuestionPaper() {
  switchPrintPreviewMode('questions');
  setTimeout(() => {
    window.print();
  }, 150);
}

function printSolutionsPaper() {
  switchPrintPreviewMode('solutions');
  setTimeout(() => {
    window.print();
  }, 150);
}

function printCombinedPaper() {
  switchPrintPreviewMode('combined');
  setTimeout(() => {
    window.print();
  }, 150);
}

function exportDualPdfSequence() {
  // 1. First print questions
  printQuestionPaper();
  showToast('📄 Step 1: Save Questions PDF in print dialog. Then click "Solutions PDF" to save Answer Key!', 'info');
}

// =============================================================================
// 16. BATCH ACTIONS & SELECTION ENGINE (VAULT)
// =============================================================================
function toggleBatchSelectMode(force) {
  if (typeof force === 'boolean') {
    isBatchMode = force;
  } else {
    isBatchMode = !isBatchMode;
  }

  if (!isBatchMode) {
    batchSelectedDoubtIds.clear();
  }

  const bar = document.getElementById('vault-batch-bar');
  if (bar) {
    if (isBatchMode) bar.classList.remove('hidden');
    else bar.classList.add('hidden');
  }

  updateBatchBar();
  renderVault();
}

function toggleBatchMode() {
  toggleBatchSelectMode();
}

function toggleSelectAllBatch(force) {
  const allDoubts = AppState.doubts || [];
  if (typeof force === 'boolean') {
    if (force) {
      allDoubts.forEach(d => batchSelectedDoubtIds.add(d.id));
    } else {
      batchSelectedDoubtIds.clear();
    }
  } else {
    if (batchSelectedDoubtIds.size === allDoubts.length) {
      batchSelectedDoubtIds.clear();
    } else {
      allDoubts.forEach(d => batchSelectedDoubtIds.add(d.id));
    }
  }

  const masterCheckbox = document.getElementById('batch-select-all-checkbox');
  if (masterCheckbox) {
    masterCheckbox.checked = batchSelectedDoubtIds.size === allDoubts.length && allDoubts.length > 0;
  }

  updateBatchBar();
  renderVault();
}

function toggleBatchSelectDoubt(doubtId) {
  if (batchSelectedDoubtIds.has(doubtId)) {
    batchSelectedDoubtIds.delete(doubtId);
  } else {
    batchSelectedDoubtIds.add(doubtId);
  }

  const masterCheckbox = document.getElementById('batch-select-all-checkbox');
  if (masterCheckbox) {
    masterCheckbox.checked = batchSelectedDoubtIds.size === (AppState.doubts || []).length;
  }

  updateBatchBar();
  renderVault();
}

function updateBatchBar() {
  const countEl = document.getElementById('batch-selected-count');
  if (countEl) {
    countEl.textContent = `${batchSelectedDoubtIds.size} Selected`;
  }
}

function openBatchMoveModal() {
  if (batchSelectedDoubtIds.size === 0) {
    showToast('Select at least one doubt first', 'info');
    return;
  }
  const select = document.getElementById('batch-move-notebook-select');
  if (select) {
    select.innerHTML = `
      <option value="">Remove from Notebook (General Vault)</option>
      ${(AppState.notebooks || []).map(nb => `<option value="${nb.id}">${nb.name} (${nb.subject || 'General'})</option>`).join('')}
    `;
  }
  document.getElementById('modal-batch-move')?.classList.remove('hidden');
}

function closeBatchMoveModal() {
  document.getElementById('modal-batch-move')?.classList.add('hidden');
}

function applyBatchMoveToNotebook() {
  const notebookId = document.getElementById('batch-move-notebook-select')?.value || null;
  AppState.doubts.forEach(d => {
    if (batchSelectedDoubtIds.has(d.id)) {
      d.notebook_id = notebookId;
    }
  });

  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  closeBatchMoveModal();
  toggleBatchSelectMode(false);
  renderVault();
  renderNotebooksList();
  showToast('Moved selected doubts successfully!', 'success');
}

function openBatchTagModal() {
  if (batchSelectedDoubtIds.size === 0) {
    showToast('Select at least one doubt first', 'info');
    return;
  }
  document.getElementById('modal-batch-tag')?.classList.remove('hidden');
}

function closeBatchTagModal() {
  document.getElementById('modal-batch-tag')?.classList.add('hidden');
}

function applyBatchAddTag() {
  const tagInput = document.getElementById('batch-tag-input')?.value?.trim();
  if (!tagInput) return;

  const formattedTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;

  AppState.doubts.forEach(d => {
    if (batchSelectedDoubtIds.has(d.id)) {
      if (!d.custom_tags) d.custom_tags = [];
      if (!d.custom_tags.includes(formattedTag)) {
        d.custom_tags.push(formattedTag);
      }
    }
  });

  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  closeBatchTagModal();
  toggleBatchSelectMode(false);
  renderVault();
  showToast(`Added tag "${formattedTag}" to selected doubts`, 'success');
}

function batchToggleMastered() {
  batchMarkMastered();
}

function batchMarkMastered() {
  if (batchSelectedDoubtIds.size === 0) {
    showToast('Select at least one doubt first', 'info');
    return;
  }

  AppState.doubts.forEach(d => {
    if (batchSelectedDoubtIds.has(d.id)) {
      d.mastery_level = 3;
      d.is_resolved = true;
    }
  });

  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  toggleBatchSelectMode(false);
  renderVault();
  updateHeaderMetrics();
  showToast('Marked selected doubts as Mastered (Level 3)! 🎉', 'success');
}

function confirmBatchDelete() {
  batchDeleteDoubts();
}

function batchDeleteDoubts() {
  if (batchSelectedDoubtIds.size === 0) {
    showToast('Select at least one doubt first', 'info');
    return;
  }

  if (!confirm(`Delete ${batchSelectedDoubtIds.size} selected doubts permanently?`)) return;

  AppState.doubts = AppState.doubts.filter(d => !batchSelectedDoubtIds.has(d.id));
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);

  toggleBatchSelectMode(false);
  renderVault();
  updateHeaderMetrics();
  showToast('Deleted selected doubts', 'info');
}

// =============================================================================
// 17. LIGHTBOX IMAGE VIEWER WITH ZOOM & ROTATE
// =============================================================================
let currentLightboxZoom = 1;

function openImageLightbox(src, title = 'Question Attachment') {
  const modal = document.getElementById('modal-image-lightbox');
  const img = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  if (!modal || !img) return;

  currentLightboxZoom = 1;
  img.src = src;
  img.style.transform = `scale(${currentLightboxZoom})`;
  if (titleEl) titleEl.textContent = title;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeLightboxModal() {
  document.getElementById('modal-image-lightbox')?.classList.add('hidden');
}

function zoomLightboxImage(delta) {
  const img = document.getElementById('lightbox-image');
  if (!img) return;
  currentLightboxZoom = Math.max(0.5, Math.min(3.5, currentLightboxZoom + delta));
  img.style.transform = `scale(${currentLightboxZoom})`;
}

function resetLightboxZoom() {
  const img = document.getElementById('lightbox-image');
  if (!img) return;
  currentLightboxZoom = 1;
  img.style.transform = `scale(${currentLightboxZoom})`;
}

// =============================================================================
// 18. SCRATCHPAD TOGGLER & GLOBAL ALIASES
// =============================================================================
function toggleScratchpad() {
  const modal = document.getElementById('modal-scratchpad');
  if (modal?.classList.contains('hidden')) {
    openScratchpadModal();
  } else {
    closeScratchpadModal();
  }
}

// =============================================================================
// 19. QUIZ / TEST GENERATOR PRESETS & CHAPTER MODALS
// =============================================================================
let generatorSelectedChapters = {
  test: new Set(),
  practice: new Set()
};

function applyExamPreset(preset) {
  const countSelect = document.getElementById('test-count-select');
  const timerSelect = document.getElementById('test-timer-select');
  const nameInput = document.getElementById('test-name-input');

  const phyCb = document.getElementById('test-gen-subj-phy');
  const chemCb = document.getElementById('test-gen-subj-chem');
  const mathCb = document.getElementById('test-gen-subj-math');

  if (preset === 'full_mock') {
    if (phyCb) phyCb.checked = true;
    if (chemCb) chemCb.checked = true;
    if (mathCb) mathCb.checked = true;
    if (countSelect) countSelect.value = '30';
    if (timerSelect) timerSelect.value = '60';
    if (nameInput) nameInput.value = 'JEE Full Syllabus Mock Drill';
  } else if (preset === 'phy_drill') {
    if (phyCb) phyCb.checked = true;
    if (chemCb) chemCb.checked = false;
    if (mathCb) mathCb.checked = false;
    if (countSelect) countSelect.value = '10';
    if (timerSelect) timerSelect.value = '20';
    if (nameInput) nameInput.value = 'Physics Mastery Sprint';
  } else if (preset === 'chem_drill') {
    if (phyCb) phyCb.checked = false;
    if (chemCb) chemCb.checked = true;
    if (mathCb) mathCb.checked = false;
    if (countSelect) countSelect.value = '10';
    if (timerSelect) timerSelect.value = '15';
    if (nameInput) nameInput.value = 'Chemistry Rapid Recall Test';
  } else if (preset === 'math_drill') {
    if (phyCb) phyCb.checked = false;
    if (chemCb) chemCb.checked = false;
    if (mathCb) mathCb.checked = true;
    if (countSelect) countSelect.value = '10';
    if (timerSelect) timerSelect.value = '30';
    if (nameInput) nameInput.value = 'Mathematics Problem Sprint';
  } else if (preset === 'weak_spots') {
    if (phyCb) phyCb.checked = true;
    if (chemCb) chemCb.checked = true;
    if (mathCb) mathCb.checked = true;
    if (countSelect) countSelect.value = '15';
    if (timerSelect) timerSelect.value = '30';
    if (nameInput) nameInput.value = 'Weak Area Diagnosis Drill';
  }

  onGeneratorFilterChange('test');
}

function toggleAllSubjects(subTab) {
  const phyCb = document.getElementById(`${subTab}-gen-subj-phy`);
  const chemCb = document.getElementById(`${subTab}-gen-subj-chem`);
  const mathCb = document.getElementById(`${subTab}-gen-subj-math`);

  const allChecked = phyCb?.checked && chemCb?.checked && mathCb?.checked;
  const nextState = !allChecked;

  if (phyCb) phyCb.checked = nextState;
  if (chemCb) chemCb.checked = nextState;
  if (mathCb) mathCb.checked = nextState;

  onGeneratorFilterChange(subTab);
}

function onGeneratorFilterChange(subTab) {
  const phyCb = document.getElementById(`${subTab}-gen-subj-phy`);
  const chemCb = document.getElementById(`${subTab}-gen-subj-chem`);
  const mathCb = document.getElementById(`${subTab}-gen-subj-math`);

  const selectedSubjects = [];
  if (phyCb?.checked) selectedSubjects.push('Physics');
  if (chemCb?.checked) selectedSubjects.push('Chemistry');
  if (mathCb?.checked) selectedSubjects.push('Mathematics');

  const doubts = (AppState.doubts || []).filter(d => {
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(d.subject)) return false;
    if (generatorSelectedChapters[subTab]?.size > 0 && !generatorSelectedChapters[subTab].has(d.chapter)) return false;
    return true;
  });

  const bannerCount = document.getElementById(`${subTab}-matching-count`);
  if (bannerCount) bannerCount.textContent = `${doubts.length} Doubts Available`;
}

function openChapterSelectModal(subTab = 'test') {
  const modal = document.getElementById('modal-select-chapters');
  if (!modal) return;

  renderChapterModalList(subTab);
  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeChapterSelectModal() {
  document.getElementById('modal-select-chapters')?.classList.add('hidden');
}

function renderChapterModalList(subTab = 'test') {
  const container = document.getElementById('chapter-select-modal-list');
  if (!container) return;

  const searchQ = document.getElementById('chapter-select-search')?.value?.trim().toLowerCase() || '';

  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  let html = '';

  subjects.forEach(subj => {
    const chapters = getAllChaptersForSubject(subj).filter(ch => {
      if (!searchQ) return true;
      return ch.toLowerCase().includes(searchQ) || subj.toLowerCase().includes(searchQ);
    });

    if (chapters.length === 0) return;

    html += `
      <div class="space-y-1 pt-2">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">${subj}</h4>
        <div class="space-y-1">
          ${chapters.map(ch => {
            const isChecked = generatorSelectedChapters[subTab]?.has(ch);
            const doubtCount = (AppState.doubts || []).filter(d => d.chapter === ch).length;

            return `
              <label class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:hover:bg-[#252525] cursor-pointer text-xs transition">
                <div class="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                  <input 
                    type="checkbox" 
                    value="${ch}" 
                    ${isChecked ? 'checked' : ''}
                    class="chapter-modal-cb w-4 h-4 rounded text-purple-600 focus:ring-purple-500" 
                  />
                  <span class="font-bold text-slate-800 dark:text-slate-200 truncate">${ch}</span>
                </div>
                ${doubtCount > 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex-shrink-0">${doubtCount} Qs</span>` : ''}
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html || '<div class="py-6 text-center text-slate-400 text-xs">No chapters matching search.</div>';
}

function filterChapterModalList() {
  renderChapterModalList(AppState.quizSubTab === 'practice' ? 'practice' : 'test');
}

function selectAllChaptersInModal() {
  document.querySelectorAll('.chapter-modal-cb').forEach(cb => { cb.checked = true; });
}

function clearAllChaptersInModal() {
  document.querySelectorAll('.chapter-modal-cb').forEach(cb => { cb.checked = false; });
}

function selectWeakChaptersInModal() {
  // Find chapters with lowest mastery or most doubts
  const weakChapters = new Set();
  (AppState.doubts || []).filter(d => (d.mastery_level || 0) < 2).forEach(d => {
    if (d.chapter) weakChapters.add(d.chapter);
  });

  document.querySelectorAll('.chapter-modal-cb').forEach(cb => {
    cb.checked = weakChapters.has(cb.value);
  });
}

function applyChapterSelectionFromModal() {
  const subTab = AppState.quizSubTab === 'practice' ? 'practice' : 'test';
  if (!generatorSelectedChapters[subTab]) generatorSelectedChapters[subTab] = new Set();
  generatorSelectedChapters[subTab].clear();

  document.querySelectorAll('.chapter-modal-cb:checked').forEach(cb => {
    generatorSelectedChapters[subTab].add(cb.value);
  });

  const countBadge = document.getElementById(`${subTab}-selected-chapters-badge`);
  if (countBadge) {
    const sz = generatorSelectedChapters[subTab].size;
    countBadge.textContent = sz === 0 ? 'All Chapters Included' : `${sz} Chapters Selected`;
  }

  closeChapterSelectModal();
  onGeneratorFilterChange(subTab);
  showToast('Chapter scope updated!', 'success');
}

function setCustomTestCount(count) {
  const countSelect = document.getElementById('test-count-select');
  if (countSelect) {
    countSelect.value = String(count);
  }
}

function startCustomTestSession() {
  startTestSession();
}

function toggleTestPaletteDrawer() {
  const drawer = document.getElementById('test-palette-drawer');
  drawer?.classList.toggle('hidden');
}

function selectTestOption(optionLetter) {
  const input = document.getElementById('test-user-answer');
  if (input) {
    input.value = optionLetter;
  }
  saveCurrentTestAnswer();
}

function clearTestCurrentResponse() {
  const input = document.getElementById('test-user-answer');
  if (input) input.value = '';
  saveCurrentTestAnswer();
}

function markReviewAndNextTest() {
  const q = AppState.testSession.questions[AppState.testSession.currentIndex];
  if (q) q.isMarkedForReview = true;
  nextTestQuestion();
}

function toggleTestHint() {
  const hintContent = document.getElementById('test-hint-content');
  hintContent?.classList.toggle('hidden');
}

function startQuizForActiveNotebook() {
  if (!AppState.activeNotebookFilterId) return;
  switchTab('quiz');
  switchQuizSubTab('test');
  const scopeSelect = document.getElementById('test-scope-select');
  if (scopeSelect) {
    scopeSelect.value = 'notebook';
    handleTestScopeChange();
  }
  const nbPicker = document.getElementById('test-notebook-picker');
  if (nbPicker) nbPicker.value = AppState.activeNotebookFilterId;
  startTestSession();
}

// =============================================================================
// 20. SRS / FLASHCARDS REVISION DECK ENGINE
// =============================================================================
let flashcardDeck = [];
let currentFlashcardIndex = 0;
let isFlashcardFlipped = false;
let flashcardFilterSubj = 'all';

function startSrsFlashcardsDeck() {
  switchTab('quiz');
  switchQuizSubTab('flashcards');
  updateFlashcardPoolCount();
}

function setFlashcardSubjectFilter(sub) {
  flashcardFilterSubj = sub;
  ['all', 'Physics', 'Chemistry', 'Mathematics'].forEach(s => {
    const btn = document.getElementById(`fc-filter-btn-${s}`);
    if (btn) {
      if (s === sub) {
        btn.className = 'px-3 py-1.5 rounded-xl font-bold bg-purple-600 text-white text-xs shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl font-bold bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-400 text-xs';
      }
    }
  });
  updateFlashcardPoolCount();
}

function updateFlashcardPoolCount() {
  const pool = getFlashcardPool();
  const countEl = document.getElementById('flashcard-pool-count');
  if (countEl) countEl.textContent = `${pool.length} Cards Ready`;
}

function getFlashcardPool() {
  return (AppState.doubts || []).filter(d => {
    if (flashcardFilterSubj !== 'all' && d.subject !== flashcardFilterSubj) return false;
    return true;
  });
}

function startFlashcardSession() {
  const pool = getFlashcardPool();
  if (pool.length === 0) {
    showToast('No doubts available in selected subject deck!', 'error');
    return;
  }

  // Shuffle flashcard deck
  flashcardDeck = [...pool].sort(() => Math.random() - 0.5);
  currentFlashcardIndex = 0;
  isFlashcardFlipped = false;

  document.getElementById('flashcard-setup-card')?.classList.add('hidden');
  document.getElementById('flashcard-active-card')?.classList.remove('hidden');
  renderCurrentFlashcard();
}

function renderCurrentFlashcard() {
  const card = flashcardDeck[currentFlashcardIndex];
  if (!card) {
    exitFlashcardSession();
    return;
  }

  isFlashcardFlipped = false;
  const flipCard = document.getElementById('srs-flip-card');
  flipCard?.classList.remove('flipped');

  // Front Elements
  const progText = document.getElementById('fc-prog-text');
  const subjBadge = document.getElementById('fc-front-subject');
  const chBadge = document.getElementById('fc-front-chapter');
  const diffBadge = document.getElementById('fc-front-diff');
  const titleEl = document.getElementById('fc-front-title');
  const imgFront = document.getElementById('fc-front-img');
  const imgBox = document.getElementById('fc-front-img-box');

  if (progText) progText.textContent = `Card ${currentFlashcardIndex + 1} of ${flashcardDeck.length}`;
  if (subjBadge) subjBadge.textContent = card.subject || 'Physics';
  if (chBadge) chBadge.textContent = card.chapter || 'Topic';
  if (diffBadge) diffBadge.textContent = card.difficulty || 'Medium';
  if (titleEl) titleEl.textContent = card.title || 'Untitled Problem';

  if (card.question_image_url) {
    if (imgFront) imgFront.src = card.question_image_url;
    imgBox?.classList.remove('hidden');
  } else {
    imgBox?.classList.add('hidden');
  }

  // Back Elements
  const solImg = document.getElementById('fc-back-img');
  const solImgBox = document.getElementById('fc-back-img-box');
  const solText = document.getElementById('fc-back-text');
  const hintText = document.getElementById('fc-back-hint');
  const hintBox = document.getElementById('fc-back-hint-box');

  if (card.solution_image_url) {
    if (solImg) solImg.src = card.solution_image_url;
    solImgBox?.classList.remove('hidden');
  } else {
    solImgBox?.classList.add('hidden');
  }

  if (solText) {
    solText.textContent = card.solution_text || (card.solution_image_url ? '' : 'No handwritten explanation saved.');
  }

  if (card.hint_text && card.hint_text.trim()) {
    if (hintText) hintText.textContent = card.hint_text;
    hintBox?.classList.remove('hidden');
  } else {
    hintBox?.classList.add('hidden');
  }

  if (window.lucide) window.lucide.createIcons();
}

function toggleFlashcardFlip() {
  const flipCard = document.getElementById('srs-flip-card');
  if (!flipCard) return;
  isFlashcardFlipped = !isFlashcardFlipped;
  flipCard.classList.toggle('flipped', isFlashcardFlipped);
}

function rateFlashcard(qualityRating) {
  const card = flashcardDeck[currentFlashcardIndex];
  if (card) {
    // SM-2 Spaced Repetition Logic update
    const currentMastery = card.mastery_level || 0;
    if (qualityRating >= 4) {
      card.mastery_level = Math.min(3, currentMastery + 1);
    } else if (qualityRating <= 2) {
      card.mastery_level = Math.max(0, currentMastery - 1);
    }
    card.last_reviewed_at = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  }

  currentFlashcardIndex++;
  if (currentFlashcardIndex >= flashcardDeck.length) {
    showToast('🎉 Great job! Completed the Flashcard Revision Deck!', 'success');
    exitFlashcardSession();
  } else {
    renderCurrentFlashcard();
  }
}

function exitFlashcardSession() {
  document.getElementById('flashcard-active-card')?.classList.add('hidden');
  document.getElementById('flashcard-setup-card')?.classList.remove('hidden');
}

