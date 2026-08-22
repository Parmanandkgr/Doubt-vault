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
  THEME: "jee_vault_theme_clean_v3"
};

const AppState = {
  currentTab: 'vault',
  doubts: [],
  notebooks: [],
  customChapters: [],
  practiceLogs: [],
  
  // Vault Filtering
  subjectFilter: 'all', // 'all', 'Physics', 'Chemistry', 'Mathematics', 'starred'
  activeNotebookFilterId: null,
  searchQuery: '',
  sortBy: 'newest',
  
  // Active Detail Modal
  activeDoubtId: null,

  // Active Quiz State
  quiz: {
    inProgress: false,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    secondsElapsed: 0,
    timerInterval: null,
    selectedLength: 5
  }
};

let chartSubjectDist = null;
let chartDailyVolume = null;

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

  // Also update quiz notebook picker
  const quizPicker = document.getElementById('quiz-notebook-picker');
  if (quizPicker) {
    quizPicker.innerHTML = '';
    if ((AppState.notebooks || []).length === 0) {
      quizPicker.innerHTML = '<option value="">No notebooks created yet</option>';
    } else {
      AppState.notebooks.forEach(nb => {
        const opt = document.createElement('option');
        opt.value = nb.id;
        opt.textContent = nb.name;
        quizPicker.appendChild(opt);
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
    if (!AppState.quiz.inProgress) {
      document.getElementById('quiz-setup-card')?.classList.remove('hidden');
      document.getElementById('quiz-active-panel')?.classList.add('hidden');
      document.getElementById('quiz-results-card')?.classList.add('hidden');
    }
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
// 6. INTERACTIVE QUIZ & RE-ATTEMPT ENGINE
// =============================================================================
function handleQuizScopeChange() {
  const scope = document.getElementById('quiz-scope-select')?.value;
  const pickerBox = document.getElementById('quiz-notebook-picker-box');
  if (scope === 'notebook') {
    pickerBox?.classList.remove('hidden');
  } else {
    pickerBox?.classList.add('hidden');
  }
}

function setQuizLength(len) {
  AppState.quiz.selectedLength = len;
  document.querySelectorAll('.quiz-len-btn').forEach(btn => {
    if (Number(btn.dataset.len) === len) {
      btn.className = 'quiz-len-btn py-2 rounded-xl border border-slate-200 dark:border-[#2E2E2E] text-xs font-bold bg-purple-600 text-white';
    } else {
      btn.className = 'quiz-len-btn py-2 rounded-xl border border-slate-200 dark:border-[#2E2E2E] text-xs font-bold bg-slate-50 dark:bg-[#121212] text-slate-700 dark:text-slate-300';
    }
  });
}

function startQuizForActiveNotebook() {
  if (!AppState.activeNotebookFilterId) return;
  switchTab('quiz');
  const scopeSelect = document.getElementById('quiz-scope-select');
  if (scopeSelect) {
    scopeSelect.value = 'notebook';
    handleQuizScopeChange();
  }
  const nbPicker = document.getElementById('quiz-notebook-picker');
  if (nbPicker) {
    nbPicker.value = AppState.activeNotebookFilterId;
  }
  startQuizSession();
}

function startQuizSession() {
  const scope = document.getElementById('quiz-scope-select')?.value || 'all';
  const selectedNotebookId = document.getElementById('quiz-notebook-picker')?.value;

  let pool = [...(AppState.doubts || [])];

  if (scope === 'Physics' || scope === 'Chemistry' || scope === 'Mathematics') {
    pool = pool.filter(d => d.subject === scope);
  } else if (scope === 'starred') {
    pool = pool.filter(d => d.is_starred);
  } else if (scope === 'notebook' && selectedNotebookId) {
    pool = pool.filter(d => d.notebook_id === selectedNotebookId);
  }

  if (pool.length === 0) {
    showToast('No doubts found in the selected scope to quiz!', 'error');
    return;
  }

  // Shuffle pool
  pool.sort(() => Math.random() - 0.5);

  const len = AppState.quiz.selectedLength || 5;
  const questions = pool.slice(0, len);

  AppState.quiz.inProgress = true;
  AppState.quiz.questions = questions;
  AppState.quiz.currentIndex = 0;
  AppState.quiz.correctCount = 0;
  AppState.quiz.secondsElapsed = 0;

  // Clear previous timer
  if (AppState.quiz.timerInterval) clearInterval(AppState.quiz.timerInterval);
  AppState.quiz.timerInterval = setInterval(() => {
    AppState.quiz.secondsElapsed++;
    updateQuizTimerDisplay();
  }, 1000);

  document.getElementById('quiz-setup-card')?.classList.add('hidden');
  document.getElementById('quiz-results-card')?.classList.add('hidden');
  document.getElementById('quiz-active-panel')?.classList.remove('hidden');

  renderCurrentQuizQuestion();
}

function updateQuizTimerDisplay() {
  const el = document.getElementById('quiz-timer-display');
  if (!el) return;
  const m = Math.floor(AppState.quiz.secondsElapsed / 60);
  const s = AppState.quiz.secondsElapsed % 60;
  el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderCurrentQuizQuestion() {
  const q = AppState.quiz.questions[AppState.quiz.currentIndex];
  if (!q) {
    finishQuizSession();
    return;
  }

  const progText = document.getElementById('quiz-progress-text');
  if (progText) progText.textContent = `Q ${AppState.quiz.currentIndex + 1} of ${AppState.quiz.questions.length}`;

  const subjBadge = document.getElementById('quiz-badge-subject');
  if (subjBadge) subjBadge.textContent = q.subject || 'Physics';

  const diffBadge = document.getElementById('quiz-badge-diff');
  if (diffBadge) diffBadge.textContent = q.difficulty || 'Medium';

  const chEl = document.getElementById('quiz-q-chapter');
  if (chEl) chEl.textContent = q.chapter || 'Topic';

  const titleEl = document.getElementById('quiz-q-title');
  if (titleEl) titleEl.textContent = q.title || 'Untitled Doubt';

  // Question Image
  const imgBox = document.getElementById('quiz-q-img-box');
  const imgEl = document.getElementById('quiz-q-img');
  if (q.question_image_url) {
    if (imgEl) imgEl.src = q.question_image_url;
    imgBox?.classList.remove('hidden');
  } else {
    imgBox?.classList.add('hidden');
  }

  // Hint box
  const hintBox = document.getElementById('quiz-hint-box');
  const hintText = document.getElementById('quiz-hint-text');
  const hintContent = document.getElementById('quiz-hint-content');
  if (q.hint_text && q.hint_text.trim()) {
    if (hintText) hintText.textContent = q.hint_text;
    hintContent?.classList.add('hidden');
    hintBox?.classList.remove('hidden');
  } else {
    hintBox?.classList.add('hidden');
  }

  // Solution Box reset
  const solBox = document.getElementById('quiz-solution-box');
  const solImg = document.getElementById('quiz-sol-img');
  const solBtnText = document.getElementById('quiz-solution-btn-text');
  if (solBox) solBox.classList.add('hidden');
  if (solBtnText) solBtnText.textContent = 'Check Solution';
  if (q.solution_image_url && solImg) {
    solImg.src = q.solution_image_url;
  }

  // Clear answer input
  const userAns = document.getElementById('quiz-user-answer');
  if (userAns) userAns.value = '';

  if (window.lucide) window.lucide.createIcons();
}

function toggleQuizHint() {
  const content = document.getElementById('quiz-hint-content');
  content?.classList.toggle('hidden');
}

function toggleQuizSolution() {
  const solBox = document.getElementById('quiz-solution-box');
  const solBtnText = document.getElementById('quiz-solution-btn-text');
  if (!solBox) return;

  const isHidden = solBox.classList.toggle('hidden');
  if (solBtnText) solBtnText.textContent = isHidden ? 'Check Solution' : 'Hide Solution';
}

function submitQuizAnswer(isCorrect) {
  if (isCorrect) AppState.quiz.correctCount++;
  nextQuizQuestion();
}

function nextQuizQuestion() {
  AppState.quiz.currentIndex++;
  if (AppState.quiz.currentIndex >= AppState.quiz.questions.length) {
    finishQuizSession();
  } else {
    renderCurrentQuizQuestion();
  }
}

function finishQuizSession() {
  if (AppState.quiz.timerInterval) clearInterval(AppState.quiz.timerInterval);

  document.getElementById('quiz-active-panel')?.classList.add('hidden');
  const resCard = document.getElementById('quiz-results-card');
  resCard?.classList.remove('hidden');

  const totalEl = document.getElementById('quiz-res-total');
  const corEl = document.getElementById('quiz-res-correct');
  const timeEl = document.getElementById('quiz-res-time');

  const m = Math.floor(AppState.quiz.secondsElapsed / 60);
  const s = AppState.quiz.secondsElapsed % 60;
  const timeFormatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  if (totalEl) totalEl.textContent = String(AppState.quiz.questions.length);
  if (corEl) corEl.textContent = String(AppState.quiz.correctCount);
  if (timeEl) timeEl.textContent = timeFormatted;

  AppState.quiz.inProgress = false;
  if (window.lucide) window.lucide.createIcons();
}

function exitQuizSession() {
  if (AppState.quiz.timerInterval) clearInterval(AppState.quiz.timerInterval);
  AppState.quiz.inProgress = false;
  document.getElementById('quiz-active-panel')?.classList.add('hidden');
  document.getElementById('quiz-results-card')?.classList.add('hidden');
  document.getElementById('quiz-setup-card')?.classList.remove('hidden');
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
  renderDiagnosticChapters();
  renderPracticeLogsHistory();
  renderSubjectDistributionChart();
  renderDailyVolumeChart();
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
// 9. CAPTURE ENGINE (100% OPTIONAL FIELDS)
// =============================================================================
let uploadedImages = { question: null, solution: null };

function compressImage(file, maxWidth = 1000, quality = 0.8) {
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

    if (previewImg) previewImg.src = compressedBase64;
    previewContainer?.classList.remove('hidden');
    placeholder?.classList.add('hidden');
  } catch (err) {
    console.error("Image processing error", err);
    showToast("Failed to process image", "error");
  }
}

function removeImage(type) {
  uploadedImages[type] = null;
  const prefix = type === 'question' ? 'q' : 'sol';
  const input = document.getElementById(`${prefix}-image-input`);
  if (input) input.value = '';
  document.getElementById(`${prefix}-preview-container`)?.classList.add('hidden');
  document.getElementById(`${prefix}-placeholder`)?.classList.remove('hidden');
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
    practice_logs: AppState.practiceLogs
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
      showToast('Backup restored successfully!', 'success');
      closeBackupModal();
      renderVault();
      updateHeaderMetrics();
      renderNotebooksList();
    } catch (err) {
      console.error(err);
      showToast('Invalid backup JSON file', 'error');
    }
  };
  reader.readAsText(file);
}

function confirmClearAllData() {
  if (!confirm('Are you sure you want to clear all doubts, practice logs, and custom notebooks? This cannot be undone.')) return;
  AppState.doubts = [];
  AppState.notebooks = [];
  AppState.customChapters = [];
  AppState.practiceLogs = [];
  localStorage.clear();
  closeBackupModal();
  renderVault();
  updateHeaderMetrics();
  renderNotebooksList();
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
