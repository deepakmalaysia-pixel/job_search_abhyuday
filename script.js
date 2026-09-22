// Theme toggle (persists choice in localStorage)
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var saved = null;
  try { saved = localStorage.getItem('cv-jobs-theme'); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    root.setAttribute('data-theme', saved);
  }
  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  function updateLabel() {
    if (!btn) return;
    btn.textContent = currentTheme() === 'dark' ? 'Light mode' : 'Dark mode';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('cv-jobs-theme', next); } catch (e) {}
      updateLabel();
    });
    updateLabel();
  }
})();

// Filter tracks and companies by search text
(function () {
  var input = document.getElementById('filter-input');
  var noResults = document.getElementById('no-results');
  if (!input) return;

  var tracks = Array.prototype.slice.call(document.querySelectorAll('section.track'));

  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    var anyVisible = false;

    tracks.forEach(function (track) {
      var heading = track.querySelector('h2');
      var note = track.querySelector('.track-note');
      var companies = Array.prototype.slice.call(track.querySelectorAll('.company'));

      var trackTextMatches = query === '' ||
        (heading && heading.textContent.toLowerCase().indexOf(query) !== -1) ||
        (note && note.textContent.toLowerCase().indexOf(query) !== -1);

      var visibleCompanyCount = 0;
      companies.forEach(function (company) {
        var matches = query === '' || trackTextMatches ||
          company.textContent.toLowerCase().indexOf(query) !== -1;
        company.classList.toggle('company-hidden', !matches);
        if (matches) visibleCompanyCount++;
      });

      var showTrack = query === '' || trackTextMatches || visibleCompanyCount > 0;
      track.classList.toggle('track-hidden', !showTrack);
      if (showTrack) anyVisible = true;
    });

    if (noResults) noResults.classList.toggle('visible', !anyVisible);
  });
})();
