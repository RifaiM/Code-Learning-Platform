// Initialize task elements
const taskEditor = document.getElementById('code-editor');

// Show hint function
document.getElementById('show-hint').addEventListener('click', function() {
    alert('Hint: Create HTML elements with IDs and use JavaScript to select and modify them!\n\nExample structure:\n\n<h1 id="title">Original Title</h1>\n<button id="changeBtn">Change Title</button>\n\n<script>\n  let titleElement = document.getElementById("title");\n  let button = document.getElementById("changeBtn");\n  \n  button.onclick = function() {\n    titleElement.innerHTML = "New Title!";\n  };\n</script>\n\nRemember: You need getElementById, innerHTML, and button click functionality!');
});

// Simple result preview function - creates a clean preview window
function showCodeResult(code) {
    // Clean code by removing live server scripts
    let cleanCode = code.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
    
    // Create a new window to show the result
    const resultWindow = window.open('', 'DOM_Result', 'width=600,height=400,scrollbars=yes,resizable=yes');
    
    if (resultWindow) {
        const resultHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOM Manipulation Result</title>
    <style>
        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            margin: 20px;
            background: #f8f9ff;
            color: #333;
        }
        .header {
            background: #007BFF;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .content {
            background: white;
            border: 1px solid #dde7ff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #007BFF;
            margin-top: 0;
        }
        button {
            background: #007BFF;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s ease;
            margin: 5px;
        }
        button:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🎯 DOM Manipulation Demo Result</h2>
        <p>This window shows your code in action. Try interacting with the elements!</p>
    </div>
    <div class="content">
        ${cleanCode}
    </div>
</body>
</html>`;
        
        resultWindow.document.write(resultHTML);
        resultWindow.document.close();
        resultWindow.focus();
    } else {
        alert('Pop-up blocked! Please allow pop-ups to see your code result.\n\nAlternatively, copy your code to a new HTML file to test it.');
    }
}

// Check answer function with comprehensive validation
document.getElementById('check-answer').addEventListener('click', function() {
    // Handle completely empty or invalid code
    if (!taskEditor.value.trim()) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c; padding: 15px; border-radius: 6px;">
                <strong>⚠ Your code is empty.</strong><br><br>
                Please include all requirements:<br>
                • HTML structure with at least one heading and one button<br>
                • Unique ID attributes for elements you want to manipulate<br>
                • JavaScript that uses getElementById to select elements<br>
                • Button click functionality that changes the heading text<br>
                • innerHTML property to modify content<br>
                • The button should change the heading text when clicked
            </div>
        `;
        return;
    }

    const code = taskEditor.value;
    
    // Clean code by removing live server scripts
    let cleanCode = code.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
    cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
    
    // Extract JavaScript content if it's in HTML
    let jsContent = cleanCode;
    const scriptMatches = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptMatches) {
        jsContent = scriptMatches.map(match => {
            const content = match.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            return content ? content[1] : '';
        }).join('\n');
    }
    
    // Check for required DOM manipulation elements
    const hasGetElementById = /document\.getElementById\s*\(\s*["'`][^"'`]*["'`]\s*\)/i.test(jsContent);
    const getElementByIdCount = (jsContent.match(/document\.getElementById\s*\(/gi) || []).length;
    
    // Check for innerHTML usage
    const hasInnerHTML = /\.innerHTML\s*=/i.test(jsContent);
    const innerHTMLCount = (jsContent.match(/\.innerHTML\s*=/gi) || []).length;
    
    // Check for button click functionality
    const hasButtonClick = /\.onclick\s*=|addEventListener\s*\(\s*["'`]click["'`]/i.test(jsContent);
    
    // Check for HTML structure elements
    const hasHeading = /<h[1-6][^>]*>/i.test(cleanCode);
    const hasButton = /<button[^>]*>/i.test(cleanCode);
    
    // Check for ID attributes
    const hasIds = /id\s*=\s*["'`][^"'`]+["'`]/i.test(cleanCode);
    const idCount = (cleanCode.match(/id\s*=\s*["'`][^"'`]+["'`]/gi) || []).length;
    
    // Check for proper HTML structure
    const hasHTMLStructure = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || 
                             /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode) ||
                             (hasHeading && hasButton); // Allow simpler structure
    
    // Check for meaningful variable names
    const hasDescriptiveNames = /let\s+[a-zA-Z_$][a-zA-Z0-9_$]{3,}\s*=/.test(jsContent) ||
                               /const\s+[a-zA-Z_$][a-zA-Z0-9_$]{3,}\s*=/.test(jsContent) ||
                               /var\s+[a-zA-Z_$][a-zA-Z0-9_$]{3,}\s*=/.test(jsContent);
    
    let errorMessages = [];
    let successMessages = [];
    let warningMessages = [];
    
    // Check HTML structure
    if (!hasHTMLStructure) {
        errorMessages.push('Missing proper HTML structure. Include HTML elements or at least heading and button tags.');
    } else {
        successMessages.push('✓ Has HTML structure');
    }
    
    // Check for headings
    if (!hasHeading) {
        errorMessages.push('Missing heading element. Include at least one <h1>, <h2>, etc. element.');
    } else {
        successMessages.push('✓ Has heading element');
    }
    
    // Check for buttons
    if (!hasButton) {
        errorMessages.push('Missing button element. Include at least one <button> element.');
    } else {
        successMessages.push('✓ Has button element');
    }
    
    // Check for ID attributes
    if (!hasIds) {
        errorMessages.push('Missing ID attributes. Add id="..." to elements you want to manipulate.');
    } else if (idCount < 2) {
        errorMessages.push(`Need at least 2 elements with ID attributes. Found ${idCount} ID(s).`);
    } else {
        successMessages.push(`✓ Has ${idCount} element(s) with ID attributes`);
    }
    
    // Check getElementById usage
    if (!hasGetElementById) {
        errorMessages.push('Missing document.getElementById(). Use it to select HTML elements.');
    } else if (getElementByIdCount < 2) {
        errorMessages.push(`Need at least 2 getElementById() calls. Found ${getElementByIdCount} call(s).`);
    } else {
        successMessages.push(`✓ Uses getElementById (${getElementByIdCount} calls)`);
    }
    
    // Check innerHTML usage
    if (!hasInnerHTML) {
        errorMessages.push('Missing innerHTML usage. Use element.innerHTML = "..." to change content.');
    } else {
        successMessages.push(`✓ Uses innerHTML (${innerHTMLCount} usage(s))`);
    }
    
    // Check button click functionality
    if (!hasButtonClick) {
        errorMessages.push('Missing button click functionality. Use button.onclick = function() {...} or addEventListener.');
    } else {
        successMessages.push('✓ Has button click functionality');
    }
    
    // Check variable naming
    if (!hasDescriptiveNames) {
        warningMessages.push('Use descriptive variable names (e.g., "titleElement" instead of "x").');
    } else {
        successMessages.push('✓ Uses descriptive variable names');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        let feedbackContent = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60; padding: 15px; border-radius: 6px;">
                <strong>🎉 Excellent DOM Manipulation!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully created interactive DOM manipulation with getElementById and innerHTML!<br>
                <strong>🔥 Pro tip:</strong> DOM manipulation is the foundation of modern web interactivity.<br><br>
                <button onclick="showCodeResult(\`${cleanCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)" style="background: #007BFF; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                    🚀 View Your Code Result
                </button>
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson11_complete', 'true');
        
        // Add the showCodeResult function to the global scope for the button
        window.showCodeResult = showCodeResult;
        
    } else {
        let feedbackContent = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c; padding: 15px; border-radius: 6px;">
                <strong>⚠ Please fix these issues:</strong><br>
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
            • HTML structure with at least one heading and one button<br>
            • Unique ID attributes for elements you want to manipulate<br>
            • JavaScript that uses getElementById to select elements<br>
            • Button click functionality that changes the heading text<br>
            • innerHTML property to modify content<br>
            • The button should change the heading text when clicked
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Keep next button disabled
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    }
});

// Next lesson button
document.getElementById('next-lesson').addEventListener('click', function() {
    if (!this.disabled) {
        window.location.href = '../lesson12/lesson12.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson11_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Hide the live preview iframe since we're not using it
    const resultContainer = document.querySelector('.result-container');
    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
    
    // Adjust the editor to take full width
    const editorBox = document.querySelector('.editor-box');
    if (editorBox) {
        editorBox.style.flex = '1 1 100%';
        editorBox.style.maxWidth = '100%';
    }
});