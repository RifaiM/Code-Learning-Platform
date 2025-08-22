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

// Enhanced iframe HTML with console capture
function createEnhancedHTML(userCode) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Output</title>
    <style>
        body {
            font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f8f9ff;
            color: #333;
        }
        .console-output {
            background: #2d3748;
            color: #e2e8f0;
            padding: 16px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            margin-top: 20px;
            border: 2px solid #4a5568;
            max-height: 200px;
            overflow-y: auto;
        }
        .console-header {
            color: #a0aec0;
            font-size: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid #4a5568;
            padding-bottom: 8px;
            font-weight: bold;
        }
        .console-line {
            margin: 4px 0;
            padding: 2px 0;
        }
        .console-line.log {
            color: #68d391;
        }
        .console-line.error {
            color: #feb2b2;
        }
        .console-line.warn {
            color: #f6e05e;
        }
        .info-box {
            background: white;
            border: 1px solid #dde7ff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1, h2, h3 {
            color: #007BFF;
        }
        .highlight {
            background: #e3f2fd;
            padding: 8px 12px;
            border-radius: 4px;
            border-left: 4px solid #007BFF;
            margin: 12px 0;
        }
    </style>
</head>
<body>
    <div id="page-content"></div>
    <div class="console-output" id="console-output">
        <div class="console-header">📟 Console Output (console.log results appear here)</div>
        <div id="console-logs"></div>
    </div>
    
    <script>
        // Capture console.log output
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const consoleDiv = document.getElementById('console-logs');
        let logCount = 0;
        
        function addToConsole(message, type = 'log') {
            const line = document.createElement('div');
            line.className = 'console-line ' + type;
            line.textContent = '> ' + message;
            consoleDiv.appendChild(line);
            logCount++;
        }
        
        console.log = function(...args) {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            addToConsole(message, 'log');
            originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
            const message = args.map(arg => String(arg)).join(' ');
            addToConsole('ERROR: ' + message, 'error');
            originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
            const message = args.map(arg => String(arg)).join(' ');
            addToConsole('WARN: ' + message, 'warn');
            originalWarn.apply(console, args);
        };
        
        // Execute user code
        try {
            ${userCode}
            
            if (logCount === 0) {
                addToConsole('No console.log() output detected. Add console.log() statements to see results here!', 'warn');
            }
        } catch (error) {
            addToConsole('JavaScript Error: ' + error.message, 'error');
        }
    </script>
</body>
</html>
    `;
}

function extractScriptContent(html) {
    // Extract content from <script> tags
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    const scripts = [];
    let match;
    
    while ((match = scriptRegex.exec(html)) !== null) {
        scripts.push(match[1]);
    }
    
    return scripts.join('\n');
}

function extractBodyContent(html) {
    // Extract content from <body> tags (excluding script tags)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        // Remove script tags from body content
        let bodyContent = bodyMatch[1];
        bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        return bodyContent.trim();
    }
    return '';
}

function renderTask() {
    const iframe = document.getElementById('result-frame') || taskPreview;
    if (taskEditor && iframe) {
        let cleanCode = taskEditor.value;
        
        // Remove live server script injection
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?Live reload enabled[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<script[^>]*>[\s\S]*?websocket[\s\S]*?<\/script>/gi, '');
        cleanCode = cleanCode.replace(/<!--[\s\S]*?Live reload[\s\S]*?-->/gi, '');
        
        // Check if it's a full HTML document or just JavaScript
        if (cleanCode.includes('<html') || cleanCode.includes('<body')) {
            // Full HTML document
            const scriptContent = extractScriptContent(cleanCode);
            const bodyContent = extractBodyContent(cleanCode);
            
            // Create enhanced HTML with console capture
            const enhancedHTML = createEnhancedHTML(scriptContent);
            
            // Add body content to the enhanced HTML
            if (bodyContent) {
                const finalHTML = enhancedHTML.replace(
                    '<div id="page-content"></div>',
                    '<div id="page-content">' + bodyContent + '</div>'
                );
                setIframeHTML(iframe, finalHTML);
            } else {
                setIframeHTML(iframe, enhancedHTML);
            }
        } else {
            // Just JavaScript code
            const enhancedHTML = createEnhancedHTML(cleanCode);
            setIframeHTML(iframe, enhancedHTML);
        }
    }
}

// Update preview on input
if (taskEditor) {
    taskEditor.addEventListener('input', function() {
        // Filter out any injected live server scripts
        let value = this.value;
        if (value.includes('Live reload enabled') || value.includes('websocket')) {
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
    alert('Hint: Create variables and use console.log() to display output!\n\nExample structure:\n\n// Variables\nlet userName = "Alice";\nlet age = 25;\nlet isStudent = true;\n\n// Calculations\nlet birthYear = 2024 - age;\nlet sum = 10 + 5;\n\n// Console output\nconsole.log("Hello, " + userName + "!");\nconsole.log("Sum:", sum);\n\nRemember: You need console.log() statements and mathematical operations!');
});

// Check answer function
document.getElementById('check-answer').addEventListener('click', function() {
    // Handle completely empty or invalid code
    if (!taskEditor.value.trim()) {
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div style="color: #e74c3c; background: #fadbd8; border: 1px solid #e74c3c;">
                <strong>❌ Your code is empty.</strong><br><br>
                Please include all requirements:<br>
                • At least 3 variables with different data types (string, number, boolean)<br>
                • At least 2 mathematical operations using operators (+, -, *, /, etc.)<br>
                • Multiple console.log() statements to display output<br>
                • A greeting message that includes a variable<br>
                • A calculation result displayed in the console<br>
                • Descriptive variable names and meaningful output messages
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
    if (cleanCode.includes('<script')) {
        const scriptMatch = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (scriptMatch) {
            jsContent = scriptMatch[1];
        }
    }
    
    // Check for required JavaScript elements
    const hasConsoleLog = /console\.log\s*\(/i.test(jsContent);
    const consoleLogCount = (jsContent.match(/console\.log\s*\(/gi) || []).length;
    
    // Check for variables (let, const, var)
    const hasLet = /let\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/i.test(jsContent);
    const hasConst = /const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/i.test(jsContent);
    const hasVar = /var\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/i.test(jsContent);
    const hasVariables = hasLet || hasConst || hasVar;
    
    // Count total variables
    const letCount = (jsContent.match(/let\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/gi) || []).length;
    const constCount = (jsContent.match(/const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/gi) || []).length;
    const varCount = (jsContent.match(/var\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/gi) || []).length;
    const totalVariables = letCount + constCount + varCount;
    
    // Check for different data types
    const hasString = /["'`][^"'`]*["'`]/.test(jsContent);
    const hasNumber = /=\s*\d+(\.\d+)?[^a-zA-Z]/.test(jsContent);
    const hasBoolean = /=\s*(true|false)[\s;]/.test(jsContent);
    
    // Check for mathematical operations
    const hasMathOperations = /[\+\-\*\/\%]/.test(jsContent);
    const mathOperationCount = (jsContent.match(/[a-zA-Z_$][a-zA-Z0-9_$]*\s*[\+\-\*\/\%]\s*[a-zA-Z0-9_$]+/g) || []).length +
                              (jsContent.match(/\d+\s*[\+\-\*\/\%]\s*\d+/g) || []).length;
    
    // Check for meaningful variable names (not just single letters)
    const hasDescriptiveNames = /let\s+[a-zA-Z_$][a-zA-Z0-9_$]{2,}\s*=/.test(jsContent) ||
                               /const\s+[a-zA-Z_$][a-zA-Z0-9_$]{2,}\s*=/.test(jsContent);
    
    // Check for greeting message
    const hasGreeting = /console\.log\s*\(\s*["'`][^"'`]*hello[^"'`]*["'`]/.test(jsContent.toLowerCase()) ||
                       /console\.log\s*\(\s*["'`][^"'`]*hi[^"'`]*["'`]/.test(jsContent.toLowerCase()) ||
                       /console\.log\s*\(\s*["'`][^"'`]*welcome[^"'`]*["'`]/.test(jsContent.toLowerCase()) ||
                       /console\.log\s*\([^)]*\+[^)]*\)/.test(jsContent); // String concatenation
    
    // Check for calculation display
    const hasCalculationOutput = /console\.log\s*\([^)]*[\+\-\*\/][^)]*\)/.test(jsContent);
    
    // Check for HTML structure if present
    const hasHTMLStructure = /<html[^>]*>[\s\S]*<\/html>/i.test(cleanCode) || 
                             /<body[^>]*>[\s\S]*<\/body>/i.test(cleanCode);
    
    let errorMessages = [];
    let successMessages = [];
    let warningMessages = [];
    
    // Check basic requirements
    if (!hasConsoleLog) {
        errorMessages.push('Missing console.log() statements. Use console.log() to display output.');
    } else if (consoleLogCount < 2) {
        errorMessages.push('Need at least 2 console.log() statements to display multiple outputs.');
    } else {
        successMessages.push(`✓ Uses console.log() (${consoleLogCount} statements)`);
    }
    
    // Check variables
    if (!hasVariables) {
        errorMessages.push('Missing variable declarations. Use let, const, or var to create variables.');
    } else if (totalVariables < 3) {
        errorMessages.push(`Need at least 3 variables. Found ${totalVariables} variable(s).`);
    } else {
        successMessages.push(`✓ Has ${totalVariables} variable(s)`);
    }
    
    // Check data types
    let dataTypeCount = 0;
    if (hasString) {
        successMessages.push('✓ Uses string data type');
        dataTypeCount++;
    } else {
        errorMessages.push('Missing string variable. Create a variable with text in quotes.');
    }
    
    if (hasNumber) {
        successMessages.push('✓ Uses number data type');
        dataTypeCount++;
    } else {
        errorMessages.push('Missing number variable. Create a variable with a numeric value.');
    }
    
    if (hasBoolean) {
        successMessages.push('✓ Uses boolean data type');
        dataTypeCount++;
    } else {
        warningMessages.push('Consider adding a boolean variable (true/false) for practice.');
    }
    
    // Check mathematical operations
    if (!hasMathOperations) {
        errorMessages.push('Missing mathematical operations. Use operators like +, -, *, / for calculations.');
    } else if (mathOperationCount < 2) {
        errorMessages.push(`Need at least 2 mathematical operations. Found ${mathOperationCount} operation(s).`);
    } else {
        successMessages.push(`✓ Has ${mathOperationCount} mathematical operation(s)`);
    }
    
    // Check greeting message
    if (!hasGreeting) {
        errorMessages.push('Missing greeting message. Create a console.log() with a greeting that uses a variable.');
    } else {
        successMessages.push('✓ Has greeting message');
    }
    
    // Check calculation output
    if (!hasCalculationOutput && mathOperationCount > 0) {
        warningMessages.push('Consider displaying calculation results with console.log().');
    } else if (hasCalculationOutput) {
        successMessages.push('✓ Displays calculation results');
    }
    
    // Check variable naming
    if (!hasDescriptiveNames) {
        warningMessages.push('Use descriptive variable names (e.g., "userName" instead of "x").');
    } else {
        successMessages.push('✓ Uses descriptive variable names');
    }
    
    // Check HTML structure if attempting to write HTML
    if (cleanCode.includes('<') && !hasHTMLStructure) {
        warningMessages.push('If writing HTML, include proper <html>, <head>, and <body> tags.');
    } else if (hasHTMLStructure) {
        successMessages.push('✓ Proper HTML structure');
    }
    
    // Check for syntax errors (basic)
    const hasSyntaxIssues = /let\s+\w+\s*[^=]/.test(jsContent) && !/let\s+\w+\s*=/.test(jsContent);
    if (hasSyntaxIssues) {
        errorMessages.push('Check your syntax. Variables should be assigned with = operator.');
    }
    
    // Display feedback
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-lesson');
    
    if (errorMessages.length === 0) {
        let feedbackContent = `
            <div style="color: #27ae60; background: #d5f4e6; border: 1px solid #27ae60;">
                <strong>🎉 Excellent JavaScript Basics!</strong><br>
                ${successMessages.join('<br>')}
        `;
        
        if (warningMessages.length > 0) {
            feedbackContent += `<br><br><strong>💡 Tips for improvement:</strong><br>${warningMessages.join('<br>')}`;
        }
        
        feedbackContent += `
                <br><br>You've successfully created a JavaScript program with variables, operations, and console output!<br>
                <strong>🔍 Pro tip:</strong> Open your browser's Developer Console (F12) to see the console.log() output in real websites!
            </div>
        `;
        
        feedback.innerHTML = feedbackContent;
        
        // Enable next button
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        
        // Store completion
        localStorage.setItem('partB_lesson10_complete', 'true');
        
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
            • At least 3 variables with different data types (string, number, boolean)<br>
            • At least 2 mathematical operations using operators<br>
            • Multiple console.log() statements (minimum 2)<br>
            • A greeting message that includes a variable<br>
            • Display calculation results in the console<br>
            • Use descriptive variable names (not just x, y, z)
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
        window.location.href = '../lesson11/lesson11.html';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if lesson is already completed
    if (localStorage.getItem('partB_lesson10_complete') === 'true') {
        const nextBtn = document.getElementById('next-lesson');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
    
    // Initial preview render
    renderTask();
});