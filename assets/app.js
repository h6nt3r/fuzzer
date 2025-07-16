function getKeywordss(){
    $.get($('#urla').val(), function(resp) {
        document.getElementById('keywords1').value = resp;
    });
}

function Generate() {
    // Clear previous results
    $('#results').empty();

    // Get payloads from the keywords1 textarea
    var payloads = $('#keywords1').val().split('\n');
    var targetUrl = $('#targets').val();

    // Generate URLs and make them clickable
    $.each(payloads, function(index, payload) {
        if (payload.trim() !== '') {
            var modifiedUrl = targetUrl.replace('FUZZ', encodeURIComponent(payload.trim()));
            var link = $('<a></a>').attr('href', modifiedUrl).attr('target', '_blank').text(modifiedUrl);
            $('#results').append(link).append('<br>');
        }
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
