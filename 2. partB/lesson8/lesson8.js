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
    alert('Hint: Create a navigation bar using Flexbox!\n\nExample structure:\n<nav class="navbar">\n  <div class="logo">My Website</div>\n  <ul class="nav-links">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>\n\nKey CSS properties:\n- display: flex (on navbar)\n- justify-content: space-between\n- align-items: center\n- display: flex (on nav-links)\n\nRemember: You need display: flex and justify-content!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    const code = taskEditor.value;
    
    // Clean code by removing live server scripts
    let cleanCode = code.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
    
    const codeClean = cleanCode.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for required Flexbox properties
    const hasDisplayFlex = /display\s*:\s*flex/i.test(cleanCode);
    const hasJustifyContent = /justify-content\s*:\s*[^;]+/i.test(cleanCode);
    const hasAlignItems = /align-items\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for CSS syntax structure
    const hasSelector = /[a-z#.][a-z0-9#.-]*\s*{[^}]*}/i.test(cleanCode);
    const hasValidCSSSyntax = /[^{}]*{\s*[^{}]*:\s*[^{}]*;[^{}]*}/i.test(cleanCode);
    
    // Check for HTML structure
    const hasHtml = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode);
    const hasNav = /<nav[^>]*>[\s\S]*<\/nav>/i.test(cleanCode);
    const hasStyleTag = /<style[^>]*>[\s\S]*<\/style>/i.test(cleanCode);
    
    // Check for navigation elements (at least 3 links)
    const linkCount = (cleanCode.match(/<a[^>]*href[^>]*>/gi) || []).length;
    const hasUL = /<ul[^>]*>[\s\S]*<\/ul>/i.test(cleanCode);
    const hasLI = /<li[^>]*>[\s\S]*<\/li>/i.test(cleanCode);
    
    // Check for logo/title
    const hasLogo = /logo|brand|title|site/i.test(cleanCode) || /<h[1-6][^>]*>[\s\S]*<\/h[1-6]>/i.test(cleanCode);
    
    // Check for class usage
    const hasNavbarClass = /class\s*=\s*['""][^'""]*navbar[^'""]*['""]/i.test(cleanCode);
    const hasNavLinksClass = /class\s*=\s*['""][^'""]*nav-?links?[^'""]*['""]/i.test(cleanCode);
    
    // Check for proper navigation structure
    const hasNavStructure = hasNav && (hasUL || hasLI) && linkCount >= 3;
    
    // Check for content in body
    const hasBodyContent = /<body[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/body>/i.test(cleanCode) || 
                          /<nav[^>]*>[\s\S]*?<\/nav>/i.test(cleanCode);
    
    // Check for styling
    const hasBackgroundColor = /background(-color)?\s*:\s*[^;]+/i.test(cleanCode);
    const hasPadding = /padding\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for multiple flex containers
    const flexCount = (cleanCode.match(/display\s*:\s*flex/gi) || []).length;
    
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
    
    // Check for navigation structure
    if (!hasNav) {
        errorMessages.push('Missing <nav> element. Use <nav> for the navigation bar.');
    } else {
        successMessages.push('✓ Uses <nav> element');
    }
    
    if (!hasNavStructure) {
        errorMessages.push('Navigation needs proper structure with <ul>, <li>, and at least 3 <a> links.');
    } else {
        successMessages.push(`✓ Proper navigation structure with ${linkCount} links`);
    }
    
    // Check required Flexbox properties
    if (!hasDisplayFlex) {
        errorMessages.push('Missing "display: flex" property. This is required for Flexbox layout.');
    } else {
        successMessages.push('✓ Uses display: flex');
    }
    
    if (!hasJustifyContent) {
        errorMessages.push('Missing "justify-content" property. This controls alignment along the main axis.');
    } else {
        successMessages.push('✓ Uses justify-content property');
    }
    
    // Check align-items (recommended but not required)
    if (!hasAlignItems) {
        warningMessages.push('Consider adding "align-items" for better vertical alignment.');
    } else {
        successMessages.push('✓ Uses align-items property');
    }
    
    // Check for logo/title
    if (!hasLogo) {
        warningMessages.push('Add a logo or site title to the navigation.');
    } else {
        successMessages.push('✓ Includes logo/title element');
    }
    
    // Check class usage
    if (hasNavbarClass) {
        successMessages.push('✓ Uses navbar class');
    } else {
        warningMessages.push('Consider using a "navbar" class for better organization.');
    }
    
    if (hasNavLinksClass) {
        successMessages.push('✓ Uses nav-links class');
    } else {
        warningMessages.push('Consider using a "nav-links" class for the link container.');
    }
    
    // Check styling
    if (!hasBackgroundColor) {
        warningMessages.push('Add background color to make the navigation bar more visible.');
    } else {
        successMessages.push('✓ Uses background color');
    }
    
    if (!hasPadding) {
        warningMessages.push('Add padding to improve spacing and appearance.');
    } else {
        successMessages.push('✓ Uses padding for spacing');
    }
    
    // Check for multiple flex containers
    if (flexCount > 1) {
        successMessages.push('✓ Excellent! Uses multiple flex containers');
    } else if (flexCount === 1) {
        warningMessages.push('Try using flexbox for both the navbar and nav-links containers.');
    }
    
    // Check for common CSS best practices
    if (codeClean.includes('style=')) {
        warningMessages.push('Avoid inline styles. Use <style> tags or external CSS instead.');
    }
    
    // Check for list-style removal
    if (hasUL && !/list-style\s*:\s*none/i.test(cleanCode)) {
        warningMessages.push('Consider removing list bullets with "list-style: none" on ul.');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        let feedbackContent = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Excellent Flexbox Navigation!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully created a navigation bar using Flexbox layout properties!
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson8_complete', 'true');
        
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
            • Complete HTML page with &lt;nav&gt; element<br>
            • CSS using &lt;style&gt; tags in &lt;head&gt;<br>
            • Use display: flex on navigation container<br>
            • Include justify-content property<br>
            • At least 3 navigation links in proper structure<br>
            • Logo or site title element
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
        window.location.href = '../lesson9/lesson9.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson8_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});