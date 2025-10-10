document.addEventListener('DOMContentLoaded', ()=>{

  const urlaInput = document.getElementById('urla');
  const keywordsTextarea = document.getElementById('keywords1');
  const targetsInput = document.getElementById('targets');
  const resultsDiv = document.getElementById('results');
  const linkRangeSelect = document.getElementById('linkRangeSelect');
  const copyBtn = document.getElementById('copyLinksBtn');
  const resetBtn = document.getElementById('resetBtn');
  const themeBtn = document.getElementById('themeToggleBtn');
  const getlistsBtn = document.getElementById('getlists-btn');
  const generateBtn = document.getElementById('generate-btn');
  const clearUrlaBtn = document.getElementById('clear-urla-btn');
  const clearTargetsBtn = document.getElementById('clear-targets-btn');

  let totalLinks = 0;

  // update dropdown based on total links
  function updateDropdown(total, step = 15){
    linkRangeSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = total > 0 ? 'Select range' : 'No links';
    linkRangeSelect.appendChild(placeholder);

    if(total <= 0) { linkRangeSelect.disabled = true; return; }
    linkRangeSelect.disabled = false;

    for(let start = 1; start <= total; start += step){
      const end = Math.min(start + step - 1, total);
      const opt = document.createElement('option');
      opt.value = `${start}-${end}`;
      opt.textContent = `${start}-${end}`;
      linkRangeSelect.appendChild(opt);
    }

    // add final "All" option if last end != total (or always allow All)
    if(total > 0){
      const allOpt = document.createElement('option');
      allOpt.value = `1-${total}`;
      allOpt.textContent = `All (1-${total})`;
      // place it at end
      linkRangeSelect.appendChild(allOpt);
    }
  }

  // fetch payloads (fetch API, no jQuery)
  getlistsBtn.addEventListener('click', ()=>{
    const url = urlaInput.value.trim();
    if(!url){
      alert('Provide a raw/public payload URL (or paste payloads below).');
      return;
    }
    fetch(url).then(r=>{
      if(!r.ok) throw new Error('Network error');
      return r.text();
    }).then(text=>{
      keywordsTextarea.value = text;
    }).catch(err=>{
      console.error(err);
      alert('Unable to fetch payloads. Check URL or CORS. (Try serving locally)');
    });
  });

  // generate
  generateBtn.addEventListener('click', ()=>{
    resultsDiv.innerHTML = '';
    const target = targetsInput.value.trim();
    if(!target.includes('FUZZ')){ resultsDiv.textContent = 'Target must include FUZZ (e.g. ?p=FUZZ).'; return; }
    const payloads = keywordsTextarea.value.split('\n').map(s=>s.trim()).filter(Boolean);
    if(payloads.length === 0){ resultsDiv.textContent = 'No payloads found.'; return; }

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

      // clicking behaviors
      link.addEventListener('click', (e)=>{
        e.preventDefault();
        checkbox.checked = true;
        window.open(url, '_blank', 'noopener');
      });

      wrapper.addEventListener('click', (e)=>{
        if(e.target === checkbox || e.target === link) return;
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

  // copy selected range
  copyBtn.addEventListener('click', ()=>{
    if(totalLinks === 0){
      alert('No links generated.');
      return;
    }
    const val = linkRangeSelect.value;
    if(!val){
      alert('Please select a range from the dropdown first.');
      return;
    }
    const [start, end] = val.split('-').map(Number);
    if(!start || !end){
      alert('Invalid range selected.');
      return;
    }

    const collected = [];
    const wrappers = Array.from(document.querySelectorAll('#results .generated-link-wrapper'));
    wrappers.forEach((wrapper, i)=>{
      const serial = i + 1;
      const cb = wrapper.querySelector('.generated-link-checkbox');
      const a = wrapper.querySelector('.generated-link');
      if(serial >= start && serial <= end){
        cb.checked = true;
        collected.push(a.href);
      } else {
        cb.checked = false;
      }
    });

    if(collected.length === 0){
      alert('No links found in that range.');
      return;
    }

    navigator.clipboard.writeText(collected.join('\n')).then(()=>{
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(()=>{ copyBtn.textContent = old; }, 1200);
    }).catch(err=>{
      console.error(err);
      alert('Copy failed (browser may block clipboard).');
    });
  });

  // reset
  resetBtn.addEventListener('click', ()=>{
    urlaInput.value = '';
    keywordsTextarea.value = '';
    targetsInput.value = '';
    resultsDiv.innerHTML = '';
    totalLinks = 0;
    updateDropdown(0);
  });

  // theme toggle
  themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  // clear controls
  clearUrlaBtn.addEventListener('click', ()=> urlaInput.value = '');
  clearTargetsBtn.addEventListener('click', ()=> targetsInput.value = '');

  // init
  updateDropdown(0);

});
