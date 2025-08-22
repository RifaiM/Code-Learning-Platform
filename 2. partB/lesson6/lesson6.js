// Initialize task preview
const taskEditor = document.getElementById('code-editor');
const taskPreview = document.getElementById('result-frame');

function renderTask() {
    if (taskEditor && taskPreview) {
        // Clean the code by removing any live server injection scripts
        let cleanCode = taskEditor.value;
        
        // Remove live server script injection
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
        
        taskPreview.srcdoc = cleanCode;
    }
}

// Update preview on input
if (taskEditor) {
    taskEditor.addEventListener('input', function() {
        // Filter out any injected live server scripts
        let value = this.value;
        if (value.includes('Live reload enabled') || value.includes('websocket')) {
            // Clean the value
            value = value.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
            value = value.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
            value = value.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
            this.value = value;
        }
        renderTask();
    });
    renderTask(); // Initial render
}

// Show hint function
document.getElementById('show-hint').addEventListener('click', function() {
    alert('Hint: Create a complete HTML page with CSS styling!\n\n<html>\n<head>\n  <style>\n    h1 {\n      color: blue;\n      font-family: Arial, sans-serif;\n    }\n    body {\n      background: #f0f0f0;\n    }\n    .highlight {\n      color: red;\n      background: yellow;\n    }\n  </style>\n</head>\n<body>\n  <h1>My Styled Page</h1>\n  <p class="highlight">This is highlighted text</p>\n</body>\n</html>\n\nRemember: You need color, font-family, and background properties!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    const code = taskEditor.value;
    
    // Clean code by removing live server scripts
    let cleanCode = code.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
    
    const codeClean = cleanCode.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for required CSS properties
    const hasColor = /color\s*:\s*[^;]+/i.test(cleanCode);
    const hasFontFamily = /font-family\s*:\s*[^;]+/i.test(cleanCode);
    const hasBackground = /background(-color)?\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for CSS syntax structure
    const hasSelector = /[a-z#.][a-z0-9#.-]*\s*{[^}]*}/i.test(cleanCode);
    const hasValidCSSSyntax = /[^{}]*{\s*[^{}]*:\s*[^{}]*;[^{}]*}/i.test(cleanCode);
    
    // Check for HTML structure
    const hasHtml = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode);
    const hasHead = /<head[^>]*>[\s\S]*<\/head>/i.test(cleanCode);
    const hasStyleTag = /<style[^>]*>[\s\S]*<\/style>/i.test(cleanCode);
    
    // Check for content in body
    const hasBodyContent = /<body[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/body>/i.test(cleanCode) || 
                          /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i.test(cleanCode) || 
                          /<p[^>]*>[\s\S]*?<\/p>/i.test(cleanCode);
    
    // Check for class usage (good practice)
    const hasClassSelector = /\.[a-z][a-z0-9-]*\s*{/i.test(cleanCode);
    const hasClassAttribute = /class\s*=\s*['""][^'""]*['"]/i.test(cleanCode);
    
    // Check for element selectors
    const hasElementSelector = /^[a-z][a-z0-9]*\s*{/im.test(cleanCode) || 
                               /}\s*[a-z][a-z0-9]*\s*{/im.test(cleanCode) ||
                               />\s*[a-z][a-z0-9]*\s*{/im.test(cleanCode);
    
    let errorMessages = [];
    let successMessages = [];
    let warningMessages = [];
    
    // Check basic HTML structure
    if (!hasHtml || !hasBodyContent) {
        errorMessages.push('Create a complete HTML page with content in the body.');
    } else {
        successMessages.push('✓ Has HTML structure with content');
    }
    
    // Check for style implementation
    if (!hasStyleTag && !hasSelector) {
        errorMessages.push('Add CSS styling using <style> tags in the <head> section.');
    } else if (hasStyleTag) {
        successMessages.push('✓ Uses <style> tags for CSS');
    }
    
    // Check CSS syntax
    if (!hasValidCSSSyntax && hasStyleTag) {
        errorMessages.push('Check your CSS syntax: selector { property: value; }');
    } else if (hasValidCSSSyntax) {
        successMessages.push('✓ Proper CSS syntax structure');
    }
    
    // Check required properties
    if (!hasColor) {
        errorMessages.push('Missing "color" property. Add color styling to an element.');
    } else {
        successMessages.push('✓ Uses color property');
    }
    
    if (!hasFontFamily) {
        errorMessages.push('Missing "font-family" property. Set the font for your text.');
    } else {
        successMessages.push('✓ Uses font-family property');
    }
    
    if (!hasBackground) {
        errorMessages.push('Missing "background" or "background-color" property. Add background styling.');
    } else {
        successMessages.push('✓ Uses background property');
    }
    
    // Check selectors
    if (!hasElementSelector && hasValidCSSSyntax) {
        warningMessages.push('Consider using element selectors like h1, p, body, etc.');
    } else if (hasElementSelector) {
        successMessages.push('✓ Uses element selectors');
    }
    
    if (hasClassSelector && hasClassAttribute) {
        successMessages.push('✓ Great! Uses class selectors and attributes');
    } else if (hasClassSelector && !hasClassAttribute) {
        warningMessages.push('You have CSS class selectors but no HTML elements using those classes.');
    } else if (!hasClassSelector) {
        warningMessages.push('Try adding a class selector (.classname) for better styling control.');
    }
    
    // Check for common CSS best practices
    if (codeClean.includes('style=')) {
        warningMessages.push('Avoid inline styles. Use <style> tags or external CSS instead.');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        let feedbackContent = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Excellent CSS Styling!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully applied CSS styling to transform plain HTML into a visually appealing webpage!
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson6_complete', 'true');
        
    } else {
        let feedbackContent = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c;">
                <strong>❌ Please fix these issues:</strong><br>
                ${errorMessages.join('<br>')}
        `;
        
        if (successMessages.length > 0) {
            feedbackContent += `<br><br><strong>What's working well:</strong><br>${successMessages.join('<br>')}`;
        }
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Suggestions:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
            <br><br><strong>🎯 Requirements recap:</strong><br>
            • Complete HTML page with content<br>
            • CSS using &lt;style&gt; tags in &lt;head&gt;<br>
            • Use color, font-family, and background properties<br>
            • Proper CSS syntax: selector { property: value; }
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
        window.location.href = '../lesson7/lesson7.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson6_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});