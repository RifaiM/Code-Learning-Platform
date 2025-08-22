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
    alert('Hint: Create a complete HTML page with box model properties!\n\n<html>\n<head>\n  <style>\n    .box1 {\n      width: 200px;\n      height: 100px;\n      background: lightblue;\n      margin: 20px;\n      padding: 15px;\n      border: 2px solid blue;\n    }\n    .box2 {\n      width: 180px;\n      height: 80px;\n      background: lightgreen;\n      margin: 10px 30px;\n      padding: 20px;\n      border: 3px dashed green;\n    }\n    .box3 {\n      width: 160px;\n      height: 60px;\n      background: lightyellow;\n      margin: 15px auto;\n      padding: 12px;\n      border: 1px solid orange;\n      border-radius: 5px;\n    }\n  </style>\n</head>\n<body>\n  <div class="box1">Box 1 with margin and padding</div>\n  <div class="box2">Box 2 with different spacing</div>\n  <div class="box3">Box 3 with auto margins</div>\n</body>\n</html>\n\nRemember: You need margin, padding, and border properties!');
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
    const hasMargin = /margin(-top|-right|-bottom|-left)?\s*:\s*[^;]+/i.test(cleanCode);
    const hasPadding = /padding(-top|-right|-bottom|-left)?\s*:\s*[^;]+/i.test(cleanCode);
    const hasBorder = /border(-top|-right|-bottom|-left|-width|-style|-color)?\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for CSS syntax structure
    const hasSelector = /[a-z#.][a-z0-9#.-]*\s*{[^}]*}/i.test(cleanCode);
    const hasValidCSSSyntax = /[^{}]*{\s*[^{}]*:\s*[^{}]*;[^{}]*}/i.test(cleanCode);
    
    // Check for HTML structure
    const hasHtml = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode);
    const hasHead = /<head[^>]*>[\s\S]*<\/head>/i.test(cleanCode);
    const hasStyleTag = /<style[^>]*>[\s\S]*<\/style>/i.test(cleanCode);
    
    // Check for multiple elements (at least 3)
    const elementCount = (cleanCode.match(/<div[^>]*>|<p[^>]*>|<h[1-6][^>]*>|<section[^>]*>|<article[^>]*>/gi) || []).length;
    
    // Check for content in body
    const hasBodyContent = /<body[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/body>/i.test(cleanCode) || 
                          /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i.test(cleanCode) || 
                          /<p[^>]*>[\s\S]*?<\/p>/i.test(cleanCode) ||
                          /<div[^>]*>[\s\S]*?<\/div>/i.test(cleanCode);
    
    // Check for background colors (to visualize spacing)
    const hasBackground = /background(-color)?\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for class usage
    const hasClassSelector = /\.[a-z][a-z0-9-]*\s*{/i.test(cleanCode);
    const hasClassAttribute = /class\s*=\s*['""][^'""]*['"]/i.test(cleanCode);
    
    // Check for element selectors
    const hasElementSelector = /^[a-z][a-z0-9]*\s*{/im.test(cleanCode) || 
                               /}\s*[a-z][a-z0-9]*\s*{/im.test(cleanCode) ||
                               />\s*[a-z][a-z0-9]*\s*{/im.test(cleanCode);
    
    // Check for different values (good practice)
    const marginValues = cleanCode.match(/margin[^:]*:\s*([^;]+)/gi) || [];
    const paddingValues = cleanCode.match(/padding[^:]*:\s*([^;]+)/gi) || [];
    const borderValues = cleanCode.match(/border[^:]*:\s*([^;]+)/gi) || [];
    
    const hasDifferentMargins = new Set(marginValues.map(v => v.toLowerCase())).size > 1;
    const hasDifferentPadding = new Set(paddingValues.map(v => v.toLowerCase())).size > 1;
    const hasDifferentBorders = new Set(borderValues.map(v => v.toLowerCase())).size > 1;
    
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
    if (!hasMargin) {
        errorMessages.push('Missing "margin" property. Add margin to create space between elements.');
    } else {
        successMessages.push('✓ Uses margin property');
    }
    
    if (!hasPadding) {
        errorMessages.push('Missing "padding" property. Add padding to create space inside elements.');
    } else {
        successMessages.push('✓ Uses padding property');
    }
    
    if (!hasBorder) {
        errorMessages.push('Missing "border" property. Add border styling to elements.');
    } else {
        successMessages.push('✓ Uses border property');
    }
    
    // Check for multiple elements
    if (elementCount < 3) {
        errorMessages.push(`Need at least 3 different elements. Found ${elementCount}. Try adding more divs or paragraphs.`);
    } else {
        successMessages.push(`✓ Has ${elementCount} elements`);
    }
    
    // Check background colors
    if (!hasBackground) {
        warningMessages.push('Add background colors to better visualize the box model spacing.');
    } else {
        successMessages.push('✓ Uses background colors for visualization');
    }
    
    // Check selectors
    if (!hasElementSelector && hasValidCSSSyntax) {
        warningMessages.push('Consider using element selectors like div, p, h1, etc.');
    } else if (hasElementSelector) {
        successMessages.push('✓ Uses element selectors');
    }
    
    if (hasClassSelector && hasClassAttribute) {
        successMessages.push('✓ Great! Uses class selectors and attributes');
    } else if (hasClassSelector && !hasClassAttribute) {
        warningMessages.push('You have CSS class selectors but no HTML elements using those classes.');
    } else if (!hasClassSelector) {
        warningMessages.push('Try adding class selectors (.classname) for better styling control.');
    }
    
    // Check for variety in values
    if (hasDifferentMargins) {
        successMessages.push('✓ Excellent! Uses different margin values');
    } else if (hasMargin) {
        warningMessages.push('Try using different margin values for different elements.');
    }
    
    if (hasDifferentPadding) {
        successMessages.push('✓ Excellent! Uses different padding values');
    } else if (hasPadding) {
        warningMessages.push('Try using different padding values for different elements.');
    }
    
    if (hasDifferentBorders) {
        successMessages.push('✓ Excellent! Uses different border styles');
    } else if (hasBorder) {
        warningMessages.push('Try using different border styles (solid, dashed, dotted).');
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
                <strong>🎉 Excellent Box Model Implementation!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully demonstrated the CSS box model with margin, padding, and border properties!
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson7_complete', 'true');
        
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
            • Complete HTML page with at least 3 elements<br>
            • CSS using &lt;style&gt; tags in &lt;head&gt;<br>
            • Use margin, padding, and border properties<br>
            • Different spacing values for different elements<br>
            • Background colors to visualize spacing
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
        window.location.href = '../lesson8/lesson8.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson7_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});