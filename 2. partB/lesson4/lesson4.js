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
    alert('Hint: Create a navigation structure like this:\n\n<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>\n\nRemember: nav contains ul, ul contains li, li contains a!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    const code = taskEditor.value;
    const codeClean = code.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for required elements
    const hasNav = /<nav[^>]*>[\s\S]*?<\/nav>/i.test(code);
    const hasUl = /<ul[^>]*>[\s\S]*?<\/ul>/i.test(code);
    const hasLi = /<li[^>]*>[\s\S]*?<\/li>/i.test(code);
    
    // Count list items
    const liCount = (code.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || []).length;
    
    // Check structure: nav contains ul, ul contains li
    const navContainsUl = /<nav[^>]*>[\s\S]*?<ul[^>]*>[\s\S]*?<\/ul>[\s\S]*?<\/nav>/i.test(code);
    const ulContainsLi = /<ul[^>]*>[\s\S]*?<li[^>]*>[\s\S]*?<\/li>[\s\S]*?<\/ul>/i.test(code);
    
    // Check if li elements contain links (optional but good practice)
    const liWithLinks = (code.match(/<li[^>]*>[\s\S]*?<a[^>]*href[\s\S]*?<\/a>[\s\S]*?<\/li>/gi) || []).length;
    
    let errorMessages = [];
    let successMessages = [];
    
    // Check requirements
    if (!hasNav) {
        errorMessages.push('Missing <nav> element.');
    } else {
        successMessages.push('✓ Has <nav> element');
    }
    
    if (!hasUl) {
        errorMessages.push('Missing <ul> element.');
    } else {
        successMessages.push('✓ Has <ul> element');
    }
    
    if (!hasLi) {
        errorMessages.push('Missing <li> elements.');
    } else if (liCount < 3) {
        errorMessages.push(`Need exactly 3 <li> elements, found ${liCount}.`);
    } else if (liCount > 3) {
        errorMessages.push(`Need exactly 3 <li> elements, found ${liCount}. (Remove ${liCount - 3})`);
    } else {
        successMessages.push('✓ Has exactly 3 <li> elements');
    }
    
    // Check structure
    if (hasNav && hasUl && !navContainsUl) {
        errorMessages.push('<ul> must be inside the <nav> element.');
    } else if (navContainsUl) {
        successMessages.push('✓ Correct <nav> and <ul> structure');
    }
    
    if (hasUl && hasLi && !ulContainsLi) {
        errorMessages.push('<li> elements must be inside the <ul> element.');
    } else if (ulContainsLi) {
        successMessages.push('✓ Correct <ul> and <li> structure');
    }
    
    // Bonus points for links
    if (liCount === 3 && liWithLinks >= 2) {
        successMessages.push('✓ Great! You included links in your navigation');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0 && liCount === 3) {
        feedback.innerHTML = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Perfect Navigation Structure!</strong><br>
                ${successMessages.join('<br>')}
                <br><br>You've successfully created a semantic navigation bar!
            </div>
        `;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson4_complete', 'true');
        
    } else {
        let feedbackContent = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c;">
                <strong>❌ Please fix these issues:</strong><br>
                ${errorMessages.join('<br>')}
        `;
        
        if (successMessages.length > 0) {
            feedbackContent += `<br><br><strong>What's working well:</strong><br>${successMessages.join('<br>')}`;
        }
        
        feedbackContent += `
            <br><br><strong>💡 Remember the structure:</strong><br>
            nav → ul → li (3 times)
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
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
        window.location.href = '../lesson5/lesson5.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson4_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});