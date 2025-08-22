// Enhanced browser timeline data
const browsers = [
    {
    year: 1990,
    name: "WorldWideWeb",
    icon: "🌍",
    description: "The very first web browser, created by Tim Berners-Lee. It could both browse and edit web pages!",
    impact: "Birth of the Web"
    },
    {
    year: 1993,
    name: "Mosaic",
    icon: "🖼️",
    description: "First browser to display images inline with text. Made the web visual and accessible to everyone.",
    impact: "Visual Revolution"
    },
    {
    year: 1994,
    name: "Netscape Navigator",
    icon: "🧭",
    description: "Dominated the early web with 90% market share. Introduced JavaScript and many web standards.",
    impact: "Web Goes Mainstream"
    },
    {
    year: 1995,
    name: "Internet Explorer",
    icon: "💷",
    description: "Microsoft's browser that came with Windows. Started the first 'Browser War' with Netscape.",
    impact: "Browser Wars Begin"
    },
    {
    year: 2003,
    name: "Safari",
    icon: "🧭",
    description: "Apple's sleek browser that pioneered many mobile web features and web standards.",
    impact: "Mobile Web Pioneer"
    },
    {
    year: 2004,
    name: "Firefox",
    icon: "🦊",
    description: "Open-source champion that introduced tabbed browsing, extensions, and challenged IE's dominance.",
    impact: "Innovation Returns"
    },
    {
    year: 2008,
    name: "Chrome",
    icon: "🌟",
    description: "Google's speed-focused browser that revolutionized web apps and now leads the market.",
    impact: "Speed & Standards"
    },
    {
    year: 2015,
    name: "Edge",
    icon: "💎",
    description: "Microsoft's modern replacement for IE, built for today's web standards and security needs.",
    impact: "Modern Microsoft"
    }
];

let currentBrowserIndex = 0;
const timelineContainer = document.getElementById('timelineContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize timeline
function initTimeline() {
    browsers.forEach((browser, index) => {
    const card = document.createElement('div');
    card.className = `timeline-card ${index === 0 ? 'active' : ''}`;
    card.innerHTML = `
        <div class="browser-icon">${browser.icon}</div>
        <div class="timeline-year">${browser.year}</div>
        <div class="timeline-title">${browser.name}</div>
        <div class="timeline-description">${browser.description}</div>
        <div style="margin-top: 15px; font-weight: 600; color: var(--brand); font-size: 0.9rem;">
        ${browser.impact}
        </div>
    `;
    timelineContainer.appendChild(card);
    });
}

// Timeline navigation
function updateTimeline() {
    const cards = timelineContainer.querySelectorAll('.timeline-card');
    cards.forEach((card, index) => {
    card.classList.toggle('active', index === currentBrowserIndex);
    });
    
    const cardWidth = 350; // card width + margin
    timelineContainer.scrollTo({
    left: currentBrowserIndex * cardWidth,
    behavior: 'smooth'
    });

    prevBtn.disabled = currentBrowserIndex === 0;
    nextBtn.disabled = currentBrowserIndex === browsers.length - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentBrowserIndex > 0) {
    currentBrowserIndex--;
    updateTimeline();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentBrowserIndex < browsers.length - 1) {
    currentBrowserIndex++;
    updateTimeline();
    }
});

// Quiz functionality
const quizQuestions = [
    {
    question: "Which browser was the first to introduce tabbed browsing as a standard feature?",
    options: [
        { text: "Internet Explorer", correct: false },
        { text: "Netscape Navigator", correct: false },
        { text: "Firefox", correct: true },
        { text: "Safari", correct: false }
    ],
    explanation: "Firefox (originally Phoenix/Firebird) popularized tabbed browsing in 2004, though some earlier browsers had experimental versions."
    },
    {
    question: "What was revolutionary about the Mosaic browser?",
    options: [
        { text: "It was the first browser", correct: false },
        { text: "It displayed images inline with text", correct: true },
        { text: "It introduced JavaScript", correct: false },
        { text: "It was mobile-friendly", correct: false }
    ],
    explanation: "Mosaic was the first browser to display images alongside text, making the web visual and much more appealing to users."
    },
    {
    question: "Which company created the first web browser?",
    options: [
        { text: "Microsoft", correct: false },
        { text: "Google", correct: false },
        { text: "CERN", correct: true },
        { text: "Netscape", correct: false }
    ],
    explanation: "Tim Berners-Lee created the first web browser 'WorldWideWeb' while working at CERN in 1990."
    }
];

let currentQuizIndex = 0;
let quizAnswered = false;

function loadQuiz() {
    const quiz = quizQuestions[currentQuizIndex];
    document.getElementById('quizQuestion').textContent = quiz.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    quiz.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option.text;
    button.dataset.answer = option.correct;
    button.addEventListener('click', handleQuizAnswer);
    optionsContainer.appendChild(button);
    });
    
    document.getElementById('quizFeedback').classList.remove('show');
    quizAnswered = false;
}

function handleQuizAnswer(e) {
    if (quizAnswered) return;
    
    quizAnswered = true;
    const options = document.querySelectorAll('.quiz-option');
    const isCorrect = e.target.dataset.answer === 'true';
    const quiz = quizQuestions[currentQuizIndex];
    
    options.forEach(option => {
    if (option.dataset.answer === 'true') {
        option.classList.add('correct');
    } else if (option === e.target && !isCorrect) {
        option.classList.add('incorrect');
    }
    option.style.pointerEvents = 'none';
    });
    
    const feedback = document.getElementById('quizFeedback');
    feedback.innerHTML = `
    <div style="font-size: 1.3rem; margin-bottom: 10px;">
        ${isCorrect ? '🎉 Excellent!' : '🤔 Not quite!'}
    </div>
    <div>${quiz.explanation}</div>
    `;
    feedback.classList.add('show');
    
    // Auto-advance to next question after 3 seconds
    setTimeout(() => {
    currentQuizIndex = (currentQuizIndex + 1) % quizQuestions.length;
    loadQuiz();
    }, 3000);
}

// FIXED progress tracking function
function updateProgress() {
    console.log('📊 Updating progress...'); 
    
    const topics = ['website', 'html', 'css', 'javascript'];
    let completedCount = 0;
    
    // Fixed key mapping - these must match exactly what each concept page stores
    const keyMap = {
        website: 'readWebsite',
        html: 'readHTML',
        css: 'readCSS',
        javascript: 'readJavaScript'  // This matches what javascript_concept.js now stores
    };
    
    topics.forEach(topic => {
        const storageKey = keyMap[topic];
        const isCompleted = localStorage.getItem(storageKey) === 'true';
        
        console.log(`Checking ${topic}: key=${storageKey}, completed=${isCompleted}`); // Debug log
        
        if (isCompleted) {
            completedCount++;
            const card = document.querySelector(`.concept-card[data-concept="${topic}"]`);
            if (card) {
                // Remove existing badge first
                const existingBadge = card.querySelector('.completed-badge');
                if (existingBadge) existingBadge.remove();
                
                // Add completed badge
                const badge = document.createElement('div');
                badge.className = 'completed-badge';
                badge.innerHTML = '✅';
                card.appendChild(badge);
                card.classList.add('completed');
            }
        }
    });
    
    console.log(`Total completed: ${completedCount}/4`); // Debug log
    
    // Update progress display
    document.getElementById('progressCount').textContent = completedCount;
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = (completedCount / 4) * 100 + '%';
    
    // Enable/disable next button
    const nextBtn = document.getElementById('nextBtnPartB');
    if (completedCount === 4) {
        nextBtn.classList.remove('disabled');
        nextBtn.innerHTML = '🚀 Start Building Your First Website - Ready!';
    } else {
        nextBtn.classList.add('disabled');
        nextBtn.innerHTML = `🚀 Complete ${4 - completedCount} more concepts to continue`;
    }
}

// Handle concept card clicks with enhanced feedback
function handleConceptClick(e) {
    const card = e.currentTarget;
    const concept = card.dataset.concept;
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
    card.style.transform = '';
    }, 150);
    
    // Store click time for analytics (optional)
    localStorage.setItem(`${concept}ClickTime`, Date.now().toString());
}

// Enhanced page load detection (keeping original logic)
function navTypeIsReload() {
    try {
    if (performance.getEntriesByType) {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav && nav.type) return nav.type === 'reload';
    }
    if (performance.navigation) {
        return performance.navigation.type === 1;
    }
    } catch (e) {}
    return false;
}

// Auto-advance timeline
function autoAdvanceTimeline() {
    setInterval(() => {
    if (currentBrowserIndex < browsers.length - 1) {
        currentBrowserIndex++;
        updateTimeline();
    } else {
        currentBrowserIndex = 0;
        updateTimeline();
    }
    }, 5000); // Change every 5 seconds
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
    }
    });
}, observerOptions);

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Reset progress on hard reload only
    if (navTypeIsReload()) {
    ['Website', 'HTML', 'CSS', 'JavaScript'].forEach(topic => {
        localStorage.removeItem('read' + topic);
    });
    }

    // Initialize components
    initTimeline();
    updateTimeline();
    loadQuiz();
    updateProgress();
    
    // Start auto-advance timeline after 10 seconds
    setTimeout(autoAdvanceTimeline, 10000);
    
    // Add concept card click handlers
    document.querySelectorAll('.concept-card').forEach(card => {
    card.addEventListener('click', handleConceptClick);
    });
    
    // Animate elements on scroll
    document.querySelectorAll('.section, .concept-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
    });
    
    // Initial animation for hero elements
    setTimeout(() => {
    document.querySelectorAll('.section').forEach((el, index) => {
        setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        }, index * 200);
    });
    }, 300);

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        nextBtn.click();
    }
    });

    // Add touch/swipe support for timeline
    let touchStartX = 0;
    let touchEndX = 0;
    
    timelineContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    });
    
    timelineContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    });
    
    function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && !nextBtn.disabled) {
        // Swipe left - next
        nextBtn.click();
        } else if (diff < 0 && !prevBtn.disabled) {
        // Swipe right - previous
        prevBtn.click();
        }
    }
    }

    // ADDED: Listen for storage changes to update progress when user comes back from concept pages
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.startsWith('read')) {
            console.log('Storage changed:', e.key, e.newValue);
            updateProgress();
        }
    });
    
    // ADDED: Also check for progress updates when page gains focus (user comes back)
    window.addEventListener('focus', function() {
        console.log('Page focused - checking progress...');
        updateProgress();
    });
});

// Handle next button click
document.getElementById('nextBtnPartB').addEventListener('click', function() {
    if (!this.classList.contains('disabled')) {
    // Add celebration animation
    this.innerHTML = '🎉 Loading your coding adventure...';
    this.style.background = 'var(--success)';
    
    setTimeout(() => {
        window.location.href = '/2. partB/lesson1/lesson1.html';
    }, 1000);
    } else {
    // Shake animation for disabled button
    this.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        this.style.animation = '';
    }, 500);
    
    // Highlight incomplete concepts
    document.querySelectorAll('.concept-card:not(.completed)').forEach(card => {
        card.style.border = '3px solid var(--warning)';
        card.style.animation = 'pulse 1s ease-in-out 2';
        setTimeout(() => {
        card.style.border = '';
        card.style.animation = '';
        }, 2000);
    });
    }
});

// Add some fun Easter eggs
let clickCount = 0;
document.querySelector('header h1').addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 5) {
    document.body.style.filter = 'hue-rotate(45deg)';
    setTimeout(() => {
        document.body.style.filter = '';
        clickCount = 0;
    }, 2000);
    }
});

// Performance monitoring (optional)
window.addEventListener('load', () => {
    if (performance.now) {
    const loadTime = performance.now();
    if (loadTime < 2000) {
        console.log('🚀 Page loaded fast!', Math.round(loadTime) + 'ms');
    }
    }
});