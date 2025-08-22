
// Initialize task preview
const taskEditor = document.getElementById('code-editor');
const taskPreview = document.getElementById('result-frame');

// Safer way to write HTML into an <iframe>
function setIframeHTML(iframe, html) {
    try {
        if (iframe && 'srcdoc' in iframe) {
            iframe.srcdoc = html;
            return;
        }
        const doc = (iframe && (iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document))) || null;
        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();
            return;
        }
        if (iframe) {
            iframe.setAttribute('src', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
        }
    } catch (e) {
        try {
            if (iframe) {
                iframe.setAttribute('src', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
            }
        } catch (_) {}
        console.error('Failed to render preview:', e);
    }
}


function renderTask() {
    const _iframe = document.getElementById('result-frame') || taskPreview;
    if (taskEditor && _iframe) {
        let cleanCode = taskEditor.value;
        
        // Remove live server script injection
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
        
        setIframeHTML(_iframe, cleanCode);
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
}


// Show hint function
document.getElementById('show-hint').addEventListener('click', function() {
    alert('Hint: Create a sticky footer using position: fixed!\n\nExample structure:\n<footer class="footer">\n  Copyright © 2024 My Website\n</footer>\n\nKey CSS properties:\n- position: fixed (on footer)\n- bottom: 0\n- left: 0\n- width: 100%\n- margin-bottom on content to avoid overlap\n\nRemember: You need position: fixed for the footer and proper spacing for content!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    // Handle completely empty or invalid code
    if (!taskEditor.value.trim() || !/(<html|<body|<footer|<header|<main)/i.test(taskEditor.value)) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c;">
                <strong>❌ Your code is empty.</strong><br><br>
                Please include all requirements:<br>
                • A complete HTML structure (&lt;html&gt;, &lt;head&gt;, &lt;body&gt;)<br>
                • A &lt;header&gt; section with a title<br>
                • A &lt;main&gt; section with at least 2 &lt;p&gt; paragraphs<br>
                • A &lt;footer&gt; that uses <code>position: fixed</code>, <code>bottom: 0</code>, and <code>width: 100%</code><br>
                • CSS styling inside &lt;style&gt; tags<br>
                • At least one element with <code>position: absolute</code> or <code>relative</code><br>
                • Proper spacing (margin-bottom/padding-bottom) to prevent footer overlap
            </div>
        `;
        return; // stop further validation
    }

    const code = taskEditor.value;
    
    // Clean code by removing live server scripts
    let cleanCode = code.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
    
    const codeClean = cleanCode.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Check for required positioning properties
    const hasPositionFixed = /position\s*:\s*fixed/i.test(cleanCode);
    const hasBottom = /bottom\s*:\s*0/i.test(cleanCode);
    const hasWidth = /width\s*:\s*100%/i.test(cleanCode);
    const hasPositionAbsolute = /position\s*:\s*absolute/i.test(cleanCode);
    const hasPositionRelative = /position\s*:\s*relative/i.test(cleanCode);
    
    // Check for CSS syntax structure
    const hasSelector = /[a-z#.][a-z0-9#.-]*\s*{[^}]*}/i.test(cleanCode);
    const hasValidCSSSyntax = /[^{}]*{\s*[^{}]*:\s*[^{}]*;[^{}]*}/i.test(cleanCode);
    
    // Check for HTML structure
    const hasHtml = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode);
    const hasFooter = /<footer[^>]*>[\s\S]*<\/footer>/i.test(cleanCode);
    const hasStyleTag = /<style[^>]*>[\s\S]*<\/style>/i.test(cleanCode);
    
    // Check for content structure
    const hasHeader = /<header[^>]*>[\s\S]*<\/header>/i.test(cleanCode) || /<h[1-6][^>]*>[\s\S]*<\/h[1-6]>/i.test(cleanCode);
    const hasMain = /<main[^>]*>[\s\S]*<\/main>/i.test(cleanCode) || /<div[^>]*class[^>]*content[^>]*>/i.test(cleanCode);
    const hasParagraphs = (cleanCode.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []).length >= 2;
    
    // Check for proper spacing (margin-bottom on content)
    const hasMarginBottom = /margin-bottom\s*:\s*[^;]+/i.test(cleanCode);
    const hasPaddingBottom = /padding-bottom\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for content in body
    const hasBodyContent = /<body[^>]*>[\s\S]*?<[^>]*>[\s\S]*?<\/[^>]*>[\s\S]*?<\/body>/i.test(cleanCode);
    
    // Check for styling
    const hasBackgroundColor = /background(-color)?\s*:\s*[^;]+/i.test(cleanCode);
    const hasPadding = /padding\s*:\s*[^;]+/i.test(cleanCode);
    const hasColor = /color\s*:\s*[^;]+/i.test(cleanCode);
    
    // Check for footer classes
    const hasFooterClass = /class\s*=\s*['""][^'""]*footer[^'""]*['""]/i.test(cleanCode);
    
    // Check for z-index (good practice for fixed elements)
    const hasZIndex = /z-index\s*:\s*[^;]+/i.test(cleanCode);
    
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
    
    // Check for footer element
    if (!hasFooter) {
        errorMessages.push('Missing <footer> element. Use <footer> for the footer section.');
    } else {
        successMessages.push('✓ Uses <footer> element');
    }
    
    // Check required positioning properties
    if (!hasPositionFixed) {
        errorMessages.push('Missing "position: fixed" property. This is required for sticky footer.');
    } else {
        successMessages.push('✓ Uses position: fixed');
    }
    
    if (!hasBottom) {
        errorMessages.push('Missing "bottom: 0" property. Footer should stick to bottom of viewport.');
    } else {
        successMessages.push('✓ Uses bottom: 0');
    }
    
    if (!hasWidth) {
        errorMessages.push('Missing "width: 100%" property. Footer should span full width.');
    } else {
        successMessages.push('✓ Uses width: 100%');
    }
    
    // Check for content structure
    if (!hasHeader) {
        errorMessages.push('Missing header section with title. Add <header> or heading elements.');
    } else {
        successMessages.push('✓ Has header section');
    }
    
    if (!hasMain) {
        errorMessages.push('Missing main content area. Add <main> or content container.');
    } else {
        successMessages.push('✓ Has main content area');
    }
    
    if (!hasParagraphs) {
        errorMessages.push('Need at least 2 paragraphs in the main content area.');
    } else {
        successMessages.push(`✓ Has multiple paragraphs (${(cleanCode.match(/<p[^>]*>/gi) || []).length})`);
    }
    
    // Check for absolute positioning requirement
    if (!hasPositionAbsolute && !hasPositionRelative) {
        errorMessages.push('Missing additional positioned element. Add at least one element with position: absolute or relative.');
    } else if (hasPositionAbsolute) {
        successMessages.push('✓ Uses position: absolute');
    } else if (hasPositionRelative) {
        successMessages.push('✓ Uses position: relative');
    }
    
    // Check for proper spacing (to prevent footer overlap)
    if (!hasMarginBottom && !hasPaddingBottom) {
        errorMessages.push('Add margin-bottom or padding-bottom to content to prevent footer overlap.');
    } else {
        successMessages.push('✓ Has spacing to prevent footer overlap');
    }
    
    // Check styling
    if (!hasBackgroundColor) {
        warningMessages.push('Add background colors to make elements more visible.');
    } else {
        successMessages.push('✓ Uses background colors');
    }
    
    if (!hasPadding) {
        warningMessages.push('Add padding to improve spacing and appearance.');
    } else {
        successMessages.push('✓ Uses padding for spacing');
    }
    
    if (!hasColor) {
        warningMessages.push('Add text colors for better visual contrast.');
    } else {
        successMessages.push('✓ Uses text colors');
    }
    
    // Check class usage
    if (hasFooterClass) {
        successMessages.push('✓ Uses footer class');
    } else {
        warningMessages.push('Consider using a "footer" class for better organization.');
    }
    
    // Check z-index
    if (!hasZIndex) {
        warningMessages.push('Consider adding z-index to ensure footer appears above other content.');
    } else {
        successMessages.push('✓ Uses z-index for layering');
    }
    
    // Check for common CSS best practices
    if (codeClean.includes('style=')) {
        warningMessages.push('Avoid inline styles. Use <style> tags or external CSS instead.');
    }
    
    // Check for body margin reset
    if (!/body\s*{[^}]*margin\s*:\s*0/i.test(cleanCode)) {
        warningMessages.push('Consider resetting body margin with "margin: 0" for better layout control.');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        let feedbackContent = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Excellent CSS Positioning!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully created a sticky footer using CSS positioning!
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson9_complete', 'true');
        
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
            • Complete HTML page with header, main content, and footer<br>
            • Footer must use position: fixed with bottom: 0 and width: 100%<br>
            • At least 2 paragraphs in main content<br>
            • At least one element with position: absolute or relative<br>
            • Proper spacing to prevent footer from overlapping content<br>
            • CSS styling using &lt;style&gt; tags in &lt;head&gt;
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
        window.location.href = '../lesson10/lesson10.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson9_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});
