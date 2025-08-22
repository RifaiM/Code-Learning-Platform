// Initialize task preview
const taskEditor = document.getElementById('code-editor');
const taskPreview = document.getElementById('result-frame');

function renderTask() {
    if (taskEditor && taskPreview) {
        taskPreview.srcdoc = taskEditor.value;
    }
}

// Update preview on input
if (taskEditor) {
    taskEditor.addEventListener('input', renderTask);
    renderTask(); // Initial render
}

// Show hint function
document.getElementById('show-hint').addEventListener('click', function() {
    alert('Hint: Use <h1> for your name, <img> with src and alt attributes, <p> for description, and <a> with href for links.\n\nExample:\n<h1>Your Name</h1>\n<img src="image-url" alt="description">\n<p>About yourself...</p>\n<a href="website-url">Link text</a>');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    const code = taskEditor.value.toLowerCase();
    const originalCode = taskEditor.value; // Keep original case for more detailed checks
    
    // Check for required elements
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(originalCode);
    const hasImg = /<img[^>]*>/i.test(originalCode);
    const hasAlt = /<img[^>]*alt\s*=\s*["'][^"']*["']/i.test(originalCode);
    const hasA = /<a[^>]*href\s*=\s*["'][^"']*["'][^>]*>[\s\S]*?<\/a>/i.test(originalCode);
    const hasP = /<p[^>]*>[\s\S]*?<\/p>/i.test(originalCode);
    
    // Count images and links
    const imgCount = (originalCode.match(/<img[^>]*>/gi) || []).length;
    const linkCount = (originalCode.match(/<a[^>]*href[^>]*>[\s\S]*?<\/a>/gi) || []).length;
    
    let errorMessages = [];
    let successMessages = [];
    
    // Check requirements
    if (!hasH1) {
        errorMessages.push('Missing <h1> heading tag.');
    } else {
        successMessages.push('✓ Has heading');
    }
    
    if (!hasImg) {
        errorMessages.push('Missing <img> tag.');
    } else if (imgCount !== 1) {
        errorMessages.push(`Must have exactly 1 image, found ${imgCount}.`);
    } else {
        successMessages.push('✓ Has 1 image');
    }
    
    if (!hasAlt && hasImg) {
        errorMessages.push('Image is missing alt attribute.');
    } else if (hasImg && hasAlt) {
        successMessages.push('✓ Image has alt text');
    }
    
    if (!hasA) {
        errorMessages.push('Missing <a> link tag with href attribute.');
    } else if (linkCount < 1) {
        errorMessages.push('Must have at least 1 working link.');
    } else {
        successMessages.push('✓ Has link(s)');
    }
    
    if (!hasP) {
        errorMessages.push('Missing <p> paragraph tag.');
    } else {
        successMessages.push('✓ Has paragraph');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        feedback.innerHTML = `<div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60; border-radius: 6px; padding: 10px;">
            <strong>✅ Excellent work!</strong><br>
            ${successMessages.join('<br>')}
            <br><br>You can now move to the next lesson!
        </div>`;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson3_complete', 'true');
    } else {
        feedback.innerHTML = `<div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c; border-radius: 6px; padding: 10px;">
            <strong>❌ Please fix these issues:</strong><br>
            ${errorMessages.join('<br>')}
            ${successMessages.length > 0 ? '<br><br><strong>What you have so far:</strong><br>' + successMessages.join('<br>') : ''}
        </div>`;
        
        // Keep next button disabled
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    }
    
    // Update preview
    renderTask();
});

// Next lesson button
document.getElementById('next-lesson').addEventListener('click', function() {
    if (!this.disabled) {
        window.location.href = '../lesson4/lesson4.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson3_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});