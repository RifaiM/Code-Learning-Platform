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
    alert('Hint: Build a semantic structure like this:\n\n<header>\n  <h1>My Blog</h1>\n</header>\n<main>\n  <section>\n    <h2>Blog Posts</h2>\n    <article>\n      <h3>Article Title</h3>\n      <p>Article content...</p>\n    </article>\n  </section>\n</main>\n<footer>\n  <p>Footer content</p>\n</footer>\n\nRemember: header → main → section → article → footer structure!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    const code = taskEditor.value;
    const codeClean = code.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for required elements
    const hasHeader = /<header[^>]*>[\s\S]*?<\/header>/i.test(code);
    const hasMain = /<main[^>]*>[\s\S]*?<\/main>/i.test(code);
    const hasSection = /<section[^>]*>[\s\S]*?<\/section>/i.test(code);
    const hasArticle = /<article[^>]*>[\s\S]*?<\/article>/i.test(code);
    const hasFooter = /<footer[^>]*>[\s\S]*?<\/footer>/i.test(code);
    
    // Check proper nesting structure
    const mainContainsSection = /<main[^>]*>[\s\S]*?<section[^>]*>[\s\S]*?<\/section>[\s\S]*?<\/main>/i.test(code);
    const sectionContainsArticle = /<section[^>]*>[\s\S]*?<article[^>]*>[\s\S]*?<\/article>[\s\S]*?<\/section>/i.test(code);
    
    // Check for content inside elements
    const headerHasContent = /<header[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/header>/i.test(code) || 
                             /<header[^>]*>[^<]*\w+[^<]*<\/header>/i.test(code);
    const articleHasContent = /<article[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/article>/i.test(code) || 
                             /<article[^>]*>[^<]*\w+[^<]*<\/article>/i.test(code);
    const footerHasContent = /<footer[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/footer>/i.test(code) || 
                            /<footer[^>]*>[^<]*\w+[^<]*<\/footer>/i.test(code);
    
    let errorMessages = [];
    let successMessages = [];
    
    // Check requirements
    if (!hasHeader) {
        errorMessages.push('Missing <header> element.');
    } else if (!headerHasContent) {
        errorMessages.push('<header> element is empty. Add a title or heading.');
    } else {
        successMessages.push('✓ Has <header> with content');
    }
    
    if (!hasMain) {
        errorMessages.push('Missing <main> element.');
    } else {
        successMessages.push('✓ Has <main> element');
    }
    
    if (!hasSection) {
        errorMessages.push('Missing <section> element.');
    } else {
        successMessages.push('✓ Has <section> element');
    }
    
    if (!hasArticle) {
        errorMessages.push('Missing <article> element.');
    } else if (!articleHasContent) {
        errorMessages.push('<article> element is empty. Add some content.');
    } else {
        successMessages.push('✓ Has <article> with content');
    }
    
    if (!hasFooter) {
        errorMessages.push('Missing <footer> element.');
    } else if (!footerHasContent) {
        errorMessages.push('<footer> element is empty. Add some content.');
    } else {
        successMessages.push('✓ Has <footer> with content');
    }
    
    // Check nesting structure
    if (hasMain && hasSection && !mainContainsSection) {
        errorMessages.push('<section> must be inside the <main> element.');
    } else if (mainContainsSection) {
        successMessages.push('✓ Correct <main> and <section> nesting');
    }
    
    if (hasSection && hasArticle && !sectionContainsArticle) {
        errorMessages.push('<article> must be inside the <section> element.');
    } else if (sectionContainsArticle) {
        successMessages.push('✓ Correct <section> and <article> nesting');
    }
    
    // Check for semantic best practices
    if (hasHeader && hasMain && hasFooter) {
        const properOrder = code.indexOf('<header') < code.indexOf('<main') && 
                           code.indexOf('<main') < code.indexOf('<footer');
        if (properOrder) {
            successMessages.push('✓ Semantic elements in logical order');
        } else {
            errorMessages.push('Elements should be in order: header → main → footer');
        }
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        feedback.innerHTML = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Perfect Semantic Structure!</strong><br>
                ${successMessages.join('<br>')}
                <br><br>Your HTML now has meaningful semantic structure that browsers, screen readers, and search engines can understand!
            </div>
        `;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson5_complete', 'true');
        
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
            header → main → section → article → footer
            <br>Each element should have some content!
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
        window.location.href = '../lesson6/lesson6.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson5_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});