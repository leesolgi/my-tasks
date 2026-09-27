// ================================================================
// 설정
// ================================================================

const STORAGE_KEY = 'myTasks';
const FILTER_KEY = 'myTasksFilter';
const THEME_KEY = 'myTasksTheme';
const SORT_KEY = 'myTasksSort';
const BACKUP_KEY = 'myTasksLastBackup';

const CATEGORIES = {
  work: '업무',
  personal: '개인',
  study: '공부',
};
const CATEGORY_ORDER = Object.keys(CATEGORIES);
const DEFAULT_CATEGORY = 'work';
const FILTERS = ['all', ...CATEGORY_ORDER];
const SORTS = ['status', 'newest', 'oldest', 'category', 'manual'];
const MAX_LENGTH = 100;
const MAX_IMPORT_SIZE = 5 * 1024 * 1024;
const UNDO_LIMIT = 30;
const BACKUP_REMIND_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

// 시간(ms). 애니메이션 값은 style.css와 맞춘다
const SEARCH_DELAY = 200;
const SAVE_DELAY = 300;
const TOAST_DURATION = 5000;
const LEAVE_DURATION = 250;
const SLIDE_DURATION = 350;
// 이보다 많이 보이면 위치 이동 애니메이션을 생략해서 성능을 지킨다
const MAX_ANIMATED_ITEMS = 150;

// Alt + 숫자 → 필터. 한글 자판에서도 동작하도록 event.code로 판단한다
const FILTER_SHORTCUTS = {
  Digit1: 'all',
  Digit2: 'work',
  Digit3: 'personal',
  Digit4: 'study',
};

const QUOTES = [
  { text: '천 리 길도 한 걸음부터.', author: '속담' },
  { text: '오늘 할 수 있는 일을 내일로 미루지 마라.', author: '벤저민 프랭클린' },
  { text: '시작이 반이다.', author: '속담' },
  { text: '우리가 반복하는 행동이 곧 우리 자신이다.', author: '아리스토텔레스' },
  { text: '계획 없는 목표는 한낱 꿈에 불과하다.', author: '생텍쥐페리' },
  { text: '성공은 매일 반복한 작은 노력들의 합이다.', author: '로버트 콜리어' },
  { text: '행동은 모든 성공의 기본 열쇠다.', author: '파블로 피카소' },
  { text: '할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 된다.', author: '헨리 포드' },
  { text: '시작하는 방법은 말을 멈추고 행동하는 것이다.', author: '월트 디즈니' },
  { text: '가장 중요한 일을 가장 먼저 하라.', author: '스티븐 코비' },
  { text: '늦었다고 생각할 때가 가장 빠른 때다.', author: '속담' },
  { text: '멈추지 않는 한 얼마나 천천히 가는지는 중요하지 않다.', author: '공자' },
];

const CHEERS = [
  '잘했어요! 👏',
  '멋져요! ✨',
  '한 걸음 더 나아갔어요! 🚶',
  '좋아요, 이 흐름 그대로! 🔥',
  '착착 해내고 있어요! 💪',
];

// 자동 분류 키워드. 할 일에 포함된 키워드의 글자 수를 점수로 더해 가장 높은 카테고리를 고른다.
// 영어는 소문자로 적는다. 한 글자 키워드는 오분류가 많아 쓰지 않는다
const AUTO_CATEGORY_KEY = 'myTasksAutoCategory';
const CATEGORY_KEYWORDS = {
  work: [
    '업무', '회의', '미팅', '보고서', '보고', '기획', '발표', '메일', '이메일', '결재', '출장',
    '계약', '고객', '거래처', '프로젝트', '마감', '제안서', '견적', '회사', '출근', '야근',
    '세미나', '문서', '자료', '엑셀', '슬라이드', '피피티', '코드 리뷰', '배포', '업데이트',
    '팀장', '팀원', '상사', '동료', '면담', '회식', '월급', '급여', '정산', '영수증',
    'meeting', 'report', 'email', 'ppt', 'deadline', 'project', 'client',
  ],
  personal: [
    '장보기', '마트', '운동', '헬스', '요가', '필라테스', '산책', '조깅', '러닝', '병원',
    '치과', '약국', '약속', '친구', '가족', '부모님', '엄마', '아빠', '청소', '빨래',
    '설거지', '요리', '분리수거', '은행', '택배', '쇼핑', '생일', '선물', '여행', '예약',
    '미용실', '영화', '데이트', '저녁', '점심', '아침', '반려', '공과금', '관리비',
    'gym', 'workout', 'shopping', 'dinner', 'birthday',
  ],
  study: [
    '공부', '강의', '수업', '과제', '숙제', '시험', '복습', '예습', '단어', '영어', '수학',
    '독서', '책 읽기', '논문', '문제 풀이', '학습', '인강', '자격증', '토익', '토플', '오픽',
    '알고리즘', '코딩 연습', '암기', '노트 정리', '레포트', '리포트', '중간고사', '기말고사',
    '스터디', '튜토리얼', '문법', '회화', '독해',
    'study', 'exam', 'lecture', 'homework', 'toeic', 'leetcode',
  ],
};

// ================================================================
// DOM
// ================================================================

const $ = (id) => document.getElementById(id);

const form = $('todo-form');
const input = $('todo-input');
const categorySelect = $('category-select');
const formMessage = $('form-message');
const searchInput = $('search-input');
const sortSelect = $('sort-select');
const filters = $('filters');
const list = $('todo-list');
const themeToggle = $('theme-toggle');
const remainingBadge = $('remaining-badge');

const quoteText = $('quote-text');
const quoteAuthor = $('quote-author');
const quoteNext = $('quote-next');

const dashboard = $('dashboard');
const progressPercent = $('progress-percent');
const progressCount = $('progress-count');
const progressBar = $('progress-bar');
const progressFill = $('progress-fill');
const todayCount = $('today-count');
const cheerMessage = $('cheer-message');

const emptyState = $('empty-state');
const emptyIcon = $('empty-icon');
const emptyTitle = $('empty-title');
const emptyDesc = $('empty-desc');

const listFooter = $('list-footer');
const listSummary = $('list-summary');
const clearCompletedButton = $('clear-completed');

const backupStatus = $('backup-status');
const exportButton = $('export-btn');
const importButton = $('import-btn');
const importFile = $('import-file');
const importDialog = $('import-dialog');
const importSummary = $('import-summary');
const importBackup = $('import-backup');
const importBackupLabel = $('import-backup-label');

const toast = $('toast');
const toastMessage = $('toast-message');
const toastUndo = $('toast-undo');
const toastClose = $('toast-close');
const announcer = $('announcer');
const autoCategoryToggle = $('auto-category-toggle');
const autoHint = $('auto-hint');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ================================================================
// 저장소
// ================================================================

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`데이터(${key})를 저장하지 못했습니다.`, error);
    return false;
  }
}

function loadChoice(key, allowed, fallback) {
  const saved = readStorage(key);
  return allowed.includes(saved) ? saved : fallback;
}

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function isCategory(value) {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, value);
}

// 저장된 데이터와 가져온 파일 모두 이 함수로 검증한다
function sanitizeTodo(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.text !== 'string') return null;
  const text = raw.text.trim().slice(0, MAX_LENGTH);
  if (!text) return null;

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    text,
    // 카테고리가 없는 데이터는 키워드로 분류하고, 맞는 키워드가 없으면 기본 카테고리로 채운다
    category: isCategory(raw.category)
      ? raw.category
      : classifyText(text)?.category ?? DEFAULT_CATEGORY,
    completed: raw.completed === true,
    createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
  };
}

function sanitizeList(rawList) {
  const seen = new Set();
  const result = [];
  for (const raw of rawList) {
    const todo = sanitizeTodo(raw);
    if (!todo) continue;
    if (seen.has(todo.id)) todo.id = createId();
    seen.add(todo.id);
    result.push(todo);
  }
  return result;
}

function loadTodos() {
  try {
    const saved = JSON.parse(readStorage(STORAGE_KEY));
    return Array.isArray(saved) ? sanitizeList(saved) : [];
  } catch (error) {
    console.warn('저장된 할 일을 읽지 못해 빈 목록으로 시작합니다.', error);
    return [];
  }
}

// 빠르게 여러 번 바뀌어도 마지막 한 번만 저장한다(디바운싱)
let saveTimer = null;

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, SAVE_DELAY);
}

function flushSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
  if (!writeStorage(STORAGE_KEY, JSON.stringify(todos))) {
    showToast('저장 공간이 부족해서 변경 내용을 저장하지 못했어요.');
  }
}

// ================================================================
// 상태
// ================================================================

let todos = loadTodos();
let currentFilter = loadChoice(FILTER_KEY, FILTERS, 'all');
let sortMode = loadChoice(SORT_KEY, SORTS, 'status');
let searchQuery = '';
let editingId = null;
let justAddedId = null;
let pendingDuplicate = null;
let pendingImport = null;
let undoStack = [];
let isRendering = false;
let drag = null;
let autoCategoryEnabled = readStorage(AUTO_CATEGORY_KEY) !== 'off';
let manualCategory = DEFAULT_CATEGORY; // 사용자가 고른(또는 필터가 정한) 기본 카테고리
let categoryTouched = false; // 이번 입력에서 사용자가 카테고리를 직접 골랐는지
let autoResult = null; // 지금 입력에 적용된 자동 분류 결과
let quoteIndex = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY) % QUOTES.length;

// 모든 변경은 저장 예약 후 다시 그린다
function commit() {
  scheduleSave();
  render();
}

// ================================================================
// 실행 취소
// ================================================================

function pushUndo(label) {
  undoStack.push({ label, todos: todos.map((todo) => ({ ...todo })) });
  if (undoStack.length > UNDO_LIMIT) undoStack.shift();
}

function undo() {
  const entry = undoStack.pop();
  if (!entry) {
    showToast('되돌릴 작업이 없어요.');
    return;
  }
  todos = entry.todos;
  editingId = null;
  commit();
  showToast(`'${entry.label}' 작업을 되돌렸어요.`);
}

// ================================================================
// 알림: 스크린 리더 · 토스트
// ================================================================

function announce(message) {
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

let toastTimer = null;

function showToast(message, { undoable = false } = {}) {
  toastMessage.textContent = message;
  toastUndo.hidden = !undoable;
  toast.hidden = false;
  // 새 알림마다 등장 애니메이션을 다시 재생한다
  toast.style.animation = 'none';
  void toast.offsetWidth;
  toast.style.animation = '';
  startToastTimer();
}

function startToastTimer() {
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, TOAST_DURATION);
}

function hideToast() {
  clearTimeout(toastTimer);
  toast.hidden = true;
}

function shorten(text, length = 20) {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

function randomCheer() {
  return CHEERS[Math.floor(Math.random() * CHEERS.length)];
}

// ================================================================
// 할 일 조작
// ================================================================

function normalizeText(text) {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

function findTodo(id) {
  return todos.find((todo) => todo.id === id);
}

function remainingCount() {
  return todos.filter((todo) => !todo.completed).length;
}

function addTodo(text, category, { autoKeyword = null } = {}) {
  const todo = {
    id: createId(),
    text,
    category,
    completed: false,
    createdAt: Date.now(),
  };

  pushUndo('추가');
  todos.unshift(todo);
  justAddedId = todo.id;
  commit();
  justAddedId = null;

  if (!itemCache.get(todo.id)?.element.isConnected) {
    showToast('추가했어요. 지금 검색·필터 조건에서는 보이지 않아요.', { undoable: true });
  } else {
    const autoNote = autoKeyword ? ` '${autoKeyword}' 키워드로 ${CATEGORIES[category]}에 자동 분류했어요.` : '';
    announce(`'${text}' 추가됨.${autoNote} 남은 할 일 ${remainingCount()}개`);
  }
}

function updateTodo(id, changes, label) {
  pushUndo(label);
  todos = todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo));
  commit();
}

function toggleTodo(id) {
  const todo = findTodo(id);
  if (!todo) return;

  updateTodo(id, { completed: !todo.completed }, todo.completed ? '완료 취소' : '완료');

  if (todo.completed) {
    announce(`'${todo.text}' 완료 취소`);
    return;
  }
  const remaining = remainingCount();
  showToast(
    remaining === 0 ? '🎉 오늘 할 일을 모두 끝냈어요!' : `${randomCheer()} 남은 할 일 ${remaining}개`,
    { undoable: true }
  );
}

function deleteTodo(id) {
  const todo = findTodo(id);
  if (!todo) return;
  pushUndo('삭제');
  todos = todos.filter((item) => item.id !== id);
  commit();
  showToast(`'${shorten(todo.text)}'을(를) 삭제했어요.`, { undoable: true });
}

// 삭제는 실행 취소가 가능하므로 확인 창 없이 바로 처리한다
function clearCompleted() {
  const count = todos.filter((todo) => todo.completed).length;
  if (count === 0) return;

  const hadFocus = clearCompletedButton.contains(document.activeElement);
  list.querySelectorAll('.todo-item.completed').forEach((item) => item.classList.add('leaving'));

  setTimeout(() => {
    pushUndo('완료 항목 삭제');
    todos = todos.filter((todo) => !todo.completed);
    commit();
    showToast(`완료한 할 일 ${count}개를 삭제했어요.`, { undoable: true });
    if (hadFocus) input.focus();
  }, leaveDelay());
}

// 보이는 항목들의 새 순서를 전체 목록에 반영한다(필터·검색으로 숨은 항목 위치는 유지)
function applyVisibleOrder(orderedIds) {
  const byId = new Map(todos.map((todo) => [todo.id, todo]));
  const idSet = new Set(orderedIds);
  let next = 0;

  pushUndo('순서 변경');
  todos = todos.map((todo) => (idSet.has(todo.id) ? byId.get(orderedIds[next++]) : todo));
  commit();
}

function setFilter(filter) {
  currentFilter = filter;
  writeStorage(FILTER_KEY, filter);
  syncCategorySelect();
  render();
  announce(`${filter === 'all' ? '전체' : CATEGORIES[filter]} 필터: ${visibleIds().length}개`);
}

// 특정 카테고리 필터를 보고 있으면 추가 드롭다운의 기본값도 그 카테고리로 맞춘다
function syncCategorySelect() {
  if (currentFilter !== 'all') manualCategory = currentFilter;
  if (!autoResult && !categoryTouched) categorySelect.value = manualCategory;
}

function setSort(mode) {
  sortMode = mode;
  writeStorage(SORT_KEY, mode);
  render();
  announce(`${sortSelect.selectedOptions[0].textContent}으로 정렬했어요.`);
}

function setSearch(query) {
  searchQuery = query.trim();
  renderList({ animate: false });
  if (searchQuery) announce(`검색 결과 ${visibleIds().length}개`);
}

// ================================================================
// 중복 확인
// ================================================================

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.hidden = false;
  input.setAttribute('aria-invalid', String(type === 'error'));
}

function hideFormMessage() {
  formMessage.hidden = true;
  input.removeAttribute('aria-invalid');
}

function flashItem(id) {
  const element = itemCache.get(id)?.element;
  if (!element?.isConnected) return;
  element.classList.remove('flash');
  void element.offsetWidth;
  element.classList.add('flash');
  element.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function handleSubmit() {
  const text = input.value.trim();
  if (!text) {
    showFormMessage('할 일 내용을 입력해 주세요.', 'error');
    return;
  }

  const key = normalizeText(text);
  const duplicate = todos.find((todo) => normalizeText(todo.text) === key);
  if (duplicate && pendingDuplicate !== key) {
    pendingDuplicate = key;
    showFormMessage(
      `이미 ${duplicate.completed ? '완료한 ' : ''}같은 할 일이 있어요. 그래도 추가하려면 한 번 더 눌러 주세요.`,
      'warn'
    );
    flashItem(duplicate.id);
    return;
  }

  const category = categorySelect.value;
  const autoKeyword = autoResult?.category === category ? autoResult.keyword : null;
  addTodo(text, category, { autoKeyword });
  input.value = '';
  pendingDuplicate = null;
  hideFormMessage();
  resetAutoCategory();
}

// ================================================================
// 키워드 자동 분류
// ================================================================

// 가장 점수가 높은 카테고리와 그 근거가 된 키워드를 돌려준다. 동점이거나 맞는 키워드가 없으면 null
function classifyText(text) {
  const normalized = normalizeText(text);
  if (!normalized) return null;

  let best = null;
  let tie = false;
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    let keyword = null;
    for (const word of keywords) {
      if (!normalized.includes(word)) continue;
      score += word.length;
      if (!keyword || word.length > keyword.length) keyword = word;
    }
    if (score === 0) continue;
    if (!best || score > best.score) {
      best = { category, keyword, score };
      tie = false;
    } else if (score === best.score) {
      tie = true;
    }
  }
  return best && !tie ? { category: best.category, keyword: best.keyword } : null;
}

function showAutoHint() {
  if (!autoResult) {
    autoHint.hidden = true;
    return;
  }
  const message = `🪄 '${autoResult.keyword}' → ${CATEGORIES[autoResult.category]}`;
  // 같은 내용이면 다시 쓰지 않아서 스크린 리더가 반복해 읽지 않게 한다
  if (autoHint.textContent !== message) autoHint.textContent = message;
  autoHint.className = `auto-hint ${autoResult.category}`;
  autoHint.hidden = false;
}

// 입력할 때마다 키워드를 확인해 카테고리를 맞춘다. 사용자가 직접 고른 뒤에는 건드리지 않는다
function updateAutoCategory() {
  if (!autoCategoryEnabled || categoryTouched) {
    autoResult = null;
    showAutoHint();
    return;
  }

  autoResult = classifyText(input.value);
  categorySelect.value = autoResult ? autoResult.category : manualCategory;
  showAutoHint();
}

function resetAutoCategory() {
  categoryTouched = false;
  autoResult = null;
  categorySelect.value = manualCategory;
  showAutoHint();
}

function setAutoCategoryEnabled(enabled) {
  autoCategoryEnabled = enabled;
  writeStorage(AUTO_CATEGORY_KEY, enabled ? 'on' : 'off');
  if (enabled) {
    updateAutoCategory();
  } else if (autoResult) {
    resetAutoCategory();
  }
  announce(enabled ? '키워드 자동 분류를 켰어요.' : '키워드 자동 분류를 껐어요.');
}

// ================================================================
// 다크 모드
// ================================================================

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
}

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  writeStorage(THEME_KEY, next);
  announce(next === 'dark' ? '다크 모드 켜짐' : '다크 모드 꺼짐');
}

// ================================================================
// 인라인 수정
// ================================================================

function startEdit(id) {
  editingId = id;
  render();
}

function finishEdit(item, { save, restoreFocus = false }) {
  const id = item.dataset.id;
  // editingId를 먼저 비워서 blur 등으로 두 번 저장되는 것을 막는다
  if (editingId !== id) return;
  editingId = null;

  const todo = findTodo(id);
  const text = item.querySelector('.edit-input').value.trim().slice(0, MAX_LENGTH);
  const category = item.querySelector('.edit-category').value;
  const changed = todo && (text !== todo.text || category !== todo.category);

  // 내용을 모두 지웠으면 변경을 취소하고 원래 내용을 유지한다
  if (save && text && changed) {
    updateTodo(id, { text, category }, '수정');
    announce('수정했어요.');
  } else {
    render();
  }

  if (restoreFocus) itemCache.get(id)?.element.querySelector('.todo-text')?.focus();
}

// ================================================================
// 삭제 애니메이션 · 포커스 관리
// ================================================================

function leaveDelay() {
  return reducedMotion.matches ? 0 : LEAVE_DURATION;
}

function removeWithFade(item) {
  if (item.classList.contains('leaving')) return;

  // 키보드로 삭제했다면 이웃 항목으로 포커스를 옮겨 흐름이 끊기지 않게 한다
  const hadFocus = item.contains(document.activeElement);
  const neighbor = item.nextElementSibling || item.previousElementSibling;

  item.classList.add('leaving');
  setTimeout(() => {
    deleteTodo(item.dataset.id);
    if (!hadFocus) return;
    const target = neighbor?.isConnected && neighbor.querySelector('.delete-btn');
    (target || input).focus();
  }, leaveDelay());
}

// ================================================================
// 백업: 내보내기 · 가져오기
// ================================================================

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function exportData({ silent = false } = {}) {
  flushSave();
  const data = {
    app: 'my-tasks',
    version: 1,
    exportedAt: new Date().toISOString(),
    count: todos.length,
    todos,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `my-tasks-${formatDate(Date.now())}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  writeStorage(BACKUP_KEY, String(Date.now()));
  renderBackupInfo();
  if (!silent) showToast(`할 일 ${todos.length}개를 백업 파일로 저장했어요.`);
}

function parseImport(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('올바른 JSON 파일이 아니에요.');
  }

  const rawList = Array.isArray(data) ? data : data?.todos;
  if (!Array.isArray(rawList)) throw new Error('파일에서 할 일 목록을 찾을 수 없어요.');

  const items = sanitizeList(rawList);
  if (rawList.length > 0 && items.length === 0) throw new Error('올바른 형식의 할 일이 없어요.');

  return {
    items,
    skipped: rawList.length - items.length,
    exportedAt: typeof data?.exportedAt === 'string' ? Date.parse(data.exportedAt) : NaN,
  };
}

async function handleImportFile(file) {
  importFile.value = '';
  if (!file) return;
  if (file.size > MAX_IMPORT_SIZE) {
    showToast('파일이 너무 커요. 5MB 이하의 파일만 가져올 수 있어요.');
    return;
  }

  try {
    pendingImport = parseImport(await file.text());
  } catch (error) {
    showToast(`가져오지 못했어요. ${error.message}`);
    return;
  }

  const { items, skipped, exportedAt } = pendingImport;
  const lines = [`'${file.name}'에 할 일 ${items.length}개가 있어요.`];
  if (Number.isFinite(exportedAt)) lines.push(`백업 날짜: ${formatDate(exportedAt)}`);
  if (skipped > 0) lines.push(`형식이 잘못된 ${skipped}개는 제외돼요.`);
  lines.push(`현재 할 일은 ${todos.length}개예요.`);
  lines.push('합치기: 기존 목록에 새 항목만 더해요.\n덮어쓰기: 기존 목록을 파일 내용으로 바꿔요.');
  importSummary.textContent = lines.join('\n');

  importBackupLabel.hidden = todos.length === 0;
  importBackup.checked = todos.length > 0;
  importDialog.showModal();
}

function applyImport(items, mode) {
  pushUndo('가져오기');

  if (mode === 'replace') {
    todos = items.map((todo) => ({ ...todo }));
    commit();
    flushSave();
    showToast(`할 일 ${items.length}개로 바꿨어요.`, { undoable: true });
    return;
  }

  // 합치기: 같은 id나 같은 내용의 할 일은 건너뛴다
  const ids = new Set(todos.map((todo) => todo.id));
  const texts = new Set(todos.map((todo) => normalizeText(todo.text)));
  const fresh = items.filter((todo) => {
    const key = normalizeText(todo.text);
    if (ids.has(todo.id) || texts.has(key)) return false;
    ids.add(todo.id);
    texts.add(key);
    return true;
  });
  const skipped = items.length - fresh.length;

  todos = [...fresh.map((todo) => ({ ...todo })), ...todos];
  commit();
  flushSave();
  showToast(
    `할 일 ${fresh.length}개를 가져왔어요.${skipped ? ` (중복 ${skipped}개 제외)` : ''}`,
    { undoable: true }
  );
}

// ================================================================
// 화면: 격언 · 대시보드 · 배지 · 백업 정보
// ================================================================

function renderQuote(animate = false) {
  const quote = QUOTES[quoteIndex];
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = `— ${quote.author}`;
  if (animate) {
    quoteText.classList.remove('changing');
    void quoteText.offsetWidth;
    quoteText.classList.add('changing');
  }
}

function percent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

// 통계는 목록을 한 번만 훑어서 계산한다
function computeStats() {
  const today = new Date().toDateString();
  const stats = { total: 0, done: 0, today: 0, byCategory: {} };
  CATEGORY_ORDER.forEach((key) => {
    stats.byCategory[key] = { total: 0, done: 0 };
  });

  for (const todo of todos) {
    const category = stats.byCategory[todo.category];
    stats.total += 1;
    category.total += 1;
    if (todo.completed) {
      stats.done += 1;
      category.done += 1;
    }
    if (new Date(todo.createdAt).toDateString() === today) stats.today += 1;
  }
  return stats;
}

function cheerFor(done, total) {
  if (total === 0) return '첫 할 일을 적으며 하루를 시작해 볼까요?';
  if (done === total) return '🎉 모든 할 일을 끝냈어요! 오늘 정말 수고했어요.';
  if (done === 0) return '천천히, 하나씩 시작해 봐요.';
  const ratio = done / total;
  if (ratio < 0.5) return '좋은 출발이에요! 이 흐름을 이어가요.';
  if (ratio < 0.8) return '절반을 넘었어요. 조금만 더 힘내요!';
  return '거의 다 왔어요! 마지막 스퍼트! 🏁';
}

function renderDashboard(stats) {
  const { done, total } = stats;
  const value = percent(done, total);

  progressPercent.textContent = `${value}%`;
  progressCount.textContent = `${done} / ${total} 완료`;
  progressFill.style.width = `${value}%`;
  progressBar.setAttribute('aria-valuenow', String(value));
  progressBar.setAttribute('aria-valuetext', `${total}개 중 ${done}개 완료, ${value}%`);

  dashboard.querySelectorAll('.category-stat').forEach((stat) => {
    const counts = stats.byCategory[stat.dataset.category];
    stat.querySelector('.category-stat-count').textContent = `${counts.done}/${counts.total}`;
    stat.querySelector('.mini-fill').style.width = `${percent(counts.done, counts.total)}%`;
  });

  todayCount.textContent = stats.today;
  dashboard.classList.toggle('all-done', total > 0 && done === total);
  cheerMessage.textContent = cheerFor(done, total);
}

function renderRemainingBadge(stats) {
  const remaining = stats.total - stats.done;

  remainingBadge.hidden = stats.total === 0;
  remainingBadge.classList.toggle('done', stats.total > 0 && remaining === 0);
  remainingBadge.textContent = remaining > 0 ? `${remaining}개 남음` : '모두 완료';
  remainingBadge.setAttribute('aria-label', `남은 할 일 ${remaining}개`);

  document.title = remaining > 0 ? `(${remaining}) My Tasks` : 'My Tasks';
}

function renderBackupInfo() {
  const last = Number(readStorage(BACKUP_KEY)) || 0;
  exportButton.disabled = todos.length === 0;

  if (!last) {
    backupStatus.textContent = todos.length > 0 ? '아직 백업한 적이 없어요. 한 번 내보내 두세요.' : '아직 백업한 적이 없어요.';
    backupStatus.classList.toggle('warn', todos.length > 0);
    return;
  }

  const days = Math.round((startOfDay(Date.now()) - startOfDay(last)) / DAY);
  const when = days === 0 ? '오늘' : days === 1 ? '어제' : `${days}일 전`;
  const needsBackup = todos.length > 0 && days >= BACKUP_REMIND_DAYS;
  backupStatus.textContent = `마지막 백업: ${when} (${formatDate(last)})${needsBackup ? ' · 새로 백업해 두세요' : ''}`;
  backupStatus.classList.toggle('warn', needsBackup);
}

function renderFilters(stats) {
  filters.querySelectorAll('.filter-btn').forEach((button) => {
    const filter = button.dataset.filter;
    const active = filter === currentFilter;
    const count = filter === 'all' ? stats.total : stats.byCategory[filter].total;

    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
    button.querySelector('.filter-count').textContent = count;
  });
}

// ================================================================
// 화면: 목록 (id 기반 재사용으로 바뀐 항목만 새로 만든다)
// ================================================================

// id → { element, signature }. signature가 같으면 기존 DOM을 그대로 쓴다
const itemCache = new Map();

function formatCreatedAt(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (date.toDateString() === now.toDateString()) return `오늘 ${time}`;
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${time}`;
  }
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${time}`;
}

function matchesSearch(todo) {
  return !searchQuery || todo.text.toLowerCase().includes(searchQuery.toLowerCase());
}

// 검색어와 일치하는 부분을 <mark>로 감싼다. innerHTML 없이 텍스트 노드로만 만든다
function appendHighlighted(element, text) {
  if (!searchQuery) {
    element.textContent = text;
    return;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = searchQuery.toLowerCase();
  let start = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    element.append(text.slice(start, index));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(index, index + searchQuery.length);
    element.append(mark);
    start = index + searchQuery.length;
    index = lowerText.indexOf(lowerQuery, start);
  }
  element.append(text.slice(start));
}

function createCategorySelect(selected) {
  const select = document.createElement('select');
  select.className = 'edit-category';
  select.setAttribute('aria-label', '카테고리 변경');
  Object.entries(CATEGORIES).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = value === selected;
    select.append(option);
  });
  return select;
}

function createEditBody(todo) {
  const body = document.createElement('div');
  body.className = 'todo-body';

  const row = document.createElement('div');
  row.className = 'edit-row';

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;
  editInput.maxLength = MAX_LENGTH;
  editInput.setAttribute('aria-label', '할 일 수정. Enter 저장, Esc 취소');

  row.append(editInput, createCategorySelect(todo.category));

  const hint = document.createElement('div');
  hint.className = 'edit-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.textContent = 'Enter 저장 · Esc 취소';

  body.append(row, hint);
  return body;
}

function createViewBody(todo) {
  const body = document.createElement('div');
  body.className = 'todo-body';

  const text = document.createElement('span');
  text.className = 'todo-text';
  appendHighlighted(text, todo.text);
  text.tabIndex = 0;
  text.title = '더블클릭하여 수정';
  text.setAttribute('role', 'button');
  text.setAttribute('aria-label', `${todo.text}, ${CATEGORIES[todo.category]}${todo.completed ? ', 완료됨' : ''}. Enter로 수정`);

  const meta = document.createElement('div');
  meta.className = 'todo-meta';
  meta.setAttribute('aria-hidden', 'true');

  const tag = document.createElement('span');
  tag.className = 'category-tag';
  tag.textContent = CATEGORIES[todo.category];

  const time = document.createElement('time');
  time.dateTime = new Date(todo.createdAt).toISOString();
  time.textContent = formatCreatedAt(todo.createdAt);

  meta.append(tag, time);
  body.append(text, meta);
  return body;
}

function createTodoItem(todo) {
  const item = document.createElement('li');
  item.className = `todo-item ${todo.category}`;
  item.classList.toggle('completed', todo.completed);
  item.classList.toggle('entering', todo.id === justAddedId);
  item.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `${todo.text} 완료`);

  if (todo.id === editingId) {
    item.classList.add('editing');
    item.append(checkbox, createEditBody(todo));
    return item;
  }

  if (sortMode === 'manual') {
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'drag-handle';
    handle.textContent = '⋮⋮';
    handle.title = '드래그하거나 위/아래 화살표 키로 순서 변경';
    handle.setAttribute('aria-label', `${todo.text} 순서 이동`);
    handle.setAttribute('aria-describedby', 'drag-hint');
    item.append(handle);
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = '✕';
  deleteButton.setAttribute('aria-label', `${todo.text} 삭제`);

  item.append(checkbox, createViewBody(todo), deleteButton);
  return item;
}

function itemSignature(todo, today) {
  return [
    todo.text,
    todo.category,
    todo.completed,
    todo.createdAt,
    todo.id === editingId,
    searchQuery,
    sortMode === 'manual',
    today,
  ].join('\u0000');
}

function sortForDisplay(items) {
  const newestFirst = (a, b) => b.createdAt - a.createdAt;

  switch (sortMode) {
    case 'manual':
      return items; // 저장된 배열 순서가 곧 사용자가 정한 순서
    case 'newest':
      return items.sort(newestFirst);
    case 'oldest':
      return items.sort((a, b) => a.createdAt - b.createdAt);
    case 'category':
      return items.sort((a, b) =>
        CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
        a.completed - b.completed ||
        newestFirst(a, b)
      );
    default:
      // 완료 상태순: 미완료 위, 완료 아래. 같은 그룹 안에서는 최근 추가 순
      return items.sort((a, b) => a.completed - b.completed || newestFirst(a, b));
  }
}

function getVisibleTodos() {
  return sortForDisplay(
    todos.filter((todo) =>
      (currentFilter === 'all' || todo.category === currentFilter) && matchesSearch(todo)
    )
  );
}

function visibleIds() {
  return [...list.children].map((item) => item.dataset.id);
}

// 순서가 이미 맞는 가장 긴 부분(최장 증가 부분 수열)의 위치를 구한다
function longestIncreasingSubsequence(values) {
  const tails = [];
  const tailIndexes = [];
  const previous = new Array(values.length).fill(-1);

  values.forEach((value, index) => {
    if (value < 0) return;
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (tails[mid] < value) low = mid + 1;
      else high = mid;
    }
    tails[low] = value;
    tailIndexes[low] = index;
    previous[index] = low > 0 ? tailIndexes[low - 1] : -1;
  });

  const keep = new Set();
  let index = tails.length ? tailIndexes[tails.length - 1] : -1;
  while (index !== -1) {
    keep.add(index);
    index = previous[index];
  }
  return keep;
}

// 순서가 맞는 노드는 그대로 두고, 새 노드와 자리가 바뀐 노드만 옮긴다
function reconcile(elements) {
  const oldIndex = new Map([...list.children].map((element, index) => [element, index]));
  const nextSet = new Set(elements);
  for (const element of oldIndex.keys()) {
    if (!nextSet.has(element)) element.remove();
  }

  const keep = longestIncreasingSubsequence(
    elements.map((element) => (oldIndex.has(element) ? oldIndex.get(element) : -1))
  );

  let anchor = null;
  for (let i = elements.length - 1; i >= 0; i--) {
    if (!keep.has(i)) list.insertBefore(elements[i], anchor);
    anchor = elements[i];
  }
}

// 다시 그리기 전후의 위치 차이만큼 항목을 미끄러지듯 옮긴다(FLIP)
function slideToNewPositions(previousTops) {
  for (const item of list.children) {
    const previousTop = previousTops.get(item.dataset.id);
    if (previousTop === undefined) continue;
    const deltaY = previousTop - item.getBoundingClientRect().top;
    if (deltaY === 0) continue;
    item.animate(
      [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }],
      { duration: SLIDE_DURATION, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
    );
  }
}

function showEmptyState(icon, title, desc) {
  emptyIcon.textContent = icon;
  emptyTitle.textContent = title;
  emptyDesc.textContent = desc;
  emptyState.hidden = false;
}

function renderEmptyState(visibleCount) {
  if (visibleCount > 0) {
    emptyState.hidden = true;
  } else if (todos.length === 0) {
    showEmptyState('📝', '아직 할 일이 없어요', '위 입력창에 오늘의 첫 할 일을 적어 보세요.');
  } else if (searchQuery) {
    showEmptyState('🔍', `'${searchQuery}'에 맞는 할 일이 없어요`, '다른 검색어를 입력하거나 Esc로 검색을 지워 보세요.');
  } else {
    showEmptyState('📂', `${CATEGORIES[currentFilter]} 카테고리가 비어 있어요`, '카테고리를 고르고 할 일을 추가해 보세요.');
  }
}

function renderListFooter(visible, stats) {
  const remainingVisible = visible.filter((todo) => !todo.completed).length;
  const completed = stats.done;

  listFooter.hidden = stats.total === 0;
  listSummary.textContent = searchQuery
    ? `검색 결과 ${visible.length}개 · 남은 할 일 ${remainingVisible}개`
    : `남은 할 일 ${remainingVisible}개`;

  clearCompletedButton.hidden = completed === 0;
  clearCompletedButton.textContent = `완료 항목 모두 삭제 (${completed})`;
}

function renderList({ animate = true, stats = computeStats() } = {}) {
  const visible = getVisibleTodos();
  const shouldAnimate = animate && !reducedMotion.matches && !drag
    && visible.length <= MAX_ANIMATED_ITEMS && list.children.length <= MAX_ANIMATED_ITEMS;

  const previousTops = new Map();
  if (shouldAnimate) {
    for (const item of list.children) previousTops.set(item.dataset.id, item.getBoundingClientRect().top);
  }

  const today = new Date().toDateString();
  const visibleSet = new Set();
  const elements = visible.map((todo) => {
    visibleSet.add(todo.id);
    const signature = itemSignature(todo, today);
    const cached = itemCache.get(todo.id);
    if (cached && cached.signature === signature) return cached.element;
    const element = createTodoItem(todo);
    itemCache.set(todo.id, { element, signature });
    return element;
  });

  for (const id of itemCache.keys()) {
    if (!visibleSet.has(id)) itemCache.delete(id);
  }

  // 노드를 옮기거나 새로 만들면 포커스가 풀리므로 기억했다가 되돌린다
  const focused = list.contains(document.activeElement) ? document.activeElement : null;
  const focusedItemId = focused?.closest('.todo-item')?.dataset.id;
  const focusedClass = focused?.classList[0];
  isRendering = true;
  reconcile(elements);
  isRendering = false;
  if (focused && document.activeElement !== focused) {
    const target = focused.isConnected
      ? focused
      : itemCache.get(focusedItemId)?.element.querySelector(`.${focusedClass}`);
    target?.focus({ preventScroll: true });
  }

  if (shouldAnimate) slideToNewPositions(previousTops);

  renderEmptyState(visible.length);
  renderListFooter(visible, stats);

  if (editingId) {
    const editInput = list.querySelector('.editing .edit-input');
    if (editInput && document.activeElement !== editInput && document.activeElement?.closest('.editing') == null) {
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }
  }
}

function render() {
  const stats = computeStats();
  renderDashboard(stats);
  renderRemainingBadge(stats);
  renderFilters(stats);
  renderList({ stats });
  renderBackupInfo();
}

// ================================================================
// 드래그 앤 드롭 (마우스 · 터치 공통 Pointer Events)
// ================================================================

function startDrag(event, handle) {
  const item = handle.closest('.todo-item');
  try {
    handle.setPointerCapture(event.pointerId);
  } catch {
    // 캡처를 못 해도 목록 안에서의 드래그는 동작한다
  }
  drag = {
    item,
    pointerId: event.pointerId,
    grabOffset: event.clientY - item.getBoundingClientRect().top,
    originalIds: visibleIds(),
    offset: 0,
  };
  item.classList.add('dragging');
  list.classList.add('is-dragging');
}

function moveDrag(event) {
  // offsetTop은 transform의 영향을 받지 않아서 애니메이션 중에도 위치 계산이 안정적이다
  const pointerY = event.clientY - list.getBoundingClientRect().top;
  const siblings = [...list.children].filter((element) => element !== drag.item);

  let before = null;
  for (const element of siblings) {
    if (pointerY < element.offsetTop + element.offsetHeight / 2) {
      before = element;
      break;
    }
  }

  if (before !== drag.item.nextElementSibling) {
    const tops = new Map(siblings.map((element) => [element, element.offsetTop]));
    list.insertBefore(drag.item, before);
    if (!reducedMotion.matches) {
      for (const element of siblings) {
        const deltaY = tops.get(element) - element.offsetTop;
        if (deltaY) {
          element.animate(
            [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }],
            { duration: 150, easing: 'ease-out' }
          );
        }
      }
    }
  }

  drag.offset = pointerY - drag.grabOffset - drag.item.offsetTop;
  drag.item.style.transform = `translateY(${drag.offset}px)`;

  // 화면 가장자리에서는 자동으로 스크롤한다
  const edge = 60;
  if (event.clientY < edge) window.scrollBy(0, -12);
  else if (event.clientY > window.innerHeight - edge) window.scrollBy(0, 12);
}

function endDrag(cancelled) {
  if (!drag) return;
  const { item, offset, originalIds } = drag;
  drag = null;

  item.classList.remove('dragging');
  list.classList.remove('is-dragging');
  item.style.transform = '';
  if (offset && !reducedMotion.matches) {
    item.animate(
      [{ transform: `translateY(${offset}px)` }, { transform: 'translateY(0)' }],
      { duration: 150, easing: 'ease-out' }
    );
  }

  const newIds = visibleIds();
  if (cancelled || newIds.join() === originalIds.join()) {
    renderList({ animate: false }); // 원래 순서로 되돌린다
    return;
  }

  applyVisibleOrder(newIds);
  const position = newIds.indexOf(item.dataset.id) + 1;
  announce(`${position}번째로 옮겼어요.`);
}

function moveByKeyboard(id, direction) {
  const ids = visibleIds();
  const index = ids.indexOf(id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= ids.length) return;

  [ids[index], ids[target]] = [ids[target], ids[index]];
  applyVisibleOrder(ids);
  itemCache.get(id)?.element.querySelector('.drag-handle')?.focus();
  announce(`${ids.length}개 중 ${target + 1}번째로 옮겼어요.`);
}

// ================================================================
// 이벤트
// ================================================================

form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit();
  input.focus();
});

input.addEventListener('input', () => {
  // 입력을 모두 지우면 다음 입력부터 다시 자동 분류한다
  if (!input.value.trim()) categoryTouched = false;
  updateAutoCategory();

  if (formMessage.hidden) return;
  pendingDuplicate = null;
  hideFormMessage();
});

// 검색은 입력이 멈춘 뒤 한 번만 처리한다(디바운싱)
let searchTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => setSearch(searchInput.value), SEARCH_DELAY);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  clearTimeout(searchTimer);
  searchInput.value = '';
  setSearch('');
});

sortSelect.addEventListener('change', () => setSort(sortSelect.value));

// 사용자가 직접 고른 카테고리가 자동 분류보다 우선한다
categorySelect.addEventListener('change', () => {
  manualCategory = categorySelect.value;
  categoryTouched = input.value.trim() !== '';
  autoResult = null;
  showAutoHint();
});

autoCategoryToggle.addEventListener('change', () => setAutoCategoryEnabled(autoCategoryToggle.checked));

filters.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (button) setFilter(button.dataset.filter);
});

themeToggle.addEventListener('click', toggleTheme);
clearCompletedButton.addEventListener('click', clearCompleted);

quoteNext.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % QUOTES.length;
  renderQuote(true);
});

exportButton.addEventListener('click', () => exportData());
importButton.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', () => handleImportFile(importFile.files[0]));

// 누른 버튼(submitter)의 value로 동작을 정한다. Esc로 닫으면 아무것도 하지 않는다
importDialog.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const mode = event.submitter?.value;
  const data = pendingImport;
  pendingImport = null;
  importDialog.close();
  if (!data || (mode !== 'merge' && mode !== 'replace')) return;
  if (importBackup.checked && todos.length > 0) exportData({ silent: true });
  applyImport(data.items, mode);
});

importDialog.addEventListener('cancel', () => {
  pendingImport = null;
});

// 토스트: 마우스를 올리거나 포커스하면 사라지지 않게 멈춘다
toast.addEventListener('mouseenter', () => clearTimeout(toastTimer));
toast.addEventListener('mouseleave', startToastTimer);
toast.addEventListener('focusin', () => clearTimeout(toastTimer));
toast.addEventListener('focusout', startToastTimer);
toastUndo.addEventListener('click', () => {
  undo();
  input.focus();
});
toastClose.addEventListener('click', () => {
  hideToast();
  input.focus();
});

list.addEventListener('change', (event) => {
  if (!event.target.classList.contains('todo-checkbox')) return;
  const item = event.target.closest('.todo-item');
  // 수정 중에 체크하면 수정 내용을 먼저 저장한다
  if (item.classList.contains('editing')) finishEdit(item, { save: true });
  toggleTodo(item.dataset.id);
});

list.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    removeWithFade(event.target.closest('.todo-item'));
  }
});

list.addEventListener('dblclick', (event) => {
  const text = event.target.closest('.todo-text');
  if (text) startEdit(text.closest('.todo-item').dataset.id);
});

list.addEventListener('keydown', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;

  // 손잡이에서 위/아래 화살표로 순서 변경
  if (event.target.classList.contains('drag-handle') && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();
    moveByKeyboard(item.dataset.id, event.key === 'ArrowUp' ? -1 : 1);
    return;
  }

  // 키보드 사용자: 텍스트에 포커스한 뒤 Enter로 수정 시작
  if (!item.classList.contains('editing')) {
    if ((event.key === 'Enter' || event.key === 'F2') && event.target.classList.contains('todo-text')) {
      event.preventDefault();
      startEdit(item.dataset.id);
    }
    return;
  }

  // 한글 조합 중 Enter는 무시한다
  if (event.key === 'Enter' && !event.isComposing) {
    event.preventDefault();
    finishEdit(item, { save: true, restoreFocus: true });
  } else if (event.key === 'Escape') {
    event.stopPropagation();
    finishEdit(item, { save: false, restoreFocus: true });
  }
});

// 항목 바깥으로 포커스가 나가면 저장한다(입력창 ↔ 카테고리 이동, 다시 그리는 중은 제외)
list.addEventListener('focusout', (event) => {
  if (isRendering) return;
  const item = event.target.closest('.todo-item.editing');
  if (!item || item.contains(event.relatedTarget)) return;
  finishEdit(item, { save: true });
});

list.addEventListener('animationend', (event) => {
  if (event.animationName === 'fade-in') event.target.classList.remove('entering');
  if (event.animationName === 'flash') event.target.classList.remove('flash');
});

list.addEventListener('pointerdown', (event) => {
  const handle = event.target.closest('.drag-handle');
  if (!handle || event.button !== 0 || drag) return;
  event.preventDefault();
  startDrag(event, handle);
});

list.addEventListener('pointermove', (event) => {
  if (drag && event.pointerId === drag.pointerId) moveDrag(event);
});

list.addEventListener('pointerup', (event) => {
  if (drag && event.pointerId === drag.pointerId) endDrag(false);
});

list.addEventListener('pointercancel', () => endDrag(true));

function isTextField(element) {
  return element instanceof Element &&
    element.matches('input:not([type="checkbox"]), textarea, select, [contenteditable="true"]');
}

// 전역 단축키
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drag) {
    endDrag(true);
    return;
  }
  if (importDialog.open) return;

  const modifier = event.ctrlKey || event.metaKey;

  // Ctrl+Z: 입력창 밖에서만 앱 실행 취소(입력창에서는 브라우저 기본 동작)
  if (modifier && !event.altKey && !event.shiftKey && event.code === 'KeyZ') {
    if (isTextField(event.target)) return;
    event.preventDefault();
    undo();
    return;
  }

  // Alt+N 입력, Alt+1~4 필터, Alt+D 다크 모드
  if (!event.altKey || modifier || event.shiftKey) return;
  if (event.code === 'KeyN') {
    event.preventDefault();
    input.focus();
  } else if (event.code === 'KeyD') {
    event.preventDefault();
    toggleTheme();
  } else if (FILTER_SHORTCUTS[event.code]) {
    event.preventDefault();
    setFilter(FILTER_SHORTCUTS[event.code]);
  }
});

// 페이지를 떠나기 전에 예약된 저장을 즉시 처리한다
window.addEventListener('pagehide', () => {
  if (saveTimer) flushSave();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && saveTimer) flushSave();
});

// ================================================================
// 시작
// ================================================================

applyTheme(currentTheme());
sortSelect.value = sortMode;
autoCategoryToggle.checked = autoCategoryEnabled;
syncCategorySelect();
renderQuote();
render();
