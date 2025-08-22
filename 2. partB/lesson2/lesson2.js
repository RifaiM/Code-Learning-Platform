document.getElementById('check-answer').addEventListener('click', function () {
    const code = document.getElementById('code-editor').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const iframe = document.getElementById('result-frame');
    iframe.srcdoc = code;

    const hasOpeningH1 = code.includes('<h1>');
    const hasClosingH1 = code.includes('</h1>');
    const hasOpeningH2 = code.includes('<h2>');
    const hasClosingH2 = code.includes('</h2>');
    const hasOpeningP = code.includes('<p>');
    const hasClosingP = code.includes('</p>');

    let errorMessages = [];
    if (!hasOpeningH1) errorMessages.push('Missing opening <h1> tag.');
    if (!hasClosingH1) errorMessages.push('Missing closing </h1> tag.');
    if (!hasOpeningH2) errorMessages.push('Missing opening <h2> tag.');
    if (!hasClosingH2) errorMessages.push('Missing closing </h2> tag.');
    if (!hasOpeningP) errorMessages.push('Missing opening <p> tag.');
    if (!hasClosingP) errorMessages.push('Missing closing </p> tag.');

    if (errorMessages.length === 0) {
        feedback.textContent = '✅ Correct! Well done! You can move to the next lesson.';
        feedback.style.color = 'green';
        document.getElementById('next-lesson').disabled = false;
        localStorage.setItem('partB_lesson2_complete', 'true');
    } else {
        feedback.textContent = '❌ Errors: ' + errorMessages.join(' ');
        feedback.style.color = 'red';

        const missingClosings = errorMessages.filter(msg => msg.includes('closing'));
        if (missingClosings.length > 0) {
            alert('Please add the following closing tags: ' + missingClosings.join(' and '));
        }
    }
});

document.getElementById('show-hint').addEventListener('click', function () {
    alert('<h1>Main Title</h1>\n<h2>Subheading</h2>\n<p>Your paragraph here.</p>');
});

document.getElementById('next-lesson').addEventListener('click', function () {
    if (!this.disabled) {
        window.location.href = '../lesson3/lesson3.html';
    }
});
