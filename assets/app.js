function getKeywordss() {
    $.get($('#urla').val(), function(resp) {
        document.getElementById('keywords1').value = resp;
    });
}

function Generate() {
    const target = document.getElementById('targets').value;
    const payloads = document.getElementById('keywords1').value.split('\n').filter(Boolean);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    payloads.forEach((payload, idx) => {
        // The payload is now used directly without encoding
        const url = target.replace('FUZZ', payload);
        const wrapper = document.createElement('div');
        wrapper.className = 'generated-link-wrapper';
        wrapper.tabIndex = 0;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'generated-link-checkbox';
        checkbox.style.marginRight = '10px';
        checkbox.tabIndex = -1;

        // Link
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = url;
        link.className = 'generated-link';

        // Prevent default link behavior to avoid double opening
        link.onclick = function(e) {
            e.preventDefault();
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
            window.open(url, '_blank', 'noopener');
        };

        // Make the whole div clickable
        wrapper.onclick = function(e) {
            // Only check if not clicking the checkbox or link itself
            if (e.target !== checkbox && e.target !== link) {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                }
                window.open(url, '_blank', 'noopener');
            }
        };

        wrapper.appendChild(checkbox);
        wrapper.appendChild(link);
        resultsDiv.appendChild(wrapper);
    });
}

function resetAll() {
    document.getElementById('urla').value = '';
    document.getElementById('targets').value = '';
    document.getElementById('keywords1').value = '';
    document.getElementById('results').innerHTML = '';
}

function toggleTheme() {
    const body = document.body;
    const button = document.getElementById('themeToggleBtn');
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        button.textContent = 'Light Mode';
        button.classList.remove('btn-dark');
        button.classList.add('btn-light');
    } else {
        button.textContent = 'Dark Mode';
        button.classList.remove('btn-light');
        button.classList.add('btn-dark');
    }
}