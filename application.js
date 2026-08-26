const currentApplications = {
  new: [
    {
      id: 'new-01',
      stage: 'New opportunity',
      title: 'Artistic Research Fellowship',
      institution: 'North Coast Academy of Arts',
      place: 'Finland',
      date: '15 Oct 2026',
      tone: 'blue',
      meta: 'Strong thematic fit',
      note: 'The call connects artistic practice, material research, and public space.',
      next: 'Check eligibility and save the official call before deciding whether to prepare.'
    },
    {
      id: 'new-02',
      stage: 'New opportunity',
      title: 'Public Space Research Residency',
      institution: 'Civic Form Institute',
      place: 'Netherlands',
      date: '30 Nov 2026',
      tone: 'blue',
      meta: 'Eligibility check',
      note: 'A research-based residency focused on observation, place, and public encounter.',
      next: 'Read the residency conditions and assess research fit.'
    }
  ],
  preparing: [
    {
      id: 'preparing-01',
      stage: 'Preparing',
      title: 'Practice-based Doctoral Fellowship',
      institution: 'School of Material Arts',
      place: 'Sweden',
      date: '01 Dec 2026',
      tone: 'ink',
      meta: 'Draft package',
      note: 'Research proposal and portfolio are currently being aligned to the call.',
      next: 'Complete the evidence check, then freeze the tailored proposal.'
    },
    {
      id: 'preparing-02',
      stage: 'Preparing',
      title: 'Art and Public Space Research Fellow',
      institution: 'Metropolitan Arts University',
      place: 'Norway',
      date: '12 Dec 2026',
      tone: 'ink',
      meta: 'Portfolio alignment',
      note: 'The application package is open and the portfolio sequence is being assessed.',
      next: 'Confirm the required attachments and finalize the work selection.'
    }
  ],
  monitoring: [
    {
      id: 'monitoring-01',
      stage: 'Monitoring',
      title: 'Doctoral Studentship in Artistic Practice',
      institution: 'European Academy of Arts',
      place: 'Denmark',
      date: 'Decision · Oct',
      tone: 'amber',
      meta: 'Submitted 12 Aug 2026',
      note: 'The application was submitted and is currently within the stated decision period.',
      next: 'Wait for the official update; no action is required today.'
    }
  ]
};

const records = {
  submitted: [
    {
      id: 'submitted-01',
      stage: 'Submitted',
      title: 'Practice-led PhD Application',
      institution: 'Northern School of Art',
      place: 'Sweden',
      date: '12 Aug 2026',
      tone: 'ink',
      meta: 'Submission package recorded',
      note: 'The final submitted documents are stored as a fixed application package.',
      next: 'Retain the package unchanged and record any official response.'
    },
    {
      id: 'submitted-02',
      stage: 'Submitted',
      title: 'Research Residency Application',
      institution: 'Centre for Situated Practice',
      place: 'France',
      date: '28 Jul 2026',
      tone: 'ink',
      meta: 'Submission record',
      note: 'The application and confirmation receipt are stored together.',
      next: 'Monitor the announced result date.'
    }
  ],
  archive: [
    {
      id: 'archive-01',
      stage: 'Archive',
      title: 'Doctoral Research Fellowship',
      institution: 'Academy of Visual Inquiry',
      place: 'Belgium',
      date: '31 Jul 2026',
      tone: 'muted',
      meta: 'Closed · not selected',
      note: 'The opportunity is closed and retained as part of the application history.',
      next: 'No further action. Keep the call, package, and result together.'
    },
    {
      id: 'archive-02',
      stage: 'Archive',
      title: 'Artist Research Residency',
      institution: 'Fieldwork Arts Centre',
      place: 'Germany',
      date: '18 Aug 2026',
      tone: 'muted',
      meta: 'Closed · completed',
      note: 'The record is complete and no longer belongs in the active pipeline.',
      next: 'No further action.'
    }
  ]
};

const currentList = document.querySelector('#current-list');
const recordList = document.querySelector('#record-list');
const allItems = [...Object.values(currentApplications).flat(), ...Object.values(records).flat()];

function card(item) {
  return `<button class="application-card" type="button" data-item-id="${item.id}" data-search="${item.title} ${item.institution} ${item.place} ${item.meta}"><span class="card-status status-${item.tone}"></span><span class="application-card-copy"><small>${item.institution}</small><strong>${item.title}</strong><span>${item.place} · ${item.meta}</span></span><span class="application-date">${item.date}</span><b>→</b></button>`;
}

function bindCardDetails(container) {
  container.querySelectorAll('[data-item-id]').forEach(button => {
    button.addEventListener('click', () => openDetail(button.dataset.itemId));
  });
}

function renderCurrent(stage) {
  currentList.innerHTML = currentApplications[stage].map(card).join('');
  bindCardDetails(currentList);
}

function renderRecords(stage) {
  recordList.innerHTML = records[stage].map(card).join('');
  bindCardDetails(recordList);
}

document.querySelectorAll('[data-stage]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-stage]').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  renderCurrent(tab.dataset.stage);
}));

document.querySelectorAll('[data-record]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('[data-record]').forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  renderRecords(tab.dataset.record);
}));

const searchOverlay = document.querySelector('#directory-search');
const searchInput = document.querySelector('#directory-search-input');
const searchResults = document.querySelector('#directory-search-results');
const detailOverlay = document.querySelector('#application-detail');

function openSearch() {
  searchOverlay.hidden = false;
  setTimeout(() => searchInput.focus(), 0);
}

function closeSearch() {
  searchOverlay.hidden = true;
  searchInput.value = '';
  searchResults.innerHTML = '<p>Search the current directory and records.</p>';
}

function openDetail(id) {
  const item = allItems.find(entry => entry.id === id);
  if (!item) return;
  document.querySelector('#application-detail-stage').textContent = item.stage;
  document.querySelector('#application-detail-institution').textContent = item.institution;
  document.querySelector('#application-detail-title').textContent = item.title;
  document.querySelector('#application-detail-place').textContent = item.place;
  document.querySelector('#application-detail-date').textContent = item.date;
  document.querySelector('#application-detail-note').textContent = item.note;
  document.querySelector('#application-detail-next').textContent = item.next;
  detailOverlay.hidden = false;
  setTimeout(() => document.querySelector('#application-detail-close').focus(), 0);
}

function closeDetail() {
  detailOverlay.hidden = true;
}

document.querySelector('#directory-search-open').addEventListener('click', openSearch);
document.querySelector('#directory-search-close').addEventListener('click', closeSearch);
document.querySelector('#application-detail-close').addEventListener('click', closeDetail);
searchOverlay.addEventListener('click', event => {
  if (event.target === searchOverlay) closeSearch();
});
detailOverlay.addEventListener('click', event => {
  if (event.target === detailOverlay) closeDetail();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '<p>Search the current directory and records.</p>';
    return;
  }
  const found = allItems.filter(item => Object.values(item).join(' ').toLowerCase().includes(query));
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

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!detailOverlay.hidden) closeDetail();
  else if (!searchOverlay.hidden) closeSearch();
});

renderCurrent('new');
renderRecords('submitted');
