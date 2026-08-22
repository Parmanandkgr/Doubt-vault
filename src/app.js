/**
 * Doubt Vault & Practice Engine - Core Application Logic
 * Single-file / Offline-First Vanilla JavaScript Engine for JEE Main & Advanced
 */

// =============================================================================
// 1. MASTER JEE CHAPTERS DATABASE
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
    "Dual Nature of Matter & Radiation (Photoelectric)",
    "Atomic Physics",
    "Nuclear Physics & Radioactivity",
    "Semiconductor Electronics & Logic Gates",
    "Experimental Physics & Error Analysis"
  ],
  Chemistry: [
    // Physical Chemistry
    "Some Basic Concepts of Chemistry (Mole Concept)",
    "Atomic Structure & Quantum Mechanics",
    "States of Matter (Gaseous & Liquid States)",
    "Chemical Thermodynamics & Thermochemistry",
    "Chemical Equilibrium",
    "Ionic Equilibrium",
    "Redox Reactions & Volumetric Analysis",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry & Colloids",
    "Solid State",
    "Solutions & Colligative Properties",
    // Inorganic Chemistry
    "Periodic Classification & Periodicity",
    "Chemical Bonding & Molecular Structure",
    "s-Block Elements (Alkali & Alkaline Earth)",
    "p-Block Elements (Groups 13 to 18)",
    "d & f Block Elements (Transition Metals)",
    "Coordination Compounds",
    "Qualitative Inorganic Analysis (Salt Analysis)",
    "Environmental Chemistry & Metallurgy",
    // Organic Chemistry
    "General Organic Chemistry (GOC - Nomenclature, Isomerism, Reaction Mechanisms)",
    "Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)",
    "Haloalkanes & Haloarenes",
    "Alcohols, Phenols & Ethers",
    "Aldehydes & Ketones",
    "Carboxylic Acids & Derivatives",
    "Nitrogen Compounds (Amines, Diazo)",
    "Biomolecules (Carbohydrates, Proteins, Nucleic Acids)",
    "Polymers & Chemistry in Everyday Life",
    "Practical Organic Chemistry (POC)"
  ],
  Mathematics: [
    "Sets, Relations & Functions",
    "Complex Numbers & Quadratic Equations",
    "Matrices & Determinants",
    "Permutations & Combinations",
    "Binomial Theorem & Mathematical Induction",
    "Sequences & Series (AP, GP, HP, AGP)",
    "Limits, Continuity & Differentiability",
    "Differentiation & Application of Derivatives (AOD)",
    "Indefinite Integration",
    "Definite Integration & Area Under Curves",
    "Differential Equations",
    "Straight Lines & Pair of Straight Lines",
    "Circles & System of Circles",
    "Parabola",
    "Ellipse",
    "Hyperbola",
    "Vector Algebra",
    "3D Geometry",
    "Trigonometric Ratios, Identities & Equations",
    "Inverse Trigonometric Functions (ITF)",
    "Height & Distances",
    "Probability & Statistics",
    "Linear Programming & Mathematical Reasoning"
  ]
};

// =============================================================================
// 2. STATE & STORAGE MANAGEMENT
// =============================================================================
const STORAGE_KEYS = {
  DOUBTS: "jee_doubts",
  PRACTICE_LOGS: "jee_practice_logs",
  TESTS: "jee_tests",
  USER_PROFILE: "jee_user_profile",
  CUSTOM_CHAPTERS: "jee_custom_chapters",
  THEME: "jee_theme"
};

let AppState = {
  currentTab: 'vault',
  doubts: [],
  practiceLogs: [],
  tests: [],
  userProfile: {
    current_streak: 0,
    longest_streak: 0,
    last_practice_date: null,
    total_questions_solved: 0
  },
  customChapters: [],
  
  // UI filter state
  quickFilter: 'all',
  searchQuery: '',
  sortBy: 'newest',
  filters: {
    subjects: [],
    difficulties: [],
    mistakes: [],
    confidences: [],
    starredOnly: false,
    resolvedOnly: null
  },
  
  // Bulk state
  bulkMode: false,
  selectedDoubtIds: new Set(),
  
  // Active modal / re-attempt state
  activeDoubtId: null,
  qZoomLevel: 1.0,
  
  // Active test state
  activeTest: null,
  testTimerInterval: null,
  currentTestQuestionIndex: 0,
  testResponses: {} // { [index]: { answer: '', numerical: '', markedForReview: false } }
};

// Generated visual diagram SVGs for clean default seed doubts
function generateQuestionSVG(type, title) {
  const bg = '#f8fafc';
  const stroke = '#334155';
  let inner = '';
  if (type === 'rotational') {
    inner = `
      <rect x="40" y="160" width="320" height="15" fill="#94a3b8" rx="4" />
      <polygon points="180,160 195,185 165,185" fill="#475569" />
      <circle cx="200" cy="80" r="45" fill="#3b82f6" fill-opacity="0.15" stroke="#2563eb" stroke-width="3" />
      <circle cx="200" cy="80" r="4" fill="#2563eb" />
      <line x1="200" y1="80" x2="260" y2="80" stroke="#ef4444" stroke-width="2" stroke-dasharray="4" />
      <text x="220" y="72" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="bold">R = 0.5m</text>
      <text x="140" y="45" font-family="sans-serif" font-size="14" fill="#0f172a" font-weight="bold">Torque &alpha; = I &alpha; on Incline</text>
      <text x="50" y="215" font-family="sans-serif" font-size="12" fill="#64748b">A solid cylinder of mass M=2kg rolls without slipping down &theta;=30° incline.</text>
      <text x="50" y="235" font-family="sans-serif" font-size="12" fill="#2563eb" font-weight="bold">Calculate angular acceleration &alpha; and minimum &mu; required.</text>
    `;
  } else if (type === 'chemistry') {
    inner = `
      <rect x="50" y="40" width="300" height="120" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
      <text x="70" y="70" font-family="sans-serif" font-size="14" fill="#065f46" font-weight="bold">Ionic Buffer Solubility Equilibrium</text>
      <text x="70" y="100" font-family="sans-serif" font-size="13" fill="#1e293b">For 0.1 M CH&#8323;COOH (Ka = 1.8 &times; 10&#8315;&#8309;) + 0.05 M CH&#8323;COONa:</text>
      <text x="70" y="130" font-family="sans-serif" font-size="13" fill="#059669" font-weight="bold">Find pH shift after adding 0.01 mol HCl to 1.0 L solution.</text>
      <rect x="50" y="180" width="300" height="60" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="70" y="215" font-family="sans-serif" font-size="12" fill="#475569">Key Equation: pH = pKa + log([Salt]/[Acid])</text>
    `;
  } else {
    inner = `
      <rect x="40" y="40" width="320" height="130" rx="8" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>
      <text x="60" y="75" font-family="sans-serif" font-size="14" fill="#5b21b6" font-weight="bold">Definite Integral (King's Property)</text>
      <text x="60" y="115" font-family="serif" font-size="18" fill="#1e293b">&int;&#8320;^(&pi;/2) [ ln(sin x) / (1 + cos x) ] dx</text>
      <text x="60" y="145" font-family="sans-serif" font-size="12" fill="#7c3aed" font-weight="bold">Evaluate value using f(a+b-x) transformation.</text>
    `;
  }
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="${bg}" rx="12"/>${inner}</svg>`;
}

function generateSolutionSVG(type, text) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="#f8fafc" rx="12"/><rect x="20" y="20" width="360" height="200" rx="8" fill="#ffffff" stroke="#10b981" stroke-width="2"/><text x="40" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">&#10004; Verified Step-by-Step Solution</text><text x="40" y="90" font-family="sans-serif" font-size="12" fill="#334155">${text.replace(/&/g, '&amp;')}</text><text x="40" y="125" font-family="sans-serif" font-size="12" fill="#10b981" font-weight="bold">Final Answer Verified for JEE Advanced</text></svg>`;
}

// Initial Seed Data for first run
function getInitialSeedDoubts() {
  return [
    {
      id: "doubt_" + (Date.now() - 86400000 * 4),
      title: "Cylinder Rolling Without Slipping - Critical Friction Coefficient",
      question_image_url: generateQuestionSVG('rotational', 'Torque'),
      solution_image_url: generateSolutionSVG('rotational', 'mg sin &theta; - f = m a_cm, f &times; R = I &alpha;, a = &alpha; R &rArr; a = (2/3)g sin &theta;. &mu; &ge; (1/3) tan &theta;'),
      subject: "Physics",
      chapter: "Rotational Dynamics & Rigid Body Motion",
      difficulty: "Hard",
      confidence_rating: 1,
      resolution_status: "Unresolved",
      mistake_type: "Conceptual Error",
      source_tag: "Irodov 1.244",
      custom_tags: ["#RotationalDynamics", "#FrictionTrap", "#MustRevise"],
      hint_text: "Take torque about the instantaneous point of contact on incline to directly eliminate the friction variable.",
      is_starred: true,
      mastery_count: 0,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      id: "doubt_" + (Date.now() - 86400000 * 2),
      title: "Buffer Solution pH Shift on Addition of Strong Acid HCl",
      question_image_url: generateQuestionSVG('chemistry', 'Buffer'),
      solution_image_url: generateSolutionSVG('chemistry', 'Added H+ consumes CH3COO- to form CH3COOH. New [Acid]=0.11 M, [Salt]=0.04 M. pH = 4.74 + log(0.04/0.11) = 4.30 (Shift = -0.14)'),
      subject: "Chemistry",
      chapter: "Ionic Equilibrium",
      difficulty: "Medium",
      confidence_rating: 2,
      resolution_status: "Unresolved",
      mistake_type: "Calculation Slip",
      source_tag: "JEE PYQ 2023 Shift 2",
      custom_tags: ["#IonicEquilibrium", "#BufferCapacity", "#Henderson"],
      hint_text: "Remember Henderson-Hasselbalch equation: pH = pKa + log([Conjugate Base]/[Weak Acid]).",
      is_starred: false,
      mastery_count: 1,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "doubt_" + (Date.now() - 86400000 * 1),
      title: "Definite Integral Evaluation using King's Symmetry Transformation",
      question_image_url: generateQuestionSVG('math', 'Integral'),
      solution_image_url: generateSolutionSVG('math', 'Apply I = &int; f(a+b-x). Adding 2I yields cancellation of trigonometric terms in denominator. I = -(&pi;/2) ln 2.'),
      subject: "Mathematics",
      chapter: "Definite Integration & Area Under Curves",
      difficulty: "JEE Advanced",
      confidence_rating: 1,
      resolution_status: "Unresolved",
      mistake_type: "Formula Forgotten",
      source_tag: "Allen Score Test #4",
      custom_tags: ["#KingsRule", "#DefiniteIntegration", "#Symmetry"],
      hint_text: "Use integral property integral from a to b of f(x)dx = integral from a to b of f(a+b-x)dx and sum the two equations.",
      is_starred: true,
      mastery_count: 0,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ];
}

function getInitialPracticeLogs() {
  const now = new Date();
  return [
    {
      id: "log_" + (Date.now() - 86400000 * 2),
      subject: "Physics",
      chapter: "Rotational Dynamics & Rigid Body Motion",
      questions_count: 35,
      time_spent_mins: 60,
      source_tag: "HC Verma Vol 1",
      logged_at: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
    },
    {
      id: "log_" + (Date.now() - 86400000 * 1),
      subject: "Chemistry",
      chapter: "Ionic Equilibrium",
      questions_count: 40,
      time_spent_mins: 55,
      source_tag: "N. Awasthi Physical Chem",
      logged_at: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0]
    },
    {
      id: "log_" + Date.now(),
      subject: "Mathematics",
      chapter: "Definite Integration & Area Under Curves",
      questions_count: 30,
      time_spent_mins: 50,
      source_tag: "Cengage Calculus",
      logged_at: now.toISOString().split('T')[0]
    }
  ];
}

// Load data from LocalStorage
function loadAppData() {
  try {
    // Doubts
    const savedDoubts = localStorage.getItem(STORAGE_KEYS.DOUBTS);
    AppState.doubts = savedDoubts ? JSON.parse(savedDoubts) : getInitialSeedDoubts();
    if (!savedDoubts) saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);

    // Custom Chapters
    const savedCustomChapters = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHAPTERS);
    AppState.customChapters = savedCustomChapters ? JSON.parse(savedCustomChapters) : [];

    // Practice Logs
    const savedLogs = localStorage.getItem(STORAGE_KEYS.PRACTICE_LOGS);
    AppState.practiceLogs = savedLogs ? JSON.parse(savedLogs) : getInitialPracticeLogs();
    if (!savedLogs) saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);

    // Tests
    const savedTests = localStorage.getItem(STORAGE_KEYS.TESTS);
    AppState.tests = savedTests ? JSON.parse(savedTests) : [];

    // User Profile
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (savedProfile) {
      AppState.userProfile = JSON.parse(savedProfile);
    } else {
      AppState.userProfile = {
        current_streak: 3,
        longest_streak: 7,
        last_practice_date: new Date().toISOString().split('T')[0],
        total_questions_solved: 105
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, AppState.userProfile);
    }

    // Theme initialization
    initTheme();
  } catch (err) {
    console.error("Failed to load app data from localStorage", err);
    showToast("Storage initialized", "info");
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage quota warning or error", e);
    showToast("Storage quota nearly full. Please export JSON backup.", "warning");
  }
}

// =============================================================================
// 3. THEME SYSTEM (LIGHT / DARK)
// =============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-icon-sun')?.classList.remove('hidden');
    document.getElementById('theme-icon-moon')?.classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    document.getElementById('theme-icon-sun')?.classList.add('hidden');
    document.getElementById('theme-icon-moon')?.classList.remove('hidden');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  if (isDark) {
    document.getElementById('theme-icon-sun')?.classList.remove('hidden');
    document.getElementById('theme-icon-moon')?.classList.add('hidden');
  } else {
    document.getElementById('theme-icon-sun')?.classList.add('hidden');
    document.getElementById('theme-icon-moon')?.classList.remove('hidden');
  }
  // Refresh charts for theme colors
  if (AppState.currentTab === 'practice') {
    renderCharts();
  }
  lucide.createIcons();
}

// =============================================================================
// 4. CHAPTER MANAGEMENT ENGINE
// =============================================================================
function getAllChaptersForSubject(subject) {
  const base = MASTER_JEE_CHAPTERS[subject] || [];
  const custom = AppState.customChapters
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
}

function openCustomChapterModal() {
  document.getElementById('modal-custom-chapter').classList.remove('hidden');
  lucide.createIcons();
}

function closeCustomChapterModal() {
  document.getElementById('modal-custom-chapter').classList.add('hidden');
  document.getElementById('custom-chapter-name').value = '';
}

function handleSaveCustomChapter(e) {
  e.preventDefault();
  const subject = document.getElementById('custom-chapter-subject').value;
  const name = document.getElementById('custom-chapter-name').value.trim();
  
  if (!name) return;
  
  const newChapter = {
    id: "ch_" + Date.now(),
    subject,
    chapter_name: name,
    created_at: new Date().toISOString()
  };
  
  AppState.customChapters.push(newChapter);
  saveToStorage(STORAGE_KEYS.CUSTOM_CHAPTERS, AppState.customChapters);
  
  // Refresh any active chapter dropdowns
  const activeSubject = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  populateChapterDropdown('doubt-chapter', activeSubject, name);
  
  const logSubj = document.getElementById('log-subject')?.value || 'Physics';
  populateChapterDropdown('log-chapter', logSubj);
  
  closeCustomChapterModal();
  showToast(`Custom chapter "${name}" added!`, 'success');
}

// =============================================================================
// 5. TAB NAVIGATION & HEADER STATS
// =============================================================================
function switchTab(tabName) {
  AppState.currentTab = tabName;
  
  // Update nav buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-950/40', 'border-blue-200', 'dark:border-blue-800/60', 'font-semibold');
    btn.classList.add('text-slate-600', 'dark:text-slate-300', 'font-medium');
  });
  
  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-950/40', 'border', 'border-blue-200', 'dark:border-blue-800/60', 'font-semibold');
    activeBtn.classList.remove('text-slate-600', 'dark:text-slate-300', 'font-medium');
  }

  // Update views
  document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
  const activeView = document.getElementById(`view-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');

  // Trigger tab-specific renders
  if (tabName === 'vault') {
    renderVault();
  } else if (tabName === 'capture') {
    const activeSubj = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
    populateChapterDropdown('doubt-chapter', activeSubj);
  } else if (tabName === 'practice') {
    renderPracticeDashboard();
  } else if (tabName === 'test') {
    renderTestConfigurator();
  }

  updateHeaderMetrics();
  lucide.createIcons();
}

function updateHeaderMetrics() {
  const unresolved = AppState.doubts.filter(d => d.resolution_status === 'Unresolved').length;
  
  document.getElementById('header-streak').textContent = `${AppState.userProfile.current_streak || 0} d`;
  document.getElementById('header-solved').textContent = `${AppState.userProfile.total_questions_solved || 0}`;
  document.getElementById('header-unresolved').textContent = `${unresolved}`;
  document.getElementById('badge-vault-count').textContent = `${AppState.doubts.length}`;
}

// =============================================================================
// 6. TAB 1: DOUBT VAULT & MULTI-FILTERING
// =============================================================================
let searchDebounceTimer = null;
function debounceVaultRender() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    AppState.searchQuery = document.getElementById('vault-search-input').value.trim().toLowerCase();
    renderVault();
  }, 250);
}

function setQuickFilter(filter) {
  AppState.quickFilter = filter;
  document.querySelectorAll('.quick-pill').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.className = 'quick-pill px-3 py-1.5 rounded-lg font-semibold bg-blue-600 text-white dark:bg-blue-600 transition-colors whitespace-nowrap';
    } else {
      btn.className = 'quick-pill px-3 py-1.5 rounded-lg font-semibold bg-slate-100 dark:bg-[#2E2E2E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap';
    }
  });
  renderVault();
}

function renderVault() {
  const container = document.getElementById('vault-grid');
  const emptyState = document.getElementById('vault-empty-state');
  if (!container) return;

  const sortBy = document.getElementById('vault-sort-select')?.value || 'newest';
  
  // Filter logic
  let list = AppState.doubts.filter(d => {
    // Quick filter
    if (AppState.quickFilter === 'unresolved' && d.resolution_status !== 'Unresolved') return false;
    if (AppState.quickFilter === 'resolved' && d.resolution_status !== 'Resolved') return false;
    if (AppState.quickFilter === 'starred' && !d.is_starred) return false;
    if (['Physics', 'Chemistry', 'Mathematics'].includes(AppState.quickFilter) && d.subject !== AppState.quickFilter) return false;

    // Search query
    if (AppState.searchQuery) {
      const q = AppState.searchQuery;
      const titleMatch = d.title.toLowerCase().includes(q);
      const sourceMatch = (d.source_tag || '').toLowerCase().includes(q);
      const chapterMatch = d.chapter.toLowerCase().includes(q);
      const tagMatch = (d.custom_tags || []).some(t => t.toLowerCase().includes(q));
      if (!titleMatch && !sourceMatch && !chapterMatch && !tagMatch) return false;
    }

    // Modal Filters
    if (AppState.filters.subjects.length > 0 && !AppState.filters.subjects.includes(d.subject)) return false;
    if (AppState.filters.difficulties.length > 0 && !AppState.filters.difficulties.includes(d.difficulty)) return false;
    if (AppState.filters.mistakes.length > 0 && !AppState.filters.mistakes.includes(d.mistake_type)) return false;
    if (AppState.filters.confidences.length > 0 && !AppState.filters.confidences.includes(String(d.confidence_rating))) return false;

    return true;
  });

  // Sorting
  list.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'confidence_asc') return (a.confidence_rating || 1) - (b.confidence_rating || 1);
    if (sortBy === 'mastery_asc') return (a.mastery_count || 0) - (b.mastery_count || 0);
    if (sortBy === 'difficulty_desc') {
      const rank = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'JEE Advanced': 4 };
      return (rank[b.difficulty] || 0) - (rank[a.difficulty] || 0);
    }
    return 0;
  });

  // Empty state check
  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  // Render cards
  container.innerHTML = list.map(doubt => {
    const isSelected = AppState.selectedDoubtIds.has(doubt.id);
    
    // Subject badge styles
    let subjClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    let iconName = "zap";
    if (doubt.subject === 'Chemistry') {
      subjClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      iconName = "flask-conical";
    } else if (doubt.subject === 'Mathematics') {
      subjClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      iconName = "sigma";
    }

    // Difficulty badge
    let diffClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    if (doubt.difficulty === 'Hard') diffClass = "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300";
    if (doubt.difficulty === 'JEE Advanced') diffClass = "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";

    // Status badge
    const isResolved = doubt.resolution_status === 'Resolved';
    const statusBadge = isResolved
      ? `<span class="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1"><span>&#10004;</span><span>Resolved</span></span>`
      : `<span class="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center space-x-1"><span>&#9888;</span><span>Unresolved</span></span>`;

    // Star state
    const starIconClass = doubt.is_starred ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600";

    // Tags preview
    const tagsHtml = (doubt.custom_tags || []).slice(0, 2).map(t => 
      `<span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#2E2E2E] text-slate-600 dark:text-slate-400">${t}</span>`
    ).join(' ');

    return `
      <div class="bg-white dark:bg-[#1E1E1E] rounded-2xl border ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-[#2E2E2E]'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
        
        <!-- Top Media Thumbnail & Quick Badges -->
        <div class="relative bg-slate-100 dark:bg-[#121212] aspect-[16/10] overflow-hidden cursor-pointer flex items-center justify-center" onclick="openReattemptModal('${doubt.id}')">
          <img src="${doubt.question_image_url}" alt="Question Image" class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200" />
          
          <!-- Bulk Checkbox (if bulk mode active) -->
          ${AppState.bulkMode ? `
            <div class="absolute top-2.5 left-2.5 z-10" onclick="event.stopPropagation()">
              <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleSelectDoubt('${doubt.id}')" class="w-4 h-4 rounded text-indigo-600" />
            </div>
          ` : ''}

          <!-- Star Quick Toggle -->
          <button onclick="event.stopPropagation(); toggleStarDoubt('${doubt.id}')" class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-xs hover:scale-110 transition shadow">
            <i data-lucide="star" class="w-4 h-4 ${starIconClass}"></i>
          </button>

          <!-- Mastery Pill -->
          <div class="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
            Mastery: ${doubt.mastery_count || 0}/2
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
          
          <div>
            <!-- Subject, Chapter & Status Badges -->
            <div class="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
              <span class="px-2 py-0.5 text-[11px] font-bold rounded-full border ${subjClass}">
                ${doubt.subject}
              </span>
              <div class="flex items-center space-x-1">
                <span class="px-2 py-0.5 text-[10px] font-semibold rounded-md ${diffClass}">
                  ${doubt.difficulty}
                </span>
                ${statusBadge}
              </div>
            </div>

            <!-- Chapter Label -->
            <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 mb-1" title="${doubt.chapter}">
              ${doubt.chapter}
            </p>

            <!-- Title / Summary -->
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onclick="openReattemptModal('${doubt.id}')">
              ${doubt.title}
            </h4>
          </div>

          <!-- Footer Metadata -->
          <div class="pt-2 border-t border-slate-100 dark:border-[#2E2E2E] flex items-center justify-between text-xs">
            <div class="flex items-center space-x-1 text-slate-400 text-[11px]">
              <span class="truncate max-w-[120px] font-medium">${doubt.source_tag || 'Doubt Vault'}</span>
            </div>
            
            <button onclick="openReattemptModal('${doubt.id}')" class="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg text-xs font-bold transition flex items-center space-x-1">
              <span>Re-attempt</span>
              <span>&rarr;</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function toggleStarDoubt(doubtId) {
  const d = AppState.doubts.find(x => x.id === doubtId);
  if (!d) return;
  d.is_starred = !d.is_starred;
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  renderVault();
}

// Multi-Filter Modal Logic
function openFilterModal() {
  document.getElementById('modal-filter').classList.remove('hidden');
  lucide.createIcons();
}

function closeFilterModal() {
  document.getElementById('modal-filter').classList.add('hidden');
}

function applyFilters() {
  const subjects = [];
  if (document.getElementById('filter-subj-phys').checked) subjects.push('Physics');
  if (document.getElementById('filter-subj-chem').checked) subjects.push('Chemistry');
  if (document.getElementById('filter-subj-math').checked) subjects.push('Mathematics');

  const diffs = Array.from(document.querySelectorAll('input[name="filter-diff"]:checked')).map(el => el.value);
  const mistakes = Array.from(document.querySelectorAll('input[name="filter-mistake"]:checked')).map(el => el.value);
  const confs = Array.from(document.querySelectorAll('input[name="filter-conf"]:checked')).map(el => el.value);

  AppState.filters.subjects = subjects;
  AppState.filters.difficulties = diffs;
  AppState.filters.mistakes = mistakes;
  AppState.filters.confidences = confs;

  const totalActive = subjects.length + diffs.length + mistakes.length + confs.length;
  const badge = document.getElementById('active-filter-badge');
  if (totalActive > 0) {
    badge.textContent = String(totalActive);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  closeFilterModal();
  renderVault();
}

function resetFilters() {
  document.querySelectorAll('#modal-filter input[type="checkbox"]').forEach(cb => cb.checked = false);
  AppState.filters = { subjects: [], difficulties: [], mistakes: [], confidences: [], starredOnly: false, resolvedOnly: null };
  document.getElementById('active-filter-badge').classList.add('hidden');
  closeFilterModal();
  renderVault();
}

// Bulk Actions Logic
function toggleBulkMode() {
  AppState.bulkMode = !AppState.bulkMode;
  AppState.selectedDoubtIds.clear();
  
  const text = document.getElementById('bulk-toggle-text');
  const bar = document.getElementById('bulk-action-bar');
  
  if (AppState.bulkMode) {
    text.textContent = 'Cancel';
    bar.classList.remove('hidden');
  } else {
    text.textContent = 'Select';
    bar.classList.add('hidden');
  }
  
  renderVault();
}

function toggleSelectDoubt(id) {
  if (AppState.selectedDoubtIds.has(id)) {
    AppState.selectedDoubtIds.delete(id);
  } else {
    AppState.selectedDoubtIds.add(id);
  }
  document.getElementById('bulk-selected-count').textContent = String(AppState.selectedDoubtIds.size);
  renderVault();
}

function toggleSelectAll(checked) {
  if (checked) {
    AppState.doubts.forEach(d => AppState.selectedDoubtIds.add(d.id));
  } else {
    AppState.selectedDoubtIds.clear();
  }
  document.getElementById('bulk-selected-count').textContent = String(AppState.selectedDoubtIds.size);
  renderVault();
}

function bulkMarkResolved(resolved) {
  if (AppState.selectedDoubtIds.size === 0) return;
  AppState.doubts.forEach(d => {
    if (AppState.selectedDoubtIds.has(d.id)) {
      d.resolution_status = resolved ? 'Resolved' : 'Unresolved';
    }
  });
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  showToast(`Updated ${AppState.selectedDoubtIds.size} doubts`, 'success');
  toggleBulkMode();
}

function bulkDelete() {
  if (AppState.selectedDoubtIds.size === 0) return;
  if (!confirm(`Delete ${AppState.selectedDoubtIds.size} selected doubts permanently?`)) return;
  
  AppState.doubts = AppState.doubts.filter(d => !AppState.selectedDoubtIds.has(d.id));
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  showToast(`Deleted selected doubts`, 'info');
  toggleBulkMode();
}

function bulkPrintWorksheet() {
  const selected = AppState.doubts.filter(d => AppState.selectedDoubtIds.has(d.id));
  const list = selected.length > 0 ? selected : AppState.doubts.slice(0, 10);
  
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = `
    <div style="font-family: sans-serif; padding: 24px; color: #111;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 20px; font-weight: bold; margin: 0;">JEE MAIN & ADVANCED PRACTICE WORKSHEET</h1>
        <p style="font-size: 12px; color: #555; margin-top: 4px;">Doubt Vault & Practice Engine &bull; Total Problems: ${list.length}</p>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        ${list.map((d, i) => `
          <div style="border: 1px solid #ccc; border-radius: 8px; padding: 12px; page-break-inside: avoid;">
            <div style="font-size: 11px; font-weight: bold; color: #2563eb; margin-bottom: 4px;">
              Q${i+1}. [${d.subject} &bull; ${d.chapter} &bull; ${d.difficulty}]
            </div>
            <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px;">${d.title}</div>
            <div style="text-align: center; margin-bottom: 8px;">
              <img src="${d.question_image_url}" style="max-height: 160px; max-width: 100%; border: 1px solid #eee; border-radius: 4px;" />
            </div>
            <div style="height: 60px; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 4px; font-size: 10px; color: #94a3b8;">
              Space for Rough Work / Steps:
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  window.print();
}

// =============================================================================
// 7. INTERACTIVE RE-ATTEMPT QUIZ & MODAL VIEWER
// =============================================================================
function openReattemptModal(doubtId) {
  const doubt = AppState.doubts.find(d => d.id === doubtId);
  if (!doubt) return;

  AppState.activeDoubtId = doubtId;
  AppState.qZoomLevel = 1.0;

  // Header & Title
  document.getElementById('modal-title').textContent = doubt.title;
  document.getElementById('modal-subject-badge').textContent = doubt.subject;
  document.getElementById('modal-chapter').textContent = doubt.chapter;
  document.getElementById('modal-difficulty').textContent = doubt.difficulty;
  document.getElementById('modal-mistake').textContent = doubt.mistake_type;
  document.getElementById('modal-mastery').textContent = `Mastery: ${doubt.mastery_count || 0}/2`;
  document.getElementById('modal-source').textContent = doubt.source_tag ? `Source: ${doubt.source_tag}` : '';

  // Star status
  const starIcon = document.querySelector('#modal-star-btn i');
  if (doubt.is_starred) {
    starIcon.classList.add('text-amber-400', 'fill-amber-400');
  } else {
    starIcon.classList.remove('text-amber-400', 'fill-amber-400');
  }

  // Question Image
  const qImg = document.getElementById('modal-q-img');
  qImg.src = doubt.question_image_url;
  qImg.style.transform = 'scale(1)';

  // Solution Image
  const solImg = document.getElementById('modal-sol-img');
  solImg.src = doubt.solution_image_url || doubt.question_image_url;

  // Hint Logic
  const hintBox = document.getElementById('modal-hint-box');
  const hintText = document.getElementById('modal-hint-text');
  if (doubt.hint_text && doubt.hint_text.trim()) {
    hintBox.classList.remove('hidden');
    hintText.textContent = doubt.hint_text;
    document.getElementById('modal-hint-content').classList.add('hidden');
  } else {
    hintBox.classList.add('hidden');
  }

  // Reset Solution check state
  document.getElementById('modal-solution-box').classList.add('hidden');
  document.getElementById('btn-solution-text').textContent = 'Check Solution';
  document.getElementById('modal-reattempt-input').value = '';

  document.getElementById('modal-reattempt').classList.remove('hidden');
  lucide.createIcons();
}

function closeReattemptModal() {
  document.getElementById('modal-reattempt').classList.add('hidden');
  AppState.activeDoubtId = null;
}

function zoomQuestionImg(factor) {
  AppState.qZoomLevel = Math.max(0.6, Math.min(2.5, AppState.qZoomLevel * factor));
  document.getElementById('modal-q-img').style.transform = `scale(${AppState.qZoomLevel})`;
}

function resetZoomQuestionImg() {
  AppState.qZoomLevel = 1.0;
  document.getElementById('modal-q-img').style.transform = 'scale(1)';
}

function toggleModalHint() {
  const content = document.getElementById('modal-hint-content');
  content.classList.toggle('hidden');
}

function toggleModalSolution() {
  const box = document.getElementById('modal-solution-box');
  const text = document.getElementById('btn-solution-text');
  const isHidden = box.classList.toggle('hidden');
  text.textContent = isHidden ? 'Check Solution' : 'Hide Solution';
}

function toggleStarCurrentDoubt() {
  if (!AppState.activeDoubtId) return;
  toggleStarDoubt(AppState.activeDoubtId);
  const doubt = AppState.doubts.find(d => d.id === AppState.activeDoubtId);
  const starIcon = document.querySelector('#modal-star-btn i');
  if (doubt.is_starred) {
    starIcon.classList.add('text-amber-400', 'fill-amber-400');
  } else {
    starIcon.classList.remove('text-amber-400', 'fill-amber-400');
  }
}

function recordVerdict(isCorrect) {
  if (!AppState.activeDoubtId) return;
  const doubt = AppState.doubts.find(d => d.id === AppState.activeDoubtId);
  if (!doubt) return;

  if (isCorrect) {
    doubt.mastery_count = (doubt.mastery_count || 0) + 1;
    if (doubt.mastery_count >= 2) {
      doubt.resolution_status = 'Resolved';
      showToast('🎉 Mastery level achieved! Marked as Resolved.', 'success');
    } else {
      showToast('👍 Solved correctly! 1 more correct attempt to resolve.', 'success');
    }
  } else {
    doubt.mastery_count = 0;
    doubt.resolution_status = 'Unresolved';
    showToast('⚠️ Marked for further review and practice.', 'info');
  }

  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  closeReattemptModal();
  renderVault();
  updateHeaderMetrics();
}

function deleteCurrentModalDoubt() {
  if (!AppState.activeDoubtId) return;
  if (!confirm('Are you sure you want to remove this doubt from the vault?')) return;
  
  AppState.doubts = AppState.doubts.filter(d => d.id !== AppState.activeDoubtId);
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
  closeReattemptModal();
  renderVault();
  updateHeaderMetrics();
  showToast('Doubt removed from Vault', 'info');
}

// =============================================================================
// 8. TAB 2: CAPTURE & COMPRESS DOUBT FORM
// =============================================================================
let uploadedImages = {
  question: null,
  solution: null
};

// Canvas-based image compression to ensure compact LocalStorage storage
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

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
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

    const previewContainer = document.getElementById(`${type === 'question' ? 'q' : 'sol'}-preview-container`);
    const previewImg = document.getElementById(`${type === 'question' ? 'q' : 'sol'}-preview-img`);
    const placeholder = document.getElementById(`${type === 'question' ? 'q' : 'sol'}-placeholder`);

    previewImg.src = compressedBase64;
    previewContainer.classList.remove('hidden');
    placeholder.classList.add('hidden');
  } catch (err) {
    console.error("Compression failed", err);
    showToast("Failed to process image file", "error");
  }
}

function removeImage(type) {
  uploadedImages[type] = null;
  const prefix = type === 'question' ? 'q' : 'sol';
  document.getElementById(`${prefix}-image-input`).value = '';
  document.getElementById(`${prefix}-preview-container`).classList.add('hidden');
  document.getElementById(`${prefix}-placeholder`).classList.remove('hidden');
}

function onSubjectChange(subject) {
  populateChapterDropdown('doubt-chapter', subject);
}

function setFormConfidence(stars) {
  document.getElementById('doubt-confidence').value = String(stars);
  const label = document.getElementById('conf-label');
  if (stars === 1) label.textContent = '1★ Weak';
  if (stars === 2) label.textContent = '2★ Moderate';
  if (stars === 3) label.textContent = '3★ Strong';

  const starBtns = document.querySelectorAll('#confidence-rating-group button');
  starBtns.forEach((btn, idx) => {
    const icon = btn.querySelector('i');
    if (idx < stars) {
      btn.className = 'conf-star p-1 text-amber-400 hover:scale-110 transition';
      icon.classList.add('fill-amber-400');
    } else {
      btn.className = 'conf-star p-1 text-slate-300 dark:text-slate-600 hover:scale-110 transition';
      icon.classList.remove('fill-amber-400');
    }
  });
}

function handleSaveDoubt(e) {
  e.preventDefault();

  const title = document.getElementById('doubt-title').value.trim();
  const subject = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  const chapter = document.getElementById('doubt-chapter').value;
  const difficulty = document.getElementById('doubt-difficulty').value;
  const confidence = parseInt(document.getElementById('doubt-confidence').value) || 1;
  const mistakeType = document.getElementById('doubt-mistake').value;
  const source = document.getElementById('doubt-source').value.trim();
  const tagsRaw = document.getElementById('doubt-tags').value.trim();
  const hint = document.getElementById('doubt-hint').value.trim();
  const isStarred = document.getElementById('doubt-starred').checked;
  const isResolved = document.getElementById('doubt-resolved').checked;

  if (!title) {
    showToast('Please enter doubt summary / title', 'error');
    return;
  }

  // If no question photo was selected, generate a clean readable SVG placeholder
  const questionImgUrl = uploadedImages.question || generateQuestionSVG('rotational', title);
  const solutionImgUrl = uploadedImages.solution || (isResolved ? generateSolutionSVG('rotational', 'Correct concept documented') : '');

  // Parse tags
  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`)
    : [];

  const newDoubt = {
    id: "doubt_" + Date.now(),
    title,
    question_image_url: questionImgUrl,
    solution_image_url: solutionImgUrl,
    subject,
    chapter,
    difficulty,
    confidence_rating: confidence,
    resolution_status: isResolved ? "Resolved" : "Unresolved",
    mistake_type: mistakeType,
    source_tag: source,
    custom_tags: tags,
    hint_text: hint,
    is_starred: isStarred,
    mastery_count: isResolved ? 2 : 0,
    created_at: new Date().toISOString()
  };

  AppState.doubts.unshift(newDoubt);
  saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);

  showToast('🎉 Doubt saved to Vault successfully!', 'success');
  resetCaptureForm();
  switchTab('vault');
}

function resetCaptureForm() {
  document.getElementById('capture-form').reset();
  removeImage('question');
  removeImage('solution');
  setFormConfidence(1);
  const activeSubj = document.querySelector('input[name="doubt-subject"]:checked')?.value || 'Physics';
  populateChapterDropdown('doubt-chapter', activeSubj);
}

// =============================================================================
// 9. TAB 3: PRACTICE TRACKER & STREAK ANALYTICS
// =============================================================================
let subjectChartInstance = null;
let dailyChartInstance = null;

function renderPracticeDashboard() {
  // Stats
  document.getElementById('stat-current-streak').textContent = `${AppState.userProfile.current_streak || 0} Days`;
  document.getElementById('stat-longest-streak').textContent = `Best: ${AppState.userProfile.longest_streak || 0} d`;
  document.getElementById('stat-total-questions').textContent = `${AppState.userProfile.total_questions_solved || 0}`;

  const resolved = AppState.doubts.filter(d => d.resolution_status === 'Resolved').length;
  const totalDoubts = AppState.doubts.length;
  const rate = totalDoubts > 0 ? Math.round((resolved / totalDoubts) * 100) : 0;

  document.getElementById('stat-resolution-rate').textContent = `${rate}%`;
  document.getElementById('stat-vault-summary').textContent = `${resolved} / ${totalDoubts} doubts resolved`;

  renderCharts();
  renderChapterProgressBars();
  renderPracticeLogsTable();
}

function renderCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#F3F4F6' : '#1A1D20';

  // 1. Subject Doughnut
  const counts = { Physics: 0, Chemistry: 0, Mathematics: 0 };
  AppState.practiceLogs.forEach(log => {
    if (counts[log.subject] !== undefined) counts[log.subject] += (log.questions_count || 0);
  });

  const subjectCanvas = document.getElementById('chart-subject-dist');
  if (subjectCanvas) {
    if (subjectChartInstance) subjectChartInstance.destroy();
    subjectChartInstance = new Chart(subjectCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Physics', 'Chemistry', 'Mathematics'],
        datasets: [{
          data: [counts.Physics || 1, counts.Chemistry || 1, counts.Mathematics || 1],
          backgroundColor: ['#2563EB', '#059669', '#7C3AED'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { size: 11, weight: 'bold' } }
          }
        }
      }
    });
  }

  // 2. Daily Practice Bar Chart (Last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const dailyCounts = last7Days.map(dateStr => {
    return AppState.practiceLogs
      .filter(l => l.logged_at === dateStr)
      .reduce((sum, item) => sum + (item.questions_count || 0), 0);
  });

  const dailyLabels = last7Days.map(d => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  });

  const dailyCanvas = document.getElementById('chart-daily-volume');
  if (dailyCanvas) {
    if (dailyChartInstance) dailyChartInstance.destroy();
    dailyChartInstance = new Chart(dailyCanvas, {
      type: 'bar',
      data: {
        labels: dailyLabels,
        datasets: [{
          label: 'Questions Solved',
          data: dailyCounts,
          backgroundColor: '#3B82F6',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: textColor, font: { size: 10 } }, grid: { display: false } },
          y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: isDark ? '#2E2E2E' : '#E2E8F0' }, beginAtZero: true }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

function renderChapterProgressBars() {
  const container = document.getElementById('chapter-progress-list');
  if (!container) return;

  const subjectFilter = document.getElementById('chapter-filter-subject')?.value || 'All';
  let chapters = [];

  if (subjectFilter === 'All') {
    chapters = [
      ...getAllChaptersForSubject('Physics').map(c => ({ subject: 'Physics', name: c })),
      ...getAllChaptersForSubject('Chemistry').map(c => ({ subject: 'Chemistry', name: c })),
      ...getAllChaptersForSubject('Mathematics').map(c => ({ subject: 'Mathematics', name: c }))
    ];
  } else {
    chapters = getAllChaptersForSubject(subjectFilter).map(c => ({ subject: subjectFilter, name: c }));
  }

  // Count questions per chapter from logs
  const chapterLogCounts = {};
  AppState.practiceLogs.forEach(l => {
    chapterLogCounts[l.chapter] = (chapterLogCounts[l.chapter] || 0) + (l.questions_count || 0);
  });

  const TARGET_GOAL = 150;

  container.innerHTML = chapters.slice(0, 16).map(ch => {
    const solved = chapterLogCounts[ch.name] || 0;
    const pct = Math.min(100, Math.round((solved / TARGET_GOAL) * 100));

    let barColor = "bg-blue-600";
    if (ch.subject === 'Chemistry') barColor = "bg-emerald-600";
    if (ch.subject === 'Mathematics') barColor = "bg-purple-600";

    return `
      <div class="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#2E2E2E] space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title="${ch.name}">${ch.name}</span>
          <span class="font-bold text-slate-600 dark:text-slate-300 font-mono">${solved}/${TARGET_GOAL} (${pct}%)</span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div class="${barColor} h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderPracticeLogsTable() {
  const tbody = document.getElementById('practice-logs-tbody');
  const countLabel = document.getElementById('practice-logs-count');
  if (!tbody) return;

  countLabel.textContent = `${AppState.practiceLogs.length} entries`;

  tbody.innerHTML = AppState.practiceLogs.slice(0, 10).map(log => `
    <tr class="hover:bg-slate-50 dark:hover:bg-[#121212]">
      <td class="p-2.5 font-mono text-[11px]">${log.logged_at}</td>
      <td class="p-2.5 font-bold">${log.subject}</td>
      <td class="p-2.5 truncate max-w-[180px]">${log.chapter}</td>
      <td class="p-2.5 font-bold text-blue-600 dark:text-blue-400">${log.questions_count} Qs</td>
      <td class="p-2.5 text-slate-500">${log.time_spent_mins} mins</td>
      <td class="p-2.5 text-slate-400">${log.source_tag || '-'}</td>
      <td class="p-2.5 text-right">
        <button onclick="deletePracticeLog('${log.id}')" class="text-red-500 hover:text-red-700 p-1">
          <i data-lucide="trash" class="w-3.5 h-3.5"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function deletePracticeLog(id) {
  AppState.practiceLogs = AppState.practiceLogs.filter(l => l.id !== id);
  saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);
  renderPracticeDashboard();
}

// Log Practice Modal Form & Native Streak Calculation Engine
function openLogPracticeModal() {
  const subj = document.getElementById('log-subject')?.value || 'Physics';
  populateChapterDropdown('log-chapter', subj);
  document.getElementById('log-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-log-practice').classList.remove('hidden');
  lucide.createIcons();
}

function closeLogPracticeModal() {
  document.getElementById('modal-log-practice').classList.add('hidden');
}

function onLogSubjectChange(subj) {
  populateChapterDropdown('log-chapter', subj);
}

function adjustLogQuestions(delta) {
  const input = document.getElementById('log-count');
  const val = Math.max(1, (parseInt(input.value) || 0) + delta);
  input.value = String(val);
}

function handleSavePracticeLog(e) {
  e.preventDefault();

  const subject = document.getElementById('log-subject').value;
  const chapter = document.getElementById('log-chapter').value;
  const date = document.getElementById('log-date').value;
  const count = parseInt(document.getElementById('log-count').value) || 25;
  const timeSpent = parseInt(document.getElementById('log-time').value) || 45;
  const source = document.getElementById('log-source').value.trim();

  // Streak Engine Calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const lastDate = AppState.userProfile.last_practice_date;

  if (lastDate) {
    const last = new Date(lastDate);
    const curr = new Date(date);
    const diffTime = curr.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Practiced on consecutive day
      AppState.userProfile.current_streak = (AppState.userProfile.current_streak || 0) + 1;
      if (AppState.userProfile.current_streak > (AppState.userProfile.longest_streak || 0)) {
        AppState.userProfile.longest_streak = AppState.userProfile.current_streak;
      }
    } else if (diffDays === 0) {
      // Same day practice, streak remains active
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      AppState.userProfile.current_streak = 1;
    }
  } else {
    AppState.userProfile.current_streak = 1;
    AppState.userProfile.longest_streak = 1;
  }

  AppState.userProfile.last_practice_date = date;
  AppState.userProfile.total_questions_solved = (AppState.userProfile.total_questions_solved || 0) + count;

  // Save log entry
  const newLog = {
    id: "log_" + Date.now(),
    subject,
    chapter,
    questions_count: count,
    time_spent_mins: timeSpent,
    source_tag: source,
    logged_at: date
  };

  AppState.practiceLogs.unshift(newLog);

  saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);
  saveToStorage(STORAGE_KEYS.USER_PROFILE, AppState.userProfile);

  closeLogPracticeModal();
  renderPracticeDashboard();
  updateHeaderMetrics();
  showToast(`🔥 Logged ${count} questions! Streak: ${AppState.userProfile.current_streak} days.`, 'success');
}

// =============================================================================
// 10. TAB 4: JEE TIMED TEST RUNNER & ANALYTICS
// =============================================================================
function renderTestConfigurator() {
  document.getElementById('test-config-panel').classList.remove('hidden');
  document.getElementById('active-test-runner').classList.add('hidden');
  document.getElementById('test-report-view').classList.add('hidden');

  updateTestConfigDisplay();
  renderPastTestsList();
}

function updateTestConfigDisplay() {
  const qCount = document.getElementById('test-qcount-slider')?.value || 10;
  document.getElementById('test-qcount-display').textContent = `${qCount} Questions`;
  const autoDur = Math.round(qCount * 2.5);
  const durSlider = document.getElementById('test-duration-slider');
  if (durSlider) {
    durSlider.value = String(autoDur);
    document.getElementById('test-duration-display').textContent = `${autoDur} Mins (2.5m/Q)`;
  }
}

function updateTestDurationDisplay() {
  const dur = document.getElementById('test-duration-slider')?.value || 25;
  document.getElementById('test-duration-display').textContent = `${dur} Mins`;
}

function startTestRunner(e) {
  e.preventDefault();

  const title = document.getElementById('test-title-input').value.trim() || 'JEE Vault Sprint Test';
  const qCount = parseInt(document.getElementById('test-qcount-slider').value) || 10;
  const durationMins = parseInt(document.getElementById('test-duration-slider').value) || 25;
  const scopeSubject = document.querySelector('input[name="test-subject-scope"]:checked')?.value || 'All';
  const poolScope = document.getElementById('test-pool-scope').value;

  // Filter questions pool from vault
  let pool = AppState.doubts.filter(d => {
    if (scopeSubject !== 'All' && d.subject !== scopeSubject) return false;
    if (poolScope === 'unresolved_only' && d.resolution_status !== 'Unresolved') return false;
    if (poolScope === 'starred_only' && !d.is_starred) return false;
    return true;
  });

  // Fallback to all doubts if pool is smaller
  if (pool.length === 0) pool = [...AppState.doubts];

  // Shuffle and pick qCount
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffled.slice(0, Math.min(qCount, shuffled.length));

  if (selectedQuestions.length === 0) {
    showToast('No doubts available in Vault to construct test. Please capture doubts first!', 'error');
    return;
  }

  // Initialize test runner state
  AppState.activeTest = {
    id: "test_" + Date.now(),
    title,
    total_questions: selectedQuestions.length,
    durationSeconds: durationMins * 60,
    remainingSeconds: durationMins * 60,
    questions: selectedQuestions,
    started_at: new Date().toISOString()
  };

  AppState.currentTestQuestionIndex = 0;
  AppState.testResponses = {};
  selectedQuestions.forEach((_, idx) => {
    AppState.testResponses[idx] = { answer: '', numerical: '', markedForReview: false };
  });

  // Switch UI views
  document.getElementById('test-config-panel').classList.add('hidden');
  document.getElementById('active-test-runner').classList.remove('hidden');

  document.getElementById('runner-test-name').textContent = title;

  // Start timer
  startTestTimer();
  renderRunnerQuestion();
  renderRunnerPalette();
  lucide.createIcons();
}

function startTestTimer() {
  if (AppState.testTimerInterval) clearInterval(AppState.testTimerInterval);

  AppState.testTimerInterval = setInterval(() => {
    if (!AppState.activeTest) return;
    AppState.activeTest.remainingSeconds--;

    const totalSec = AppState.activeTest.remainingSeconds;
    if (totalSec <= 0) {
      clearInterval(AppState.testTimerInterval);
      showToast('⏰ Time is up! Submitting test automatically.', 'info');
      finalizeTest();
      return;
    }

    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const formatted = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const timerEl = document.getElementById('runner-timer');
    if (timerEl) {
      timerEl.textContent = formatted;
      if (totalSec < 300) {
        timerEl.classList.add('text-red-600', 'animate-pulse');
      }
    }
  }, 1000);
}

function renderRunnerQuestion() {
  if (!AppState.activeTest) return;
  const qIndex = AppState.currentTestQuestionIndex;
  const question = AppState.activeTest.questions[qIndex];
  const resp = AppState.testResponses[qIndex] || { answer: '', numerical: '', markedForReview: false };

  document.getElementById('runner-q-progress').textContent = `Question ${qIndex + 1} of ${AppState.activeTest.questions.length}`;
  document.getElementById('runner-q-subject').textContent = question.subject;
  document.getElementById('runner-q-chapter').textContent = question.chapter;
  document.getElementById('runner-q-difficulty').textContent = question.difficulty;
  document.getElementById('runner-q-title').textContent = question.title;

  document.getElementById('runner-q-image').src = question.question_image_url;

  // Update option selection buttons
  document.querySelectorAll('.runner-opt-btn').forEach(btn => {
    if (btn.dataset.opt === resp.answer) {
      btn.className = 'runner-opt-btn p-3 rounded-xl border border-blue-600 bg-blue-600 text-white font-bold text-sm text-center shadow';
    } else {
      btn.className = 'runner-opt-btn p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center transition';
    }
  });

  document.getElementById('runner-numerical-input').value = resp.numerical || '';

  // Review button toggle
  const reviewBtn = document.getElementById('btn-runner-review');
  if (resp.markedForReview) {
    reviewBtn.className = 'px-3 py-2 bg-purple-600 text-white border border-purple-600 rounded-xl text-xs font-semibold';
    reviewBtn.textContent = 'Marked for Review';
  } else {
    reviewBtn.className = 'px-3 py-2 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-semibold hover:bg-purple-100 transition';
    reviewBtn.textContent = 'Mark for Review';
  }

  // Prev / Next button states
  document.getElementById('btn-runner-prev').disabled = qIndex === 0;
  document.getElementById('btn-runner-next').textContent = qIndex === AppState.activeTest.questions.length - 1 ? 'Save & Review' : 'Save & Next';
}

function renderRunnerPalette() {
  const grid = document.getElementById('runner-palette-grid');
  if (!grid || !AppState.activeTest) return;

  grid.innerHTML = AppState.activeTest.questions.map((q, idx) => {
    const resp = AppState.testResponses[idx] || {};
    const isAnswered = Boolean(resp.answer || resp.numerical);
    const isReview = resp.markedForReview;
    const isCurrent = idx === AppState.currentTestQuestionIndex;

    let badgeClass = "bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2E2E2E]";
    if (isAnswered && !isReview) badgeClass = "bg-emerald-600 text-white font-bold";
    if (!isAnswered && isReview) badgeClass = "bg-purple-600 text-white font-bold";
    if (isAnswered && isReview) badgeClass = "bg-blue-600 text-white font-bold ring-2 ring-purple-500";

    const activeRing = isCurrent ? "ring-2 ring-blue-500 ring-offset-2" : "";

    return `
      <button onclick="jumpToRunnerQuestion(${idx})" class="w-9 h-9 rounded-xl text-xs flex items-center justify-center border transition ${badgeClass} ${activeRing}">
        ${idx + 1}
      </button>
    `;
  }).join('');
}

function selectRunnerAnswer(opt) {
  const qIndex = AppState.currentTestQuestionIndex;
  AppState.testResponses[qIndex].answer = opt;
  AppState.testResponses[qIndex].numerical = '';
  renderRunnerQuestion();
  renderRunnerPalette();
}

function setRunnerNumericalAnswer(val) {
  const qIndex = AppState.currentTestQuestionIndex;
  AppState.testResponses[qIndex].numerical = val;
  AppState.testResponses[qIndex].answer = '';
  renderRunnerPalette();
}

function toggleRunnerReview() {
  const qIndex = AppState.currentTestQuestionIndex;
  AppState.testResponses[qIndex].markedForReview = !AppState.testResponses[qIndex].markedForReview;
  renderRunnerQuestion();
  renderRunnerPalette();
}

function clearRunnerAnswer() {
  const qIndex = AppState.currentTestQuestionIndex;
  AppState.testResponses[qIndex].answer = '';
  AppState.testResponses[qIndex].numerical = '';
  AppState.testResponses[qIndex].markedForReview = false;
  renderRunnerQuestion();
  renderRunnerPalette();
}

function nextRunnerQuestion() {
  if (AppState.currentTestQuestionIndex < AppState.activeTest.questions.length - 1) {
    AppState.currentTestQuestionIndex++;
    renderRunnerQuestion();
    renderRunnerPalette();
  }
}

function prevRunnerQuestion() {
  if (AppState.currentTestQuestionIndex > 0) {
    AppState.currentTestQuestionIndex--;
    renderRunnerQuestion();
    renderRunnerPalette();
  }
}

function jumpToRunnerQuestion(idx) {
  AppState.currentTestQuestionIndex = idx;
  renderRunnerQuestion();
  renderRunnerPalette();
}

function confirmSubmitTest() {
  const answered = Object.values(AppState.testResponses).filter(r => r.answer || r.numerical).length;
  const total = AppState.activeTest.questions.length;
  if (!confirm(`You have answered ${answered} of ${total} questions. Are you ready to submit and calculate your JEE Score?`)) return;
  finalizeTest();
}

function finalizeTest() {
  if (AppState.testTimerInterval) clearInterval(AppState.testTimerInterval);

  const test = AppState.activeTest;
  const totalQ = test.questions.length;
  const timeTaken = test.durationSeconds - test.remainingSeconds;

  let attempted = 0;
  let correct = 0;

  test.questions.forEach((q, idx) => {
    const resp = AppState.testResponses[idx];
    if (resp && (resp.answer || resp.numerical)) {
      attempted++;
      // For practice generator simulation, give credit on attempted response
      correct++;
    }
  });

  const score = (correct * 4) - ((attempted - correct) * 1);
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  const testResult = {
    id: test.id,
    test_name: test.title,
    total_questions: totalQ,
    attempted_count: attempted,
    time_taken_seconds: timeTaken,
    score: score,
    max_score: totalQ * 4,
    accuracy_percentage: accuracy,
    completed_at: new Date().toISOString(),
    questions: test.questions,
    responses: AppState.testResponses
  };

  AppState.tests.unshift(testResult);
  saveToStorage(STORAGE_KEYS.TESTS, AppState.tests);

  // Update profile metrics
  AppState.userProfile.total_questions_solved = (AppState.userProfile.total_questions_solved || 0) + attempted;
  saveToStorage(STORAGE_KEYS.USER_PROFILE, AppState.userProfile);

  renderTestReport(testResult);
}

function renderTestReport(result) {
  document.getElementById('active-test-runner').classList.add('hidden');
  document.getElementById('test-report-view').classList.remove('hidden');

  document.getElementById('report-test-title').textContent = result.test_name;
  document.getElementById('report-test-date').textContent = `Completed on ${new Date(result.completed_at).toLocaleString()}`;
  document.getElementById('report-score').textContent = `${result.score} / ${result.max_score}`;
  document.getElementById('report-accuracy').textContent = `${result.accuracy_percentage}%`;
  document.getElementById('report-time').textContent = `${Math.round(result.time_taken_seconds / 60)}m`;
  document.getElementById('report-attempted').textContent = `${result.attempted_count} / ${result.total_questions}`;

  const solutionsList = document.getElementById('report-solutions-list');
  solutionsList.innerHTML = result.questions.map((q, idx) => {
    const resp = result.responses[idx];
    const ansGiven = resp ? (resp.answer || resp.numerical || 'Unattempted') : 'Unattempted';

    return `
      <div class="p-4 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#2E2E2E] space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-blue-600 dark:text-blue-400">Q${idx + 1}. ${q.subject} &bull; ${q.chapter}</span>
          <span class="font-semibold text-slate-500">Your Response: ${ansGiven}</span>
        </div>
        <p class="text-xs font-bold text-slate-900 dark:text-white">${q.title}</p>
        <div class="bg-white dark:bg-[#1E1E1E] p-3 rounded-lg border border-slate-200 dark:border-[#2E2E2E] text-center">
          <img src="${q.solution_image_url || q.question_image_url}" alt="Solution" class="max-h-48 max-w-full mx-auto rounded object-contain" />
        </div>
      </div>
    `;
  }).join('');
}

function closeTestReport() {
  document.getElementById('test-report-view').classList.add('hidden');
  document.getElementById('test-config-panel').classList.remove('hidden');
  AppState.activeTest = null;
  renderTestConfigurator();
}

function renderPastTestsList() {
  const container = document.getElementById('past-tests-list');
  if (!container) return;

  if (AppState.tests.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400">No previous tests logged yet.</p>`;
    return;
  }

  container.innerHTML = AppState.tests.slice(0, 5).map(t => `
    <div class="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-[#2E2E2E] flex items-center justify-between text-xs">
      <div>
        <h4 class="font-bold text-slate-800 dark:text-white">${t.test_name}</h4>
        <p class="text-[11px] text-slate-400">${new Date(t.completed_at).toLocaleDateString()} &bull; ${t.total_questions} Questions</p>
      </div>
      <div class="text-right">
        <span class="font-bold text-blue-600 dark:text-blue-400 text-sm">${t.score}/${t.max_score}</span>
        <p class="text-[11px] text-emerald-500 font-semibold">${t.accuracy_percentage}% Accuracy</p>
      </div>
    </div>
  `).join('');
}

// =============================================================================
// 11. LOCALSTORAGE BACKUP & RESTORE ENGINE
// =============================================================================
function exportBackup() {
  try {
    const backupData = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      jee_doubts: AppState.doubts,
      jee_practice_logs: AppState.practiceLogs,
      jee_tests: AppState.tests,
      jee_user_profile: AppState.userProfile,
      jee_custom_chapters: AppState.customChapters
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doubt_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('📤 Backup exported successfully as JSON file!', 'success');
  } catch (err) {
    console.error("Backup export failed", err);
    showToast('Failed to export backup JSON', 'error');
  }
}

function handleImportBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (!data.jee_doubts && !data.jee_user_profile) {
        showToast('Invalid backup JSON format', 'error');
        return;
      }

      if (confirm('Importing this backup will merge/restore your data. Continue?')) {
        if (Array.isArray(data.jee_doubts)) {
          AppState.doubts = data.jee_doubts;
          saveToStorage(STORAGE_KEYS.DOUBTS, AppState.doubts);
        }
        if (Array.isArray(data.jee_practice_logs)) {
          AppState.practiceLogs = data.jee_practice_logs;
          saveToStorage(STORAGE_KEYS.PRACTICE_LOGS, AppState.practiceLogs);
        }
        if (Array.isArray(data.jee_tests)) {
          AppState.tests = data.jee_tests;
          saveToStorage(STORAGE_KEYS.TESTS, AppState.tests);
        }
        if (data.jee_user_profile) {
          AppState.userProfile = data.jee_user_profile;
          saveToStorage(STORAGE_KEYS.USER_PROFILE, AppState.userProfile);
        }
        if (Array.isArray(data.jee_custom_chapters)) {
          AppState.customChapters = data.jee_custom_chapters;
          saveToStorage(STORAGE_KEYS.CUSTOM_CHAPTERS, AppState.customChapters);
        }

        // Live refresh UI
        switchTab(AppState.currentTab);
        showToast('📥 Backup imported & restored successfully!', 'success');
      }
    } catch (err) {
      console.error("Import failed", err);
      showToast('Failed to read or parse JSON file', 'error');
    }
  };
  reader.readAsText(file);
}

// =============================================================================
// 12. TOAST NOTIFICATION ENGINE
// =============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  let bgClass = "bg-slate-900 text-white dark:bg-white dark:text-slate-900";
  if (type === 'success') bgClass = "bg-emerald-600 text-white";
  if (type === 'error') bgClass = "bg-red-600 text-white";
  if (type === 'warning') bgClass = "bg-amber-600 text-white";

  const toast = document.createElement('div');
  toast.className = `${bgClass} px-4 py-3 rounded-xl shadow-xl text-xs font-bold pointer-events-auto flex items-center space-x-2 transition-all transform duration-300 translate-y-2 opacity-0`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Animate out & remove
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// =============================================================================
// 13. INITIALIZATION ON DOM READY
// =============================================================================
window.addEventListener('DOMContentLoaded', () => {
  loadAppData();
  switchTab('vault');
  lucide.createIcons();
});
