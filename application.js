const collections = {
  new: [
    {
      id: 'new-01', stage: 'new', title: 'Artistic Research Fellowship', institution: 'North Coast Academy of Arts',
      place: 'Finland', date: '15 Oct 2026', status: 'Unread opportunity', fit: 'Strong fit · 88%', tone: 'blue',
      link: 'https://example.com/artistic-research-fellowship',
      fitNotes: ['Practice-based artistic research', 'Material and public-space focus', 'Eligible international applicants'],
      note: 'Read the complete call and confirm the required research materials.', saved: false
    },
    {
      id: 'new-02', stage: 'new', title: 'Public Space Research Residency', institution: 'Civic Form Institute',
      place: 'Netherlands', date: '30 Nov 2026', status: 'Unread opportunity', fit: 'Possible fit · 72%', tone: 'blue',
      link: 'https://example.com/public-space-residency',
      fitNotes: ['Situated observation', 'Public encounter', 'Research-led residency format'],
      note: 'Eligibility and residency dates still need to be checked.', saved: false
    }
  ],
  monitoring: [
    {
      id: 'monitoring-01', stage: 'monitoring', title: 'Doctoral Studentship in Artistic Practice', institution: 'European Academy of Arts',
      place: 'Denmark', date: 'Decision · Oct', status: 'Monitoring', fit: 'Strong fit · 84%', tone: 'amber',
      link: 'https://example.com/doctoral-studentship',
      fitNotes: ['Artistic-practice doctorate', 'Supports situated research', 'Relevant supervision environment'],
      note: 'Watch for an official update; no action is required today.'
    }
  ],
  preparing: [
    {
      id: 'preparing-01', stage: 'preparing', title: 'Practice-based Doctoral Fellowship', institution: 'School of Material Arts',
      place: 'Sweden', date: '01 Dec 2026', status: 'Preparing', fit: 'Strong fit · 91%', tone: 'ink',
      link: 'https://example.com/practice-based-doctorate',
      fitNotes: ['Painting-led research accepted', 'Material translation is relevant', 'Strong methodological alignment'],
      note: 'Complete the evidence check, then freeze the tailored proposal.'
    },
    {
      id: 'preparing-02', stage: 'preparing', title: 'Art and Public Space Research Fellow', institution: 'Metropolitan Arts University',
      place: 'Norway', date: '12 Dec 2026', status: 'Preparing', fit: 'Strong fit · 86%', tone: 'ink',
      link: 'https://example.com/art-public-space',
      fitNotes: ['Direct public-space connection', 'Supports practice-led inquiry', 'Portfolio evidence is relevant'],
      note: 'Confirm the required attachments and finalize the work selection.'
    }
  ],
  submitted: [
    {
      id: 'submitted-01', stage: 'submitted', title: 'Practice-led PhD Application', institution: 'Northern School of Art',
      place: 'Sweden', date: '12 Aug 2026', status: 'Submitted', fit: 'Strong fit · 87%', tone: 'ink',
      link: 'https://example.com/practice-led-phd',
      fitNotes: ['Practice-led structure', 'Research environment aligned', 'Complete application package'],
      note: 'The submitted documents are retained as a fixed package.'
    },
    {
      id: 'submitted-02', stage: 'submitted', title: 'Research Residency Application', institution: 'Centre for Situated Practice',
      place: 'France', date: '28 Jul 2026', status: 'Submitted', fit: 'Possible fit · 75%', tone: 'ink',
      link: 'https://example.com/research-residency',
      fitNotes: ['Research-based residency', 'Supports field observation', 'Short working period'],
      note: 'The application and confirmation receipt are stored together.'
    }
  ],
  archive: [
    {
      id: 'archive-01', stage: 'archive', title: 'Doctoral Research Fellowship', institution: 'Academy of Visual Inquiry',
      place: 'Belgium', date: '31 Jul 2026', status: 'Closed · not selected', fit: 'Past fit · 70%', tone: 'muted',
      link: 'https://example.com/doctoral-research',
      fitNotes: ['Relevant discipline', 'Different methodological emphasis', 'Record retained for comparison'],
      note: 'The call, submitted package, and result remain together in the archive.'
    },
    {
      id: 'archive-02', stage: 'archive', title: 'Artist Research Residency', institution: 'Fieldwork Arts Centre',
      place: 'Germany', date: '18 Aug 2026', status: 'Closed · completed', fit: 'Past fit · 76%', tone: 'muted',
      link: 'https://example.com/artist-research-residency',
      fitNotes: ['Fieldwork component', 'Useful residency format', 'No longer active'],
      note: 'The record is complete and no longer belongs in the active pipeline.'
    }
  ]
};

const viewOrder = ['new', 'monitoring', 'preparing', 'submitted', 'archive'];
const viewCopy = {
  all: ['All · Overview', 'All Applications', 'Every current application and completed record.'],
  new: ['01 · Current', 'New Opportunities', 'Newly collected opportunities waiting for a decision.'],
  monitoring: ['02 · Current', 'Monitoring', 'Opportunities kept under observation before preparation.'],
  preparing: ['03 · Current', 'Preparing', 'Applications with active materials and next steps.'],
  submitted: ['04 · Records', 'Submitted', 'Fixed application packages and submission records.'],
  archive: ['05 · Records', 'Archive', 'Closed opportunities retained for traceability.']
};

let selectedView = 'all';
let openItemId = null;
let manualId = 0;
const submittedFiles = new Map();

const folderGrid = document.querySelector('#folder-grid');
const folderEmpty = document.querySelector('#folder-empty');
const detailOverlay = document.querySelector('#application-detail');
const detailActions = document.querySelector('#application-detail-actions');
const addOverlay = document.querySelector('#manual-add');
const addForm = document.querySelector('#manual-add-form');
const submittedDocuments = document.querySelector('#submitted-documents');
const documentUpload = document.querySelector('#document-upload');
const submittedDocumentList = document.querySelector('#submitted-document-list');
const confirmationReceivedTime = document.querySelector('#confirmation-received-time');

function allItems() {
  return viewOrder.flatMap(stage => collections[stage]);
}

function itemsForView(view) {
  return view === 'all' ? allItems() : collections[view];
}

function stageLabel(stage) {
  return ({ new: 'New', monitoring: 'Monitoring', preparing: 'Preparing', submitted: 'Submitted', archive: 'Archive' })[stage];
}

function folderTemplate(item, index) {
  const savedLabel = item.stage === 'new' && item.saved ? ' · Saved' : '';
  return `<button class="opportunity-folder" type="button" data-item-id="${item.id}" aria-label="Open ${item.title}">
    <span class="folder-visual" aria-hidden="true">
      <span class="folder-tab"></span><span class="folder-stack-lines"></span><span class="folder-face"><i class="folder-dot status-${item.tone}"></i><small>${stageLabel(item.stage)}${savedLabel}</small></span>
    </span>
    <span class="folder-caption"><strong><i>${String(index + 1).padStart(2, '0')}</i><em>|</em>${item.title}</strong>
      <span class="folder-tree"><span>${item.institution}</span><span>${item.date}</span><span>${item.fit}</span></span>
    </span>
  </button>`;
}

function allListTemplate(item, index) {
  const savedLabel = item.stage === 'new' && item.saved ? ' · Saved' : '';
  return `<button class="all-application-row" type="button" data-item-id="${item.id}" aria-label="Open ${item.title}">
    <span class="all-row-index">${String(index + 1).padStart(2, '0')}</span>
    <span class="all-row-stage"><i class="status-${item.tone}"></i>${stageLabel(item.stage)}${savedLabel}</span>
    <span class="all-row-copy"><strong>${item.title}</strong><small>${item.institution} · ${item.place}</small></span>
    <span class="all-row-date">${item.date}</span>
    <span class="all-row-fit">${item.fit}</span>
    <b>→</b>
  </button>`;
}

function renderFolders() {
  const items = itemsForView(selectedView);
  const isAll = selectedView === 'all';
  folderGrid.classList.toggle('list-mode', isAll);
  folderGrid.innerHTML = isAll ? items.map(allListTemplate).join('') : items.map(folderTemplate).join('');
  folderEmpty.hidden = items.length > 0;
  folderGrid.hidden = items.length === 0;
  folderGrid.querySelectorAll('[data-item-id]').forEach(folder => {
    folder.addEventListener('click', () => openDetail(folder.dataset.itemId));
  });
}

function updateCounts() {
  const records = collections.submitted.length + collections.archive.length;
  const total = allItems().length;
  document.querySelector('#all-total').textContent = `${total} folders`;
  document.querySelector('#count-new').textContent = collections.new.length;
  document.querySelector('#count-monitoring').textContent = collections.monitoring.length;
  document.querySelector('#count-preparing').textContent = collections.preparing.length;
  document.querySelector('#count-records').textContent = records;
  viewOrder.forEach(stage => {
    const count = document.querySelector(`#nav-${stage}`);
    if (count) count.textContent = collections[stage].length;
  });
}

function setView(view) {
  selectedView = view;
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const [label, title, description] = viewCopy[view];
  document.querySelector('#folder-view-label').textContent = label;
  document.querySelector('#folder-view-title').textContent = title;
  document.querySelector('#folder-view-description').textContent = description;
  document.querySelector('#manual-add-open').hidden = !['monitoring', 'preparing'].includes(view);
  renderFolders();
}

function findItem(id) {
  return allItems().find(item => item.id === id);
}

function openDetail(id) {
  const item = findItem(id);
  if (!item) return;
  openItemId = id;
  document.querySelector('#application-detail-stage').textContent = stageLabel(item.stage);
  document.querySelector('#application-detail-institution').textContent = item.institution;
  document.querySelector('#application-detail-title').textContent = item.title;
  document.querySelector('#application-detail-place').textContent = item.place || 'Not recorded';
  document.querySelector('#application-detail-date').textContent = item.date || 'Not recorded';
  document.querySelector('#application-detail-status').textContent = item.status;
  document.querySelector('#application-detail-fit').textContent = item.fit;
  const link = document.querySelector('#application-detail-link');
  link.href = item.link || '#';
  link.textContent = item.link ? 'Open opportunity ↗' : 'No link saved';
  link.classList.toggle('is-disabled', !item.link);
  document.querySelector('#application-detail-fit-notes').innerHTML = item.fitNotes.map(note => `<li>${note}</li>`).join('');
  document.querySelector('#application-detail-note').textContent = item.note || 'No notes yet.';
  const isSubmitted = item.stage === 'submitted';
  submittedDocuments.hidden = !isSubmitted;
  document.querySelector('#application-detail-fit-section').hidden = isSubmitted;
  document.querySelector('#application-detail-note-section').hidden = isSubmitted;
  if (isSubmitted) {
    confirmationReceivedTime.value = item.receiptReceivedAt || '';
    renderSubmittedFiles(item.id);
  }
  renderDetailActions(item);
  detailOverlay.hidden = false;
  setTimeout(() => document.querySelector('#application-detail-close').focus(), 0);
}

function fileTypeLabel(file) {
  const extension = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE';
  return extension.slice(0, 5);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function fileSizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderSubmittedFiles(itemId) {
  const files = submittedFiles.get(itemId) || [];
  submittedDocumentList.innerHTML = files.length
    ? files.map(file => `<a class="submitted-document" href="${file.url}" target="_blank" rel="noreferrer"><span class="document-type">${escapeHTML(fileTypeLabel(file))}</span><span><strong>${escapeHTML(file.name)}</strong><small>${fileSizeLabel(file.size)} · Click to open</small></span><b>↗</b></a>`).join('')
    : '<p class="document-empty">No materials added in this session.</p>';
}

function renderDetailActions(item) {
  if (item.stage === 'new') {
    detailActions.innerHTML = `<button type="button" data-detail-action="save" class="detail-action quiet">${item.saved ? '✓ Saved' : 'Save'}</button><button type="button" data-detail-action="monitor" class="detail-action primary">Monitor</button><button type="button" data-detail-action="delete" class="detail-action danger">Delete</button>`;
  } else {
    detailActions.innerHTML = '<button type="button" data-detail-action="close" class="detail-action quiet">Close</button>';
  }
  detailActions.querySelectorAll('[data-detail-action]').forEach(button => {
    button.addEventListener('click', () => handleDetailAction(button.dataset.detailAction));
  });
}

function handleDetailAction(action) {
  const item = findItem(openItemId);
  if (!item) return;
  if (action === 'close') return closeDetail();
  if (action === 'save') {
    item.saved = true;
    item.status = 'Saved in New';
    renderDetailActions(item);
    document.querySelector('#application-detail-status').textContent = item.status;
    renderFolders();
    return;
  }
  const newIndex = collections.new.findIndex(entry => entry.id === item.id);
  if (newIndex < 0) return;
  collections.new.splice(newIndex, 1);
  if (action === 'monitor') {
    item.stage = 'monitoring';
    item.status = 'Monitoring';
    item.tone = 'amber';
    collections.monitoring.unshift(item);
  }
  closeDetail();
  updateCounts();
  renderFolders();
}

function closeDetail() {
  detailOverlay.hidden = true;
  openItemId = null;
}

function openManualAdd() {
  if (!['monitoring', 'preparing'].includes(selectedView)) return;
  document.querySelector('#manual-add-title').textContent = `Add to ${stageLabel(selectedView)}`;
  addOverlay.hidden = false;
  setTimeout(() => addForm.elements.title.focus(), 0);
}

function closeManualAdd() {
  addOverlay.hidden = true;
  addForm.reset();
}

addForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(addForm);
  const fitNotes = String(data.get('fitNotes') || '').split('\n').map(line => line.trim()).filter(Boolean);
  const stage = selectedView;
  const item = {
    id: `manual-${Date.now()}-${manualId++}`,
    stage,
    title: String(data.get('title')),
    institution: String(data.get('institution')),
    place: String(data.get('place') || 'Not recorded'),
    date: String(data.get('date') || 'No date'),
    status: stageLabel(stage),
    fit: String(data.get('fit')),
    tone: stage === 'monitoring' ? 'amber' : 'ink',
    link: String(data.get('link') || ''),
    fitNotes: fitNotes.length ? fitNotes : ['Fit assessment not added yet'],
    note: String(data.get('note') || 'No notes yet.')
  };
  collections[stage].unshift(item);
  closeManualAdd();
  updateCounts();
  renderFolders();
  openDetail(item.id);
});

const searchOverlay = document.querySelector('#directory-search');
const searchInput = document.querySelector('#directory-search-input');
const searchResults = document.querySelector('#directory-search-results');

function openSearch() {
  searchOverlay.hidden = false;
  setTimeout(() => searchInput.focus(), 0);
}

function closeSearch() {
  searchOverlay.hidden = true;
  searchInput.value = '';
  searchResults.innerHTML = '<p>Search the current directory and records.</p>';
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '<p>Search the current directory and records.</p>';
    return;
  }
  const found = allItems().filter(item => Object.values(item).flat().join(' ').toLowerCase().includes(query));
  searchResults.innerHTML = found.length
    ? found.map((item, index) => `<button type="button" data-result-id="${item.id}"><span>${String(index + 1).padStart(2, '0')}</span>${item.institution} — ${item.title}<b>→</b></button>`).join('')
    : '<p>No keyword matches found.</p>';
  searchResults.querySelectorAll('[data-result-id]').forEach(button => {
    button.addEventListener('click', () => {
      closeSearch();
      openDetail(button.dataset.resultId);
    });
  });
});

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelector('#directory-search-open').addEventListener('click', openSearch);
document.querySelector('#directory-search-close').addEventListener('click', closeSearch);
document.querySelector('#application-detail-close').addEventListener('click', closeDetail);
document.querySelector('#manual-add-open').addEventListener('click', openManualAdd);
document.querySelector('#manual-add-close').addEventListener('click', closeManualAdd);

documentUpload.addEventListener('change', () => {
  const item = findItem(openItemId);
  if (!item || item.stage !== 'submitted') return;
  const existing = submittedFiles.get(item.id) || [];
  const added = Array.from(documentUpload.files).map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file)
  }));
  submittedFiles.set(item.id, [...existing, ...added]);
  documentUpload.value = '';
  renderSubmittedFiles(item.id);
});

confirmationReceivedTime.addEventListener('change', () => {
  const item = findItem(openItemId);
  if (!item || item.stage !== 'submitted') return;
  item.receiptReceivedAt = confirmationReceivedTime.value;
});

searchOverlay.addEventListener('click', event => { if (event.target === searchOverlay) closeSearch(); });
detailOverlay.addEventListener('click', event => { if (event.target === detailOverlay) closeDetail(); });
addOverlay.addEventListener('click', event => { if (event.target === addOverlay) closeManualAdd(); });

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!addOverlay.hidden) closeManualAdd();
  else if (!detailOverlay.hidden) closeDetail();
  else if (!searchOverlay.hidden) closeSearch();
});

updateCounts();
setView('all');
