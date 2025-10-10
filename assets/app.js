document.addEventListener('DOMContentLoaded', () => {
  const urlaInput = document.getElementById('urla');
  const keywordsTextarea = document.getElementById('keywords1');
  const targetsInput = document.getElementById('targets');
  const resultsDiv = document.getElementById('results');

  const resetBtn = document.getElementById('resetBtn');
  const themeBtn = document.getElementById('themeToggleBtn');
  const getlistsBtn = document.getElementById('getlists-btn');
  const generateBtn = document.getElementById('generate-btn');
  const clearUrlaBtn = document.getElementById('clear-urla-btn');
  const clearTargetsBtn = document.getElementById('clear-targets-btn');

  // custom dropdown
  const linkRangeBtn = document.getElementById('linkRangeBtn');
  const linkRangeMenu = document.getElementById('linkRangeMenu');

  let totalLinks = 0;

  // update custom dropdown
  function updateDropdown(total, step = 15) {
    linkRangeMenu.innerHTML = '';
    linkRangeBtn.textContent = total > 0 ? "Select for copy" : "No links";

    if (total <= 0) return;

    // All option
    const allLi = document.createElement('li');
    allLi.innerHTML = `<a class="dropdown-item" href="#" data-range="1-${total}">All (1-${total})</a>`;
    linkRangeMenu.appendChild(allLi);

    // Ranges
    for (let start = 1; start <= total; start += step) {
      const end = Math.min(start + step - 1, total);
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="#" data-range="${start}-${end}">${start}-${end}</a>`;
      linkRangeMenu.appendChild(li);
    }
  }

  // fetch payloads
  getlistsBtn.addEventListener('click', () => {
    const url = urlaInput.value.trim();
    if (!url) {
      alert('Provide a raw/public payload URL (or paste payloads below).');
      return;
    }
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.text();
      })
      .then(text => {
        keywordsTextarea.value = text;
      })
      .catch(err => {
        console.error(err);
        alert('Unable to fetch payloads. Check URL or CORS. (Try serving locally)');
      });
  });

  // generate links
  generateBtn.addEventListener('click', () => {
    resultsDiv.innerHTML = '';
    const target = targetsInput.value.trim();
    if (!target.includes('FUZZ')) {
      resultsDiv.textContent = 'Target must include FUZZ (e.g. ?p=FUZZ).';
      return;
    }
    const payloads = keywordsTextarea.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (payloads.length === 0) {
      resultsDiv.textContent = 'No payloads found.';
      return;
    }

    payloads.forEach((payload, idx) => {
      const serial = idx + 1;
      const url = target.replace(/FUZZ/g, payload);

      const wrapper = document.createElement('div');
      wrapper.className = 'generated-link-wrapper';
      wrapper.tabIndex = 0;

      const sn = document.createElement('span');
      sn.className = 'serial-number';
      sn.textContent = serial + '.';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'generated-link-checkbox';
      checkbox.setAttribute('aria-label', `Select link ${serial}`);

      const link = document.createElement('a');
      link.className = 'generated-link';
      link.href = url;
      link.textContent = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        checkbox.checked = true;
        window.open(url, '_blank', 'noopener');
      });

      wrapper.addEventListener('click', (e) => {
        if (e.target === checkbox || e.target === link) return;
        checkbox.checked = !checkbox.checked;
      });

      wrapper.appendChild(sn);
      wrapper.appendChild(checkbox);
      wrapper.appendChild(link);
      resultsDiv.appendChild(wrapper);
    });

    totalLinks = payloads.length;
    updateDropdown(totalLinks);
  });

  // handle dropdown click
  linkRangeMenu.addEventListener('click', (e) => {
    e.preventDefault();
    const a = e.target.closest('a[data-range]');
    if (!a) return;

    // remove old active
    linkRangeMenu.querySelectorAll('a').forEach(el => {
      el.innerHTML = el.innerHTML.replace(/<i.*<\/i>/, '').trim();
    });

    // mark selected with green icon
    a.innerHTML = a.textContent + ' <i class="bi bi-check-circle-fill text-success"></i>';

    const [start, end] = a.dataset.range.split('-').map(Number);
    if (!start || !end) return;

    const collected = [];
    const wrappers = Array.from(document.querySelectorAll('#results .generated-link-wrapper'));

    wrappers.forEach((wrapper, i) => {
      const serial = i + 1;
      const cb = wrapper.querySelector('.generated-link-checkbox');
      const link = wrapper.querySelector('.generated-link');

      if (serial >= start && serial <= end) {
        cb.checked = true;
        collected.push(link.href);
      } else {
        cb.checked = false;
      }
    });

    if (collected.length === 0) return;

    // copy to clipboard
    navigator.clipboard.writeText(collected.join('\n')).then(() => {
      linkRangeBtn.textContent = `Copied: ${a.dataset.range}`;

      // Create notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = `Copied ${a.dataset.range} range`;
      document.body.appendChild(notification);

      // Show notification
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      // Hide notification after 2 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        // Remove notification from DOM after animation
        setTimeout(() => {
          notification.remove();
        }, 500);
      }, 2000);
    }).catch(err => console.error('Clipboard copy failed:', err));
  });

  // reset
  resetBtn.addEventListener('click', () => {
    urlaInput.value = '';
    keywordsTextarea.value = '';
    targetsInput.value = '';
    resultsDiv.innerHTML = '';
    totalLinks = 0;
    updateDropdown(0);
  });

  // theme toggle
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  clearUrlaBtn.addEventListener('click', () => urlaInput.value = '');
  clearTargetsBtn.addEventListener('click', () => targetsInput.value = '');

  // init
  updateDropdown(0);
});