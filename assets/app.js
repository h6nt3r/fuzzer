function getKeywordss(){
    $.get($('#urla').val(), function(resp) {
        document.getElementById('keywords1').value = resp;
    });
}

let clickedCount = 0; // global count

function Generate() {
    $('#results').empty();
    clickedCount = 0; // Reset on each generation

    const payloads = $('#keywords1').val().split('\n');
    const targetUrl = $('#targets').val();
    let totalGenerated = 0;

    payloads.forEach((payload) => {
        if (payload.trim() !== '') {
            totalGenerated++;
            const modifiedUrl = targetUrl.replace('FUZZ', payload.trim());

            const link = $('<a></a>', {
                href: modifiedUrl,
                target: '_blank',
                text: modifiedUrl,
                click: function () {
                    clickedCount++;
                    updateUrlCounter(clickedCount, totalGenerated);
                }
            });

            $('#results').append(link).append('<br>');
        }
    });

    updateUrlCounter(clickedCount, totalGenerated);
}
function updateUrlCounter(clicked, total) {
    document.getElementById('urlCount').textContent = `Total URLs: ${clicked} / ${total}`;
}


function resetAll() {
    document.getElementById('urla').value = '';
    document.getElementById('targets').value = '';
    document.getElementById('keywords1').value = '';
    document.getElementById('results').innerHTML = '';
    updateUrlCounter(0, 0);
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
